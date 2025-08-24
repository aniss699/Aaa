
/**
 * Trust Layer - Système de scoring de confiance dynamique
 */

export interface TrustFactors {
  anciennete: number; // mois sur la plateforme
  regularite: number; // projets par mois
  tauxReponse: number; // % de réponses aux messages
  respectDelais: number; // % projets livrés à temps
  qualiteCommunication: number; // score basé sur feedback
  consistanceRating: number; // variance des notes
  typesMissions: string[]; // diversité des missions
  budgetsGeres: number[]; // historique budgets
  verificationKYC: boolean;
}

export interface TrustBadge {
  id: string;
  label: string;
  description: string;
  confidence: number;
  criteria: string[];
  icon: string;
  color: string;
}

export class TrustScoringEngine {
  private weights = {
    anciennete: 0.15,
    regularite: 0.20,
    tauxReponse: 0.15,
    respectDelais: 0.25,
    qualiteCommunication: 0.15,
    consistanceRating: 0.10
  };

  /**
   * Calcule le Trust Score global (0-100)
   */
  calculateTrustScore(factors: TrustFactors): number {
    const scores = {
      anciennete: Math.min(100, (factors.anciennete / 24) * 100), // Max à 2 ans
      regularite: Math.min(100, factors.regularite * 10), // Max à 10 projets/mois
      tauxReponse: factors.tauxReponse,
      respectDelais: factors.respectDelais,
      qualiteCommunication: factors.qualiteCommunication,
      consistanceRating: Math.max(0, 100 - (factors.consistanceRating * 20))
    };

    const trustScore = Object.entries(scores).reduce(
      (total, [key, score]) => total + score * this.weights[key as keyof typeof this.weights],
      0
    );

    // Bonus KYC
    const kycBonus = factors.verificationKYC ? 5 : 0;
    
    return Math.min(100, Math.round(trustScore + kycBonus));
  }

  /**
   * Génère des badges de confiance basés sur l'IA
   */
  generateTrustBadges(factors: TrustFactors, projectHistory: any[]): TrustBadge[] {
    const badges: TrustBadge[] = [];

    // Badge "Fiable sur les délais"
    if (factors.respectDelais >= 90) {
      badges.push({
        id: 'reliable_deadlines',
        label: 'Fiable sur les délais',
        description: `Livre à temps dans ${factors.respectDelais}% des cas`,
        confidence: factors.respectDelais,
        criteria: ['Historique de livraison', 'Respect engagement'],
        icon: '⏰',
        color: 'green'
      });
    }

    // Badge "Excellent communicant"
    if (factors.qualiteCommunication >= 85 && factors.tauxReponse >= 90) {
      badges.push({
        id: 'excellent_communicator',
        label: 'Excellent communicant',
        description: 'Communication claire et réactive',
        confidence: Math.min(factors.qualiteCommunication, factors.tauxReponse),
        criteria: ['Taux de réponse élevé', 'Feedback client positif'],
        icon: '💬',
        color: 'blue'
      });
    }

    // Badge "Spécialiste confirmé"
    const domainesPrincipaux = this.analyzeExpertiseDomains(projectHistory);
    if (domainesPrincipaux.length > 0 && domainesPrincipaux[0].projectCount >= 5) {
      badges.push({
        id: 'domain_specialist',
        label: `Spécialiste ${domainesPrincipaux[0].domain}`,
        description: `Expert avec ${domainesPrincipaux[0].projectCount} projets réussis`,
        confidence: Math.min(95, domainesPrincipaux[0].projectCount * 10),
        criteria: ['Spécialisation métier', 'Expertise technique'],
        icon: '🎯',
        color: 'purple'
      });
    }

    // Badge "Valeur sûre"
    if (factors.consistanceRating <= 0.3 && projectHistory.length >= 10) {
      badges.push({
        id: 'consistent_quality',
        label: 'Valeur sûre',
        description: 'Performance constante sur tous les projets',
        confidence: 100 - (factors.consistanceRating * 100),
        criteria: ['Constance qualité', 'Expérience éprouvée'],
        icon: '🛡️',
        color: 'gold'
      });
    }

    return badges.filter(badge => badge.confidence >= 70);
  }

  private analyzeExpertiseDomains(projectHistory: any[]) {
    const domainCount: Record<string, number> = {};
    
    projectHistory.forEach(project => {
      if (domainCount[project.category]) {
        domainCount[project.category]++;
      } else {
        domainCount[project.category] = 1;
      }
    });

    return Object.entries(domainCount)
      .map(([domain, count]) => ({ domain, projectCount: count }))
      .sort((a, b) => b.projectCount - a.projectCount);
  }
}

export const trustScoringEngine = new TrustScoringEngine();
