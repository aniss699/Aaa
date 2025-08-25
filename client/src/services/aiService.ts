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

    // Génération d'une description optimisée intelligente
    const optimizedDescription = this.generateSmartOptimizedDescription(description, category, detectedSkills);

    // Recommandations contextuelles par catégorie
    const recommendations = this.getSmartRecommendations(description, category, detectedSkills);

    return {
      score: qualityScore,
      qualityScore,
      detectedSkills,
      recommendations,
      insights: [`Catégorie ${category || 'développement'} détectée`, `${detectedSkills.length} compétences identifiées`],
      confidence: 0.8,
      optimizedDescription,
      estimatedComplexity: Math.min(10, Math.max(3, Math.floor(words.length / 10))),
      marketInsights: {
        competitionLevel: 'medium',
        demandLevel: 'high',
        priceRange: this.getCategoryBudgetRange(category)
      }
    };
  }

  private generateSmartOptimizedDescription(description: string, category?: string, detectedSkills: string[] = []): string {
    const lowerDesc = description.toLowerCase();
    
    // Templates intelligents par catégorie
    const categoryTemplates = {
      // Informatique & Tech
      development: {
        intro: `🚀 **Projet de Développement Web/Logiciel**`,
        context: this.extractAndEnhanceContext(description, 'development'),
        specifics: [
          '**Technologies souhaitées :** ' + (detectedSkills.length > 0 ? detectedSkills.join(', ') : 'React, Node.js, TypeScript, PostgreSQL'),
          '**Fonctionnalités clés :** Interface utilisateur intuitive, API RESTful, authentification sécurisée',
          '**Livrables :** Code source documenté, tests unitaires, déploiement, formation'
        ],
        requirements: [
          '✅ Expérience prouvée en développement web',
          '✅ Portfolio de projets similaires',
          '✅ Maîtrise des bonnes pratiques de sécurité',
          '✅ Communication régulière et transparente'
        ]
      },

      mobile: {
        intro: `📱 **Développement d'Application Mobile**`,
        context: this.extractAndEnhanceContext(description, 'mobile'),
        specifics: [
          '**Plateformes :** ' + (lowerDesc.includes('ios') ? 'iOS' : lowerDesc.includes('android') ? 'Android' : 'iOS et Android (cross-platform)'),
          '**Technologies :** ' + (detectedSkills.length > 0 ? detectedSkills.join(', ') : 'React Native ou Flutter'),
          '**Fonctionnalités :** Design responsive, notifications push, intégrations API',
          '**Publication :** Accompagnement pour la mise en ligne sur les stores'
        ],
        requirements: [
          '✅ Expérience en développement mobile natif/cross-platform',
          '✅ Connaissance des guidelines iOS/Android',
          '✅ Portfolio d\'applications publiées',
          '✅ Capacité à gérer la publication sur les stores'
        ]
      },

      design: {
        intro: `🎨 **Projet de Design Graphique/UI-UX**`,
        context: this.extractAndEnhanceContext(description, 'design'),
        specifics: [
          '**Style recherché :** Moderne, épuré, adapté à votre secteur d\'activité',
          '**Livrables :** Maquettes haute fidélité, fichiers sources, charte graphique',
          '**Formats :** Web, print, réseaux sociaux selon besoins',
          '**Révisions :** Jusqu\'à 3 révisions incluses'
        ],
        requirements: [
          '✅ Portfolio créatif et professionnel',
          '✅ Maîtrise des outils de design (Figma, Adobe Creative Suite)',
          '✅ Compréhension UX et ergonomie',
          '✅ Respect des délais et feedback constructif'
        ]
      },

      marketing: {
        intro: `📈 **Stratégie Marketing Digital**`,
        context: this.extractAndEnhanceContext(description, 'marketing'),
        specifics: [
          '**Objectifs :** Augmentation de la visibilité, génération de leads qualifiés',
          '**Canaux :** Réseaux sociaux, SEO, publicité payante, content marketing',
          '**Cibles :** Définition et analyse de votre audience',
          '**ROI :** Suivi des performances et optimisation continue'
        ],
        requirements: [
          '✅ Expertise en marketing digital et réseaux sociaux',
          '✅ Maîtrise des outils analytics',
          '✅ Capacité à créer du contenu engageant',
          '✅ Résultats mesurables sur projets précédents'
        ]
      },

      // Travaux & Construction
      construction: {
        intro: `🏗️ **Travaux de Construction/Rénovation**`,
        context: this.extractAndEnhanceContext(description, 'construction'),
        specifics: [
          '**Surface concernée :** ' + this.extractSurface(description),
          '**Type de travaux :** Gros œuvre, second œuvre, finitions',
          '**Normes :** Respect des règlementations en vigueur (RT2012, RE2020)',
          '**Garanties :** Assurance décennale et garantie parfait achèvement'
        ],
        requirements: [
          '✅ Qualifications professionnelles certifiées',
          '✅ Assurance responsabilité civile et décennale',
          '✅ Portfolio de réalisations similaires',
          '✅ Devis détaillé et transparent'
        ]
      },

      plomberie: {
        intro: `🔧 **Intervention Plomberie**`,
        context: this.extractAndEnhanceContext(description, 'plomberie'),
        specifics: [
          '**Urgence :** ' + (lowerDesc.includes('urgent') || lowerDesc.includes('fuite') ? 'Intervention rapide nécessaire' : 'Planification flexible'),
          '**Type d\'intervention :** ' + this.extractPlumbingType(description),
          '**Garantie :** Pièces et main d\'œuvre garanties',
          '**Normes :** Installation conforme DTU plomberie'
        ],
        requirements: [
          '✅ Plombier qualifié et certifié',
          '✅ Disponibilité pour dépannages urgents',
          '✅ Devis gratuit et détaillé',
          '✅ Assurance responsabilité civile'
        ]
      },

      electricite: {
        intro: `⚡ **Travaux d'Électricité**`,
        context: this.extractAndEnhanceContext(description, 'electricite'),
        specifics: [
          '**Installation :** Mise aux normes NF C 15-100',
          '**Sécurité :** Tests et vérifications réglementaires',
          '**Certification :** Attestation Consuel si nécessaire',
          '**Domotique :** Intégration d\'objets connectés possible'
        ],
        requirements: [
          '✅ Électricien habilité B1V/B2V/BR',
          '✅ Certification Qualifelec appréciée',
          '✅ Assurance décennale électricité',
          '✅ Respect strict des normes de sécurité'
        ]
      },

      // Services à la personne
      menage: {
        intro: `🏠 **Service de Ménage à Domicile**`,
        context: this.extractAndEnhanceContext(description, 'menage'),
        specifics: [
          '**Surface :** ' + this.extractSurface(description),
          '**Fréquence :** ' + (lowerDesc.includes('hebdomadaire') ? 'Hebdomadaire' : lowerDesc.includes('mensuel') ? 'Mensuelle' : 'À définir selon vos besoins'),
          '**Tâches incluses :** Aspirateur, serpillère, dépoussiérage, sanitaires, cuisine',
          '**Produits :** Fournis ou utilisation de vos produits préférés'
        ],
        requirements: [
          '✅ Expérience en service à domicile',
          '✅ Assurance responsabilité civile',
          '✅ Références clients vérifiables',
          '✅ Ponctualité et discrétion'
        ]
      },

      garde_enfants: {
        intro: `👶 **Garde d'Enfants à Domicile**`,
        context: this.extractAndEnhanceContext(description, 'garde_enfants'),
        specifics: [
          '**Âge des enfants :** ' + this.extractAgeRange(description),
          '**Horaires :** ' + this.extractSchedule(description),
          '**Activités :** Jeux éducatifs, aide aux devoirs, sorties parc',
          '**Sécurité :** Formation premiers secours appréciée'
        ],
        requirements: [
          '✅ Expérience confirmée avec les enfants',
          '✅ Formation petite enfance ou équivalent',
          '✅ Casier judiciaire vierge',
          '✅ Références de familles précédentes'
        ]
      },

      jardinage: {
        intro: `🌱 **Entretien d'Espaces Verts**`,
        context: this.extractAndEnhanceContext(description, 'jardinage'),
        specifics: [
          '**Surface jardin :** ' + this.extractSurface(description),
          '**Prestations :** Tonte, taille, débroussaillage, plantation',
          '**Fréquence :** ' + this.extractFrequency(description),
          '**Matériel :** Professionnel et entretenu régulièrement'
        ],
        requirements: [
          '✅ Expérience en espaces verts',
          '✅ Matériel professionnel fourni',
          '✅ Connaissance des végétaux et saisons',
          '✅ Assurance responsabilité civile'
        ]
      },

      // Services professionnels
      comptabilite: {
        intro: `📊 **Services Comptables et Fiscaux**`,
        context: this.extractAndEnhanceContext(description, 'comptabilite'),
        specifics: [
          '**Type d\'entreprise :** ' + this.extractBusinessType(description),
          '**Prestations :** Tenue comptable, déclarations fiscales, conseils',
          '**Périodicité :** Mensuelle, trimestrielle ou annuelle',
          '**Outils :** Logiciels comptables certifiés'
        ],
        requirements: [
          '✅ Expert-comptable diplômé ou comptable expérimenté',
          '✅ Maîtrise de la fiscalité française',
          '✅ Logiciels comptables à jour',
          '✅ Disponibilité pour conseils réguliers'
        ]
      }
    };

    const template = categoryTemplates[category] || categoryTemplates['development'];
    
    return `${template.intro}

${template.context}

${template.specifics.join('\n')}

**Ce que nous recherchons :**
${template.requirements.join('\n')}

**Budget et modalités :**
• Budget à définir selon proposition détaillée
• Devis gratuit et sans engagement
• Paiement sécurisé selon avancement

**Pour postuler :**
Merci de nous faire parvenir votre proposition avec :
• Présentation de votre approche
• Exemples de réalisations similaires
• Planning prévisionnel détaillé
• Tarification transparente`;
  }

  private extractAndEnhanceContext(description: string, category: string): string {
    if (description.length < 50) {
      const defaultContexts = {
        development: "Nous souhaitons développer une solution digitale innovante pour répondre à nos besoins spécifiques.",
        mobile: "Nous recherchons un développeur mobile expérimenté pour créer une application moderne et intuitive.",
        design: "Nous avons besoin d'un designer créatif pour donner vie à notre vision graphique.",
        marketing: "Notre entreprise souhaite développer sa présence digitale et atteindre de nouveaux clients.",
        construction: "Nous planifions des travaux de qualité et recherchons un professionnel de confiance.",
        plomberie: "Nous avons besoin d'une intervention de plomberie professionnelle et rapide.",
        electricite: "Nous souhaitons réaliser des travaux électriques conformes aux normes en vigueur.",
        menage: "Nous recherchons une personne de confiance pour l'entretien régulier de notre domicile.",
        garde_enfants: "Nous cherchons une nounou expérimentée pour la garde de nos enfants à domicile.",
        jardinage: "Nous souhaitons confier l'entretien de nos espaces verts à un professionnel compétent.",
        comptabilite: "Notre entreprise a besoin d'un accompagnement comptable et fiscal professionnel."
      };
      return defaultContexts[category] || defaultContexts['development'];
    }
    return description;
  }

  private extractSurface(description: string): string {
    const surfaceMatch = description.match(/(\d+)\s*m[²2]/i);
    return surfaceMatch ? `${surfaceMatch[1]}m²` : 'À préciser';
  }

  private extractPlumbingType(description: string): string {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('fuite')) return 'Réparation de fuite';
    if (lowerDesc.includes('installation')) return 'Nouvelle installation';
    if (lowerDesc.includes('chaudière')) return 'Chauffage/Chaudière';
    if (lowerDesc.includes('robinet')) return 'Robinetterie';
    return 'Intervention générale plomberie';
  }

  private extractAgeRange(description: string): string {
    const ageMatch = description.match(/(\d+)\s*(?:ans?|années?)/i);
    return ageMatch ? `${ageMatch[1]} ans` : 'À préciser';
  }

  private extractSchedule(description: string): string {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('matin')) return 'Matinée';
    if (lowerDesc.includes('après-midi')) return 'Après-midi';
    if (lowerDesc.includes('soir')) return 'Soirée';
    if (lowerDesc.includes('weekend')) return 'Weekend';
    return 'À définir selon vos besoins';
  }

  private extractFrequency(description: string): string {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('hebdomadaire') || lowerDesc.includes('semaine')) return 'Hebdomadaire';
    if (lowerDesc.includes('mensuel') || lowerDesc.includes('mois')) return 'Mensuelle';
    if (lowerDesc.includes('ponctuel')) return 'Intervention ponctuelle';
    return 'Selon vos besoins';
  }

  private extractBusinessType(description: string): string {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('auto-entrepreneur') || lowerDesc.includes('micro')) return 'Auto-entrepreneur/Micro-entreprise';
    if (lowerDesc.includes('sarl') || lowerDesc.includes('eurl')) return 'SARL/EURL';
    if (lowerDesc.includes('sas') || lowerDesc.includes('sasu')) return 'SAS/SASU';
    if (lowerDesc.includes('association')) return 'Association';
    return 'À préciser selon votre statut';
  }

  private getSmartRecommendations(description: string, category: string, detectedSkills: string[]): string[] {
    const lowerDesc = description.toLowerCase();
    const recommendations = [];

    // Recommandations générales selon la longueur
    if (description.length < 100) {
      recommendations.push('Développer davantage la description pour plus de clarté');
    }

    // Recommandations spécifiques par catégorie
    const categoryRecommendations = {
      development: [
        !detectedSkills.length && 'Préciser les technologies souhaitées (React, Vue, PHP, etc.)',
        !lowerDesc.includes('budget') && 'Mentionner une fourchette budgétaire',
        !lowerDesc.includes('délai') && 'Indiquer les délais souhaités',
        !lowerDesc.includes('fonctionnalité') && 'Détailler les fonctionnalités principales'
      ],
      mobile: [
        !lowerDesc.includes('ios') && !lowerDesc.includes('android') && 'Préciser les plateformes (iOS/Android)',
        !lowerDesc.includes('store') && 'Indiquer si publication sur stores nécessaire',
        !lowerDesc.includes('design') && 'Mentionner les préférences de design'
      ],
      construction: [
        !this.extractSurface(description).includes('m²') && 'Préciser la surface en m²',
        !lowerDesc.includes('délai') && 'Indiquer le planning souhaité',
        !lowerDesc.includes('budget') && 'Mentionner le budget envisagé'
      ],
      plomberie: [
        !lowerDesc.includes('urgent') && !lowerDesc.includes('délai') && 'Préciser l\'urgence de l\'intervention',
        !lowerDesc.includes('garantie') && 'Mentionner si garantie souhaitée'
      ],
      menage: [
        !this.extractSurface(description).includes('m²') && 'Préciser la surface du logement',
        !lowerDesc.includes('fréquence') && 'Indiquer la fréquence souhaitée'
      ]
    };

    const categorySpecific = categoryRecommendations[category] || categoryRecommendations['development'];
    recommendations.push(...categorySpecific.filter(Boolean));

    return recommendations.slice(0, 3); // Limiter à 3 recommandations principales
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