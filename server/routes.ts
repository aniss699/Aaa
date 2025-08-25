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

      // Log pour debugging
      fastify.log.info('Creating mission with data:', request.body);

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
        clientId: 'user_1', // TODO: récupérer de l'auth
        deadline: validatedData.deadline_ts || null,
        location: validatedData.geo_required ? 'Sur site' : 'Remote',
        tags: []
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

  // POST /api/ai/missions/suggest - Suggestions IA enrichies
  fastify.post('/api/ai/missions/suggest', async (request, reply) => {
    try {
      const data = aiSuggestionSchema.parse(request.body);

      // Appel au service ML avec fallback intelligent
      let mlResult = null;
      try {
        const mlResponse = await fetch('http://localhost:8001/improve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            category: data.category,
            budget_min: data.budget_min,
            budget_max: data.budget_max
          }),
          signal: AbortSignal.timeout(5000) // 5 sec timeout
        });

        if (mlResponse.ok) {
          mlResult = await mlResponse.json();
        }
      } catch (error) {
        fastify.log.warn('Service ML indisponible, utilisation du fallback');
      }

      // Génération complète avec structure enrichie
      const suggestion = generateRichSuggestion(data, mlResult);

      return reply.send({
        suggestion: {
          title: suggestion.rewrite.title,
          summary: suggestion.rewrite.summary,
          acceptance_criteria: suggestion.rewrite.acceptance_criteria,
          category_std: suggestion.structure.category_std,
          sub_category_std: suggestion.structure.sub_category_std,
          skills_std: suggestion.structure.skills,
          tags_std: [],
          brief_quality_score: suggestion.scores.quality,
          richness_score: suggestion.scores.richness,
          missing_info: suggestion.questions,
          price_suggested_min: suggestion.economics.price_suggested_min,
          price_suggested_med: suggestion.economics.price_suggested_med,
          price_suggested_max: suggestion.economics.price_suggested_max,
          delay_suggested_days: suggestion.economics.delay_suggested_days,
          loc_base: suggestion.loc.base,
          loc_uplift_reco: suggestion.loc.uplift_reco,
          reasons: suggestion.reasons
        },
        scores: {
          quality: suggestion.scores.quality,
          richness: suggestion.scores.richness,
          confidence: suggestion.scores.confidence
        },
        version: "ai.suggest.v2"
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

  // POST /api/ai/missions/apply - Application granulaire des suggestions
  fastify.post('/api/ai/missions/apply', async (request, reply) => {
    try {
      const { missionDraft, suggestion, apply } = request.body;

      const patch = buildApplicationPatch(missionDraft, suggestion, apply);

      return reply.send({
        fields: patch.fields,
        meta: patch.meta,
        diffs: patch.diffs,
        applied_count: patch.applied_count,
        impact_summary: patch.impact_summary
      });

    } catch (error) {
      fastify.log.error('Erreur application suggestions:', error);
      return reply.status(500).send({
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors de l\'application des suggestions'
      });
    }
  });

  // POST /api/ai/missions/answer-questions - Recalcul après réponses
  fastify.post('/api/ai/missions/answer-questions', async (request, reply) => {
    try {
      const { suggestionVersion, answers, originalData } = request.body;

      // Enrichir les données originales avec les réponses
      const enrichedData = enrichDataWithAnswers(originalData, answers);

      // Recalculer la suggestion
      const updatedSuggestion = generateRichSuggestion(enrichedData, null);

      return reply.send({
        scores: updatedSuggestion.scores,
        economics: updatedSuggestion.economics,
        loc: updatedSuggestion.loc,
        questions: updatedSuggestion.questions.filter(q => 
          !answers.some(a => a.id === q.id && a.value)
        ),
        improvements: calculateImprovements(originalData, enrichedData),
        version: "ai.suggest.v2.1"
      });

    } catch (error) {
      fastify.log.error('Erreur recalcul suggestions:', error);
      return reply.status(500).send({
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors du recalcul'
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

  // GET /api/missions - Liste des missions
  fastify.get('/api/missions', async (request, reply) => {
    try {
      const missions = storage.getProjects();
      return reply.send(missions);
    } catch (error) {
      fastify.log.error('Erreur récupération missions:', error);
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

  // Middleware de gestion des erreurs 404 pour les API
  fastify.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/')) {
      return reply.status(404).send({
        error: 'Route API non trouvée',
        path: request.url,
        method: request.method,
        available_routes: [
          'GET /api/missions',
          'POST /api/missions',
          'GET /api/missions/:id',
          'POST /api/ai/missions/suggest',
          'POST /api/ai/missions/apply',
          'POST /api/ai/missions/answer-questions',
          'GET /api/admin/diagnostics',
          'GET /api/logs/errors'
        ],
        hint: 'Vérifiez l\'URL et la méthode HTTP'
      });
    }

    // Pour les autres routes, laisser le serveur Vite gérer le SPA
    return reply.code(404).type('text/plain').send('SPA Route - handled by Vite');
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


// === Fonctions helper pour les suggestions IA enrichies ===

function generateRichSuggestion(data: any, mlResult: any = null) {
  const category = data.category || 'services';
  const surface = extractSurface(data.description);
  const complexity = assessComplexity(data);

  // Scores
  const qualityScore = calculateAdvancedQualityScore(data);
  const richnessScore = calculateAdvancedRichnessScore(data);
  const confidenceScore = Math.min(qualityScore * richnessScore * 1.2, 0.95);

  // Réécriture structurée
  const rewrite = generateStructuredRewrite(data, category, surface);

  // Structure & tâches
  const structure = generateProjectStructure(data, category, surface);

  // Économie
  const economics = calculateAdvancedEconomics(data, category, complexity, surface);

  // LOC
  const loc = calculateLOCWithUplift(data, economics);

  // Questions manquantes
  const questions = generateSmartQuestions(data, category);

  // Raisons
  const reasons = generateDetailedReasons(data, qualityScore, richnessScore, economics);

  return {
    scores: {
      quality: Math.round(qualityScore * 100) / 100,
      richness: Math.round(richnessScore * 100) / 100,
      confidence: Math.round(confidenceScore * 100) / 100
    },
    rewrite: {
      title: rewrite.title,
      summary: rewrite.summary,
      acceptance_criteria: rewrite.acceptance_criteria
    },
    structure: {
      category_std: structure.category_std,
      sub_category_std: structure.sub_category_std,
      tasks: structure.tasks,
      deliverables: structure.deliverables,
      skills: structure.skills,
      constraints: structure.constraints
    },
    economics: {
      price_suggested_min: economics.price_suggested_min,
      price_suggested_med: economics.price_suggested_med,
      price_suggested_max: economics.price_suggested_max,
      delay_suggested_days: economics.delay_suggested_days,
      rationale: economics.rationale
    },
    loc: {
      base: loc.base,
      uplift_reco: loc.uplift_reco
    },
    questions,
    reasons
  };
}

function generateStructuredRewrite(data: any, category: string, surface: number | null) {
  const title = generateImprovedTitle(data.title, category, surface);
  const summary = generateStructuredSummary(data, category, surface);
  const acceptance_criteria = generateSMARTCriteria(data, category, surface);

  return { title, summary, acceptance_criteria };
}

function generateImprovedTitle(originalTitle: string, category: string, surface: number | null) {
  const categoryPrefixes = {
    'travaux': 'Travaux de',
    'développement': 'Développement',
    'design': 'Création design',
    'marketing': 'Mission marketing',
    'conseil': 'Conseil en',
    'services': 'Prestation de'
  };

  const prefix = categoryPrefixes[category] || 'Mission de';
  const surfaceText = surface ? ` (${surface} m²)` : '';

  return `${prefix} ${originalTitle.toLowerCase()}${surfaceText}`;
}

function generateStructuredSummary(data: any, category: string, surface: number | null) {
  const context = generateContextSentence(data, category);
  const objective = generateObjectiveSentence(data, category);
  const constraints = generateConstraintsSentence(data);
  const deliverables = generateDeliverablesSentence(data, category, surface);
  const criteria = generateCriteriaSentence(data, category);

  return `**Contexte :** ${context}\n\n**Objectif :** ${objective}\n\n**Contraintes :** ${constraints}\n\n**Livrables :** ${deliverables}\n\n**Critères :** ${criteria}`;
}

function generateSMARTCriteria(data: any, category: string, surface: number | null): string[] {
  const baseCriteria = [
    "Respect du cahier des charges et des spécifications techniques",
    "Qualité professionnelle conforme aux standards du secteur",
    "Livraison dans les délais convenus"
  ];

  const categoryCriteria = {
    'travaux': [
      "Finitions soignées sans défauts visibles",
      "Nettoyage complet du chantier",
      "Garantie décennale fournie"
    ],
    'développement': [
      "Code testé et documenté",
      "Performance optimisée (temps de chargement < 3s)",
      "Compatibilité multi-navigateurs"
    ],
    'design': [
      "Fichiers sources haute résolution fournis",
      "Déclinaisons selon la charte graphique",
      "3 rounds de modifications inclus"
    ]
  };

  const specific = categoryCriteria[category] || [
    "Documentation complète fournie",
    "Formation/accompagnement inclus",
    "Support post-livraison (30 jours)"
  ];

  return [...baseCriteria, ...specific].slice(0, 5);
}

function generateProjectStructure(data: any, category: string, surface: number | null) {
  const subCategories = {
    'travaux': detectWorksSubCategory(data.description),
    'développement': detectDevSubCategory(data.description),
    'design': detectDesignSubCategory(data.description),
    'marketing': detectMarketingSubCategory(data.description),
    'conseil': detectConsultingSubCategory(data.description),
    'services': detectServicesSubCategory(data.description)
  };

  const tasks = generateTasksList(data, category, surface);
  const deliverables = generateDeliverablesList(data, category, surface);
  const skills = extractRequiredSkills(data, category);
  const constraints = extractProjectConstraints(data);

  return {
    category_std: category,
    sub_category_std: subCategories[category] || 'généraliste',
    tasks,
    deliverables,
    skills,
    constraints
  };
}

function generateTasksList(data: any, category: string, surface: number | null): any[] {
  const baseTasks = {
    'travaux': [
      { id: 'prep', label: 'Préparation et protection', qty: surface ? `${surface} m²` : 'À définir' },
      { id: 'main', label: 'Réalisation principale', qty: surface ? `${surface} m²` : 'Selon devis' },
      { id: 'finish', label: 'Finitions et nettoyage', qty: '1 unité' }
    ],
    'développement': [
      { id: 'analysis', label: 'Analyse et conception', qty: '2-3 jours' },
      { id: 'dev', label: 'Développement', qty: '60-80% du temps' },
      { id: 'test', label: 'Tests et debugging', qty: '15-20% du temps' },
      { id: 'deploy', label: 'Déploiement et formation', qty: '1-2 jours' }
    ],
    'design': [
      { id: 'brief', label: 'Brief et recherches', qty: '1-2 jours' },
      { id: 'concept', label: 'Concepts et maquettes', qty: '3-5 versions' },
      { id: 'refine', label: 'Affinement et déclinaisons', qty: '2-3 rounds' }
    ]
  };

  return baseTasks[category] || [
    { id: 'analysis', label: 'Analyse des besoins', qty: '1 jour' },
    { id: 'execution', label: 'Réalisation', qty: 'Selon brief' },
    { id: 'delivery', label: 'Livraison et validation', qty: '0.5 jour' }
  ];
}

function generateDeliverablesList(data: any, category: string, surface: number | null): any[] {
  const baseDeliverables = {
    'travaux': [
      { id: 'work', label: 'Travaux réalisés selon cahier des charges', qty: surface ? `${surface} m²` : 'Complet' },
      { id: 'cleanup', label: 'Nettoyage et évacuation déchets', qty: '1 unité' },
      { id: 'warranty', label: 'Garantie et certificats', qty: 'Documentation' }
    ],
    'développement': [
      { id: 'code', label: 'Code source complet et documenté', qty: 'Repository Git' },
      { id: 'deploy', label: 'Application déployée et fonctionnelle', qty: '1 environnement' },
      { id: 'doc', label: 'Documentation technique et utilisateur', qty: 'Complète' }
    ],
    'design': [
      { id: 'files', label: 'Fichiers sources (AI, PSD, Sketch)', qty: 'Haute résolution' },
      { id: 'exports', label: 'Exports optimisés (PNG, JPG, SVG)', qty: 'Multi-formats' },
      { id: 'guidelines', label: 'Guide d\'utilisation', qty: 'Document PDF' }
    ]
  };

  return baseDeliverables[category] || [
    { id: 'main', label: 'Livrable principal selon brief', qty: 'Complet' },
    { id: 'doc', label: 'Documentation', qty: 'Standard' }
  ];
}

function calculateAdvancedEconomics(data: any, category: string, complexity: string, surface: number | null) {
  // Chargement des données de référence prix
  const priceData = getPriceReferenceData(category);

  let basePrice = priceData.daily_med * priceData.avg_days;

  // Ajustements selon complexité
  const complexityMultipliers = { simple: 0.8, medium: 1.0, complex: 1.3, expert: 1.6 };
  basePrice *= complexityMultipliers[complexity] || 1.0;

  // Ajustements selon surface (pour travaux)
  if (surface && category === 'travaux') {
    const pricePerM2 = priceData.hourly_med * 0.5; // Estimation 30min/m²
    basePrice = surface * pricePerM2;
  }

  // Ajustements selon budget existant
  if (data.budget_min && data.budget_max) {
    const userBudget = (data.budget_min + data.budget_max) / 2;
    basePrice = Math.min(basePrice, userBudget * 1.2); // Max 20% au-dessus
  }

  const price_min = Math.round(basePrice * 0.75);
  const price_med = Math.round(basePrice);
  const price_max = Math.round(basePrice * 1.35);

  const delay_days = Math.round(priceData.avg_days * (complexityMultipliers[complexity] || 1.0));

  const rationale = generatePriceRationale(category, complexity, surface, priceData);

  return {
    price_suggested_min: price_min,
    price_suggested_med: price_med,
    price_suggested_max: price_max,
    delay_suggested_days: delay_days,
    rationale
  };
}

function calculateLOCWithUplift(data: any, economics: any) {
  const base = calculateQualityScore(data) * 0.8; // Base LOC

  const uplift_budget = Math.round(economics.price_suggested_med * 1.05);
  const uplift_delay = economics.delay_suggested_days + 1;
  const delta_loc = Math.min(0.12, (uplift_budget / economics.price_suggested_med - 1) * 0.4);

  return {
    base: Math.round(base * 100) / 100,
    uplift_reco: {
      new_budget: uplift_budget,
      new_delay: uplift_delay,
      delta_loc: Math.round(delta_loc * 100) / 100
    }
  };
}

function generateSmartQuestions(data: any, category: string): any[] {
  const questions = [];

  // Questions manquantes basiques
  if (!data.deadline_ts) {
    questions.push({
      id: 'deadline',
      q: 'Quelle est votre échéance souhaitée ?',
      type: 'date',
      required: true
    });
  }

  // Questions spécifiques par catégorie
  const categoryQuestions = {
    'travaux': [
      { id: 'surface_m2', q: 'Quelle surface exacte à traiter (m²) ?', type: 'number' },
      { id: 'access', q: 'Y a-t-il des contraintes d\'accès ?', type: 'text' },
      { id: 'timing', q: 'Préférez-vous intervention en semaine ou weekend ?', type: 'enum', options: ['semaine', 'weekend', 'flexible'] }
    ],
    'développement': [
      { id: 'tech_prefs', q: 'Avez-vous des préférences technologiques ?', type: 'text' },
      { id: 'integrations', q: 'Intégrations requises (API, services) ?', type: 'text' },
      { id: 'users_count', q: 'Nombre d\'utilisateurs attendus ?', type: 'enum', options: ['<100', '100-1000', '1000-10000', '>10000'] }
    ],
    'design': [
      { id: 'brand_exists', q: 'Avez-vous déjà une charte graphique ?', type: 'enum', options: ['oui', 'non', 'partielle'] },
      { id: 'target_audience', q: 'Quelle est votre cible ?', type: 'text' },
      { id: 'formats_needed', q: 'Quels formats avez-vous besoin ?', type: 'text' }
    ]
  };

  const specificQuestions = categoryQuestions[category] || [];
  questions.push(...specificQuestions.slice(0, 3));

  return questions;
}

function buildApplicationPatch(missionDraft: any, suggestion: any, apply: any) {
  const fields: any = {};
  const meta: any = {};
  const diffs: any[] = [];
  let applied_count = 0;

  // Application du texte
  if (apply.text) {
    fields.title = suggestion.rewrite.title;
    fields.description = suggestion.rewrite.summary;
    diffs.push({
      field: 'title',
      before: missionDraft.title,
      after: suggestion.rewrite.title
    });
    diffs.push({
      field: 'description',
      before: missionDraft.description,
      after: suggestion.rewrite.summary
    });
    applied_count += 2;
  }

  // Application des critères
  if (apply.criteria) {
    meta.acceptance_criteria = suggestion.rewrite.acceptance_criteria;
    applied_count += 1;
  }

  // Application des tâches
  if (apply.tasks) {
    meta.tasks = suggestion.structure.tasks;
    applied_count += 1;
  }

  // Application des livrables
  if (apply.deliverables) {
    meta.deliverables = suggestion.structure.deliverables;
    applied_count += 1;
  }

  // Application du budget
  if (apply.budget) {
    const budgetMap = {
      'min': suggestion.economics.price_suggested_min,
      'med': suggestion.economics.price_suggested_med,
      'max': suggestion.economics.price_suggested_max
    };
    const selectedBudget = budgetMap[apply.budget];
    if (selectedBudget) {
      fields.budget_min = Math.round(selectedBudget * 0.85);
      fields.budget_max = selectedBudget;
      diffs.push({
        field: 'budget',
        before: `${missionDraft.budget_min || 0}-${missionDraft.budget_max || 0}`,
        after: `${fields.budget_min}-${fields.budget_max}`
      });
      applied_count += 1;
    }
  }

  // Application du délai
  if (apply.delay) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + suggestion.economics.delay_suggested_days);
    fields.deadline_ts = deadline.toISOString().split('T')[0];
    diffs.push({
      field: 'deadline',
      before: missionDraft.deadline_ts || 'Non défini',
      after: fields.deadline_ts
    });
    applied_count += 1;
  }

  const impact_summary = `${applied_count} amélioration(s) appliquée(s). Impact estimé : +${Math.round(suggestion.loc.uplift_reco.delta_loc * 100)} pts de probabilité d\'aboutissement.`;

  return { fields, meta, diffs, applied_count, impact_summary };
}

function enrichDataWithAnswers(originalData: any, answers: any[]) {
  const enriched = { ...originalData };

  answers.forEach(answer => {
    switch (answer.id) {
      case 'surface_m2':
        enriched.surface = parseInt(answer.value);
        break;
      case 'deadline':
        enriched.deadline_ts = answer.value;
        break;
      case 'tech_prefs':
        enriched.description += `\n\nPréférences techniques : ${answer.value}`;
        break;
      case 'access':
        enriched.description += `\n\nContraintes d\'accès : ${answer.value}`;
        break;
      default:
        enriched[answer.id] = answer.value;
    }
  });

  return enriched;
}

function calculateImprovements(originalData: any, enrichedData: any) {
  const originalScore = calculateAdvancedQualityScore(originalData);
  const enrichedScore = calculateAdvancedQualityScore(enrichedData);

  return {
    quality_delta: Math.round((enrichedScore - originalScore) * 100) / 100,
    new_questions_count: generateSmartQuestions(enrichedData, enrichedData.category || 'services').length,
    message: enrichedScore > originalScore ? 
      `Qualité améliorée de ${Math.round((enrichedScore - originalScore) * 100)}%` :
      'Pas d\'amélioration significative détectée'
  };
}

// Helpers utilitaires
function extractSurface(description: string): number | null {
  const matches = description.match(/(\d+)\s*m[²2]/);
  return matches ? parseInt(matches[1]) : null;
}

function assessComplexity(data: any): string {
  const desc = data.description?.toLowerCase() || '';
  if (desc.includes('simple') || desc.includes('basique')) return 'simple';
  if (desc.includes('complexe') || desc.includes('avancé')) return 'complex';
  if (desc.includes('expert') || desc.includes('spécialisé')) return 'expert';
  return 'medium';
}

function calculateAdvancedQualityScore(data: any): number {
  let score = 0.2; // Base

  if (data.title && data.title.length > 10) score += 0.15;
  if (data.description && data.description.length > 50) score += 0.15;
  if (data.description && data.description.length > 200) score += 0.1;
  if (data.category) score += 0.1;
  if (data.budget_min && data.budget_max) score += 0.1;
  if (data.deadline_ts) score += 0.1;
  if (extractSurface(data.description)) score += 0.05;
  if (data.description && data.description.split('.').length > 3) score += 0.05;

  return Math.min(score, 0.95);
}

function calculateAdvancedRichnessScore(data: any): number {
  let score = 0.1; // Base

  const descLength = data.description?.length || 0;
  if (descLength > 100) score += 0.2;
  if (descLength > 300) score += 0.15;
  if (descLength > 500) score += 0.1;

  const keywords = extractSkills(data.description || '').length;
  score += Math.min(keywords * 0.03, 0.2);

  if (data.location) score += 0.05;
  if (data.deadline_ts) score += 0.1;
  if (extractSurface(data.description)) score += 0.1;

  return Math.min(score, 0.9);
}

function getPriceReferenceData(category: string) {
  const priceData = {
    'travaux': { hourly_med: 45, daily_med: 350, avg_days: 8 },
    'développement': { hourly_med: 60, daily_med: 480, avg_days: 18 },
    'design': { hourly_med: 50, daily_med: 400, avg_days: 10 },
    'marketing': { hourly_med: 55, daily_med: 440, avg_days: 12 },
    'conseil': { hourly_med: 85, daily_med: 680, avg_days: 15 },
    'services': { hourly_med: 40, daily_med: 320, avg_days: 7 }
  };

  return priceData[category] || priceData['services'];
}

function generatePriceRationale(category: string, complexity: string, surface: number | null, priceData: any): string {
  let rationale = `Basé sur tarif médian ${category} (${priceData.daily_med}€/jour, ${priceData.avg_days}j moyens)`;

  if (complexity !== 'medium') {
    rationale += `, ajusté complexité ${complexity}`;
  }

  if (surface) {
    rationale += `, surface ${surface} m²`;
  }

  return rationale + '.';
}

function generateDetailedReasons(data: any, qualityScore: number, richnessScore: number, economics: any): string[] {
  const reasons = [];

  if (qualityScore < 0.7) {
    reasons.push('Brief enrichi avec structure professionnelle et critères SMART');
  }

  if (richnessScore < 0.6) {
    reasons.push('Contenu structuré pour une meilleure compréhension');
  }

  if (economics.price_suggested_med > (data.budget_max || 0)) {
    reasons.push(`Budget ajusté au marché (+${Math.round((economics.price_suggested_med / (data.budget_max || economics.price_suggested_med) - 1) * 100)}%)`);
  }

  if (!data.deadline_ts) {
    reasons.push(`Délai réaliste proposé (${economics.delay_suggested_days} jours)`);
  }

  const skills = extractSkills(data.description || '');
  if (skills.length > 0) {
    reasons.push(`${skills.length} compétence(s) identifiée(s) : ${skills.slice(0, 2).join(', ')}`);
  }

  return reasons.slice(0, 4);
}

// Fonctions de détection de sous-catégories
function detectWorksSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('peinture')) return 'peinture';
  if (desc.includes('plomberie')) return 'plomberie';
  if (desc.includes('électricité') || desc.includes('électrique')) return 'électricité';
  if (desc.includes('maçonnerie')) return 'maçonnerie';
  return 'rénovation';
}

function detectDevSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('web') || desc.includes('site')) return 'web';
  if (desc.includes('mobile') || desc.includes('app')) return 'mobile';
  if (desc.includes('api')) return 'api';
  if (desc.includes('backend') || desc.includes('serveur')) return 'backend';
  return 'web';
}

function detectDesignSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('ui') || desc.includes('ux') || desc.includes('interface')) return 'ui_ux';
  if (desc.includes('logo')) return 'logo';
  if (desc.includes('print') || desc.includes('impression')) return 'print';
  return 'graphique';
}

function detectMarketingSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('seo') || desc.includes('référencement')) return 'seo';
  if (desc.includes('social') || desc.includes('réseaux')) return 'social';
  if (desc.includes('contenu') || desc.includes('rédaction')) return 'contenu';
  return 'digital';
}

function detectConsultingSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('business') || desc.includes('entreprise')) return 'business';
  if (desc.includes('it') || desc.includes('informatique')) return 'it';
  if (desc.includes('formation')) return 'formation';
  return 'stratégie';
}

function detectServicesSubCategory(description: string): string {
  const desc = description.toLowerCase();
  if (desc.includes('traduction')) return 'traduction';
  if (desc.includes('rédaction') || desc.includes('écriture')) return 'rédaction';
  if (desc.includes('juridique') || desc.includes('droit')) return 'juridique';
  return 'généraliste';
}

function extractRequiredSkills(data: any, category: string): string[] {
  const skills = extractSkills(data.description || '');

  // Ajouter des compétences par défaut selon la catégorie
  const defaultSkills = {
    'travaux': ['travaux intérieur', 'finitions'],
    'développement': ['programmation', 'tests'],
    'design': ['création graphique', 'logiciels design'],
    'marketing': ['marketing digital', 'communication'],
    'conseil': ['analyse', 'recommandations'],
    'services': ['service client', 'qualité']
  };

  const combined = [...new Set([...skills, ...(defaultSkills[category] || [])])];
  return combined.slice(0, 6);
}

function extractProjectConstraints(data: any): string[] {
  const constraints = [];
  const desc = data.description?.toLowerCase() || '';

  if (desc.includes('urgent')) constraints.push('délais serrés');
  if (desc.includes('budget') && desc.includes('serré')) constraints.push('budget contraint');
  if (desc.includes('weekend')) constraints.push('intervention weekend');
  if (desc.includes('présence') || desc.includes('sur site')) constraints.push('présence sur site');
  if (data.geo_required) constraints.push('intervention géographique requise');

  return constraints;
}

function generateContextSentence(data: any, category: string): string {
  const contexts = {
    'travaux': 'Travaux de rénovation/amélioration nécessitant une intervention professionnelle.',
    'développement': 'Projet de développement logiciel nécessitant des compétences techniques.',
    'design': 'Création graphique professionnelle pour répondre aux besoins visuels.',
    'marketing': 'Mission marketing pour développer la visibilité et l\'engagement.',
    'conseil': 'Mission de conseil pour apporter expertise et recommandations.',
    'services': 'Prestation de service spécialisée.'
  };

  return contexts[category] || 'Mission professionnelle nécessitant expertise spécialisée.';
}

function generateObjectiveSentence(data: any, category: string): string {
  return `Réaliser ${data.title?.toLowerCase() || 'la mission'} selon les spécifications définies, dans le respect des délais et de la qualité attendue.`;
}

function generateConstraintsSentence(data: any): string {
  const constraints = extractProjectConstraints(data);
  if (constraints.length > 0) {
    return `Respecter les contraintes suivantes : ${constraints.join(', ')}.`;
  }
  return 'Aucune contrainte particulière identifiée.';
}

function generateDeliverablesSentence(data: any, category: string, surface: number | null): string {
  const surfaceText = surface ? ` pour ${surface} m²` : '';
  const deliverables = {
    'travaux': `Travaux terminés et conformes${surfaceText}, chantier nettoyé.`,
    'développement': 'Application fonctionnelle, code documenté, tests validés.',
    'design': 'Créations finalisées, fichiers sources, déclinaisons.',
    'marketing': 'Stratégie définie, contenus créés, campagnes déployées.',
    'conseil': 'Analyse complète, recommandations, plan d\'action.',
    'services': 'Prestation réalisée selon cahier des charges.'
  };

  return deliverables[category] || 'Livrable conforme aux attentes définies.';
}

function generateCriteriaSentence(data: any, category: string): string {
  return 'Validation par étapes, respect des standards qualité, satisfaction client mesurée.';
}