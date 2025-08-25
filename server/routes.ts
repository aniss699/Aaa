
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { storage } from './storage';

const improveProjectSchema = z.object({
  projectId: z.string()
});

const applyStandardizationSchema = z.object({
  projectId: z.string(),
  apply_budget: z.enum(['min', 'med', 'max']).optional(),
  apply_delay: z.boolean().optional(),
  apply_title: z.boolean().optional(),
  apply_summary: z.boolean().optional()
});

const completeBriefSchema = z.object({
  projectId: z.string(),
  answers: z.array(z.object({
    question_id: z.string(),
    value: z.string()
  })),
  apply: z.boolean().optional()
});

const sourcingDiscoverSchema = z.object({
  projectId: z.string(),
  strategy: z.enum(['rss', 'sitemap']).optional(),
  max: z.number().optional()
});

export async function routes(fastify: FastifyInstance) {
  // Routes existantes...
  
  // === Routes IA d'amélioration ===
  
  // Amélioration complète d'un projet
  fastify.post('/ai/projects/:id/improve', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      const project = storage.getProject(id);
      if (!project) {
        return reply.status(404).send({ error: 'Projet non trouvé' });
      }

      // Appel au service ML pour amélioration complète
      const mlResponse = await fetch('http://localhost:8001/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          category: project.category,
          budget: project.budget,
          deadline: project.deadline
        })
      });

      if (!mlResponse.ok) {
        throw new Error(`ML service error: ${mlResponse.status}`);
      }

      const improvements = await mlResponse.json();
      
      // Persistance de la standardisation
      const standardization = {
        id: `std_${id}`,
        projectId: id,
        titleStd: improvements.title_std,
        summaryStd: improvements.summary_std,
        acceptanceCriteria: improvements.acceptance_criteria,
        categoryStd: improvements.category_std,
        subCategoryStd: improvements.sub_category_std,
        tagsStd: improvements.tags_std,
        tasksStd: improvements.tasks_std,
        deliverablesStd: improvements.deliverables_std,
        skillsStd: improvements.skills_std,
        constraintsStd: improvements.constraints_std,
        briefQualityScore: improvements.brief_quality_score,
        richnessScore: improvements.richness_score,
        missingInfo: improvements.missing_info,
        priceSuggestedMin: improvements.price_suggested_min,
        priceSuggestedMed: improvements.price_suggested_med,
        priceSuggestedMax: improvements.price_suggested_max,
        delaySuggestedDays: improvements.delay_suggested_days,
        locBase: improvements.loc_base,
        locUpliftReco: improvements.loc_uplift_reco,
        rewriteVersion: improvements.rewrite_version,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveProjectStandardization(standardization);

      return {
        success: true,
        standardization,
        diffs: {
          title: {
            original: project.title,
            improved: improvements.title_std
          },
          description: {
            original: project.description,
            improved: improvements.summary_std
          },
          budget: {
            original: project.budget,
            suggested: {
              min: improvements.price_suggested_min,
              med: improvements.price_suggested_med,
              max: improvements.price_suggested_max
            }
          },
          deadline: {
            original: project.deadline,
            suggested_days: improvements.delay_suggested_days
          }
        }
      };

    } catch (error) {
      fastify.log.error('Error improving project:', error);
      return reply.status(500).send({ error: 'Erreur lors de l\'amélioration du projet' });
    }
  });

  // Preview de la standardisation
  fastify.get('/ai/projects/:id/preview', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    try {
      const project = storage.getProject(id);
      const standardization = storage.getProjectStandardization(id);
      
      if (!project) {
        return reply.status(404).send({ error: 'Projet non trouvé' });
      }

      if (!standardization) {
        return reply.status(404).send({ 
          error: 'Aucune standardisation disponible. Lancez d\'abord l\'amélioration.' 
        });
      }

      return {
        original: {
          title: project.title,
          description: project.description,
          budget: project.budget,
          deadline: project.deadline
        },
        standardized: {
          title_std: standardization.titleStd,
          summary_std: standardization.summaryStd,
          acceptance_criteria: standardization.acceptanceCriteria,
          category_std: standardization.categoryStd,
          sub_category_std: standardization.subCategoryStd,
          tags_std: standardization.tagsStd,
          skills_std: standardization.skillsStd,
          constraints_std: standardization.constraintsStd,
          tasks_std: standardization.tasksStd,
          deliverables_std: standardization.deliverablesStd
        },
        quality: {
          brief_quality_score: standardization.briefQualityScore,
          richness_score: standardization.richnessScore,
          missing_info: standardization.missingInfo
        },
        suggestions: {
          price: {
            min: standardization.priceSuggestedMin,
            med: standardization.priceSuggestedMed,
            max: standardization.priceSuggestedMax
          },
          delay_days: standardization.delaySuggestedDays,
          loc_base: standardization.locBase,
          loc_uplift_reco: standardization.locUpliftReco
        }
      };

    } catch (error) {
      fastify.log.error('Error previewing standardization:', error);
      return reply.status(500).send({ error: 'Erreur lors de la prévisualisation' });
    }
  });

  // Complétion du brief avec réponses aux questions
  fastify.post('/ai/projects/:id/brief/complete', async (request, reply) => {
    const { projectId, answers, apply } = completeBriefSchema.parse({
      projectId: (request.params as any).id,
      ...request.body
    });
    
    try {
      const project = storage.getProject(projectId);
      if (!project) {
        return reply.status(404).send({ error: 'Projet non trouvé' });
      }

      // Appel ML pour recomputer avec les réponses
      const mlResponse = await fetch('http://localhost:8001/brief/recompute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          answers: answers
        })
      });

      if (!mlResponse.ok) {
        throw new Error(`ML service error: ${mlResponse.status}`);
      }

      const updatedStandardization = await mlResponse.json();
      
      if (apply) {
        // Mise à jour de la standardisation
        storage.updateProjectStandardization(projectId, updatedStandardization);
      }

      return {
        success: true,
        updated_standardization: updatedStandardization,
        applied: apply || false
      };

    } catch (error) {
      fastify.log.error('Error completing brief:', error);
      return reply.status(500).send({ error: 'Erreur lors de la complétion du brief' });
    }
  });

  // Application des suggestions au projet
  fastify.post('/ai/projects/:id/apply', async (request, reply) => {
    const { 
      projectId, 
      apply_budget, 
      apply_delay, 
      apply_title, 
      apply_summary 
    } = applyStandardizationSchema.parse({
      projectId: (request.params as any).id,
      ...request.body
    });
    
    try {
      const project = storage.getProject(projectId);
      const standardization = storage.getProjectStandardization(projectId);
      
      if (!project || !standardization) {
        return reply.status(404).send({ error: 'Projet ou standardisation non trouvé' });
      }

      const changes: any = {};
      const originalProject = { ...project };

      // Application du budget
      if (apply_budget && standardization.priceSuggestedMin) {
        const budgetMap = {
          'min': standardization.priceSuggestedMin,
          'med': standardization.priceSuggestedMed,
          'max': standardization.priceSuggestedMax
        };
        
        project.budget = budgetMap[apply_budget];
        changes.budget = {
          from: originalProject.budget,
          to: project.budget,
          type: apply_budget
        };
      }

      // Application du délai
      if (apply_delay && standardization.delaySuggestedDays) {
        const newDeadline = new Date();
        newDeadline.setDate(newDeadline.getDate() + standardization.delaySuggestedDays);
        
        project.deadline = newDeadline;
        changes.deadline = {
          from: originalProject.deadline,
          to: project.deadline,
          days_added: standardization.delaySuggestedDays
        };
      }

      // Application du titre
      if (apply_title && standardization.titleStd) {
        project.title = standardization.titleStd;
        changes.title = {
          from: originalProject.title,
          to: project.title
        };
      }

      // Application du résumé
      if (apply_summary && standardization.summaryStd) {
        project.description = standardization.summaryStd;
        changes.description = {
          from: originalProject.description,
          to: project.description
        };
      }

      // Sauvegarde du projet modifié
      storage.updateProject(projectId, project);

      // Log des changements
      const changeLog = {
        id: `log_${Date.now()}`,
        projectId,
        action: 'apply_standardization',
        changes,
        createdAt: new Date()
      };
      storage.saveProjectChangeLog(changeLog);

      return {
        success: true,
        project_updated: project,
        changes_applied: changes,
        change_log_id: changeLog.id
      };

    } catch (error) {
      fastify.log.error('Error applying standardization:', error);
      return reply.status(500).send({ error: 'Erreur lors de l\'application des suggestions' });
    }
  });

  // === Routes Sourcing ===

  // Découverte de candidats externes
  fastify.post('/sourcing/discover', async (request, reply) => {
    const { projectId, strategy, max } = sourcingDiscoverSchema.parse(request.body);
    
    try {
      const project = storage.getProject(projectId);
      if (!project) {
        return reply.status(404).send({ error: 'Projet non trouvé' });
      }

      // Appel ML pour sourcing
      const mlResponse = await fetch('http://localhost:8001/sourcing/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          strategy: strategy || 'rss',
          max: max || 20
        })
      });

      if (!mlResponse.ok) {
        throw new Error(`ML service error: ${mlResponse.status}`);
      }

      const sourcingResults = await mlResponse.json();

      return {
        success: true,
        discovered_candidates: sourcingResults.candidates_count,
        discovery_stats: sourcingResults.stats,
        top_matches: sourcingResults.top_matches
      };

    } catch (error) {
      fastify.log.error('Error discovering candidates:', error);
      return reply.status(500).send({ error: 'Erreur lors de la découverte de candidats' });
    }
  });

  // Récupération des candidats externes pour un projet
  fastify.get('/sourcing/project/:id/candidates', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { min_score = 0.4, limit = 20 } = request.query as any;
    
    try {
      const externalCandidates = storage.getSourcingMatches(id, {
        minScore: parseFloat(min_score),
        limit: parseInt(limit)
      });

      const candidates = externalCandidates.map(match => ({
        company: storage.getExternalCompany(match.companyId),
        match_score: match.leadScore,
        reasons: match.reasons,
        status: match.status,
        last_seen: storage.getExternalCompany(match.companyId)?.lastSeenAt
      }));

      return {
        project_id: id,
        external_candidates: candidates,
        total_count: candidates.length,
        filters_applied: {
          min_score: parseFloat(min_score),
          limit: parseInt(limit)
        }
      };

    } catch (error) {
      fastify.log.error('Error getting external candidates:', error);
      return reply.status(500).send({ error: 'Erreur lors de la récupération des candidats' });
    }
  });

  // Candidats unifiés (internes + externes)
  fastify.get('/ai/projects/:id/candidates', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { diversity = false, limit = 30 } = request.query as any;
    
    try {
      const project = storage.getProject(id);
      if (!project) {
        return reply.status(404).send({ error: 'Projet non trouvé' });
      }

      // Candidats internes (existants)
      const internalBids = storage.getBids().filter(bid => bid.projectId === id);
      const internalCandidates = internalBids.map(bid => {
        const provider = storage.getUser(bid.providerId);
        return {
          type: 'internal',
          provider,
          bid,
          global_score: calculateGlobalScore(bid, project), // À implémenter
          source: 'platform'
        };
      });

      // Candidats externes
      const externalMatches = storage.getSourcingMatches(id, { minScore: 0.3 });
      const externalCandidates = externalMatches.map(match => {
        const company = storage.getExternalCompany(match.companyId);
        return {
          type: 'external',
          company,
          match_score: match.leadScore,
          reasons: match.reasons,
          source: 'sourcing'
        };
      });

      // Fusion et tri
      let allCandidates = [...internalCandidates, ...externalCandidates];
      
      if (diversity) {
        // Algorithme MMR (Maximal Marginal Relevance) simplifié
        allCandidates = applyDiversityFiltering(allCandidates);
      }

      // Limitation
      allCandidates = allCandidates.slice(0, parseInt(limit));

      return {
        project_id: id,
        unified_candidates: allCandidates,
        stats: {
          total_internal: internalCandidates.length,
          total_external: externalCandidates.length,
          diversity_applied: diversity,
          final_count: allCandidates.length
        }
      };

    } catch (error) {
      fastify.log.error('Error getting unified candidates:', error);
      return reply.status(500).send({ error: 'Erreur lors de la récupération des candidats unifiés' });
    }
  });
}

// Fonctions utilitaires
function calculateGlobalScore(bid: any, project: any): number {
  // Implémentation simplifiée du scoring global
  let score = 0.5; // Score de base

  // Facteur prix
  if (bid.amount && project.budget) {
    const priceRatio = bid.amount / project.budget;
    if (priceRatio <= 0.8) score += 0.2;
    else if (priceRatio <= 1.0) score += 0.1;
    else if (priceRatio > 1.2) score -= 0.1;
  }

  // Facteur délai
  if (bid.estimatedDuration && project.deadline) {
    const daysUntilDeadline = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (bid.estimatedDuration <= daysUntilDeadline * 0.8) score += 0.15;
    else if (bid.estimatedDuration > daysUntilDeadline) score -= 0.1;
  }

  return Math.max(0, Math.min(1, score));
}

function applyDiversityFiltering(candidates: any[]): any[] {
  // Implémentation simplifiée de MMR
  const selected: any[] = [];
  const remaining = [...candidates];

  while (remaining.length > 0 && selected.length < 20) {
    let bestCandidate = null;
    let bestScore = -1;

    for (const candidate of remaining) {
      // Score de pertinence
      const relevanceScore = candidate.global_score || candidate.match_score || 0.5;
      
      // Score de diversité (distance avec les déjà sélectionnés)
      let diversityScore = 1.0;
      for (const selectedCandidate of selected) {
        const similarity = calculateSimilarity(candidate, selectedCandidate);
        diversityScore *= (1 - similarity);
      }

      // Combinaison MMR (lambda = 0.7 pour favoriser la pertinence)
      const mmrScore = 0.7 * relevanceScore + 0.3 * diversityScore;

      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      selected.push(bestCandidate);
      remaining.splice(remaining.indexOf(bestCandidate), 1);
    } else {
      break;
    }
  }

  return selected;
}

function calculateSimilarity(candidate1: any, candidate2: any): number {
  // Calcul simplifié de similarité
  if (candidate1.type !== candidate2.type) return 0.2; // Types différents = peu similaires
  
  // Pour les candidats internes
  if (candidate1.type === 'internal' && candidate2.type === 'internal') {
    if (candidate1.provider?.id === candidate2.provider?.id) return 1.0;
    return 0.3;
  }
  
  // Pour les candidats externes
  if (candidate1.type === 'external' && candidate2.type === 'external') {
    const company1 = candidate1.company;
    const company2 = candidate2.company;
    
    if (company1?.name === company2?.name) return 1.0;
    
    // Similarité par compétences
    const skills1 = company1?.skills || [];
    const skills2 = company2?.skills || [];
    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    
    return commonSkills.length / Math.max(skills1.length, skills2.length, 1);
  }
  
  return 0.5; // Défaut
}
