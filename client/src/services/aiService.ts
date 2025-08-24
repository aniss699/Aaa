// AI Service - use direct API calls instead of component imports

export interface AIAnalysisResult {
  score: number;
  recommendations: string[];
  insights: string[];
  confidence: number;
  // New properties added from the changes
  qualityScore?: number;
  detectedSkills?: string[];
  optimizedDescription?: string;
  estimatedComplexity?: number;
  marketInsights?: {
    competitionLevel: string;
    demandLevel: string;
    priceRange?: { min: number; max: number };
  };
}

export interface PriceRecommendation {
  suggestedPrice: number;
  priceRange: { min: number; max: number };
  reasoning: string;
  marketAnalysis: string;
}

export interface MatchingResult {
  score: number;
  compatibility: number;
  strengths: string[];
  concerns: string[];
}

// New interfaces from the edited snippet
interface BidAnalysis {
  score: number;
  priceAnalysis: {
    competitiveness: number;
    marketPosition: string;
  };
  riskAssessment: {
    technical: number;
    timeline: number;
    budget: number;
  };
  recommendations: string[];
}

interface MissionMatch {
  id: number;
  title: string;
  matchScore: number;
  reasons: string[];
}

interface RevenuePrediction {
  estimatedRevenue: number;
  confidence: number;
  factors: string[];
}

interface DumpingDetection {
  isDumping: boolean;
  confidenceLevel: number;
  reasons: string[];
  recommendedMinPrice: number;
}

class AIService {
  private baseUrl = '/api/ai';

  async analyzeBrief(briefData: {
    description: string;
    title?: string;
    category?: string;
  }): Promise<AIAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/brief-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(briefData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze brief');
      }

      return await response.json();
    } catch (error) {
      // Fallback analysis if API is not available
      return this.fallbackAnalysis(briefData.description, briefData.category);
    }
  }

  async analyzePrice(priceData: {
    category: string;
    description: string;
    location?: string;
    complexity: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/price-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze price');
      }

      return await response.json();
    } catch (error) {
      // Fallback price analysis
      return this.fallbackPriceAnalysis(priceData);
    }
  }

  private fallbackAnalysis(description: string, category?: string): AIAnalysisResult {
    const words = description.split(' ').filter(w => w.length > 3);
    const qualityScore = Math.min(100, Math.max(30, words.length * 2));

    // Compétences par catégorie
    const skillsByCategory = {
      development: ['react', 'vue', 'angular', 'node', 'php', 'python', 'java', 'javascript'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
      design: ['photoshop', 'illustrator', 'figma', 'ui', 'ux', 'design'],
      marketing: ['seo', 'google ads', 'facebook', 'instagram', 'marketing'],
      ai: ['machine learning', 'python', 'tensorflow', 'pytorch', 'ia'],
      construction: ['plomberie', 'électricité', 'peinture', 'rénovation']
    };

    const categorySkills = skillsByCategory[category] || skillsByCategory.development;
    const lowerDesc = description.toLowerCase();
    const detectedSkills = categorySkills.filter(skill => lowerDesc.includes(skill));

    // Recommandations par catégorie
    const recommendationsByCategory = {
      development: [
        'Préciser les technologies souhaitées',
        'Détailler l\'architecture technique',
        'Spécifier les intégrations nécessaires'
      ],
      mobile: [
        'Préciser les plateformes (iOS/Android)',
        'Détailler les fonctionnalités natives',
        'Spécifier les stores de publication'
      ],
      design: [
        'Préciser le style graphique souhaité',
        'Détailler les supports de communication',
        'Spécifier les formats de livraison'
      ],
      marketing: [
        'Définir les objectifs mesurables',
        'Préciser les canaux de diffusion',
        'Détailler la cible et personas'
      ],
      ai: [
        'Préciser les données disponibles',
        'Définir les métriques de performance',
        'Spécifier l\'environnement de déploiement'
      ],
      construction: [
        'Préciser les matériaux souhaités',
        'Détailler les contraintes techniques',
        'Spécifier les normes à respecter'
      ]
    };

    const recommendations = recommendationsByCategory[category] || recommendationsByCategory.development;

    return {
      score: qualityScore,
      qualityScore,
      detectedSkills,
      recommendations,
      insights: [`Catégorie ${category || 'développement'} détectée`, `${detectedSkills.length} compétences identifiées`],
      confidence: 0.8,
      optimizedDescription: description + `\n\n[Suggestions IA pour ${category}]: ${recommendations[0]}`,
      estimatedComplexity: Math.min(10, Math.max(3, Math.floor(words.length / 10))),
      marketInsights: {
        competitionLevel: 'medium',
        demandLevel: 'high',
        priceRange: this.getCategoryBudgetRange(category)
      }
    };
  }

  private getCategoryBudgetRange(category?: string) {
    const ranges = {
      development: { min: 2000, max: 8000 },
      mobile: { min: 3000, max: 12000 },
      design: { min: 800, max: 3000 },
      marketing: { min: 1000, max: 5000 },
      ai: { min: 5000, max: 20000 },
      construction: { min: 1500, max: 15000 }
    };
    
    return ranges[category] || ranges.development;
  }

  private fallbackPriceAnalysis(data: any) {
    const basePrice = data.complexity * 500;
    return {
      suggestedPrice: basePrice,
      priceRange: {
        min: basePrice * 0.8,
        max: basePrice * 1.2
      },
      reasoning: 'Estimation basée sur la complexité du projet'
    };
  }
}

export const aiService = new AIService();
export type { BidAnalysis, MissionMatch, RevenuePrediction, DumpingDetection, AIAnalysisResult };