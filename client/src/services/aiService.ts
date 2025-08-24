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
      return this.fallbackAnalysis(briefData.description);
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

  private fallbackAnalysis(description: string): AIAnalysisResult {
    const words = description.split(' ').filter(w => w.length > 3);
    const qualityScore = Math.min(100, Math.max(30, words.length * 2));

    const techKeywords = ['react', 'vue', 'angular', 'node', 'php', 'python', 'java'];
    const detectedSkills = techKeywords.filter(skill => 
      description.toLowerCase().includes(skill)
    );

    return {
      score: qualityScore,
      qualityScore,
      detectedSkills,
      recommendations: [
        'Ajouter plus de détails techniques',
        'Préciser les livrables attendus',
        'Définir les critères de réussite'
      ],
      insights: [], // Added insights as per interface, though not explicitly generated in fallback
      confidence: 0.8, // Added confidence as per interface
      optimizedDescription: description + '\n\nDétails techniques à préciser...',
      estimatedComplexity: Math.min(10, Math.max(3, Math.floor(words.length / 10))),
      marketInsights: {
        competitionLevel: 'medium',
        demandLevel: 'high',
        priceRange: { min: 1000, max: 5000 }
      }
    };
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