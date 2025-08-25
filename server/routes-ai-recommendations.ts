
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

  // POST /api/ai/analyze-profile - Analyse complète du profil
  fastify.post('/api/ai/analyze-profile', async (request, reply) => {
    try {
      const { profile, user_type } = request.body as any;
      
      // Analyse de complétude
      const completeness = calculateProfileCompleteness(profile, user_type);
      const missingElements = findMissingElements(profile, user_type);
      const aiSuggestions = generateProfileSuggestions(profile, user_type);
      
      return {
        success: true,
        completeness_score: completeness.score,
        visibility_score: Math.min(completeness.score * 1.2, 100),
        trust_score: completeness.score * 0.8 + (profile.portfolio?.length || 0) * 5,
        missing_elements: missingElements,
        strengths: completeness.strengths,
        ai_suggestions: aiSuggestions,
        market_positioning: {
          current_rank: completeness.score > 80 ? 'Expert' : completeness.score > 60 ? 'Intermédiaire' : 'Débutant',
          potential_rank: 'Expert',
          competitive_advantage: ['Profil vérifié', 'Réactivité', 'Qualité reconnue']
        }
      };
    } catch (error) {
      fastify.log.error('Profile analysis error:', error);
      return { success: false, error: 'Analyse indisponible' };
    }
  });

  // POST /api/ai/text-completion - Suggestions de complétion de texte
  fastify.post('/api/ai/text-completion', async (request, reply) => {
    try {
      const { text, context, max_suggestions = 3 } = request.body as any;
      
      if (!text || text.length < 10) {
        return { success: true, suggestions: [] };
      }

      const suggestions = generateTextCompletionSuggestions(text, context, max_suggestions);
      
      return {
        success: true,
        suggestions,
        context_detected: context?.field || 'general'
      };
    } catch (error) {
      fastify.log.error('Text completion error:', error);
      return { success: false, suggestions: [] };
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


// Fonctions d'analyse IA
function calculateProfileCompleteness(profile: any, userType: string) {
  let score = 0;
  const strengths = [];
  
  // Critères de base
  if (profile.name) { score += 10; strengths.push('Nom renseigné'); }
  if (profile.email) { score += 10; strengths.push('Email vérifié'); }
  if (profile.phone) { score += 5; strengths.push('Téléphone disponible'); }
  if (profile.location) { score += 5; strengths.push('Localisation précisée'); }
  
  // Description
  if (profile.bio) {
    if (profile.bio.length > 100) { score += 20; strengths.push('Description détaillée'); }
    else if (profile.bio.length > 50) { score += 10; strengths.push('Description basique'); }
  }
  
  if (userType === 'provider') {
    // Critères prestataire
    if (profile.skills && profile.skills.length >= 5) { 
      score += 25; 
      strengths.push(`${profile.skills.length} compétences`); 
    }
    if (profile.portfolio && profile.portfolio.length >= 3) { 
      score += 15; 
      strengths.push(`${profile.portfolio.length} projets portfolio`); 
    }
    if (profile.hourlyRate) { score += 10; strengths.push('Tarif défini'); }
  } else {
    // Critères client
    if (profile.company) { score += 15; strengths.push('Entreprise renseignée'); }
    if (profile.industry) { score += 15; strengths.push('Secteur défini'); }
  }

  return { score: Math.min(score, 100), strengths };
}

function findMissingElements(profile: any, userType: string) {
  const missing = [];
  
  if (!profile.bio || profile.bio.length < 100) {
    missing.push({
      category: 'Description',
      item: 'Description détaillée',
      impact: 'high',
      suggestion: 'Ajoutez une description de 150-300 mots décrivant votre expertise ou votre entreprise',
      estimated_improvement: '+25% de visibilité'
    });
  }
  
  if (userType === 'provider') {
    if (!profile.skills || profile.skills.length < 5) {
      missing.push({
        category: 'Compétences',
        item: 'Liste des compétences',
        impact: 'high',
        suggestion: 'Ajoutez au moins 5-8 compétences clés de votre domaine',
        estimated_improvement: '+30% de correspondance'
      });
    }
    
    if (!profile.portfolio || profile.portfolio.length < 3) {
      missing.push({
        category: 'Portfolio',
        item: 'Projets de référence',
        impact: 'medium',
        suggestion: 'Présentez 3-5 projets récents avec descriptions détaillées',
        estimated_improvement: '+20% de confiance'
      });
    }
    
    if (!profile.hourlyRate) {
      missing.push({
        category: 'Tarification',
        item: 'Tarif horaire',
        impact: 'medium',
        suggestion: 'Définissez votre tarif horaire pour faciliter les négociations',
        estimated_improvement: '+15% de conversion'
      });
    }
  } else {
    if (!profile.company) {
      missing.push({
        category: 'Entreprise',
        item: 'Nom de l\'entreprise',
        impact: 'medium',
        suggestion: 'Renseignez le nom de votre entreprise pour plus de crédibilité',
        estimated_improvement: '+20% de confiance'
      });
    }
    
    if (!profile.industry) {
      missing.push({
        category: 'Secteur',
        item: 'Secteur d\'activité',
        impact: 'medium',
        suggestion: 'Précisez votre secteur pour recevoir des candidatures plus ciblées',
        estimated_improvement: '+15% de qualité'
      });
    }
  }
  
  return missing;
}

function generateProfileSuggestions(profile: any, userType: string) {
  const suggestions = [];
  
  if (profile.bio && profile.bio.length > 0) {
    let improvedBio = '';
    
    if (userType === 'provider') {
      improvedBio = profile.bio.includes('expérience') ? profile.bio : 
        profile.bio + ' Fort de plusieurs années d\'expérience, je m\'engage à livrer des solutions de qualité, dans les délais impartis et en parfaite adéquation avec vos besoins spécifiques.';
    } else {
      improvedBio = profile.bio.includes('recherchons') ? profile.bio :
        profile.bio + ' Nous recherchons des partenaires de confiance capables de nous accompagner dans nos projets avec professionnalisme et créativité.';
    }
    
    if (improvedBio !== profile.bio) {
      suggestions.push({
        type: 'text_improvement',
        field: 'bio',
        current: profile.bio,
        suggested: improvedBio,
        reasoning: 'Description plus engageante et professionnelle',
        impact_score: 85
      });
    }
  }
  
  return suggestions;
}

function generateTextCompletionSuggestions(text: string, context: any, maxSuggestions: number) {
  const suggestions = [];
  const lowerText = text.toLowerCase();
  
  // Suggestions basées sur le contexte
  if (context?.field === 'bio' || context?.field === 'description') {
    if (text.length < 50) {
      suggestions.push({
        id: 'bio_extend_1',
        type: 'extension',
        text: text + ' Avec une approche centrée sur la qualité et la satisfaction client, je m\'engage à livrer des résultats qui dépassent vos attentes.',
        confidence: 85,
        reasoning: 'Extension professionnelle standard',
        category: 'Extension pro'
      });
    }
    
    if (!lowerText.includes('expérience') && context?.userType === 'provider') {
      suggestions.push({
        id: 'bio_exp_1',
        type: 'improvement',
        text: text + ' Fort de plusieurs années d\'expérience dans mon domaine, je maîtrise les technologies modernes et les meilleures pratiques du secteur.',
        confidence: 90,
        reasoning: 'Ajout de crédibilité professionnelle',
        category: 'Expertise'
      });
    }
  }
  
  if (context?.field === 'title') {
    suggestions.push({
      id: 'title_improve_1',
      type: 'improvement',
      text: text.charAt(0).toUpperCase() + text.slice(1) + ' - Solution professionnelle clé en main',
      confidence: 80,
      reasoning: 'Titre plus accrocheur',
      category: 'Optimisation'
    });
  }
  
  // Suggestions pour projets
  if (context?.category === 'project') {
    if (!lowerText.includes('budget') && !lowerText.includes('délai')) {
      suggestions.push({
        id: 'project_details_1',
        type: 'completion',
        text: text + ' Budget flexible selon proposition. Délais souhaités : 2-4 semaines. Ouvert aux suggestions d\'amélioration et d\'optimisation.',
        confidence: 88,
        reasoning: 'Informations manquantes essentielles',
        category: 'Détails projet'
      });
    }
  }
  
  return suggestions.slice(0, maxSuggestions);
}

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
