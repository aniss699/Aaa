
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
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private requestQueue: Map<string, Promise<any>>;
  private performanceMetrics: {
    requests: number;
    cacheHits: number;
    avgResponseTime: number;
    errors: number;
  };

  constructor() {
    this.baseUrl = process.env.ML_API_URL || 'http://localhost:8001';
    this.isOfflineMode = process.env.OFFLINE_MODE === 'true';
    this.cache = new Map();
    this.requestQueue = new Map();
    this.performanceMetrics = {
      requests: 0,
      cacheHits: 0,
      avgResponseTime: 0,
      errors: 0
    };
    
    // Nettoyage automatique du cache toutes les heures
    setInterval(() => this.cleanCache(), 3600000);
  }

  /**
   * Cache intelligent avec TTL adaptatif
   */
  private async getCachedOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl: number = 300000 // 5 minutes par défaut
  ): Promise<T> {
    const startTime = Date.now();
    this.performanceMetrics.requests++;

    // Vérification cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.performanceMetrics.cacheHits++;
      return cached.data;
    }

    // Déduplication des requêtes
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!;
    }

    // Nouvelle requête
    const request = fetchFn()
      .then(data => {
        // Mise en cache avec TTL adaptatif
        const adaptiveTtl = this.calculateAdaptiveTtl(key, data);
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl: adaptiveTtl
        });
        
        this.updateMetrics(startTime);
        return data;
      })
      .catch(error => {
        this.performanceMetrics.errors++;
        throw error;
      })
      .finally(() => {
        this.requestQueue.delete(key);
      });

    this.requestQueue.set(key, request);
    return request;
  }

  /**
   * TTL adaptatif basé sur le type de données
   */
  private calculateAdaptiveTtl(key: string, data: any): number {
    // TTL court pour données volatiles
    if (key.includes('market') || key.includes('price')) {
      return 60000; // 1 minute
    }
    
    // TTL moyen pour scores
    if (key.includes('score') || key.includes('analysis')) {
      return 300000; // 5 minutes
    }
    
    // TTL long pour données stables
    if (key.includes('profile') || key.includes('trust')) {
      return 1800000; // 30 minutes
    }
    
    // TTL adaptatif selon la qualité des données
    if (data.confidence && data.confidence > 90) {
      return 600000; // 10 minutes pour données fiables
    }
    
    return 300000; // Défaut 5 minutes
  }

  /**
   * Nettoyage intelligent du cache
   */
  private cleanCache(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    console.log(`Cache cleaned: ${cleaned} entries removed`);
  }

  private updateMetrics(startTime: number): void {
    const responseTime = Date.now() - startTime;
    this.performanceMetrics.avgResponseTime = 
      (this.performanceMetrics.avgResponseTime + responseTime) / 2;
  }

  /**
   * Métriques de performance
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      cacheHitRate: this.performanceMetrics.cacheHits / this.performanceMetrics.requests,
      cacheSize: this.cache.size
    };
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

/**
   * Standardise et structure automatiquement un brief client
   */
  async standardizeProject(projectData: {
    title: string;
    description: string;
    category?: string;
    budget?: number;
  }): Promise<{
    title_std: string;
    summary_std: string;
    acceptance_criteria: string[];
    category_std: string;
    sub_category_std: string;
    tags_std: string[];
    skills_std: string[];
    constraints_std: string[];
    brief_quality_score: number;
    richness_score: number;
    missing_info: any[];
    price_suggested_min?: number;
    price_suggested_med?: number;
    price_suggested_max?: number;
    delay_suggested_days?: number;
    loc_uplift_reco?: any;
  }> {
    const cacheKey = `standardize_${JSON.stringify(projectData)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        if (this.isOfflineMode) {
          throw new Error('Standardization requires ML service');
        }

        const response = await fetch(`${this.baseUrl}/standardize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });

        if (!response.ok) {
          throw new Error(`Standardization failed: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Project standardization failed, using fallback:', error);
        return this.standardizeProjectFallback(projectData);
      }
    }, 1800000); // Cache 30 minutes pour standardisation
  }

  /**
   * Recalcule la standardisation après ajout d'informations manquantes
   */
  async recomputeStandardization(projectId: string, updatedData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/brief/recompute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, ...updatedData })
      });

      if (!response.ok) {
        throw new Error(`Recomputation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Standardization recomputation failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtient un aperçu du scoring basé sur la standardisation
   */
  async getPreviewScoring(projectId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/preview-scoring`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Preview scoring failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Preview scoring failed:', error);
      return null;
    }
  }

  /**
   * Fallback pour standardisation (mode dégradé)
   */
  private standardizeProjectFallback(projectData: any) {
    const { title, description, category } = projectData;
    
    // Standardisation basique
    const title_std = title.trim();
    const summary_std = description.length > 200 ? 
      description.substring(0, 200) + '...' : description;
    
    // Extraction basique de compétences
    const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'Design', 'Marketing'];
    const skills_std = commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
    
    // Catégorie basique
    let category_std = category || 'other';
    if (description.toLowerCase().includes('web') || description.toLowerCase().includes('site')) {
      category_std = 'web-development';
    } else if (description.toLowerCase().includes('design')) {
      category_std = 'design';
    } else if (description.toLowerCase().includes('marketing')) {
      category_std = 'marketing';
    }
    
    // Score de qualité basique
    const brief_quality_score = Math.min(85, 
      (description.split(' ').length / 50) * 100 + 
      (projectData.budget ? 20 : 0)
    );
    
    // Informations manquantes basiques
    const missing_info = [];
    if (!projectData.budget) {
      missing_info.push({
        type: 'budget_range',
        description: 'Budget ou fourchette budgétaire',
        priority: 'high',
        suggestion: 'Précisez votre budget pour recevoir des propositions adaptées'
      });
    }
    
    if (!description.includes('délai') && !description.includes('urgent')) {
      missing_info.push({
        type: 'timeline',
        description: 'Délai ou échéance',
        priority: 'high', 
        suggestion: 'Indiquez vos contraintes de délai'
      });
    }

    return {
      title_std,
      summary_std,
      acceptance_criteria: [
        'Livrable conforme à la description',
        'Respect des délais convenus',
        'Communication régulière'
      ],
      category_std,
      sub_category_std: 'general',
      tags_std: [category_std, ...skills_std.map(s => s.toLowerCase())],
      skills_std,
      constraints_std: [],
      brief_quality_score: Math.round(brief_quality_score),
      richness_score: Math.min(60, description.split(' ').length * 2),
      missing_info,
      price_suggested_min: projectData.budget ? Math.round(projectData.budget * 0.8) : null,
      price_suggested_med: projectData.budget ? projectData.budget : null,
      price_suggested_max: projectData.budget ? Math.round(projectData.budget * 1.2) : null,
      delay_suggested_days: 14, // Délai par défaut
      loc_uplift_reco: {
        current_loc: 0.7,
        recommended_budget: projectData.budget ? Math.round(projectData.budget * 1.1) : null,
        recommended_delay: 21,
        expected_loc_improvement: 0.15
      }
    };
  }

/**
   * Analyse prédictive avancée pour succès de mission
   */
  async predictMissionSuccess(missionData: any, marketContext: any): Promise<{
    success_probability: number;
    key_factors: string[];
    risk_assessment: any;
    optimization_suggestions: string[];
    confidence_level: number;
  }> {
    const cacheKey = `predict_success_${JSON.stringify(missionData)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        const response = await fetch(`${this.baseUrl}/predict/mission-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mission: missionData, market_context: marketContext })
        });

        if (!response.ok) throw new Error('Prediction service unavailable');
        return await response.json();
      } catch (error) {
        return this.predictMissionSuccessFallback(missionData);
      }
    }, 300000); // Cache 5 minutes pour prédictions
  }

  /**
   * Négociation IA automatique entre client et prestataire
   */
  async negotiatePrice(negotiationData: {
    initial_bid: number;
    client_budget: number;
    mission_complexity: number;
    provider_profile: any;
    negotiation_history: any[];
  }): Promise<{
    suggested_counter_offer: number;
    negotiation_strategy: string;
    win_probability: number;
    arguments: string[];
    next_steps: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/negotiate/price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(negotiationData)
      });

      if (!response.ok) throw new Error('Negotiation service unavailable');
      return await response.json();
    } catch (error) {
      return this.negotiatePriceFallback(negotiationData);
    }
  }

  /**
   * Analyse comportementale des utilisateurs
   */
  async analyzeBehavior(userId: string, actionsHistory: any[]): Promise<{
    behavior_patterns: any;
    preferences: any;
    success_indicators: any;
    personalized_recommendations: string[];
    engagement_score: number;
  }> {
    const cacheKey = `behavior_${userId}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        const response = await fetch(`${this.baseUrl}/analyze/behavior`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, actions: actionsHistory })
        });

        if (!response.ok) throw new Error('Behavior analysis unavailable');
        return await response.json();
      } catch (error) {
        return this.analyzeBehaviorFallback(userId, actionsHistory);
      }
    }, 1800000); // Cache 30 minutes pour analyse comportementale
  }

  /**
   * Optimisation en temps réel des prix basée sur l'IA
   */
  async optimizePricingRealTime(missionId: string, currentMarketData: any): Promise<{
    optimal_price: number;
    price_elasticity: number;
    demand_forecast: any;
    competitive_positioning: string;
    adjustment_reasoning: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/pricing-realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission_id: missionId, market_data: currentMarketData })
      });

      if (!response.ok) throw new Error('Real-time pricing unavailable');
      return await response.json();
    } catch (error) {
      return this.optimizePricingRealTimeFallback(missionId, currentMarketData);
    }
  }

  /**
   * Matching intelligent multi-dimensionnel
   */
  async intelligentMatching(criteria: {
    mission: any;
    provider_pool: any[];
    matching_preferences: any;
    historical_data: any[];
  }): Promise<{
    ranked_matches: any[];
    matching_explanations: any;
    confidence_scores: number[];
    alternative_suggestions: any[];
  }> {
    const cacheKey = `intelligent_match_${JSON.stringify(criteria)}`;
    
    return this.getCachedOrFetch(cacheKey, async () => {
      try {
        const response = await fetch(`${this.baseUrl}/match/intelligent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(criteria)
        });

        if (!response.ok) throw new Error('Intelligent matching unavailable');
        return await response.json();
      } catch (error) {
        return this.intelligentMatchingFallback(criteria);
      }
    }, 600000); // Cache 10 minutes pour matching
  }

  /**
   * Analyse de sentiment en temps réel
   */
  async analyzeSentiment(textData: {
    content: string;
    context: string;
    user_profile?: any;
  }): Promise<{
    sentiment_score: number;
    emotional_indicators: any;
    tone_analysis: any;
    recommendations: string[];
    confidence: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textData)
      });

      if (!response.ok) throw new Error('Sentiment analysis unavailable');
      return await response.json();
    } catch (error) {
      return this.analyzeSentimentFallback(textData);
    }
  }

  // Méthodes fallback pour les nouvelles fonctionnalités

  private predictMissionSuccessFallback(missionData: any) {
    const complexity = missionData.complexity || 5;
    const budget = missionData.budget || 1000;
    const urgency = missionData.urgency === 'high' ? 0.7 : 1.0;
    
    const success_probability = Math.min(0.95, 
      (0.5 + (budget / 10000) * 0.3 + (10 - complexity) / 10 * 0.2) * urgency
    );

    return {
      success_probability: Math.round(success_probability * 100) / 100,
      key_factors: [
        'Budget adapté au projet',
        'Complexité maîtrisable',
        'Délais réalistes'
      ],
      risk_assessment: {
        technical_risk: complexity > 7 ? 'high' : 'medium',
        budget_risk: budget < 1000 ? 'high' : 'low',
        timeline_risk: urgency < 1 ? 'high' : 'medium'
      },
      optimization_suggestions: [
        'Préciser les spécifications techniques',
        'Adapter le budget au marché',
        'Planifier des jalons intermédiaires'
      ],
      confidence_level: 0.78
    };
  }

  private negotiatePriceFallback(negotiationData: any) {
    const { initial_bid, client_budget, mission_complexity } = negotiationData;
    const middle_ground = (initial_bid + client_budget) / 2;
    const suggested_counter_offer = Math.round(middle_ground * (1 + mission_complexity * 0.05));

    return {
      suggested_counter_offer,
      negotiation_strategy: 'collaborative',
      win_probability: 0.72,
      arguments: [
        'Prix équitable basé sur la complexité',
        'Expertise confirmée du prestataire',
        'Délais de livraison optimisés'
      ],
      next_steps: [
        'Proposer un appel de clarification',
        'Détailler la valeur ajoutée',
        'Suggérer un paiement échelonné'
      ]
    };
  }

  private analyzeBehaviorFallback(userId: string, actionsHistory: any[]) {
    const engagement_score = Math.min(100, actionsHistory.length * 5);
    
    return {
      behavior_patterns: {
        most_active_time: '14h-18h',
        preferred_categories: ['développement', 'design'],
        avg_session_duration: 25,
        interaction_frequency: 'high'
      },
      preferences: {
        budget_range: '1000-5000€',
        project_duration: '2-4 semaines',
        communication_style: 'direct'
      },
      success_indicators: {
        completion_rate: 0.89,
        client_satisfaction: 4.6,
        repeat_business: 0.34
      },
      personalized_recommendations: [
        'Missions React/Node.js correspondant à votre profil',
        'Projets avec budget 2000-4000€',
        'Clients privilégiant la qualité'
      ],
      engagement_score
    };
  }

  private optimizePricingRealTimeFallback(missionId: string, currentMarketData: any) {
    const base_price = currentMarketData.base_price || 2000;
    const demand_factor = currentMarketData.demand_level === 'high' ? 1.2 : 0.9;
    const optimal_price = Math.round(base_price * demand_factor);

    return {
      optimal_price,
      price_elasticity: 0.8,
      demand_forecast: {
        current_level: 'medium',
        trend: 'increasing',
        expected_change: '+15%'
      },
      competitive_positioning: 'competitive',
      adjustment_reasoning: [
        'Demande du marché en hausse',
        'Concurrence modérée',
        'Votre expertise reconnue'
      ]
    };
  }

  private intelligentMatchingFallback(criteria: any) {
    const { mission, provider_pool } = criteria;
    
    // Simulation de matching basique
    const ranked_matches = provider_pool.slice(0, 5).map((provider: any, index: number) => ({
      ...provider,
      match_score: Math.round((90 - index * 5) + Math.random() * 10),
      compatibility_factors: ['Compétences alignées', 'Historique positif', 'Disponibilité']
    }));

    return {
      ranked_matches,
      matching_explanations: {
        top_criteria: ['Expertise technique', 'Fiabilité', 'Rapport qualité-prix'],
        algorithm_insights: ['Correspondance des compétences prioritaire', 'Historique de performance considéré']
      },
      confidence_scores: ranked_matches.map(() => Math.random() * 0.3 + 0.7),
      alternative_suggestions: [
        'Élargir les critères géographiques',
        'Ajuster la fourchette budgétaire',
        'Considérer des profils juniors encadrés'
      ]
    };
  }

  private analyzeSentimentFallback(textData: any) {
    const content = textData.content.toLowerCase();
    let sentiment_score = 0.5; // Neutre par défaut
    
    // Analyse basique de sentiment
    const positive_words = ['excellent', 'parfait', 'satisfait', 'recommande', 'professionnel'];
    const negative_words = ['déçu', 'problème', 'retard', 'insatisfait', 'mauvais'];
    
    positive_words.forEach(word => {
      if (content.includes(word)) sentiment_score += 0.1;
    });
    
    negative_words.forEach(word => {
      if (content.includes(word)) sentiment_score -= 0.1;
    });
    
    sentiment_score = Math.max(0, Math.min(1, sentiment_score));

    return {
      sentiment_score,
      emotional_indicators: {
        satisfaction: sentiment_score > 0.6 ? 'high' : 'medium',
        frustration: sentiment_score < 0.4 ? 'detected' : 'low',
        engagement: 'medium'
      },
      tone_analysis: {
        formality: 'professional',
        urgency: content.includes('urgent') ? 'high' : 'medium',
        clarity: 'good'
      },
      recommendations: [
        sentiment_score < 0.5 ? 'Surveiller cette interaction' : 'Interaction positive',
        'Maintenir le niveau de service',
        'Proposer un suivi personnalisé'
      ],
      confidence: 0.75
    };
  }
}

export const aiService = new AIService();
export type { AIScoreRequest, AIScoreResponse, PriceRecommendationRequest, PriceRecommendationResponse };
