
/**
 * API pour les recommandations IA contextuelles
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const assistantSuggestionsSchema = z.object({
  page: z.string(),
  userContext: z.object({
    isClient: z.boolean().optional(),
    isProvider: z.boolean().optional(),
    missions: z.number().optional(),
    completedProjects: z.number().optional()
  }).optional()
});

export async function registerAIRecommendationRoutes(fastify: FastifyInstance) {
  
  // POST /api/ai/assistant-suggestions - Suggestions contextuelles
  fastify.post('/api/ai/assistant-suggestions', async (request, reply) => {
    try {
      const { page, userContext } = assistantSuggestionsSchema.parse(request.body);
      
      const suggestions = await generatePageSuggestions(page, userContext);
      
      return {
        success: true,
        suggestions,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      fastify.log.error('Assistant suggestions error:', error);
      return {
        success: false,
        suggestions: [],
        fallback: true
      };
    }
  });

  // GET /api/ai/smart-feed - Feed intelligent personnalisé
  fastify.get('/api/ai/smart-feed', async (request, reply) => {
    try {
      // Simulation d'un feed intelligent
      const feed = [
        {
          type: 'mission_recommendation',
          title: 'Nouvelle mission correspondant à vos compétences',
          description: 'Développement d\'une API REST - Budget: 2000-3000€',
          confidence: 0.85,
          action_url: '/missions/123'
        },
        {
          type: 'market_insight',
          title: 'Tendance marché : React en forte demande',
          description: '+30% de missions React cette semaine vs. semaine précédente',
          confidence: 0.92,
          action_url: '/marketplace?category=react'
        },
        {
          type: 'optimization_tip',
          title: 'Optimisez votre profil',
          description: 'Ajoutez des certifications pour augmenter vos chances de 40%',
          confidence: 0.78,
          action_url: '/profile?tab=certifications'
        }
      ];

      return {
        success: true,
        feed,
        personalization_score: 0.82
      };
    } catch (error) {
      fastify.log.error('Smart feed error:', error);
      return { success: false, feed: [] };
    }
  });

  // POST /api/ai/predict-success - Prédiction de succès
  fastify.post('/api/ai/predict-success', async (request, reply) => {
    try {
      const { missionData, providerData } = request.body as any;
      
      const prediction = calculateSuccessPrediction(missionData, providerData);
      
      return {
        success: true,
        prediction,
        factors: prediction.key_factors,
        recommendations: prediction.recommendations
      };
    } catch (error) {
      fastify.log.error('Success prediction error:', error);
      return {
        success: false,
        prediction: { probability: 0.5, confidence: 0.3 }
      };
    }
  });
}

async function generatePageSuggestions(page: string, userContext: any) {
  const suggestions: any[] = [];
  
  switch (page) {
    case 'create-mission':
      suggestions.push({
        type: 'enhancement',
        title: 'Utilisez l\'IA pour optimiser votre annonce',
        description: 'Notre IA peut améliorer votre description et suggérer un budget optimal',
        action: 'Analyser avec l\'IA',
        icon: 'Sparkles',
        priority: 'high'
      });
      
      if (!userContext?.missions || userContext.missions < 3) {
        suggestions.push({
          type: 'tip',
          title: 'Première mission ? Voici nos conseils',
          description: 'Les missions avec budget et délais précis reçoivent 60% plus de candidatures',
          action: 'Voir le guide',
          icon: 'Lightbulb',
          priority: 'medium'
        });
      }
      break;
      
    case 'marketplace':
      suggestions.push({
        type: 'recommendation',
        title: 'Missions recommandées pour vous',
        description: 'Basé sur vos compétences et votre historique',
        action: 'Voir les recommandations',
        icon: 'Target',
        priority: 'high'
      });
      
      suggestions.push({
        type: 'market',
        title: 'Analyse du marché en temps réel',
        description: 'Découvrez les tendances et opportunités du moment',
        action: 'Voir l\'analyse',
        icon: 'TrendingUp',
        priority: 'medium'
      });
      break;
      
    case 'profile':
      suggestions.push({
        type: 'optimization',
        title: 'Optimisez votre profil avec l\'IA',
        description: 'Notre IA peut analyser et améliorer votre profil pour +40% de visibilité',
        action: 'Analyser mon profil',
        icon: 'User',
        priority: 'high'
      });
      break;
  }
  
  return suggestions;
}

function calculateSuccessPrediction(missionData: any, providerData: any) {
  // Simulation d'un calcul de prédiction
  let probability = 0.5;
  const factors = [];
  const recommendations = [];
  
  // Facteurs positifs
  if (providerData.rating > 4.5) {
    probability += 0.2;
    factors.push('Excellent rating du prestataire');
  }
  
  if (missionData.budget && missionData.budget > 1000) {
    probability += 0.15;
    factors.push('Budget confortable');
  }
  
  if (providerData.completedProjects > 10) {
    probability += 0.1;
    factors.push('Prestataire expérimenté');
  }
  
  // Facteurs de risque
  if (missionData.timeline < 7) {
    probability -= 0.1;
    factors.push('Délai serré');
    recommendations.push('Considérez un délai plus réaliste');
  }
  
  if (!missionData.detailed_requirements) {
    probability -= 0.15;
    factors.push('Spécifications peu détaillées');
    recommendations.push('Ajoutez plus de détails techniques');
  }
  
  return {
    probability: Math.max(0.1, Math.min(0.95, probability)),
    confidence: 0.78,
    key_factors: factors,
    recommendations
  };
}
