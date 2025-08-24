import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AppelsPro API is running' });
});

// Demo missions endpoint
// Stockage temporaire des missions
let missions = [
  {
    id: "mission1",
    title: "Développement d'une application mobile de e-commerce",
    description: "Je recherche un développeur expérimenté pour créer une application mobile complète de vente en ligne avec système de paiement intégré.",
    category: "developpement",
    budget: "5000",
    location: "Paris, France",
    clientId: "client1",
    clientName: "Marie Dubois",
    status: "open",
    createdAt: new Date("2024-01-15").toISOString(),
    bids: []
  },
  // ... autres missions
];

// Endpoint pour récupérer les missions
app.get('/api/missions', (req, res) => {
  res.json(missions);
});

// Endpoint pour créer une nouvelle mission
app.post('/api/missions', (req, res) => {
  const { title, description, category, budget, location, clientId, clientName } = req.body;

  if (!title || !description || !category || !budget || !clientId || !clientName) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  const newMission = {
    id: `mission_${Date.now()}`,
    title,
    description,
    category,
    budget,
    location: location || 'Non spécifié',
    clientId,
    clientName,
    status: 'open',
    createdAt: new Date().toISOString(),
    bids: []
  };

  missions.push(newMission);
  res.status(201).json(newMission);
});

// Endpoint pour récupérer une mission spécifique
app.get('/api/missions/:id', (req, res) => {
  const { id } = req.params;
  const mission = missions.find(m => m.id === id);

  if (!mission) {
    return res.status(404).json({ error: 'Mission non trouvée' });
  }

  res.json(mission);
});

app.get('/api/missions-demo', (req, res) => {
  const demoMissions = [
    {
      id: "mission1",
      title: "Développement d'une application mobile de e-commerce",
      description: "Je recherche un développeur expérimenté pour créer une application mobile complète de vente en ligne avec système de paiement intégré.",
      category: "developpement",
      budget: "5000",
      location: "Paris, France",
      clientId: "client1",
      clientName: "Marie Dubois",
      status: "open",
      createdAt: new Date("2024-01-15").toISOString(),
      bids: []
    },
    {
      id: "mission2",
      title: "Refonte complète du site web d'entreprise",
      description: "Modernisation du site vitrine de notre entreprise avec nouveau design responsive et optimisation SEO.",
      category: "design",
      budget: "3000",
      location: "Lyon, France",
      clientId: "client2",
      clientName: "Pierre Martin",
      status: "open",
      createdAt: new Date("2024-01-18").toISOString(),
      bids: []
    },
    {
      id: "mission3",
      title: "Campagne marketing digital et réseaux sociaux",
      description: "Lancement d'une campagne complète sur les réseaux sociaux pour augmenter la notoriété de notre marque.",
      category: "marketing",
      budget: "2000",
      location: "Marseille, France",
      clientId: "client3",
      clientName: "Sophie Leclerc",
      status: "open",
      createdAt: new Date("2024-01-20").toISOString(),
      bids: []
    },
    {
      id: "mission4",
      title: "Développement d'une plateforme SaaS",
      description: "Création d'une plateforme SaaS complète avec tableau de bord, API, authentification et facturation.",
      category: "developpement",
      budget: "15000",
      location: "Remote",
      clientId: "client4",
      clientName: "Tech Startup",
      status: "open",
      createdAt: new Date("2024-01-22").toISOString(),
      bids: []
    },
    {
      id: "mission5",
      title: "Application mobile React Native",
      description: "Développement d'une application mobile cross-platform avec React Native pour la gestion de tâches.",
      category: "mobile",
      budget: "8000",
      location: "Lille, France",
      clientId: "client5",
      clientName: "Productivity Corp",
      status: "open",
      createdAt: new Date("2024-01-25").toISOString(),
      bids: []
    },
    {
      id: "mission6",
      title: "Intégration IA et Machine Learning",
      description: "Intégration d'intelligence artificielle dans une plateforme existante pour l'analyse prédictive.",
      category: "ai",
      budget: "12000",
      location: "Paris, France",
      clientId: "client6",
      clientName: "AI Solutions",
      status: "open",
      createdAt: new Date("2024-01-28").toISOString(),
      bids: []
    }
  ];

  res.json(demoMissions);
});

// Mock AI endpoints pour tester
app.post('/api/ai/analyze-bid', (req, res) => {
  const { projectData, bidData } = req.body;

  const mockAnalysis = {
    score: Math.floor(Math.random() * 100),
    priceAnalysis: {
      competitiveness: Math.floor(Math.random() * 100),
      marketPosition: 'competitive'
    },
    riskAssessment: {
      technical: Math.floor(Math.random() * 100),
      timeline: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 100)
    },
    recommendations: [
      'Considérez ajuster le prix de 5-10%',
      'Mettez en avant votre expérience similaire',
      'Proposez un délai plus précis'
    ]
  };

  res.json(mockAnalysis);
});

app.post('/api/ai/match-missions', (req, res) => {
  const { providerProfile } = req.body;

  const mockMatches = [
    {
      id: 1,
      title: 'Développement d\'application mobile',
      matchScore: 85,
      reasons: ['Compétences React Native', 'Expérience mobile', 'Localisation proche']
    },
    {
      id: 2,
      title: 'Site web e-commerce',
      matchScore: 72,
      reasons: ['Stack technique compatible', 'Budget aligné']
    }
  ];

  res.json(mockMatches);
});

// Endpoint pour l'analyse de prix IA
app.post('/api/ai/price-analysis', (req, res) => {
  const { category, description, location, complexity } = req.body;

  // Simulation d'analyse de prix basée sur la complexité et la catégorie
  const basePrice = {
    'development': 5000,
    'design': 2000,
    'marketing': 1500,
    'mobile': 8000,
    'ai': 12000
  }[category] || 3000;

  const complexityMultiplier = complexity / 5; // Normaliser sur 2
  const suggestedPrice = Math.round(basePrice * complexityMultiplier);

  const priceRange = {
    min: Math.round(suggestedPrice * 0.8),
    max: Math.round(suggestedPrice * 1.3)
  };

  const mockAnalysis = {
    suggestedPrice,
    priceRange,
    reasoning: `Basé sur la catégorie ${category}, complexité ${complexity}/10 et analyse du marché`,
    marketContext: {
      demandLevel: Math.random() > 0.5 ? 'high' : 'medium',
      competitionLevel: Math.random() > 0.5 ? 'medium' : 'low'
    }
  };

  res.json(mockAnalysis);
});

// Endpoint pour l'optimisation de brief IA
app.post('/api/ai/optimize-brief', (req, res) => {
  const { description } = req.body;

  const optimizedBrief = {
    optimizedDescription: `${description}\n\n[Optimisé par IA] Objectifs clairs, fonctionnalités détaillées, contraintes techniques spécifiées.`,
    improvements: [
      'Structure améliorée',
      'Détails techniques ajoutés',
      'Critères de succès définis'
    ],
    qualityScore: Math.floor(Math.random() * 30) + 70
  };

  res.json(optimizedBrief);
});

// Endpoint pour l'analyse de brief IA (utilisé dans create-mission.tsx)
app.post('/api/ai/brief-analysis', (req, res) => {
  const { description, category, title } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description requise' });
  }

  // Simulation d'analyse IA avancée
  const qualityScore = Math.floor(Math.random() * 40) + 60; // Score entre 60-100

  const improvements = [];
  const missingElements = [];

  // Analyse du contenu
  if (description.length < 100) {
    improvements.push("Développer davantage la description pour plus de clarté");
    missingElements.push("Description trop courte");
  }

  if (!description.toLowerCase().includes('budget') && !description.includes('€')) {
    improvements.push("Mentionner une fourchette budgétaire indicative");
    missingElements.push("Budget non précisé");
  }

  if (!description.toLowerCase().includes('délai') && !description.toLowerCase().includes('quand')) {
    improvements.push("Préciser les délais souhaités");
    missingElements.push("Délais absents");
  }

  // Analyse contextuelle selon la catégorie
  const categorySpecificAnalysis = analyzeCategorySpecific(description, category);
  improvements.push(...categorySpecificAnalysis.improvements);
  missingElements.push(...categorySpecificAnalysis.missing);

  // Génération d'une version optimisée
  const optimizedDescription = generateOptimizedDescription(description, category, title);

  // Génération de champs dynamiques selon la catégorie
  const suggestedFields = generateSuggestedFields(description, category);

  const analysis = {
    qualityScore,
    improvements,
    missingElements,
    optimizedDescription,
    detectedSkills: extractSkillsFromDescription(description, category),
    estimatedComplexity: estimateComplexity(description, category),
    suggestedCategories: category ? [category] : suggestCategories(description),
    suggestedFields, // Nouveaux champs dynamiques
    marketInsights: {
      demandLevel: Math.random() > 0.5 ? 'high' : 'medium',
      competitionLevel: Math.random() > 0.5 ? 'medium' : 'low',
      suggestedBudgetRange: suggestBudgetRange(description, category, estimateComplexity(description, category))
    }
  };

  res.json(analysis);
});

function analyzeCategorySpecific(description, category) {
  const lowerDesc = description.toLowerCase();
  const improvements = [];
  const missing = [];

  const categoryAnalysis = {
    development: () => {
      if (!lowerDesc.match(/(react|vue|angular|php|python|javascript|node|laravel|symfony)/)) {
        improvements.push("Spécifier les technologies préférées");
        missing.push("Technologies non mentionnées");
      }
      if (!lowerDesc.includes('api') && !lowerDesc.includes('base de données')) {
        improvements.push("Préciser les intégrations techniques");
      }
      if (!lowerDesc.includes('responsive') && !lowerDesc.includes('mobile')) {
        improvements.push("Indiquer si compatibilité mobile requise");
      }
    },

    mobile: () => {
      if (!lowerDesc.includes('ios') && !lowerDesc.includes('android')) {
        improvements.push("Préciser les plateformes cibles (iOS/Android)");
        missing.push("Plateformes non spécifiées");
      }
      if (!lowerDesc.includes('store') && !lowerDesc.includes('publication')) {
        improvements.push("Indiquer si publication sur stores nécessaire");
      }
    },

    construction: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface en m²");
        missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('étage') && !lowerDesc.includes('niveau')) {
        improvements.push("Indiquer le nombre d'étages");
      }
      if (!lowerDesc.includes('accès') && !lowerDesc.includes('parking')) {
        improvements.push("Mentionner les contraintes d\'accès");
      }
    },

    plomberie: () => {
      if (!lowerDesc.includes('urgent') && !lowerDesc.includes('délai')) {
        improvements.push("Préciser l'urgence de l'intervention");
      }
      if (!lowerDesc.includes('étage') && !lowerDesc.includes('niveau')) {
        improvements.push("Indiquer l'étage de l'intervention");
      }
    },

    electricite: () => {
      if (!lowerDesc.includes('norme') && !lowerDesc.includes('consuel')) {
        improvements.push("Préciser si mise aux normes nécessaire");
      }
      if (!lowerDesc.includes('tableau') && !lowerDesc.includes('disjoncteur')) {
        improvements.push("Détailler l'installation électrique existante");
      }
    },

    menage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface du logement");
        missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('fréquence') && !lowerDesc.includes('semaine')) {
        improvements.push("Indiquer la fréquence souhaitée");
      }
    },

    garde_enfants: () => {
      if (!lowerDesc.match(/\d+\s*(?:ans?|années?)/)) {
        improvements.push("Préciser l'âge des enfants");
        missing.push("Âge des enfants non précisé");
      }
      if (!lowerDesc.includes('horaire') && !lowerDesc.includes('heure')) {
        improvements.push("Détailler les horaires de garde");
      }
    },

    jardinage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface du jardin");
        missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('tonte') && !lowerDesc.includes('taille') && !lowerDesc.includes('entretien')) {
        improvements.push("Détailler les travaux de jardinage souhaités");
      }
    },

    comptabilite: () => {
      if (!lowerDesc.includes('entreprise') && !lowerDesc.includes('société')) {
        improvements.push("Préciser le type d'entreprise");
      }
      if (!lowerDesc.includes('mensuel') && !lowerDesc.includes('trimestre') && !lowerDesc.includes('annuel')) {
        improvements.push("Indiquer la périodicité souhaitée");
      }
    }
  };

  const analyzer = categoryAnalysis[category];
  if (analyzer) {
    analyzer();
  }

  return { improvements, missing };
}

function generateSuggestedFields(description, category) {
  const lowerDesc = description.toLowerCase();
  const fields = [];

  const fieldsByCategory = {
    development: [
      {
        label: "Technologies préférées",
        type: "multiselect",
        options: ["React", "Vue.js", "Angular", "PHP", "Python", "Node.js", "Laravel", "Symfony", "Django"],
        suggested: !lowerDesc.match(/(react|vue|angular|php|python|javascript|node)/),
        priority: "high"
      },
      {
        label: "Type d'application",
        type: "select",
        options: ["Site vitrine", "E-commerce", "Application web", "API/Backend", "Plateforme SaaS"],
        suggested: true,
        priority: "medium"
      },
      {
        label: "Nombre de pages/fonctionnalités",
        type: "number",
        placeholder: "Ex: 5 pages principales",
        suggested: !lowerDesc.includes('page'),
        priority: "medium"
      }
    ],

    mobile: [
      {
        label: "Plateformes cibles",
        type: "multiselect",
        options: ["iOS", "Android", "Cross-platform"],
        suggested: !lowerDesc.includes('ios') && !lowerDesc.includes('android'),
        priority: "high"
      },
      {
        label: "Publication sur stores",
        type: "boolean",
        suggested: !lowerDesc.includes('store'),
        priority: "high"
      },
      {
        label: "Fonctionnalités spéciales",
        type: "multiselect",
        options: ["Géolocalisation", "Push notifications", "Paiement intégré", "Mode offline", "Appareil photo"],
        suggested: true,
        priority: "medium"
      }
    ],

    construction: [
      {
        label: "Surface des travaux (m²)",
        type: "number",
        placeholder: "Surface en mètres carrés",
        suggested: !lowerDesc.match(/\d+\s*m[²2]/),
        priority: "high"
      },
      {
        label: "Type de logement",
        type: "select",
        options: ["Maison individuelle", "Appartement", "Local commercial", "Bureau"],
        suggested: true,
        priority: "medium"
      },
      {
        label: "Contraintes d'accès",
        type: "text",
        placeholder: "Ex: 3ème étage sans ascenseur, parking possible",
        suggested: !lowerDesc.includes('accès'),
        priority: "medium"
      }
    ],

    plomberie: [
      {
        label: "Urgence de l'intervention",
        type: "select",
        options: ["Urgence immédiate", "Dans la semaine", "Sous 15 jours", "Flexible"],
        suggested: !lowerDesc.includes('urgent'),
        priority: "high"
      },
      {
        label: "Type d'intervention",
        type: "select",
        options: ["Réparation fuite", "Installation neuve", "Maintenance", "Dépannage"],
        suggested: true,
        priority: "high"
      },
      {
        label: "Étage de l'intervention",
        type: "select",
        options: ["Rez-de-chaussée", "1er étage", "2ème étage", "Plus haut"],
        suggested: !lowerDesc.includes('étage'),
        priority: "medium"
      }
    ],

    electricite: [
      {
        label: "Mise aux normes nécessaire",
        type: "boolean",
        suggested: !lowerDesc.includes('norme'),
        priority: "high"
      },
      {
        label: "Type d'installation",
        type: "multiselect",
        options: ["Éclairage", "Prises électriques", "Tableau électrique", "Domotique", "Borne de recharge"],
        suggested: true,
        priority: "high"
      },
      {
        label: "Certification Consuel requise",
        type: "boolean",
        suggested: !lowerDesc.includes('consuel'),
        priority: "medium"
      }
    ],

    menage: [
      {
        label: "Surface du logement (m²)",
        type: "number",
        placeholder: "Surface en mètres carrés",
        suggested: !lowerDesc.match(/\d+\s*m[²2]/),
        priority: "high"
      },
      {
        label: "Fréquence souhaitée",
        type: "select",
        options: ["Hebdomadaire", "Bi-mensuelle", "Mensuelle", "Ponctuelle"],
        suggested: !lowerDesc.includes('fréquence'),
        priority: "high"
      },
      {
        label: "Tâches spécifiques",
        type: "multiselect",
        options: ["Repassage", "Ménage intérieur", "Vitres", "Cuisine", "Sanitaires"],
        suggested: true,
        priority: "medium"
      }
    ],

    garde_enfants: [
      {
        label: "Âge des enfants",
        type: "text",
        placeholder: "Ex: 3 et 7 ans",
        suggested: !lowerDesc.match(/\d+\s*(?:ans?|années?)/),
        priority: "high"
      },
      {
        label: "Horaires de garde",
        type: "text",
        placeholder: "Ex: 8h-18h du lundi au vendredi",
        suggested: !lowerDesc.includes('horaire'),
        priority: "high"
      },
      {
        label: "Activités souhaitées",
        type: "multiselect",
        options: ["Aide aux devoirs", "Activités créatives", "Sorties parc", "Jeux éducatifs", "Cuisine simple"],
        suggested: true,
        priority: "medium"
      }
    ],
    services_personne: [
      {
        label: "Type de prestation",
        type: "select",
        options: ["Aide à domicile", "Soutien scolaire", "Garde d'enfants", "Soins à la personne"],
        suggested: true,
        priority: "high"
      },
      {
        label: "Fréquence souhaitée",
        type: "select",
        options: ["Quotidienne", "Hebdomadaire", "Ponctuelle", "Urgence"],
        suggested: !lowerDesc.includes('fréquence') && !lowerDesc.includes('régulier'),
        priority: "high"
      },
      {
        label: "Disponibilité horaire",
        type: "text",
        placeholder: "Ex: Matin, Après-midi, Soir, Week-end",
        suggested: !lowerDesc.includes('horaire') && !lowerDesc.includes('disponible'),
        priority: "medium"
      }
    ]
  };

  const categoryFields = fieldsByCategory[category] || fieldsByCategory['development'];

  // Retourner seulement les champs suggérés avec priorité high ou medium
  return categoryFields
    .filter(field => field.suggested && field.priority !== 'low')
    .sort((a, b) => a.priority === 'high' ? -1 : 1)
    .slice(0, 4); // Limiter à 4 champs maximum
}

function generateOptimizedDescription(description, category, title) {
  const baseDesc = description || "Description du projet";

  // Templates spécifiques par catégorie
  const categoryTemplates = {
    development: {
      title: 'Développement Logiciel',
      livrables: [
        '• Code source propre et documenté',
        '• Tests unitaires et d\'intégration',
        '• Documentation technique complète',
        '• Déploiement et mise en production',
        '• Formation utilisateur si nécessaire'
      ],
      competences: [
        '• Maîtrise des technologies modernes (React, Vue.js, Node.js, etc.)',
        '• Expérience en architecture logicielle',
        '• Connaissance des bonnes pratiques de sécurité',
        '• Méthodologies agiles (Scrum, Kanban)'
      ],
      criteres: [
        '• Portfolio de projets similaires',
        '• Expérience avec les technologies requises',
        '• Références clients dans le développement',
        '• Capacité à respecter les délais'
      ]
    },
    design: {
      title: 'Projet Design',
      livrables: [
        '• Maquettes graphiques haute fidélité',
        '• Charte graphique complète',
        '• Fichiers sources (PSD, Figma, etc.)',
        '• Guide d\'utilisation de la marque',
        '• Adaptations pour différents supports'
      ],
      competences: [
        '• Maîtrise des outils de design (Photoshop, Illustrator, Figma)',
        '• Connaissance UX/UI et ergonomie',
        '• Sens artistique et créativité',
        '• Compréhension des tendances visuelles'
      ],
      criteres: [
        '• Portfolio créatif et diversifié',
        '• Style en adéquation avec le projet',
        '• Expérience dans le secteur d\'activité',
        '• Capacité d\'adaptation et d\'écoute'
      ]
    },
    marketing: {
      title: 'Marketing & Communication',
      livrables: [
        '• Stratégie marketing documentée et planifiée',
        '• Contenus créatifs (visuels, textes, vidéos)',
        '• Calendrier éditorial et planning publications',
        '• Tableaux de bord avec KPIs et analytics',
        '• Recommandations d\'optimisation continue'
      ],
      competences: [
        '• Expertise marketing digital multicanal',
        '• Maîtrise outils analytics et automation',
        '• Création de contenu engageant',
        '• Connaissance des algorithmes réseaux sociaux'
      ],
      criteres: [
        '• Résultats mesurables sur projets similaires',
        '• Connaissance de votre secteur d\'activité',
        '• Créativité et capacité d\'innovation',
        '• Transparence sur les méthodes utilisées'
      ]
    },
    mobile: {
      title: 'Application Mobile',
      livrables: [
        '• Application native ou cross-platform',
        '• Code source et documentation',
        '• Tests sur différents appareils',
        '• Publication sur les stores (si demandée)',
        '• Guide de maintenance'
      ],
      competences: [
        '• Développement mobile (React Native, Flutter, natif)',
        '• Connaissance des guidelines iOS/Android',
        '• Expérience UX mobile',
        '• Intégration API et services backend'
      ],
      criteres: [
        '• Portfolio d\'applications mobiles',
        '• Expérience avec les technologies requises',
        '• Applications publiées sur les stores',
        '• Connaissance des bonnes pratiques mobiles'
      ]
    },
    ai: {
      title: 'Projet Intelligence Artificielle',
      livrables: [
        '• Modèle IA entraîné et optimisé',
        '• Documentation technique détaillée',
        '• API d\'intégration',
        '• Métriques de performance',
        '• Guide de déploiement et maintenance'
      ],
      competences: [
        '• Expertise en Machine Learning et Deep Learning',
        '• Maîtrise Python, TensorFlow, PyTorch',
        '• Connaissance des algorithmes d\'IA',
        '• Expérience en déploiement de modèles'
      ],
      criteres: [
        '• Projets IA réalisés avec succès',
        '• Publications ou certifications en IA',
        '• Compréhension des enjeux métier',
        '• Capacité d\'innovation technique'
      ]
    },
    construction: {
      title: 'Travaux de Construction',
      livrables: [
        '• Réalisation des travaux selon les règles de l\'art',
        '• Fourniture des matériaux conformes aux normes',
        '• Nettoyage et évacuation des déchets de chantier',
        '• Garantie décennale sur les travaux réalisés',
        '• Attestation de conformité et factures détaillées'
      ],
      competences: [
        '• Qualification professionnelle dans le corps de métier',
        '• Connaissance des normes du bâtiment (RT2012, RE2020)',
        '• Matériel et outillage professionnel certifié',
        '• Assurance responsabilité civile et décennale'
      ],
      criteres: [
        '• Photos de réalisations similaires',
        '• Certifications RGE si applicable',
        '• Assurance décennale valide',
        '• Respect des délais et devis transparent'
      ]
    },
    renovation: {
      title: 'Travaux de Rénovation',
      livrables: [
        '• Rénovation complète selon cahier des charges',
        '• Mise aux normes électriques et plomberie si nécessaire',
        '• Finitions soignées (peinture, revêtements)',
        '• Nettoyage approfondi post-travaux',
        '• Garantie sur l\'ensemble des prestations'
      ],
      competences: [
        '• Multi-compétences en second œuvre',
        '• Expérience en rénovation d\'anciens bâtiments',
        '• Connaissance des matériaux écologiques',
        '• Coordination avec différents corps de métier'
      ],
      criteres: [
        '• Portfolio de rénovations réussies',
        '• Avis clients vérifiés',
        '• Capacité d\'adaptation aux imprévus',
        '• Transparence sur les coûts additionnels'
      ]
    },
    plomberie: {
      title: 'Travaux de Plomberie',
      livrables: [
        '• Installation ou réparation selon normes DTU',
        '• Test d\'étanchéité et mise en pression',
        '• Remise en état des surfaces (carrelage, cloisons)',
        '• Nettoyage et évacuation des déchets',
        '• Garantie pièces et main d\'œuvre'
      ],
      competences: [
        '• Qualification plombier certifié',
        '• Connaissance installations gaz et eau',
        '• Diagnostic et dépannage rapide',
        '• Outillage professionnel de détection'
      ],
      criteres: [
        '• Interventions d\'urgence disponibles',
        '• Devis gratuit et détaillé',
        '• Assurance décennale plomberie',
        '• Respect des normes sanitaires'
      ]
    },
    electricite: {
      title: 'Travaux d\'Électricité',
      livrables: [
        '• Installation électrique aux normes NF C 15-100',
        '• Attestation de conformité Consuel',
        '• Schémas électriques mis à jour',
        '• Test de bon fonctionnement des circuits',
        '• Garantie décennale sur l\'installation'
      ],
      competences: [
        '• Habilitation électrique BR/B2V',
        '• Connaissance domotique et objets connectés',
        '• Installation bornes de recharge véhicules',
        '• Mise aux normes tableaux électriques'
      ],
      criteres: [
        '• Certification Qualifelec',
        '• Interventions urgentes 24h/24',
        '• Devis gratuit avec plan d\'installation',
        '• Assurance décennale électricité'
      ]
    },
    peinture: {
      title: 'Travaux de Peinture',
      livrables: [
        '• Préparation soignée des supports',
        '• Application peinture selon techniques appropriées',
        '• Finitions et protection des surfaces',
        '• Nettoyage et remise en état des lieux',
        '• Garantie sur la tenue de la peinture'
      ],
      competences: [
        '• Maîtrise techniques de peinture décorative',
        '• Connaissance peintures écologiques',
        '• Préparation et traitement des supports',
        '• Conseil couleurs et harmonies'
      ],
      criteres: [
        '• Portfolio de réalisations variées',
        '• Utilisation peintures de qualité',
        '• Respect des délais de séchage',
        '• Devis détaillé par pièce et surface'
      ]
    },
    services_personne: {
      title: 'Services à la personne',
      livrables: [
        '• Prestations selon planning convenu',
        '• Matériel et produits professionnels inclus',
        '• Compte-rendu après chaque intervention',
        '• Flexibilité horaires et remplacement si besoin',
        '• Assurance responsabilité civile professionnelle'
      ],
      competences: [
        '• Expérience confirmée dans le service à domicile',
        '• Formation aux techniques professionnelles',
        '• Discrétion, ponctualité et sens du service',
        '• Connaissance produits écologiques et sécurité'
      ],
      criteres: [
        '• Recommandations clients précédents',
        '• Disponibilité compatible avec vos besoins',
        '• Tarifs transparents et sans surprise',
        '• Possibilité d\'évaluation période d\'essai'
      ]
    }
  };

  const template = categoryTemplates[category] || categoryTemplates['development'];
  const analysis = analyzeProjectContent(baseDesc, category);
  const adaptedDeliverables = adaptDeliverablesBasedOnContent(template.livrables, analysis, category);

  return `**${title || template.title}**

**Contexte et Objectifs :**
${baseDesc}

**Livrables Attendus :**
${adaptedDeliverables.join('\n')}

**Compétences Recherchées :**
${template.competences.join('\n')}

**Critères de Sélection :**
${template.criteres.join('\n')}

**Budget et Modalités :**
• Budget à définir selon proposition détaillée
• Paiement échelonné selon avancement
• Possibilité de facturation en régie ou forfait

**Suivi et Communication :**
• Points d\'avancement réguliers
• Livraison par phases si nécessaire
• Support post-livraison inclus`;
}

function extractSkillsFromDescription(description, category) {
  const skillsByCategory = {
    'development': {
      'react': 'React.js',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'php': 'PHP',
      'python': 'Python',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'node': 'Node.js',
      'laravel': 'Laravel',
      'symfony': 'Symfony',
      'django': 'Django',
      'flask': 'Flask',
      'sql': 'SQL/Database',
      'mongodb': 'MongoDB',
      'postgresql': 'PostgreSQL',
      'mysql': 'MySQL',
      'docker': 'Docker',
      'aws': 'AWS Cloud',
      'git': 'Git/Version Control',
      'api': 'API Development',
      'rest': 'REST API',
      'graphql': 'GraphQL'
    },
    'mobile': {
      'react native': 'React Native',
      'flutter': 'Flutter',
      'swift': 'Swift (iOS)',
      'kotlin': 'Kotlin (Android)',
      'java': 'Java (Android)',
      'ionic': 'Ionic',
      'xamarin': 'Xamarin',
      'cordova': 'Apache Cordova',
      'firebase': 'Firebase',
      'push notification': 'Push Notifications',
      'app store': 'App Store Publication',
      'play store': 'Play Store Publication'
    },
    'design': {
      'photoshop': 'Adobe Photoshop',
      'illustrator': 'Adobe Illustrator',
      'figma': 'Figma',
      'sketch': 'Sketch',
      'xd': 'Adobe XD',
      'indesign': 'Adobe InDesign',
      'ui': 'UI Design',
      'ux': 'UX Design',
      'wireframe': 'Wireframing',
      'prototype': 'Prototyping',
      'branding': 'Branding',
      'logo': 'Logo Design',
      'motion': 'Motion Design',
      'animation': 'Animation'
    },
    'marketing': {
      'seo': 'SEO',
      'sem': 'SEM',
      'google ads': 'Google Ads',
      'facebook ads': 'Facebook Ads',
      'instagram': 'Instagram Marketing',
      'linkedin': 'LinkedIn Marketing',
      'email marketing': 'Email Marketing',
      'mailchimp': 'Mailchimp',
      'analytics': 'Google Analytics',
      'content': 'Content Marketing',
      'copywriting': 'Copywriting',
      'social media': 'Social Media Management',
      'influencer': 'Influencer Marketing'
    },
    'ai': {
      'machine learning': 'Machine Learning',
      'deep learning': 'Deep Learning',
      'tensorflow': 'TensorFlow',
      'pytorch': 'PyTorch',
      'python': 'Python',
      'r': 'R',
      'nlp': 'Natural Language Processing',
      'computer vision': 'Computer Vision',
      'neural network': 'Neural Networks',
      'chatbot': 'Chatbot Development',
      'data science': 'Data Science',
      'pandas': 'Pandas',
      'numpy': 'NumPy',
      'scikit': 'Scikit-learn'
    },
    'construction': {
      'plomberie': 'Plomberie',
      'électricité': 'Électricité',
      'maçonnerie': 'Maçonnerie',
      'peinture': 'Peinture',
      'carrelage': 'Carrelage',
      'parquet': 'Parquet',
      'isolation': 'Isolation',
      'charpente': 'Charpente',
      'toiture': 'Toiture',
      'cloisons': 'Cloisons',
      'rénovation': 'Rénovation',
      'aménagement': 'Aménagement'
    },
    'services_personne': {
      'aide à domicile': 'Aide à domicile',
      'soutien scolaire': 'Soutien scolaire',
      'garde d\'enfants': 'Garde d\'enfants',
      'soins': 'Soins à la personne',
      'aides ménagères': 'Aides ménagères',
      'assistance': 'Assistance',
      'famille': 'Aide familiale'
    }
  };

  const categorySkills = skillsByCategory[category] || skillsByCategory['development'];
  const detectedSkills = [];
  const lowerDesc = description.toLowerCase();

  Object.entries(categorySkills).forEach(([key, skill]) => {
    if (lowerDesc.includes(key)) {
      detectedSkills.push(skill);
    }
  });

  return detectedSkills;
}

function estimateComplexity(description, category) {
  let complexity = 3; // Base complexity
  const lowerDesc = description.toLowerCase();

  // Facteurs généraux
  if (lowerDesc.includes('api') || lowerDesc.includes('intégration')) complexity += 1;
  if (lowerDesc.includes('paiement') || lowerDesc.includes('payment')) complexity += 2;
  if (lowerDesc.includes('temps réel') || lowerDesc.includes('real-time')) complexity += 2;

  // Facteurs spécifiques par catégorie
  const categoryComplexityFactors = {
    development: [
      { keywords: ['microservices', 'architecture'], points: 2 },
      { keywords: ['ia', 'intelligence artificielle', 'ml'], points: 3 },
      { keywords: ['blockchain', 'crypto'], points: 3 },
      { keywords: ['mobile', 'web'], points: 2 },
      { keywords: ['base de données', 'database'], points: 1 },
      { keywords: ['sécurité', 'authentification'], points: 2 }
    ],
    mobile: [
      { keywords: ['ios', 'android'], points: 1 },
      { keywords: ['cross-platform', 'hybride'], points: 2 },
      { keywords: ['push notification', 'géolocalisation'], points: 1 },
      { keywords: ['ar', 'réalité augmentée'], points: 3 },
      { keywords: ['offline', 'synchronisation'], points: 2 }
    ],
    design: [
      { keywords: ['logo', 'identité visuelle'], points: 1 },
      { keywords: ['site web', 'interface'], points: 2 },
      { keywords: ['animation', 'motion'], points: 2 },
      { keywords: ['3d', 'modélisation'], points: 3 },
      { keywords: ['print', 'impression'], points: 1 }
    ],
    marketing: [
      { keywords: ['campagne', 'stratégie'], points: 1 },
      { keywords: ['multicanal', 'omnicanal'], points: 2 },
      { keywords: ['automation', 'automatisation'], points: 2 },
      { keywords: ['influencer', 'partenariat'], points: 2 },
      { keywords: ['international', 'multilingue'], points: 2 }
    ],
    ai: [
      { keywords: ['deep learning', 'neural'], points: 3 },
      { keywords: ['nlp', 'computer vision'], points: 2 },
      { keywords: ['chatbot', 'assistant'], points: 2 },
      { keywords: ['big data', 'données massives'], points: 3 },
      { keywords: ['temps réel', 'streaming'], points: 2 }
    ],
    construction: [
      { keywords: ['rénovation complète', 'gros œuvre'], points: 3 },
      { keywords: ['extension', 'agrandissement'], points: 2 },
      { keywords: ['isolation', 'énergétique'], points: 2 },
      { keywords: ['plomberie', 'électricité'], points: 2 },
      { keywords: ['design', 'architecture'], points: 1 }
    ],
    services_personne: [
      { keywords: ['aide à domicile', 'assistance'], points: 2 },
      { keywords: ['soutien scolaire', 'cours'], points: 1 },
      { keywords: ['garde d\'enfants', 'baby-sitting'], points: 2 },
      { keywords: ['soins', 'santé'], points: 3 },
      { keywords: ['ponctuel', 'urgence'], points: 1 }
    ]
  };

  const factors = categoryComplexityFactors[category] || categoryComplexityFactors['development'];

  factors.forEach(factor => {
    if (factor.keywords.some(keyword => lowerDesc.includes(keyword))) {
      complexity += factor.points;
    }
  });

  return Math.min(complexity, 10); // Cap à 10
}

function suggestCategories(description) {
  const lowerDesc = description.toLowerCase();
  const categories = [];

  // Construction et travaux
  if (lowerDesc.includes('travaux') || lowerDesc.includes('chantier') || lowerDesc.includes('bâtiment')) {
    categories.push('construction');
  }
  if (lowerDesc.includes('plomberie') || lowerDesc.includes('plombier') || lowerDesc.includes('fuite') || lowerDesc.includes('canalisation')) {
    categories.push('plomberie');
  }
  if (lowerDesc.includes('électricité') || lowerDesc.includes('électricien') || lowerDesc.includes('installation électrique') || lowerDesc.includes('tableau électrique')) {
    categories.push('electricite');
  }
  if (lowerDesc.includes('peinture') || lowerDesc.includes('peindre') || lowerDesc.includes('repeindre') || lowerDesc.includes('peintre')) {
    categories.push('peinture');
  }
  if (lowerDesc.includes('rénovation') || lowerDesc.includes('rénover') || lowerDesc.includes('réhabilitation')) {
    categories.push('renovation');
  }
  if (lowerDesc.includes('carrelage') || lowerDesc.includes('carreleur') || lowerDesc.includes('faïence')) {
    categories.push('construction');
  }
  if (lowerDesc.includes('maçonnerie') || lowerDesc.includes('maçon') || lowerDesc.includes('mur') || lowerDesc.includes('cloison')) {
    categories.push('construction');
  }

  // Technologie
  if (lowerDesc.includes('site') || lowerDesc.includes('web') || lowerDesc.includes('développement')) {
    categories.push('development');
  }
  if (lowerDesc.includes('mobile') || lowerDesc.includes('application') || lowerDesc.includes('app')) {
    categories.push('mobile');
  }
  if (lowerDesc.includes('design') || lowerDesc.includes('ui') || lowerDesc.includes('ux') || lowerDesc.includes('graphique')) {
    categories.push('design');
  }
  if (lowerDesc.includes('marketing') || lowerDesc.includes('publicité') || lowerDesc.includes('communication')) {
    categories.push('marketing');
  }
  if (lowerDesc.includes('ia') || lowerDesc.includes('intelligence') || lowerDesc.includes('machine learning')) {
    categories.push('ai');
  }

  // Services à la personne
  if (lowerDesc.includes('aide à domicile') || lowerDesc.includes('assistance') || lowerDesc.includes('ménage') || lowerDesc.includes('courses')) {
    categories.push('services_personne');
  }
  if (lowerDesc.includes('soutien scolaire') || lowerDesc.includes('cours') || lowerDesc.includes('aide aux devoirs')) {
    categories.push('services_personne');
  }
  if (lowerDesc.includes('garde d\'enfants') || lowerDesc.includes('baby-sitting')) {
    categories.push('services_personne');
  }
  if (lowerDesc.includes('soins') || lowerDesc.includes('personne âgée') || lowerDesc.includes('aide médicale')) {
    categories.push('services_personne');
  }


  return categories.length > 0 ? categories : ['construction'];
}

function suggestBudgetRange(description, category, complexity) {
  const baseBudgets = {
    development: {
      ranges: [2000, 8000],
      factors: {
        'frontend': 1.0,
        'backend': 1.2,
        'fullstack': 1.4,
        'mobile': 1.3,
        'api': 1.1,
        'e-commerce': 1.5
      }
    },
    mobile: {
      ranges: [3000, 12000],
      factors: {
        'native': 1.5,
        'cross-platform': 1.2,
        'ios': 1.3,
        'android': 1.3,
        'publication': 1.1
      }
    },
    design: {
      ranges: [800, 3000],
      factors: {
        'logo': 0.8,
        'site web': 1.2,
        'application': 1.3,
        'branding': 1.4,
        'print': 1.0
      }
    },
    marketing: {
      ranges: [1000, 5000],
      factors: {
        'seo': 1.1,
        'publicité': 1.3,
        'réseaux sociaux': 1.0,
        'content': 1.2,
        'stratégie': 1.4
      }
    },
    ai: {
      ranges: [5000, 20000],
      factors: {
        'machine learning': 1.3,
        'deep learning': 1.6,
        'chatbot': 1.1,
        'computer vision': 1.4,
        'nlp': 1.3
      }
    },
    construction: {
      ranges: [1500, 15000],
      factors: {
        'peinture': 0.8,
        'plomberie': 1.2,
        'électricité': 1.3,
        'rénovation': 1.5,
        'extension': 2.0
      }
    },
    services_personne: {
      ranges: [500, 2500],
      factors: {
        'aide à domicile': 1.0,
        'soutien scolaire': 0.9,
        'garde d\'enfants': 1.2,
        'soins': 1.5,
        'ponctuel': 0.8
      }
    }
  };

  const categoryData = baseBudgets[category] || baseBudgets['development'];
  let baseRange = categoryData.ranges;

  // Appliquer les facteurs spécifiques trouvés dans la description
  const lowerDesc = description.toLowerCase();
  let multiplier = 1.0;

  Object.entries(categoryData.factors).forEach(([key, factor]) => {
    if (lowerDesc.includes(key)) {
      multiplier = Math.max(multiplier, factor);
    }
  });

  // Ajuster selon la complexité
  const complexityMultiplier = 0.7 + (complexity / 10) * 1.3; // 0.7x à 2x selon complexité

  const finalMultiplier = multiplier * complexityMultiplier;

  return {
    min: Math.round(baseRange[0] * finalMultiplier),
    max: Math.round(baseRange[1] * finalMultiplier),
    reasoning: `Basé sur la catégorie ${category}, complexité ${complexity}/10 et mots-clés détectés`
  };
}

function analyzeProjectContent(description, category) {
  const lowerDesc = description.toLowerCase();

  // Détection des spécificités du projet
  const analysis = {
    isEcommerce: lowerDesc.includes('e-commerce') || lowerDesc.includes('boutique') || lowerDesc.includes('vente'),
    isMobile: lowerDesc.includes('mobile') || lowerDesc.includes('app') || lowerDesc.includes('ios') || lowerDesc.includes('android'),
    needsDatabase: lowerDesc.includes('base de données') || lowerDesc.includes('utilisateurs') || lowerDesc.includes('comptes'),
    needsPayment: lowerDesc.includes('paiement') || lowerDesc.includes('stripe') || lowerDesc.includes('paypal'),
    isUrgent: lowerDesc.includes('urgent') || lowerDesc.includes('rapide') || lowerDesc.includes('vite'),
    hasComplexFeatures: lowerDesc.includes('api') || lowerDesc.includes('intégration') || lowerDesc.includes('avancé'),
    needsMaintenance: lowerDesc.includes('maintenance') || lowerDesc.includes('support') || lowerDesc.includes('évolution'),
    isRenovation: lowerDesc.includes('rénovation') || lowerDesc.includes('réhabilitation'),
    needsCertification: lowerDesc.includes('norme') || lowerDesc.includes('certification') || lowerDesc.includes('conforme'),
    isRecurring: lowerDesc.includes('régulier') || lowerDesc.includes('hebdomadaire') || lowerDesc.includes('mensuel')
  };

  return analysis;
}

function adaptDeliverablesBasedOnContent(baseDeliverables, analysis, category) {
  let adaptedDeliverables = [...baseDeliverables];

  // Adaptations intelligentes selon l'analyse
  if (analysis.isEcommerce && category === 'development') {
    adaptedDeliverables.push('• Configuration système de paiement sécurisé');
    adaptedDeliverables.push('• Gestion catalogue produits et commandes');
  }

  if (analysis.isMobile) {
    adaptedDeliverables = adaptedDeliverables.map(item => 
      item.includes('responsive') ? '• Application mobile native ou hybride' : item
    );
  }

  if (analysis.needsDatabase && category === 'development') {
    adaptedDeliverables.push('• Base de données optimisée et sécurisée');
  }

  if (analysis.hasComplexFeatures) {
    adaptedDeliverables.push('• Documentation API et intégrations tierces');
  }

  if (analysis.needsMaintenance) {
    adaptedDeliverables.push('• Plan de maintenance et support technique');
  }

  if (analysis.isRenovation && category === 'construction') {
    adaptedDeliverables.push('• Diagnostic initial et conseils optimisation');
    adaptedDeliverables.push('• Coordination multi-corps de métier si nécessaire');
  }

  if (analysis.needsCertification && category === 'construction') {
    adaptedDeliverables.push('• Attestations de conformité et certificats');
  }

  if (analysis.isRecurring && category === 'services_personne') {
    adaptedDeliverables.push('• Planning récurrent avec suivi qualité');
    adaptedDeliverables.push('• Adaptation du service selon vos retours');
  }

  return adaptedDeliverables;
}

app.post('/api/ai/predict-revenue', (req, res) => {
  const { missionData, providerData } = req.body;

  const mockPrediction = {
    estimatedRevenue: Math.floor(Math.random() * 10000) + 2000,
    confidence: Math.floor(Math.random() * 40) + 60,
    factors: [
      'Historique de prix similaires',
      'Complexité du projet',
      'Demande du marché'
    ]
  };

  res.json(mockPrediction);
});

app.post('/api/ai/detect-dumping', (req, res) => {
  const { bidData } = req.body;

  const mockDetection = {
    isDumping: Math.random() > 0.7,
    confidenceLevel: Math.floor(Math.random() * 50) + 50,
    reasons: Math.random() > 0.5 ? [
      'Prix 40% en dessous de la moyenne marché',
      'Pattern inhabituel dans les enchères'
    ] : [],
    recommendedMinPrice: Math.floor(Math.random() * 2000) + 1000
  };

  res.json(mockDetection);
});

// Endpoint pour la détection d'abus
app.post('/api/ai/detect-abuse', (req, res) => {
  const { bidData } = req.body;

  const mockAbuse = {
    isAbuse: Math.random() > 0.8,
    confidence: Math.floor(Math.random() * 40) + 60,
    reasons: Math.random() > 0.5 ? [
      'Pattern de soumission suspect',
      'Prix anormalement bas répété'
    ] : [],
    severity: Math.random() > 0.7 ? 'high' : 'medium'
  };

  res.json(mockAbuse);
});

// Endpoint pour le guidage d'enchères intelligentes
app.post('/api/ai/bidding-guidance', (req, res) => {
  const { missionData, providerData } = req.body;

  const basePrice = missionData.budget || 5000;
  const suggestedBid = Math.round(basePrice * (0.7 + Math.random() * 0.3));

  const mockGuidance = {
    suggestedBid,
    reasoning: [
      'Basé sur votre profil et l\'historique de prix',
      'Tient compte de la concurrence actuelle',
      'Optimisé pour maximiser vos chances de succès'
    ],
    confidence: Math.floor(Math.random() * 30) + 70,
    competitorAnalysis: {
      averageBid: basePrice * 0.85,
      yourPosition: 'competitive',
      winProbability: Math.floor(Math.random() * 40) + 60
    }
  };

  res.json(mockGuidance);
});

// Endpoint pour l'analyse de marché
app.post('/api/ai/market-analysis', (req, res) => {
  const { category, location } = req.body;

  const mockAnalysis = {
    demandLevel: Math.random() > 0.5 ? 'high' : 'medium',
    competitionLevel: Math.random() > 0.5 ? 'medium' : 'low',
    averageBudget: Math.floor(Math.random() * 5000) + 2000,
    trendingSkills: ['React', 'Node.js', 'TypeScript', 'Python'],
    marketHeat: Math.floor(Math.random() * 100),
    recommendations: [
      'Forte demande en développement web',
      'Les projets IA sont en hausse',
      'Compétitivité modérée dans votre région'
    ]
  };

  res.json(mockAnalysis);
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  // Simple mock authentication
  const user = {
    id: 1,
    name: email.split('@')[0],
    email,
    type: 'client'
  };

  res.json({ user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, type } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide' });
  }

  // Simple mock registration
  const user = {
    id: Date.now(),
    name: name || email.split('@')[0],
    email: email.trim().toLowerCase(),
    type: type || 'client'
  };

  res.status(201).json({
    user,
    message: 'Compte créé avec succès'
  });
});


// Serve React app for all other routes
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('<!DOCTYPE html><html><body><h1>AppelsPro Loading...</h1><script>window.location.reload()</script></body></html>');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 AppelsPro server running on http://0.0.0.0:${port}`);
  console.log(`📱 Frontend: http://0.0.0.0:${port}`);
  console.log(`🔧 API Health: http://0.0.0.0:${port}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});