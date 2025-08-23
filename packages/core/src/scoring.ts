
/**
 * Système de scoring multicritère partagé
 */

export interface ScoringWeights {
  price: number;
  quality: number;
  fit: number;
  delay: number;
  risk: number;
  completion_probability: number;
}

export interface ScoringFactors {
  priceRatio: number;
  providerRating: number;
  experienceMatch: number;
  skillsMatch: number;
  responseTime: number;
  successRate: number;
  complexityLevel: 'low' | 'medium' | 'high';
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface ScoringResult {
  totalScore: number;
  breakdown: Record<keyof ScoringWeights, number>;
  explanations: string[];
  confidence: number;
  recommendations: string[];
}

export class UnifiedScoringEngine {
  private defaultWeights: ScoringWeights = {
    price: 0.25,
    quality: 0.20,
    fit: 0.20,
    delay: 0.15,
    risk: 0.10,
    completion_probability: 0.10
  };

  /**
   * Calcule un score unifié selon les critères métier
   */
  calculateScore(factors: ScoringFactors, weights?: Partial<ScoringWeights>): ScoringResult {
    const finalWeights = { ...this.defaultWeights, ...weights };
    
    const scores = {
      price: this.calculatePriceScore(factors.priceRatio),
      quality: this.calculateQualityScore(factors.providerRating, factors.experienceMatch),
      fit: this.calculateFitScore(factors.skillsMatch),
      delay: this.calculateDelayScore(factors.responseTime),
      risk: this.calculateRiskScore(factors.successRate, factors.providerRating),
      completion_probability: this.calculateCompletionScore(factors)
    };

    const totalScore = Object.entries(scores).reduce(
      (sum, [key, score]) => sum + score * finalWeights[key as keyof ScoringWeights],
      0
    );

    return {
      totalScore: Math.round(totalScore),
      breakdown: scores,
      explanations: this.generateExplanations(scores, factors),
      confidence: this.calculateConfidence(factors),
      recommendations: this.generateRecommendations(scores, factors)
    };
  }

  private calculatePriceScore(priceRatio: number): number {
    if (priceRatio < 0.5) return 20; // Suspicieusement bas
    if (priceRatio < 0.8) return 95; // Très compétitif
    if (priceRatio <= 1.0) return 85; // Compétitif
    if (priceRatio <= 1.2) return 70; // Acceptable
    return Math.max(30, 70 - (priceRatio - 1.2) * 100); // Cher
  }

  private calculateQualityScore(rating: number, experience: number): number {
    const ratingScore = (rating / 5.0) * 60;
    const experienceScore = Math.min(40, experience * 2);
    return ratingScore + experienceScore;
  }

  private calculateFitScore(skillsMatch: number): number {
    return skillsMatch; // Déjà en pourcentage
  }

  private calculateDelayScore(responseTime: number): number {
    // Score basé sur le temps de réponse en heures
    if (responseTime <= 1) return 100;
    if (responseTime <= 4) return 90;
    if (responseTime <= 24) return 75;
    return Math.max(30, 75 - responseTime);
  }

  private calculateRiskScore(successRate: number, rating: number): number {
    const successScore = successRate * 60;
    const ratingScore = (rating / 5.0) * 40;
    return successScore + ratingScore;
  }

  private calculateCompletionScore(factors: ScoringFactors): number {
    let score = factors.successRate * 70;
    
    // Ajustements selon complexité et urgence
    const complexityPenalty = { low: 0, medium: -5, high: -10 }[factors.complexityLevel] || 0;
    const urgencyPenalty = { low: 5, medium: 0, high: -10 }[factors.urgencyLevel] || 0;
    
    score += complexityPenalty + urgencyPenalty;
    
    return Math.max(10, Math.min(95, score));
  }

  private generateExplanations(scores: Record<string, number>, factors: ScoringFactors): string[] {
    const explanations: string[] = [];

    if (scores.price >= 85) {
      explanations.push("Prix très compétitif par rapport au marché");
    } else if (scores.price <= 40) {
      explanations.push("Prix potentiellement problématique (trop bas ou trop élevé)");
    }

    if (scores.quality >= 80) {
      explanations.push("Profil prestataire de haute qualité");
    } else if (scores.quality <= 50) {
      explanations.push("Expérience limitée du prestataire");
    }

    if (scores.fit >= 80) {
      explanations.push("Excellente correspondance des compétences");
    } else if (scores.fit <= 50) {
      explanations.push("Correspondance partielle des compétences requises");
    }

    if (scores.completion_probability >= 80) {
      explanations.push("Forte probabilité de succès du projet");
    } else if (scores.completion_probability <= 50) {
      explanations.push("Risques identifiés pour l'aboutissement");
    }

    return explanations;
  }

  private calculateConfidence(factors: ScoringFactors): number {
    let confidence = 75; // Base

    // Ajustements selon la qualité des données
    if (factors.experienceMatch > 10) confidence += 10; // Beaucoup d'expérience
    if (factors.providerRating >= 4.5) confidence += 10; // Excellente note
    if (factors.skillsMatch >= 80) confidence += 5; // Bon match compétences

    return Math.min(95, confidence);
  }

  private generateRecommendations(scores: Record<string, number>, factors: ScoringFactors): string[] {
    const recommendations: string[] = [];

    if (scores.price < 60) {
      recommendations.push("Vérifier la justification du prix proposé");
    }

    if (scores.quality < 70) {
      recommendations.push("Évaluer l'expérience du prestataire pour ce type de projet");
    }

    if (scores.fit < 70) {
      recommendations.push("S'assurer que les compétences correspondent aux besoins");
    }

    if (scores.completion_probability < 60) {
      recommendations.push("Prévoir des jalons et un suivi renforcé");
    }

    return recommendations;
  }
}

export const scoringEngine = new UnifiedScoringEngine();

/**
 * Utilitaires pour les constantes métier
 */
export const SCORING_CONSTANTS = {
  WEIGHTS: {
    DEFAULT: {
      price: 0.25,
      quality: 0.20,
      fit: 0.20,
      delay: 0.15,
      risk: 0.10,
      completion_probability: 0.10
    },
    CLIENT_FOCUSED: {
      price: 0.35,
      quality: 0.25,
      fit: 0.15,
      delay: 0.15,
      risk: 0.05,
      completion_probability: 0.05
    },
    QUALITY_FOCUSED: {
      price: 0.15,
      quality: 0.30,
      fit: 0.25,
      delay: 0.10,
      risk: 0.10,
      completion_probability: 0.10
    }
  },
  THRESHOLDS: {
    EXCELLENT: 85,
    GOOD: 70,
    AVERAGE: 55,
    POOR: 40
  },
  COMPETITION_LEVELS: {
    LOW: { threshold: 3, multiplier: 1.1 },
    MEDIUM: { threshold: 8, multiplier: 0.95 },
    HIGH: { threshold: 15, multiplier: 0.85 }
  }
} as const;
