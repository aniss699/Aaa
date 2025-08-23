
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

export class AIService {
  private bidAnalyzer: SmartBidAnalyzer;
  private matchingEngine: MissionMatchingEngine;
  private revenuePredictor: RevenuePredictor;
  private recommendationEngine: RecommendationEngine;
  private missionStandardizer: MissionStandardizer;

  constructor() {
    this.bidAnalyzer = new SmartBidAnalyzer();
    this.matchingEngine = new MissionMatchingEngine();
    this.revenuePredictor = new RevenuePredictor();
    this.recommendationEngine = new RecommendationEngine();
    this.missionStandardizer = new MissionStandardizer();
  }

  // Analyse intelligente des offres
  async analyzeBid(bidData: any): Promise<AIAnalysisResult> {
    const analysis = this.bidAnalyzer.analyze({
      price: bidData.price,
      timeline: bidData.timeline,
      providerProfile: bidData.provider,
      missionRequirements: bidData.mission
    });

    return {
      score: analysis.overallScore,
      recommendations: analysis.recommendations,
      insights: analysis.insights,
      confidence: analysis.confidence
    };
  }

  // Correspondance mission/prestataire
  async matchMissionToProvider(mission: any, provider: any): Promise<MatchingResult> {
    const match = this.matchingEngine.calculateMatch(mission, provider);
    
    return {
      score: match.compatibilityScore,
      compatibility: match.skillsMatch,
      strengths: match.strengths,
      concerns: match.potentialIssues
    };
  }

  // Recommandation de prix intelligente
  async recommendPrice(missionData: any): Promise<PriceRecommendation> {
    // Analyse du marché basée sur l'historique
    const marketData = this.analyzeMarket(missionData.category, missionData.complexity);
    
    // Calcul du prix suggéré
    const basePrice = this.calculateBasePrice(missionData);
    const marketMultiplier = marketData.competitionLevel < 0.5 ? 1.2 : 0.9;
    const suggestedPrice = Math.round(basePrice * marketMultiplier);

    return {
      suggestedPrice,
      priceRange: {
        min: Math.round(suggestedPrice * 0.8),
        max: Math.round(suggestedPrice * 1.3)
      },
      reasoning: `Prix basé sur la complexité (${missionData.complexity}/10), la durée estimée et l'analyse du marché`,
      marketAnalysis: `Niveau de concurrence: ${(marketData.competitionLevel * 100).toFixed(0)}%`
    };
  }

  // Prédiction de revenus
  async predictRevenue(providerData: any): Promise<any> {
    return this.revenuePredictor.predict({
      historicalData: providerData.pastMissions,
      currentProjects: providerData.activeMissions,
      marketTrends: this.getMarketTrends(providerData.specialties)
    });
  }

  // Détection d'abus et anti-dumping
  async detectAbusePattern(bidData: any): Promise<{
    isAbusive: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    reasons: string[];
  }> {
    const risks: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Détection de dumping
    const marketPrice = await this.getMarketPrice(bidData.mission);
    if (bidData.price < marketPrice * 0.5) {
      risks.push('Prix anormalement bas (possible dumping)');
      riskLevel = 'high';
    }

    // Détection de patterns suspects
    if (bidData.provider.recentBids?.filter((bid: any) => 
      bid.timestamp > Date.now() - 3600000 && bid.price < marketPrice * 0.6
    ).length > 5) {
      risks.push('Comportement de dumping répétitif détecté');
      riskLevel = 'high';
    }

    return {
      isAbusive: risks.length > 0,
      riskLevel,
      reasons: risks
    };
  }

  // Optimisation d'annonces
  async optimizeMissionDescription(missionText: string): Promise<{
    optimizedText: string;
    improvements: string[];
    seoScore: number;
  }> {
    const optimization = this.missionStandardizer.standardize(missionText);
    
    return {
      optimizedText: optimization.optimizedDescription,
      improvements: optimization.suggestions,
      seoScore: optimization.seoScore
    };
  }

  // Méthodes privées
  private analyzeMarket(category: string, complexity: number) {
    // Simulation d'analyse de marché
    const competitionLevels: Record<string, number> = {
      'développement-web': 0.8,
      'design-graphique': 0.7,
      'marketing-digital': 0.6,
      'rédaction': 0.9,
      'consulting': 0.4
    };

    return {
      competitionLevel: competitionLevels[category] || 0.5,
      averagePrice: this.getAveragePrice(category, complexity),
      demandTrend: Math.random() > 0.5 ? 'increasing' : 'stable'
    };
  }

  private calculateBasePrice(missionData: any): number {
    const complexityMultiplier = missionData.complexity * 50;
    const durationMultiplier = missionData.estimatedHours * 25;
    const urgencyMultiplier = missionData.isUrgent ? 1.5 : 1;

    return Math.round((complexityMultiplier + durationMultiplier) * urgencyMultiplier);
  }

  private getAveragePrice(category: string, complexity: number): number {
    const basePrices: Record<string, number> = {
      'développement-web': 500,
      'design-graphique': 300,
      'marketing-digital': 400,
      'rédaction': 200,
      'consulting': 800
    };

    return (basePrices[category] || 400) * (complexity / 5);
  }

  private async getMarketPrice(mission: any): Promise<number> {
    return this.getAveragePrice(mission.category, mission.complexity);
  }

  private getMarketTrends(specialties: string[]) {
    return {
      growth: Math.random() * 0.2 + 0.9, // Entre 0.9 et 1.1
      demandIndex: Math.random() * 0.4 + 0.8, // Entre 0.8 et 1.2
      seasonality: Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 30)) * 0.1 + 1
    };
  }
}

// Instance singleton
export const aiService = new AIService();
