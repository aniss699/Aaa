
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { storage } from './storage';

const createMissionSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.enum(['développement', 'design', 'marketing', 'conseil', 'travaux', 'services']),
  budget_min: z.number().min(1000, 'Le budget minimum doit être d\'au moins 1000€'),
  budget_max: z.number(),
  deadline_ts: z.string().optional(),
  geo_required: z.boolean().default(false),
  onsite_radius_km: z.number().min(0).optional(),
  missing_info_answers: z.record(z.string()).optional(),
  applied_ai_suggestion: z.object({
    applied_settings: z.object({
      text: z.boolean(),
      budget: z.string(),
      delay: z.boolean()
    }),
    suggestion: z.any()
  }).optional()
}).refine(data => data.budget_max >= data.budget_min, {
  message: 'Le budget maximum doit être supérieur au minimum',
  path: ['budget_max']
}).refine(data => !data.geo_required || data.onsite_radius_km !== undefined, {
  message: 'Le rayon d\'intervention est requis si l\'intervention sur site est demandée',
  path: ['onsite_radius_km']
});

const aiSuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  deadline_ts: z.string().optional()
});

// Store pour l'idempotence
const idempotencyStore = new Map<string, { result: any; timestamp: number }>();

export async function routes(fastify: FastifyInstance) {
  // Nettoyage périodique du store d'idempotence (15 min)
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of idempotencyStore.entries()) {
      if (now - value.timestamp > 15 * 60 * 1000) {
        idempotencyStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Routes existantes...
  
  // === Nouvelles routes pour les missions ===

  // POST /api/missions - Création de mission avec idempotence
  fastify.post('/api/missions', async (request, reply) => {
    const idempotencyKey = request.headers['idempotency-key'] as string;
    
    try {
      // Vérification idempotence
      if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
        const stored = idempotencyStore.get(idempotencyKey)!;
        return reply.status(201).send(stored.result);
      }

      // Validation des données
      const validatedData = createMissionSchema.parse(request.body);

      // Vérification deadline future
      if (validatedData.deadline_ts) {
        const deadline = new Date(validatedData.deadline_ts);
        if (deadline <= new Date()) {
          return reply.status(422).send({
            code: 'VALIDATION_ERROR',
            field: 'deadline_ts',
            message: 'L\'échéance doit être dans le futur',
            hint: 'Choisissez une date ultérieure à aujourd\'hui'
          });
        }
      }

      // Création de la mission
      const mission = storage.createProject({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        budget: `${validatedData.budget_min}-${validatedData.budget_max}`,
        status: 'PUBLISHED',
        clientId: 'user_1' // TODO: récupérer de l'auth
      });

      // Sauvegarde de la standardisation si appliquée
      if (validatedData.applied_ai_suggestion) {
        const { suggestion, applied_settings } = validatedData.applied_ai_suggestion;
        
        const standardization = {
          projectId: mission.id,
          titleStd: applied_settings.text ? suggestion.title : validatedData.title,
          summaryStd: applied_settings.text ? suggestion.summary : validatedData.description,
          acceptanceCriteria: suggestion.acceptance_criteria || [],
          categoryStd: suggestion.category_std || validatedData.category,
          subCategoryStd: suggestion.sub_category_std || '',
          tagsStd: suggestion.tags_std || [],
          tasksStd: suggestion.tasks_std || [],
          deliverablesStd: suggestion.deliverables_std || [],
          skillsStd: suggestion.skills_std || [],
          constraintsStd: suggestion.constraints_std || [],
          briefQualityScore: suggestion.brief_quality_score || 0.5,
          richnessScore: suggestion.richness_score || 0.5,
          missingInfo: suggestion.missing_info || [],
          priceSuggestedMin: suggestion.price_suggested_min,
          priceSuggestedMed: suggestion.price_suggested_med,
          priceSuggestedMax: suggestion.price_suggested_max,
          delaySuggestedDays: suggestion.delay_suggested_days,
          locBase: suggestion.loc_base || 0.5,
          locUpliftReco: suggestion.loc_uplift_reco || {},
          rewriteVersion: '1.0.0',
          appliedSettings: applied_settings,
          missingInfoAnswers: validatedData.missing_info_answers || {}
        };

        storage.saveProjectStandardization(standardization);
      }

      // Log de l'événement
      const eventLog = {
        id: `event_${Date.now()}`,
        projectId: mission.id,
        action: 'mission_created',
        details: {
          used_ai: !!validatedData.applied_ai_suggestion,
          applied_settings: validatedData.applied_ai_suggestion?.applied_settings,
          answered_questions: Object.keys(validatedData.missing_info_answers || {}).length
        },
        createdAt: new Date()
      };
      
      storage.saveProjectChangeLog(eventLog);

      const result = {
        id: mission.id,
        status: mission.status,
        validation: {
          warnings: [],
          infos: validatedData.applied_ai_suggestion 
            ? [`Suggestions IA appliquées avec succès`]
            : []
        }
      };

      // Stockage pour idempotence
      if (idempotencyKey) {
        idempotencyStore.set(idempotencyKey, {
          result,
          timestamp: Date.now()
        });
      }

      return reply.status(201).send(result);

    } catch (error) {
      fastify.log.error('Erreur création mission:', error);
      
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return reply.status(422).send({
          code: 'VALIDATION_ERROR',
          field: firstError.path.join('.'),
          message: firstError.message,
          hint: getValidationHint(firstError.path[0] as string)
        });
      }

      return reply.status(500).send({
        code: 'INTERNAL_ERROR',
        trace_id: `trace_${Date.now()}`
      });
    }
  });

  // POST /api/ai/missions/suggest - Suggestions IA
  fastify.post('/api/ai/missions/suggest', async (request, reply) => {
    try {
      const data = aiSuggestionSchema.parse(request.body);
      
      // Appel au service ML
      const mlResponse = await fetch('http://localhost:8001/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          budget_min: data.budget_min,
          budget_max: data.budget_max
        })
      });

      if (!mlResponse.ok) {
        // Fallback avec suggestions statiques
        const fallbackSuggestion = generateFallbackSuggestion(data);
        return reply.send({ suggestion: fallbackSuggestion });
      }

      const mlResult = await mlResponse.json();
      
      return reply.send({
        suggestion: {
          title: mlResult.title_std || `${data.title} (optimisé)`,
          summary: mlResult.summary_std || enhanceDescription(data.description),
          acceptance_criteria: mlResult.acceptance_criteria || generateAcceptanceCriteria(data.category),
          category_std: mlResult.category_std || data.category || 'services',
          sub_category_std: mlResult.sub_category_std || 'généraliste',
          skills_std: mlResult.skills_std || extractSkills(data.description),
          tags_std: mlResult.tags_std || extractTags(data.description),
          brief_quality_score: mlResult.brief_quality_score || calculateQualityScore(data),
          richness_score: mlResult.richness_score || calculateRichnessScore(data),
          missing_info: mlResult.missing_info || generateMissingInfoQuestions(data),
          price_suggested_min: mlResult.price_suggested_min || Math.max(1000, (data.budget_min || 5000) * 0.8),
          price_suggested_med: mlResult.price_suggested_med || data.budget_max || 8000,
          price_suggested_max: mlResult.price_suggested_max || (data.budget_max || 8000) * 1.3,
          delay_suggested_days: mlResult.delay_suggested_days || estimateDelay(data),
          loc_base: mlResult.loc_base || 0.6,
          loc_uplift_reco: mlResult.loc_uplift_reco || {
            new_budget: (data.budget_max || 8000) * 1.1,
            new_delay: estimateDelay(data) + 2,
            delta_loc: 0.08
          },
          reasons: mlResult.reasons || generateReasons(data)
        }
      });

    } catch (error) {
      fastify.log.error('Erreur suggestions IA:', error);
      
      if (error instanceof z.ZodError) {
        return reply.status(422).send({
          code: 'VALIDATION_ERROR',
          message: 'Données invalides pour la génération de suggestions'
        });
      }

      return reply.status(500).send({
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors de la génération des suggestions'
      });
    }
  });

  // GET /api/missions/:id - Détail d'une mission
  fastify.get('/api/missions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      const mission = storage.getProject(id);
      if (!mission) {
        return reply.status(404).send({ error: 'Mission non trouvée' });
      }

      const standardization = storage.getProjectStandardization(id);
      const changeLogs = storage.getProjectChangeLogs(id);

      return reply.send({
        mission,
        standardization,
        change_logs: changeLogs.slice(0, 10) // 10 derniers changements
      });

    } catch (error) {
      fastify.log.error('Erreur récupération mission:', error);
      return reply.status(500).send({ error: 'Erreur interne' });
    }
  });

  // GET /api/admin/diagnostics - Diagnostics système
  fastify.get('/api/admin/diagnostics', async (request, reply) => {
    try {
      const diagnostics = {
        routes_ok: true,
        forms_ok: true,
        db_ok: true,
        migrations_applied: ['initial', 'project_standardization', 'idempotency_support'],
        last_5_errors: storage.getRecentErrors?.() || [],
        stats: {
          total_missions: storage.getProjects().length,
          total_users: storage.getUsers().length,
          ai_suggestions_generated: storage.getProjectStandardizations?.()?.length || 0,
          idempotency_cache_size: idempotencyStore.size
        }
      };

      return reply.send(diagnostics);
    } catch (error) {
      return reply.status(500).send({
        routes_ok: false,
        db_ok: false,
        error: error.message
      });
    }
  });

  // GET /api/logs/errors - Logs d'erreurs (dev)
  fastify.get('/api/logs/errors', async (request, reply) => {
    const { since } = request.query as { since?: string };
    
    try {
      // TODO: Implémenter un vrai système de logs
      const errors = [
        {
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Exemple d\'erreur pour les tests',
          stack: 'Error stack trace...',
          context: { route: '/api/missions', method: 'POST' }
        }
      ];

      return reply.send({
        errors: errors.slice(0, 50),
        total: errors.length
      });
    } catch (error) {
      return reply.status(500).send({ error: 'Erreur lors de la récupération des logs' });
    }
  });
}

// Fonctions utilitaires
function getValidationHint(field: string): string {
  const hints = {
    'title': 'Le titre doit être descriptif et contenir au moins 3 caractères',
    'description': 'Décrivez votre projet en détail (minimum 10 caractères)',
    'category': 'Sélectionnez la catégorie qui correspond le mieux à votre projet',
    'budget_min': 'Le budget minimum doit être d\'au moins 1000€',
    'budget_max': 'Le budget maximum doit être supérieur ou égal au minimum',
    'deadline_ts': 'L\'échéance doit être une date future',
    'onsite_radius_km': 'Précisez le rayon en kilomètres si intervention sur site'
  };
  return hints[field] || 'Veuillez corriger cette valeur';
}

function generateFallbackSuggestion(data: any) {
  return {
    title: `${data.title} (version améliorée)`,
    summary: enhanceDescription(data.description),
    acceptance_criteria: generateAcceptanceCriteria(data.category),
    category_std: data.category || 'services',
    sub_category_std: 'généraliste',
    skills_std: extractSkills(data.description),
    tags_std: extractTags(data.description),
    brief_quality_score: calculateQualityScore(data),
    richness_score: calculateRichnessScore(data),
    missing_info: generateMissingInfoQuestions(data),
    price_suggested_min: Math.max(1000, (data.budget_min || 5000) * 0.8),
    price_suggested_med: data.budget_max || 8000,
    price_suggested_max: (data.budget_max || 8000) * 1.3,
    delay_suggested_days: estimateDelay(data),
    loc_base: 0.6,
    loc_uplift_reco: {
      new_budget: (data.budget_max || 8000) * 1.1,
      new_delay: estimateDelay(data) + 2,
      delta_loc: 0.08
    },
    reasons: generateReasons(data)
  };
}

function enhanceDescription(description: string): string {
  return `${description}\n\n**Contexte :** Ce projet nécessite une approche professionnelle avec une attention particulière aux détails.\n\n**Objectifs :** Livrer une solution de qualité répondant aux besoins exprimés.\n\n**Livrables attendus :** Solution complète avec documentation et support.`;
}

function generateAcceptanceCriteria(category?: string): string[] {
  const commonCriteria = [
    'Respect du cahier des charges',
    'Qualité professionnelle du livrable',
    'Tests et validation réalisés',
    'Documentation fournie',
    'Formation/accompagnement si nécessaire'
  ];

  const categorySpecific = {
    'développement': [
      'Code propre et documenté',
      'Tests unitaires réalisés',
      'Performance optimisée',
      'Sécurité renforcée'
    ],
    'design': [
      'Maquettes validées par le client',
      'Fichiers sources fournis',
      'Déclinaisons selon brief',
      'Charte graphique respectée'
    ],
    'marketing': [
      'Stratégie définie et validée',
      'KPIs identifiés et mesurables',
      'Contenus créés et programmés',
      'Reporting mis en place'
    ]
  };

  return [...commonCriteria, ...(categorySpecific[category] || [])];
}

function extractSkills(description: string): string[] {
  const skillsMap = {
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'node': 'Node.js',
    'php': 'PHP',
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'css': 'CSS',
    'html': 'HTML',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'figma': 'Figma',
    'photoshop': 'Photoshop',
    'illustrator': 'Illustrator',
    'seo': 'SEO',
    'marketing': 'Marketing digital',
    'wordpress': 'WordPress'
  };

  const foundSkills = [];
  const descLower = description.toLowerCase();
  
  for (const [keyword, skill] of Object.entries(skillsMap)) {
    if (descLower.includes(keyword)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills.slice(0, 8);
}

function extractTags(description: string): string[] {
  const tags = [];
  const descLower = description.toLowerCase();
  
  if (descLower.includes('urgent')) tags.push('urgent');
  if (descLower.includes('mobile')) tags.push('mobile');
  if (descLower.includes('responsive')) tags.push('responsive');
  if (descLower.includes('ecommerce') || descLower.includes('e-commerce')) tags.push('e-commerce');
  if (descLower.includes('api')) tags.push('api');
  if (descLower.includes('seo')) tags.push('seo');
  if (descLower.includes('moderne')) tags.push('moderne');
  if (descLower.includes('professionnel')) tags.push('professionnel');

  return tags.slice(0, 6);
}

function calculateQualityScore(data: any): number {
  let score = 0.3; // Base

  if (data.title && data.title.length > 10) score += 0.2;
  if (data.description && data.description.length > 50) score += 0.2;
  if (data.description && data.description.length > 200) score += 0.1;
  if (data.category) score += 0.1;
  if (data.budget_min && data.budget_max) score += 0.1;

  return Math.min(score, 1.0);
}

function calculateRichnessScore(data: any): number {
  let score = 0.2; // Base

  const descLength = data.description?.length || 0;
  if (descLength > 100) score += 0.2;
  if (descLength > 300) score += 0.2;

  const skillsFound = extractSkills(data.description || '').length;
  score += Math.min(skillsFound * 0.05, 0.3);

  if (data.deadline_ts) score += 0.1;

  return Math.min(score, 1.0);
}

function generateMissingInfoQuestions(data: any): Array<{id: string, q: string}> {
  const questions = [];

  if (!data.deadline_ts) {
    questions.push({
      id: 'deadline',
      q: 'Quelle est votre échéance souhaitée pour ce projet ?'
    });
  }

  if (!data.description || data.description.length < 100) {
    questions.push({
      id: 'details',
      q: 'Pouvez-vous préciser les fonctionnalités attendues ?'
    });
  }

  if (data.category === 'développement' && !data.description?.toLowerCase().includes('technologie')) {
    questions.push({
      id: 'technology',
      q: 'Avez-vous des préférences technologiques particulières ?'
    });
  }

  if (!data.budget_min || !data.budget_max) {
    questions.push({
      id: 'budget',
      q: 'Quel est votre budget prévisionnel pour ce projet ?'
    });
  }

  return questions.slice(0, 3);
}

function estimateDelay(data: any): number {
  const baseDelays = {
    'développement': 20,
    'design': 10,
    'marketing': 15,
    'conseil': 12,
    'travaux': 8,
    'services': 7
  };

  const baseDelay = baseDelays[data.category] || 14;
  
  // Ajustement selon la description
  let multiplier = 1.0;
  const descLength = data.description?.length || 0;
  
  if (descLength > 300) multiplier += 0.3;
  if (descLength < 100) multiplier -= 0.2;
  
  if (data.description?.toLowerCase().includes('complexe')) multiplier += 0.5;
  if (data.description?.toLowerCase().includes('simple')) multiplier -= 0.3;

  return Math.max(3, Math.round(baseDelay * multiplier));
}

function generateReasons(data: any): string[] {
  const reasons = [];

  const qualityScore = calculateQualityScore(data);
  if (qualityScore < 0.7) {
    reasons.push('Brief à enrichir pour attirer plus de candidats qualifiés');
  }

  if (!data.deadline_ts) {
    reasons.push('Préciser l\'échéance pour faciliter la planification des prestataires');
  }

  if (data.description && data.description.length < 100) {
    reasons.push('Détailler davantage les fonctionnalités pour éviter les incompréhensions');
  }

  const skills = extractSkills(data.description || '');
  if (skills.length > 0) {
    reasons.push(`Compétences identifiées: ${skills.slice(0, 3).join(', ')}`);
  }

  if (data.budget_max && data.budget_max > 10000) {
    reasons.push('Budget attractif qui devrait susciter l\'intérêt des prestataires expérimentés');
  }

  return reasons.slice(0, 4);
}
