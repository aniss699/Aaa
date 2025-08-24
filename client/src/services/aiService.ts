import {
  SmartBidAnalyzer,
  MissionMatchingEngine,
  RevenuePredictor,
  RecommendationEngine,
  MissionStandardizer
} from '@/components/ai';

export interface AIAnalysisResult {
  score: number;
  recommendations: string[];
  insights: string[];
  confidence: number;
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
  private baseUrl = '/api';

  // Original methods are removed and replaced with new API calls
  // analyzeBid, matchMissionToProvider, recommendPrice, predictRevenue, detectAbusePattern, optimizeMissionDescription, analyzeAdvancedBid, getIntelligentBiddingGuidance, detectAdvancedAbuse, calculateLOCProbability are removed.
  // Private methods are also removed.

  async analyzeBid(projectData: any, bidData: any): Promise<BidAnalysis> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/analyze-bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectData, bidData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'enchère:', error);
      throw error;
    }
  }

  async matchMissions(providerProfile: any): Promise<MissionMatch[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/match-missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerProfile }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la correspondance de missions:', error);
      throw error;
    }
  }

  async predictRevenue(missionData: any, providerData: any): Promise<RevenuePrediction> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/predict-revenue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionData, providerData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la prédiction de revenus:', error);
      throw error;
    }
  }

  async detectDumping(bidData: any): Promise<DumpingDetection> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/detect-dumping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la détection de dumping:', error);
      throw error;
    }
  }

  async optimizeMissionDescription(description: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/optimize-brief`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
      throw error;
    }
  }

  async detectAbusePattern(bidData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/detect-abuse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la détection d\'abus:', error);
      return { isAbuse: false, confidence: 0, reasons: [] };
    }
  }

  async getIntelligentBiddingGuidance(missionData: any, providerData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ai/bidding-guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionData, providerData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du guidage d\'enchère:', error);
      return { suggestedBid: 0, reasoning: [], confidence: 0 };
    }
  }
}

export const aiService = new AIService();
export type { BidAnalysis, MissionMatch, RevenuePrediction, DumpingDetection };