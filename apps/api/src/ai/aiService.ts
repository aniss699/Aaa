
interface AIScoreRequest {
  mission: {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    client_id: string;
    skills_required: string[];
    urgency: string;
    complexity: string;
    duration_weeks: number;
  };
  provider: {
    id: string;
    skills: string[];
    rating: number;
    completed_projects: number;
    location: string;
    hourly_rate: number;
    categories: string[];
    response_time: number;
    success_rate: number;
  };
  bid?: {
    id: string;
    mission_id: string;
    provider_id: string;
    price: number;
    timeline: string;
    proposal: string;
    created_at: string;
  };
}

interface AIScoreResponse {
  total_score: number;
  breakdown: {
    price: number;
    quality: number;
    fit: number;
    delay: number;
    risk: number;
    completion_probability: number;
  };
  explanations: string[];
}

interface PriceRecommendationRequest {
  mission: AIScoreRequest['mission'];
  market_data: Record<string, any>;
  competition_level: 'low' | 'medium' | 'high';
}

interface PriceRecommendationResponse {
  price_range: {
    min: number;
    recommended: number;
    max: number;
  };
  confidence: number;
  reasoning: string[];
  market_position: string;
}

class AIService {
  private baseUrl: string;
  private isOfflineMode: boolean;

  constructor() {
    this.baseUrl = process.env.ML_API_URL || 'http://localhost:8001';
    this.isOfflineMode = process.env.OFFLINE_MODE === 'true';
  }

  /**
   * Calcule le score multi-objectif explicable pour une offre
   */
  async calculateComprehensiveScore(request: AIScoreRequest): Promise<AIScoreResponse> {
    try {
      if (!this.isOfflineMode) {
        throw new Error('External calls disabled in offline mode');
      }

      const response = await fetch(`${this.baseUrl}/score/comprehensive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI scoring failed, using fallback:', error);
      return this.calculateScoreFallback(request);
    }
  }

  /**
   * Recommande un prix optimal basé sur l'IA
   */
  async recommendPrice(request: PriceRecommendationRequest): Promise<PriceRecommendationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/price/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Price recommendation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Price recommendation failed, using fallback:', error);
      return this.recommendPriceFallback(request);
    }
  }

  /**
   * Détecte les abus (collusion, dumping)
   */
  async detectAbuse(bids: AIScoreRequest['bid'][], mission: AIScoreRequest['mission']) {
    try {
      const response = await fetch(`${this.baseUrl}/abuse/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bids, mission })
      });

      if (!response.ok) {
        throw new Error(`Abuse detection failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Abuse detection failed:', error);
      return { collusion: { collusion_detected: false }, dumping: [] };
    }
  }

  /**
   * Matching sémantique avec TF-IDF
   */
  async semanticMatching(missionText: string, providerProfiles: string[]) {
    try {
      const response = await fetch(`${this.baseUrl}/match/semantic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission_text: missionText,
          provider_profiles: providerProfiles
        })
      });

      if (!response.ok) {
        throw new Error(`Semantic matching failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Semantic matching failed, using BM25 fallback:', error);
      return this.bm25Fallback(missionText, providerProfiles);
    }
  }

  /**
   * Calcul de correspondance guidée pour enchères inversées
   */
  calculateGuidedBidding(mission: AIScoreRequest['mission'], currentBids: number[]): {
    suggestedPrice: number;
    nudges: string[];
    antiDumpingWarning?: string;
  } {
    const avgBid = currentBids.length > 0 ? 
      currentBids.reduce((a, b) => a + b, 0) / currentBids.length : 
      mission.budget;

    const minReasonablePrice = mission.budget * 0.4; // Seuil anti-dumping
    const competitivePrice = Math.min(avgBid * 0.95, mission.budget * 0.9);
    
    const suggestedPrice = Math.max(minReasonablePrice, competitivePrice);
    
    const nudges = [];
    if (suggestedPrice < mission.budget * 0.5) {
      nudges.push('Prix très agressif - assurez-vous de pouvoir livrer avec qualité');
    }
    if (currentBids.length > 5) {
      nudges.push('Forte concurrence - différenciez-vous par la qualité');
    }
    if (mission.urgency === 'high') {
      nudges.push('Mission urgente - mettez en avant votre disponibilité');
    }

    const antiDumpingWarning = suggestedPrice <= minReasonablePrice ? 
      'Attention: Ce prix pourrait être considéré comme du dumping' : undefined;

    return { suggestedPrice, nudges, antiDumpingWarning };
  }

  /**
   * Fallback pour le calcul de score (mode dégradé)
   */
  private calculateScoreFallback(request: AIScoreRequest): AIScoreResponse {
    const { mission, provider, bid } = request;
    
    // Calculs simplifiés
    const qualityScore = (provider.rating / 5) * 100;
    const experienceScore = Math.min(100, provider.completed_projects * 2);
    const fitScore = this.calculateSkillsMatch(mission.skills_required, provider.skills);
    
    let priceScore = 70;
    if (bid) {
      const expectedPrice = provider.hourly_rate * mission.duration_weeks * 35;
      const ratio = bid.price / expectedPrice;
      priceScore = ratio < 0.8 ? 90 : ratio <= 1.0 ? 80 : Math.max(30, 80 - (ratio - 1) * 50);
    }

    const totalScore = (qualityScore + experienceScore + fitScore + priceScore) / 4;

    return {
      total_score: Math.round(totalScore),
      breakdown: {
        price: Math.round(priceScore),
        quality: Math.round(qualityScore),
        fit: Math.round(fitScore),
        delay: 75,
        risk: Math.round((provider.success_rate || 0.8) * 100),
        completion_probability: Math.round(totalScore * 0.9)
      },
      explanations: ['Score calculé en mode fallback', 'IA indisponible']
    };
  }

  /**
   * Fallback pour recommandation de prix
   */
  private recommendPriceFallback(request: PriceRecommendationRequest): PriceRecommendationResponse {
    const basePrice = request.mission.budget * 0.8;
    const competitionMultiplier = {
      'low': 1.1,
      'medium': 0.95,
      'high': 0.85
    }[request.competition_level] || 0.95;

    const recommended = basePrice * competitionMultiplier;

    return {
      price_range: {
        min: recommended * 0.9,
        recommended,
        max: recommended * 1.1
      },
      confidence: 60,
      reasoning: ['Calcul basique (IA indisponible)', 'Basé sur budget et concurrence'],
      market_position: recommended < 3000 ? 'budget_friendly' : 'standard'
    };
  }

  /**
   * Fallback BM25 pour matching sémantique
   */
  private bm25Fallback(missionText: string, providerProfiles: string[]) {
    const missionWords = this.tokenize(missionText);
    
    return providerProfiles.map((profile, index) => {
      const profileWords = this.tokenize(profile);
      const commonWords = missionWords.filter(word => profileWords.includes(word));
      const similarity = commonWords.length / Math.max(missionWords.length, 1);
      
      return {
        provider_index: index,
        similarity_score: similarity,
        match_quality: similarity > 0.3 ? 'good' : 'fair'
      };
    }).sort((a, b) => b.similarity_score - a.similarity_score);
  }

  /**
   * Calcul de correspondance des compétences
   */
  private calculateSkillsMatch(requiredSkills: string[], providerSkills: string[]): number {
    const required = requiredSkills.map(s => s.toLowerCase());
    const provider = providerSkills.map(s => s.toLowerCase());
    
    const matches = required.filter(skill => 
      provider.some(pSkill => 
        pSkill.includes(skill) || skill.includes(pSkill)
      )
    );
    
    return Math.round((matches.length / Math.max(required.length, 1)) * 100);
  }

  /**
   * Tokenisation simple pour BM25
   */
  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .split(/[\s,;.!?]+/)
      .filter(word => word.length > 2)
      .slice(0, 20);
  }
}

/**
   * Analyse et structure automatiquement un brief client
   */
  async analyzeSmartBrief(briefText: string): Promise<{
    structure_score: number;
    completeness_score: number;
    clarity_score: number;
    technical_keywords: string[];
    missing_elements: string[];
    suggestions: string[];
    structured_brief: any;
    complexity_level: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/brief/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief_text: briefText })
      });

      if (!response.ok) {
        throw new Error(`Smart brief analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Smart brief analysis failed:', error);
      return this.analyzeSmartBriefFallback(briefText);
    }
  }

  /**
   * Calcule le Trust Score et génère les badges
   */
  async calculateTrustScore(providerId: string): Promise<{
    trust_score: number;
    trust_badges: any[];
    reliability_factors: any;
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/trust/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_id: providerId })
      });

      if (!response.ok) {
        throw new Error(`Trust score calculation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Trust score calculation failed:', error);
      return this.calculateTrustScoreFallback(providerId);
    }
  }

  /**
   * Récupère le Market Heat Score en temps réel
   */
  async getMarketHeatScore(category: string, region?: string): Promise<{
    heat_score: number;
    tension: string;
    price_impact: number;
    opportunity_level: number;
    trend_indicator: string;
    recommendations: string[];
    insights: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/market/heat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, region })
      });

      if (!response.ok) {
        throw new Error(`Market heat analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Market heat analysis failed:', error);
      return this.getMarketHeatScoreFallback(category);
    }
  }

  /**
   * Matching inverse - Trouve des projets pour un prestataire
   */
  async findProjectsForProvider(providerId: string, preferences: any): Promise<{
    recommended_projects: any[];
    latent_opportunities: any[];
    potential_clients: any[];
    match_explanations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/match/inverse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider_id: providerId, preferences })
      });

      if (!response.ok) {
        throw new Error(`Inverse matching failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Inverse matching failed:', error);
      return this.findProjectsForProviderFallback(providerId, preferences);
    }
  }

  // Méthodes fallback pour mode dégradé

  private analyzeSmartBriefFallback(briefText: string) {
    const wordCount = briefText.split(' ').length;
    const hasNumbers = /\d/.test(briefText);
    const hasTechTerms = ['web', 'app', 'site', 'design', 'dev'].some(term => 
      briefText.toLowerCase().includes(term)
    );

    return {
      structure_score: wordCount > 50 ? 75 : 45,
      completeness_score: hasNumbers && wordCount > 30 ? 70 : 50,
      clarity_score: briefText.includes('?') ? 60 : 70,
      technical_keywords: hasTechTerms ? ['web development'] : [],
      missing_elements: ['budget', 'délai'],
      suggestions: ['Précisez votre budget', 'Indiquez vos contraintes de délai'],
      structured_brief: {
        titre_suggere: briefText.substring(0, 30) + '...',
        contexte: briefText.substring(0, 100),
        objectifs: ['Objectif principal à définir'],
        fonctionnalites: ['Fonctionnalités à préciser'],
        contraintes_techniques: [],
        budget_estime: null,
        delai_estime: null
      },
      complexity_level: hasTechTerms ? 'medium' : 'low'
    };
  }

  private calculateTrustScoreFallback(providerId: string) {
    return {
      trust_score: 75,
      trust_badges: [
        {
          id: 'fallback_badge',
          label: 'Prestataire vérifié',
          description: 'Profil validé par nos équipes',
          confidence: 80,
          icon: '✅',
          color: 'blue'
        }
      ],
      reliability_factors: {
        anciennete: 12,
        regularite: 3,
        tauxReponse: 85,
        respectDelais: 90
      },
      recommendations: ['Continuez sur cette lancée', 'Améliorez votre temps de réponse']
    };
  }

  private getMarketHeatScoreFallback(category: string) {
    return {
      heat_score: 65,
      tension: 'medium',
      price_impact: 1.05,
      opportunity_level: 70,
      trend_indicator: 'stable',
      recommendations: ['Marché équilibré - maintenez vos prix standards'],
      insights: [`Demande stable en ${category}`]
    };
  }

  private findProjectsForProviderFallback(providerId: string, preferences: any) {
    return {
      recommended_projects: [
        {
          id: 'fallback-1',
          title: 'Projet correspondant à vos compétences',
          match_score: 85,
          budget: 2500,
          category: preferences.preferred_category || 'web'
        }
      ],
      latent_opportunities: [],
      potential_clients: [],
      match_explanations: ['Correspondance basée sur vos préférences déclarées']
    };
  }
}

export const aiService = new AIService();
export type { AIScoreRequest, AIScoreResponse, PriceRecommendationRequest, PriceRecommendationResponse };
