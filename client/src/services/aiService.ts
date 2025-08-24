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

    // Compétences et mots-clés par catégorie (étendu à tous les services)
    const skillsByCategory = {
      // Informatique & Tech
      development: ['react', 'vue', 'angular', 'node', 'php', 'python', 'java', 'javascript', 'typescript', 'sql'],
      mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'app mobile'],
      design: ['photoshop', 'illustrator', 'figma', 'ui', 'ux', 'design', 'adobe', 'sketch'],
      marketing: ['seo', 'google ads', 'facebook', 'instagram', 'marketing', 'réseaux sociaux', 'communication'],
      ai: ['machine learning', 'python', 'tensorflow', 'pytorch', 'ia', 'intelligence artificielle'],

      // Travaux & Construction
      construction: ['maçonnerie', 'gros œuvre', 'second œuvre', 'charpente', 'toiture', 'isolation', 'fondations', 'béton'],
      plomberie: ['plomberie', 'sanitaire', 'chauffage', 'canalisation', 'robinetterie', 'chaudière', 'radiateur'],
      electricite: ['électricité', 'électricien', 'tableau électrique', 'domotique', 'éclairage', 'prise', 'interrupteur'],
      peinture: ['peinture', 'décoration', 'enduit', 'papier peint', 'lasure', 'vernissage', 'crépi'],
      renovation: ['rénovation', 'réhabilitation', 'restauration', 'aménagement', 'modernisation', 'transformation'],

      // Services à la personne
      menage: ['ménage', 'nettoyage', 'entretien', 'aspirateur', 'repassage', 'lessivage', 'désinfection'],
      garde_enfants: ['garde enfants', 'baby-sitting', 'nounou', 'crèche', 'éveil', 'sécurité enfants', 'premiers secours'],
      aide_personne: ['aide à domicile', 'assistance', 'courses', 'accompagnement', 'soins', 'mobilité'],
      jardinage: ['jardinage', 'tonte', 'taille', 'plantation', 'entretien espaces verts', 'paysagisme', 'arrosage'],
      bricolage: ['bricolage', 'montage meuble', 'petites réparations', 'fixation', 'perçage', 'visserie'],

      // Transport & Logistique
      transport: ['déménagement', 'livraison', 'transport', 'manutention', 'emballage', 'camion', 'utilitaire'],
      chauffeur: ['chauffeur', 'vtc', 'taxi', 'conduite', 'permis', 'véhicule', 'navigation'],

      // Beauté & Bien-être
      coiffure: ['coiffure', 'coupe', 'coloration', 'brushing', 'shampoing', 'coiffeur', 'salon'],
      esthetique: ['esthétique', 'soin visage', 'épilation', 'manucure', 'massage', 'beauté', 'spa'],
      fitness: ['coach sportif', 'fitness', 'musculation', 'cardio', 'yoga', 'pilates', 'remise en forme'],

      // Services professionnels
      comptabilite: ['comptabilité', 'fiscal', 'déclaration', 'bilan', 'tva', 'expert-comptable', 'gestion'],
      juridique: ['juridique', 'avocat', 'conseil', 'contrat', 'droit', 'procédure', 'contentieux'],
      traduction: ['traduction', 'interprétation', 'langue', 'bilingue', 'français', 'anglais', 'rédaction'],

      // Arts & Créatif
      photographie: ['photographie', 'photo', 'reportage', 'portrait', 'événement', 'retouche', 'studio'],
      musique: ['musique', 'cours', 'instrument', 'piano', 'guitare', 'chant', 'composition'],
      artisanat: ['artisanat', 'création', 'fait main', 'personnalisé', 'décoration', 'sculpture', 'poterie'],

      // Événementiel
      evenementiel: ['événementiel', 'organisation', 'mariage', 'réception', 'animation', 'décoration événement'],
      traiteur: ['traiteur', 'restauration', 'buffet', 'réception', 'cuisine', 'service', 'banquet'],

      // Enseignement
      cours_particuliers: ['cours particuliers', 'soutien scolaire', 'mathématiques', 'français', 'langues', 'professeur'],
      formation: ['formation', 'stage', 'apprentissage', 'certification', 'compétences', 'enseignement'],

      // Animaux
      veterinaire: ['vétérinaire', 'soins animaux', 'vaccination', 'chirurgie', 'consultation', 'urgence'],
      garde_animaux: ['garde animaux', 'pet-sitting', 'promenade chien', 'pension', 'dressage', 'toilettage']
    };

    const categorySkills = skillsByCategory[category] || skillsByCategory.development;
    const lowerDesc = description.toLowerCase();
    const detectedSkills = categorySkills.filter(skill => lowerDesc.includes(skill));

    // Recommandations contextuelles par catégorie
    const recommendationsByCategory = {
      // Informatique & Tech
      development: [
        'Préciser les technologies souhaitées (React, PHP, etc.)',
        'Détailler l\'architecture technique et intégrations',
        'Spécifier les délais et phases de développement'
      ],
      mobile: [
        'Préciser les plateformes cibles (iOS/Android)',
        'Détailler les fonctionnalités et intégrations',
        'Indiquer si publication sur stores nécessaire'
      ],
      design: [
        'Préciser le style graphique et charte existante',
        'Détailler les supports et formats de livraison',
        'Mentionner les préférences visuelles'
      ],
      marketing: [
        'Définir les objectifs mesurables (leads, ventes)',
        'Préciser les canaux de diffusion souhaités',
        'Détailler la cible et budget publicité'
      ],
      ai: [
        'Préciser les données disponibles et objectifs',
        'Définir les métriques de performance attendues',
        'Spécifier l\'environnement technique de déploiement'
      ],

      // Travaux & Construction
      construction: [
        'Préciser la surface en m² et type de travaux',
        'Décrire l\'état actuel et résultat souhaité',
        'Mentionner les contraintes d\'accès et planning'
      ],
      plomberie: [
        'Décrire précisément le problème ou installation',
        'Indiquer l\'urgence et accessibilité des canalisations',
        'Préciser si intervention garantie nécessaire'
      ],
      electricite: [
        'Détailler l\'installation existante et besoins',
        'Préciser si mise aux normes requise',
        'Indiquer si certificat Consuel nécessaire'
      ],
      peinture: [
        'Préciser les surfaces en m² et type de support',
        'Indiquer les couleurs et finitions souhaitées',
        'Mentionner si préparation des murs incluse'
      ],
      renovation: [
        'Détailler l\'étendue des travaux par pièce',
        'Préciser si logement occupé pendant travaux',
        'Indiquer le budget global et échelonnement'
      ],

      // Services à la personne
      menage: [
        'Préciser la surface du logement en m²',
        'Détailler la fréquence souhaitée (hebdo, bi-mensuel)',
        'Indiquer les tâches spécifiques incluses'
      ],
      garde_enfants: [
        'Préciser l\'âge des enfants et nombre',
        'Détailler les horaires et jours souhaités',
        'Mentionner les activités et contraintes spéciales'
      ],
      aide_personne: [
        'Décrire les besoins spécifiques d\'assistance',
        'Préciser la fréquence et durée des interventions',
        'Indiquer si diplômes/agréments requis'
      ],
      jardinage: [
        'Préciser la surface du jardin et type d\'espace',
        'Détailler les travaux souhaités (tonte, taille, etc.)',
        'Indiquer la fréquence d\'intervention'
      ],
      bricolage: [
        'Décrire précisément les travaux à réaliser',
        'Préciser si fournitures incluses ou à prévoir',
        'Indiquer les contraintes d\'accès et horaires'
      ],

      // Transport & Logistique
      transport: [
        'Préciser les lieux de départ et arrivée',
        'Détailler le volume/poids à transporter',
        'Indiquer les contraintes horaires et manutention'
      ],
      chauffeur: [
        'Préciser les trajets et horaires souhaités',
        'Indiquer si véhicule fourni ou à prévoir',
        'Mentionner les exigences (permis, expérience)'
      ],

      // Beauté & Bien-être
      coiffure: [
        'Préciser le type de prestation souhaité',
        'Indiquer si déplacement à domicile requis',
        'Mentionner les préférences et contraintes'
      ],
      esthetique: [
        'Détailler les soins esthétiques souhaités',
        'Préciser si institut ou domicile',
        'Indiquer les contraintes et préférences'
      ],
      fitness: [
        'Préciser les objectifs fitness et niveau actuel',
        'Détailler la fréquence et durée des séances',
        'Indiquer si matériel fourni ou lieu d\'entraînement'
      ],

      // Services professionnels
      comptabilite: [
        'Préciser le type d\'entreprise et activité',
        'Détailler les prestations comptables souhaitées',
        'Indiquer la périodicité et urgence'
      ],
      juridique: [
        'Décrire la problématique juridique précise',
        'Préciser le type de conseil ou procédure',
        'Indiquer l\'urgence et budget envisagé'
      ],
      traduction: [
        'Préciser les langues source et cible',
        'Détailler le type et volume de documents',
        'Indiquer les délais et spécialisations requises'
      ],

      // Arts & Créatif
      photographie: [
        'Préciser le type d\'événement ou séance',
        'Détailler le nombre de photos et retouches',
        'Indiquer les lieux et contraintes timing'
      ],
      musique: [
        'Préciser l\'instrument et niveau souhaité',
        'Détailler la fréquence et durée des cours',
        'Indiquer si matériel fourni ou lieu de cours'
      ],
      artisanat: [
        'Décrire précisément l\'objet à créer',
        'Préciser les matériaux et techniques souhaités',
        'Indiquer les délais et budget'
      ],

      // Événementiel
      evenementiel: [
        'Préciser le type d\'événement et nombre d\'invités',
        'Détailler les prestations souhaitées',
        'Indiquer le lieu, date et budget'
      ],
      traiteur: [
        'Préciser le nombre de convives et type de repas',
        'Détailler les préférences culinaires',
        'Indiquer si service complet ou livraison'
      ],

      // Enseignement
      cours_particuliers: [
        'Préciser la matière et niveau de l\'élève',
        'Détailler les objectifs pédagogiques',
        'Indiquer la fréquence et lieu des cours'
      ],
      formation: [
        'Préciser le domaine et niveau de formation',
        'Détailler les objectifs et certifications',
        'Indiquer le format (présentiel/distanciel)'
      ],

      // Animaux
      veterinaire: [
        'Préciser l\'espèce et problème de l\'animal',
        'Indiquer l\'urgence de la consultation',
        'Mentionner si déplacement ou urgence'
      ],
      garde_animaux: [
        'Préciser l\'espèce, taille et caractère de l\'animal',
        'Détailler la durée et type de garde',
        'Indiquer les soins particuliers nécessaires'
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
      // Informatique & Tech
      development: { min: 2000, max: 15000 },
      mobile: { min: 3000, max: 20000 },
      design: { min: 500, max: 5000 },
      marketing: { min: 800, max: 8000 },
      ai: { min: 5000, max: 30000 },

      // Travaux & Construction
      construction: { min: 1000, max: 50000 },
      plomberie: { min: 80, max: 3000 },
      electricite: { min: 150, max: 8000 },
      peinture: { min: 200, max: 3000 },
      renovation: { min: 1500, max: 80000 },

      // Services à la personne
      menage: { min: 15, max: 150 }, // par intervention
      garde_enfants: { min: 8, max: 25 }, // par heure
      aide_personne: { min: 20, max: 40 }, // par heure
      jardinage: { min: 20, max: 500 }, // par intervention
      bricolage: { min: 30, max: 800 }, // par intervention

      // Transport & Logistique
      transport: { min: 50, max: 2000 },
      chauffeur: { min: 15, max: 50 }, // par heure

      // Beauté & Bien-être
      coiffure: { min: 25, max: 150 },
      esthetique: { min: 30, max: 200 },
      fitness: { min: 30, max: 100 }, // par séance

      // Services professionnels
      comptabilite: { min: 300, max: 2000 }, // par mois
      juridique: { min: 150, max: 500 }, // par heure
      traduction: { min: 0.15, max: 0.50 }, // par mot

      // Arts & Créatif
      photographie: { min: 200, max: 2000 },
      musique: { min: 25, max: 80 }, // par cours
      artisanat: { min: 50, max: 1000 },

      // Événementiel
      evenementiel: { min: 500, max: 10000 },
      traiteur: { min: 15, max: 80 }, // par personne

      // Enseignement
      cours_particuliers: { min: 15, max: 60 }, // par heure
      formation: { min: 200, max: 3000 }, // par formation

      // Animaux
      veterinaire: { min: 50, max: 500 },
      garde_animaux: { min: 10, max: 40 } // par jour
    };
    
    return ranges[category] || { min: 50, max: 1000 };
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