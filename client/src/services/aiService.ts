
// Types pour l'analyse IA
interface AIAnalysis {
  qualityScore: number;
  improvements: string[];
  missingElements: string[];
  technicalComplexity: string;
  optimizedDescription?: string;
  marketInsights: {
    competitionLevel: string;
    suggestedBudgetRange: {
      min: number;
      max: number;
    };
  };
}

interface MissionData {
  description: string;
  category?: string;
  title?: string;
  budget?: string;
  location?: string;
}

// Service IA pour l'analyse et les suggestions
export const aiService = {
  // Analyse rapide d'une mission pendant la saisie
  async quickAnalysis(missionData: MissionData): Promise<AIAnalysis> {
    try {
      const response = await fetch('/api/ai/quick-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(missionData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse IA');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analyse IA:', error);
      throw error;
    }
  },

  // Analyse de brief pour la création de mission
  async briefAnalysis(data: { description: string; category?: string; title?: string }): Promise<AIAnalysis> {
    try {
      const response = await fetch('/api/ai/brief-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse du brief');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analyse brief:', error);
      throw error;
    }
  },

  // Analyse de prix intelligente
  async priceAnalysis(data: {
    category: string;
    description: string;
    location?: string;
    complexity?: number;
    urgency?: string;
  }) {
    try {
      const response = await fetch('/api/ai/price-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse de prix');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur analyse prix:', error);
      throw error;
    }
  },

  // Optimisation de brief
  async optimizeBrief(data: { description: string }) {
    try {
      const response = await fetch('/api/ai/optimize-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'optimisation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur optimisation brief:', error);
      throw error;
    }
  }
};

// Fonction d'analyse globale (alias pour compatibility)
export const analyzeWithAI = aiService.briefAnalysis;

export default aiService;
