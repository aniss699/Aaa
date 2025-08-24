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

  console.log('🧠 Analyse IA demandée pour:', { category, title: title?.substring(0, 50) });

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

  console.log('✅ Analyse IA générée:', {
    score: analysis.qualityScore,
    improvements: analysis.improvements.length,
    suggestedFields: analysis.suggestedFields.length,
    category
  });

  res.json(analysis);
});

function analyzeCategorySpecific(description, category) {
  const lowerDesc = description.toLowerCase();
  const improvements = [];
  const missing = [];

  const categoryAnalysis = {
    developpement: () => {
      // Technologies
      if (!lowerDesc.match(/(react|vue|angular|php|python|javascript|node|laravel|symfony|django|flask|nextjs|nuxt|svelte)/)) {
        improvements.push("Spécifier les technologies préférées (React, Vue, Angular, PHP, Python, etc.)");
        missing.push("Stack technique non mentionnée");
      }
      
      // Type de projet
      if (!lowerDesc.match(/(site|web|application|app|plateforme|api|backend|frontend|full.?stack)/)) {
        improvements.push("Préciser le type de développement (site web, API, application, etc.)");
        missing.push("Type de développement non spécifié");
      }
      
      // Base de données
      if (!lowerDesc.match(/(base.?de.?données|database|mysql|postgresql|mongodb|sql)/)) {
        improvements.push("Indiquer si une base de données est nécessaire");
      }
      
      // Fonctionnalités
      if (!lowerDesc.match(/(authentification|login|paiement|e.?commerce|cms|admin)/)) {
        improvements.push("Détailler les fonctionnalités principales");
      }
      
      // Responsive
      if (!lowerDesc.match(/(responsive|mobile|tablette|adapt)/)) {
        improvements.push("Préciser la compatibilité multi-device");
      }
      
      // Hébergement
      if (!lowerDesc.match(/(hébergement|hosting|serveur|cloud|aws|vercel)/)) {
        improvements.push("Mentionner les besoins d'hébergement");
      }
    },

    design: () => {
      // Type de design
      if (!lowerDesc.match(/(logo|identité|charte|graphique|ui|ux|interface|maquette)/)) {
        improvements.push("Préciser le type de design souhaité");
        missing.push("Type de design non spécifié");
      }
      
      // Support
      if (!lowerDesc.match(/(print|web|mobile|réseaux.?sociaux|packaging)/)) {
        improvements.push("Indiquer les supports de communication");
      }
      
      // Style
      if (!lowerDesc.match(/(moderne|classique|minimaliste|coloré|corporate|créatif)/)) {
        improvements.push("Décrire le style visuel souhaité");
      }
      
      // Formats
      if (!lowerDesc.match(/(psd|ai|figma|sketch|pdf|png|jpg)/)) {
        improvements.push("Spécifier les formats de livraison attendus");
      }
    },

    marketing: () => {
      // Canaux
      if (!lowerDesc.match(/(seo|sem|google.?ads|facebook|instagram|linkedin|email|content)/)) {
        improvements.push("Préciser les canaux marketing souhaités");
        missing.push("Stratégie marketing non définie");
      }
      
      // Objectifs
      if (!lowerDesc.match(/(notoriété|vente|lead|trafic|conversion|roi)/)) {
        improvements.push("Définir les objectifs de la campagne");
      }
      
      // Cible
      if (!lowerDesc.match(/(cible|audience|persona|démographique|âge|sexe)/)) {
        improvements.push("Décrire la cible marketing");
      }
      
      // Budget publicitaire
      if (!lowerDesc.match(/(budget.?pub|ad.?spend|cpc|cpm)/)) {
        improvements.push("Indiquer le budget publicitaire séparé");
      }
    },

    travaux: () => {
      // Surface
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface des travaux en m²");
        missing.push("Surface non indiquée");
      }
      
      // Type de travaux
      if (!lowerDesc.match(/(rénovation|construction|plomberie|électricité|peinture|carrelage|maçonnerie|isolation|toiture)/)) {
        improvements.push("Détailler le type de travaux");
        missing.push("Nature des travaux non précisée");
      }
      
      // Étage et accès
      if (!lowerDesc.match(/(étage|niveau|rez.?de.?chaussée|accès|ascenseur|escalier)/)) {
        improvements.push("Préciser l'étage et les contraintes d'accès");
      }
      
      // Fournitures
      if (!lowerDesc.match(/(fourniture|matériaux|inclus|client)/)) {
        improvements.push("Clarifier qui fournit les matériaux");
      }
      
      // Délais et planning
      if (!lowerDesc.match(/(délai|planning|urgent|flexible|semaine|mois)/)) {
        improvements.push("Indiquer les délais souhaités");
      }
      
      // Normes
      if (!lowerDesc.match(/(norme|rt.?2012|re.?2020|consuel|handicap)/)) {
        improvements.push("Mentionner les normes applicables");
      }
    },

    services_personne: () => {
      // Type de service
      if (!lowerDesc.match(/(ménage|garde|enfant|aide|domicile|cours|soutien|jardinage|bricolage)/)) {
        improvements.push("Préciser le type de service à la personne");
        missing.push("Service non spécifié");
      }
      
      // Fréquence
      if (!lowerDesc.match(/(fréquence|régulier|ponctuel|quotidien|hebdomadaire|mensuel)/)) {
        improvements.push("Indiquer la fréquence d'intervention");
        missing.push("Fréquence non précisée");
      }
      
      // Horaires
      if (!lowerDesc.match(/(horaire|heure|matin|après.?midi|soir|week.?end)/)) {
        improvements.push("Détailler les créneaux horaires");
      }
      
      // Matériel
      if (!lowerDesc.match(/(matériel|produit|équipement|fourni|apporter)/)) {
        improvements.push("Préciser qui fournit le matériel/produits");
      }
      
      // Contraintes spécifiques
      if (lowerDesc.includes('garde') && !lowerDesc.match(/\d+\s*(?:ans?|années?|mois)/)) {
        improvements.push("Indiquer l'âge des enfants à garder");
        missing.push("Âge des enfants non précisé");
      }
      
      if (lowerDesc.includes('ménage') && !lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface du logement");
      }
    },

    jardinage: () => {
      // Surface
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Préciser la surface du jardin/terrain");
        missing.push("Surface non indiquée");
      }
      
      // Type de travaux
      if (!lowerDesc.match(/(tonte|taille|élagage|plantation|débroussaillage|arrosage|paysagisme)/)) {
        improvements.push("Détailler les travaux de jardinage");
        missing.push("Travaux non spécifiés");
      }
      
      // Fréquence
      if (!lowerDesc.match(/(entretien|régulier|ponctuel|saison|mensuel|hebdomadaire)/)) {
        improvements.push("Indiquer la fréquence d'entretien");
      }
      
      // Équipement
      if (!lowerDesc.match(/(tondeuse|taille.?haie|sécateur|débroussailleuse|équipement)/)) {
        improvements.push("Préciser qui fournit l'équipement");
      }
      
      // Évacuation
      if (!lowerDesc.match(/(évacuation|déchets|compost|déchetterie)/)) {
        improvements.push("Indiquer la gestion des déchets verts");
      }
    },

    transport: () => {
      // Type de transport
      if (!lowerDesc.match(/(déménagement|livraison|transport|colis|meuble|véhicule)/)) {
        improvements.push("Préciser le type de transport/livraison");
        missing.push("Type de transport non spécifié");
      }
      
      // Distance et itinéraire
      if (!lowerDesc.match(/(km|distance|adresse|ville|région|local|national)/)) {
        improvements.push("Indiquer la distance ou l'itinéraire");
      }
      
      // Volume/poids
      if (!lowerDesc.match(/(volume|poids|kg|m3|carton|palette)/)) {
        improvements.push("Préciser le volume ou poids à transporter");
      }
      
      // Contraintes
      if (!lowerDesc.match(/(fragile|lourd|encombrant|montage|démontage)/)) {
        improvements.push("Mentionner les contraintes particulières");
      }
      
      // Véhicule
      if (!lowerDesc.match(/(camion|fourgon|voiture|utilitaire|porteur)/)) {
        improvements.push("Indiquer le type de véhicule nécessaire");
      }
    },

    beaute_bienetre: () => {
      // Type de prestation
      if (!lowerDesc.match(/(coiffure|esthétique|massage|manucure|pédicure|maquillage|épilation)/)) {
        improvements.push("Préciser le type de prestation beauté");
        missing.push("Prestation non spécifiée");
      }
      
      // Lieu
      if (!lowerDesc.match(/(domicile|salon|institut|déplacement)/)) {
        improvements.push("Indiquer le lieu de prestation");
      }
      
      // Durée
      if (!lowerDesc.match(/(durée|minutes|heure|séance)/)) {
        improvements.push("Préciser la durée de la prestation");
      }
      
      // Produits
      if (!lowerDesc.match(/(produit|matériel|bio|naturel|hypoallergénique)/)) {
        improvements.push("Mentionner les préférences de produits");
      }
    },

    services_pro: () => {
      // Type de service
      if (!lowerDesc.match(/(comptabilité|juridique|conseil|formation|audit|expertise)/)) {
        improvements.push("Préciser le type de service professionnel");
        missing.push("Service non spécifié");
      }
      
      // Secteur d'activité
      if (!lowerDesc.match(/(secteur|industrie|commerce|artisan|libéral|association)/)) {
        improvements.push("Indiquer votre secteur d'activité");
      }
      
      // Taille entreprise
      if (!lowerDesc.match(/(taille|salarié|chiffre.?affaire|tpe|pme|auto.?entrepreneur)/)) {
        improvements.push("Préciser la taille de votre entreprise");
      }
      
      // Fréquence
      if (!lowerDesc.match(/(ponctuel|régulier|mensuel|trimestriel|annuel)/)) {
        improvements.push("Indiquer la périodicité souhaitée");
      }
    },

    evenementiel: () => {
      // Type d'événement
      if (!lowerDesc.match(/(mariage|anniversaire|entreprise|séminaire|cocktail|gala|baptême)/)) {
        improvements.push("Préciser le type d'événement");
        missing.push("Type d'événement non spécifié");
      }
      
      // Nombre d'invités
      if (!lowerDesc.match(/\d+\s*(?:personne|invité|convive|participant)/)) {
        improvements.push("Indiquer le nombre d'invités");
        missing.push("Nombre d'invités non précisé");
      }
      
      // Date et durée
      if (!lowerDesc.match(/(date|jour|durée|heure|journée|soirée)/)) {
        improvements.push("Préciser la date et durée de l'événement");
      }
      
      // Lieu
      if (!lowerDesc.match(/(lieu|salle|domicile|extérieur|restaurant)/)) {
        improvements.push("Indiquer le lieu de l'événement");
      }
      
      // Services inclus
      if (!lowerDesc.match(/(traiteur|animation|décoration|photographe|musique)/)) {
        improvements.push("Détailler les services souhaités");
      }
    },

    enseignement: () => {
      // Niveau
      if (!lowerDesc.match(/(primaire|collège|lycée|supérieur|adulte|professionnel|cp|ce1|ce2|cm1|cm2|6ème|5ème|4ème|3ème|seconde|première|terminale)/)) {
        improvements.push("Préciser le niveau scolaire");
        missing.push("Niveau non spécifié");
      }
      
      // Matière
      if (!lowerDesc.match(/(mathématiques|français|anglais|sciences|histoire|géographie|physique|chimie|informatique)/)) {
        improvements.push("Indiquer la/les matière(s)");
        missing.push("Matière non précisée");
      }
      
      // Fréquence
      if (!lowerDesc.match(/(fois|semaine|mois|régulier|intensif|stage)/)) {
        improvements.push("Préciser la fréquence des cours");
      }
      
      // Lieu
      if (!lowerDesc.match(/(domicile|déplacement|distanciel|webcam|skype|zoom)/)) {
        improvements.push("Indiquer le mode de cours (présentiel/distanciel)");
      }
      
      // Objectifs
      if (!lowerDesc.match(/(rattrapage|perfectionnement|préparation|examen|bac|brevet|concours)/)) {
        improvements.push("Définir les objectifs pédagogiques");
      }
    },

    animaux: () => {
      // Type d'animal
      if (!lowerDesc.match(/(chien|chat|oiseau|rongeur|reptile|poisson|cheval)/)) {
        improvements.push("Préciser le type d'animal");
        missing.push("Animal non spécifié");
      }
      
      // Age et taille
      if (!lowerDesc.match(/(âge|mois|ans|taille|poids|race|petit|moyen|grand)/)) {
        improvements.push("Indiquer l'âge et taille de l'animal");
      }
      
      // Type de service
      if (!lowerDesc.match(/(garde|promenade|toilettage|dressage|vétérinaire|pension)/)) {
        improvements.push("Préciser le service animalier souhaité");
        missing.push("Service non spécifié");
      }
      
      // Durée
      if (!lowerDesc.match(/(durée|jour|semaine|vacances|week.?end|quotidien)/)) {
        improvements.push("Indiquer la durée de garde/service");
      }
      
      // Caractère
      if (!lowerDesc.match(/(caractère|sociable|agressif|craintif|calme|joueur)/)) {
        improvements.push("Décrire le caractère de l'animal");
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
    developpement: [
      {
        label: "Stack technique préférée",
        type: "multiselect",
        options: ["React", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "PHP", "Laravel", "Symfony", "Python", "Django", "Flask", "Node.js", "Express", "NestJS", "ASP.NET", "Java Spring"],
        suggested: !lowerDesc.match(/(react|vue|angular|php|python|javascript|node|laravel|symfony|django|flask|nextjs|nuxt|svelte)/),
        priority: "high"
      },
      {
        label: "Type de projet",
        type: "select",
        options: ["Site vitrine/corporate", "E-commerce/marketplace", "Application web (SaaS)", "API/Backend", "Application mobile", "Plateforme collaborative", "CMS/Blog", "Intranet/Extranet"],
        suggested: !lowerDesc.match(/(site|application|api|plateforme|cms)/),
        priority: "high"
      },
      {
        label: "Base de données",
        type: "select",
        options: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Firebase", "Supabase", "Pas de BDD"],
        suggested: !lowerDesc.match(/(base|database|mysql|postgresql|mongodb)/),
        priority: "medium"
      },
      {
        label: "Fonctionnalités clés",
        type: "multiselect",
        options: ["Authentification utilisateur", "Paiement en ligne", "API REST/GraphQL", "Panel d'administration", "Chat/Messagerie", "Notifications push", "Upload de fichiers", "Géolocalisation", "Multi-langue", "Mode sombre"],
        suggested: !lowerDesc.match(/(login|paiement|admin|chat|notification|upload|geo)/),
        priority: "medium"
      },
      {
        label: "Hébergement souhaité",
        type: "select",
        options: ["Vercel/Netlify", "AWS", "Google Cloud", "Azure", "OVH", "Hostinger", "Je m'en occupe", "À voir ensemble"],
        suggested: !lowerDesc.match(/(hébergement|hosting|serveur|vercel|aws|cloud)/),
        priority: "medium"
      },
      {
        label: "Budget développement",
        type: "select",
        options: ["< 2000€", "2000€ - 5000€", "5000€ - 10000€", "10000€ - 20000€", "> 20000€"],
        suggested: true,
        priority: "low"
      }
    ],

    design: [
      {
        label: "Type de design",
        type: "multiselect",
        options: ["Logo & identité visuelle", "Site web/app", "Print (flyers, cartes)", "Packaging produit", "Réseaux sociaux", "Présentation/Slide", "Illustration custom", "Refonte existant"],
        suggested: !lowerDesc.match(/(logo|site|print|packaging|social|illustration)/),
        priority: "high"
      },
      {
        label: "Style souhaité",
        type: "multiselect",
        options: ["Moderne/Épuré", "Corporate/Professionnel", "Créatif/Artistique", "Minimaliste", "Coloré/Vibrant", "Élégant/Luxe", "Jeune/Dynamique", "Classique/Intemporel"],
        suggested: !lowerDesc.match(/(moderne|corporate|créatif|minimaliste|coloré|élégant)/),
        priority: "high"
      },
      {
        label: "Secteur d'activité",
        type: "select",
        options: ["Tech/Digital", "Santé/Médical", "Finance/Banque", "Immobilier", "Mode/Beauté", "Restauration", "Éducation", "Sport/Fitness", "Art/Culture", "Autre"],
        suggested: true,
        priority: "medium"
      },
      {
        label: "Formats de livraison",
        type: "multiselect",
        options: ["Fichiers Photoshop (PSD)", "Illustrator (AI/EPS)", "Figma/Sketch", "PDF haute résolution", "PNG/JPG optimisés", "SVG vectoriels", "Fichiers print (CMJN)", "Assets web"],
        suggested: !lowerDesc.match(/(psd|ai|figma|pdf|png|svg)/),
        priority: "medium"
      },
      {
        label: "Délai souhaité",
        type: "select",
        options: ["< 1 semaine (urgent)", "1-2 semaines", "2-4 semaines", "1-2 mois", "> 2 mois", "Flexible"],
        suggested: !lowerDesc.match(/(urgent|semaine|mois|délai)/),
        priority: "medium"
      }
    ],

    marketing: [
      {
        label: "Canaux marketing",
        type: "multiselect",
        options: ["Google Ads (SEA)", "Facebook & Instagram Ads", "LinkedIn Ads", "TikTok Ads", "SEO/Référencement", "Email marketing", "Content marketing", "Influenceurs", "Relations presse"],
        suggested: !lowerDesc.match(/(google|facebook|instagram|linkedin|seo|email|content|influenceur)/),
        priority: "high"
      },
      {
        label: "Objectifs principaux",
        type: "multiselect",
        options: ["Augmenter notoriété", "Générer des leads", "Booster les ventes", "Fidéliser clients", "Lancement produit", "Recrutement", "Trafic website", "Engagement réseaux"],
        suggested: !lowerDesc.match(/(notoriété|lead|vente|fidélisation|lancement|trafic)/),
        priority: "high"
      },
      {
        label: "Cible marketing",
        type: "text",
        placeholder: "Ex: Femmes 25-45 ans, CSP+, intérêt écologie",
        suggested: !lowerDesc.match(/(cible|âge|démographique|persona)/),
        priority: "high"
      },
      {
        label: "Budget publicitaire mensuel",
        type: "select",
        options: ["< 500€", "500€ - 1000€", "1000€ - 3000€", "3000€ - 5000€", "> 5000€", "Variable selon ROI"],
        suggested: !lowerDesc.match(/(budget.*pub|ad.*spend)/),
        priority: "medium"
      },
      {
        label: "Secteur d'activité",
        type: "select",
        options: ["E-commerce", "Services B2B", "Services B2C", "SaaS/Tech", "Immobilier", "Santé", "Formation", "Restauration", "Autre"],
        suggested: true,
        priority: "medium"
      }
    ],

    travaux: [
      {
        label: "Surface des travaux (m²)",
        type: "number",
        placeholder: "Surface exacte en mètres carrés",
        suggested: !lowerDesc.match(/\d+\s*m[²2]/),
        priority: "high"
      },
      {
        label: "Types de travaux",
        type: "multiselect",
        options: ["Plomberie", "Électricité", "Peinture", "Carrelage/Sol", "Cloisons/Murs", "Isolation", "Menuiserie", "Chauffage", "Cuisine/SDB", "Toiture", "Façade"],
        suggested: !lowerDesc.match(/(plomberie|électricité|peinture|carrelage|isolation|menuiserie)/),
        priority: "high"
      },
      {
        label: "Type de logement",
        type: "select",
        options: ["Maison individuelle", "Appartement", "Local commercial", "Bureau", "Atelier/Garage", "Immeuble"],
        suggested: !lowerDesc.match(/(maison|appartement|local|bureau)/),
        priority: "medium"
      },
      {
        label: "Étage des travaux",
        type: "select",
        options: ["Rez-de-chaussée", "1er étage", "2ème étage", "3ème étage", "Plus haut", "Tous étages"],
        suggested: !lowerDesc.match(/(étage|niveau|rez.*chaussée)/),
        priority: "medium"
      },
      {
        label: "Contraintes d'accès",
        type: "multiselect",
        options: ["Pas d'ascenseur", "Escalier étroit", "Parking difficile", "Horaires restreints", "Voisinage sensible", "Copropriété", "Monument historique"],
        suggested: !lowerDesc.match(/(accès|ascenseur|parking|escalier)/),
        priority: "medium"
      },
      {
        label: "Fourniture matériaux",
        type: "select",
        options: ["Artisan fournit tout", "Client fournit matériaux", "Fourniture partagée", "À définir ensemble"],
        suggested: !lowerDesc.match(/(fourniture|matériaux|inclus)/),
        priority: "medium"
      },
      {
        label: "Urgence des travaux",
        type: "select",
        options: ["Urgence (< 48h)", "Rapide (< 1 semaine)", "Normal (2-4 semaines)", "Flexible (planning libre)", "Saisonnier"],
        suggested: !lowerDesc.match(/(urgent|rapide|délai|planning)/),
        priority: "medium"
      }
    ],

    services_personne: [
      {
        label: "Type de service",
        type: "select",
        options: ["Ménage/Entretien", "Garde d'enfants", "Aide aux personnes âgées", "Soutien scolaire", "Jardinage", "Bricolage", "Courses/Commissions", "Assistance administrative"],
        suggested: !lowerDesc.match(/(ménage|garde|aide|soutien|jardinage|bricolage|course)/),
        priority: "high"
      },
      {
        label: "Fréquence d'intervention",
        type: "select",
        options: ["Quotidienne", "2-3 fois/semaine", "Hebdomadaire", "Bi-mensuelle", "Mensuelle", "Ponctuelle", "Selon besoins"],
        suggested: !lowerDesc.match(/(quotidien|hebdomadaire|mensuel|ponctuel|régulier)/),
        priority: "high"
      },
      {
        label: "Créneaux horaires",
        type: "multiselect",
        options: ["Matin (8h-12h)", "Après-midi (14h-18h)", "Soir (18h-21h)", "Week-end", "Jours fériés", "Vacances scolaires", "Flexible"],
        suggested: !lowerDesc.match(/(matin|après.*midi|soir|week.*end|horaire)/),
        priority: "high"
      },
      {
        label: "Durée par intervention",
        type: "select",
        options: ["1-2 heures", "2-4 heures", "Demi-journée", "Journée complète", "Variable selon tâches"],
        suggested: !lowerDesc.match(/(heure|durée|temps)/),
        priority: "medium"
      },
      {
        label: "Matériel/Produits",
        type: "select",
        options: ["Prestataire fournit tout", "Client fournit", "Produits écologiques uniquement", "Matériel spécialisé requis"],
        suggested: !lowerDesc.match(/(matériel|produit|écologique|fourni)/),
        priority: "medium"
      }
    ],

    jardinage: [
      {
        label: "Surface du jardin (m²)",
        type: "number",
        placeholder: "Surface totale du terrain",
        suggested: !lowerDesc.match(/\d+\s*m[²2]/),
        priority: "high"
      },
      {
        label: "Types de travaux",
        type: "multiselect",
        options: ["Tonte pelouse", "Taille haies", "Élagage arbres", "Débroussaillage", "Plantation", "Entretien massifs", "Arrosage", "Création paysagère"],
        suggested: !lowerDesc.match(/(tonte|taille|élagage|plantation|entretien|arrosage)/),
        priority: "high"
      },
      {
        label: "Fréquence entretien",
        type: "select",
        options: ["Hebdomadaire", "Bi-mensuelle", "Mensuelle", "Saisonnière", "Ponctuelle", "Selon pousse"],
        suggested: !lowerDesc.match(/(hebdomadaire|mensuel|saison|régulier)/),
        priority: "high"
      },
      {
        label: "Équipement disponible",
        type: "multiselect",
        options: ["Tondeuse", "Taille-haie", "Sécateur", "Débroussailleuse", "Souffleur", "Bêche/Outils main", "Rien (prestataire équipé)"],
        suggested: !lowerDesc.match(/(tondeuse|taille.*haie|équipement|outil)/),
        priority: "medium"
      },
      {
        label: "Évacuation déchets",
        type: "select",
        options: ["Prestataire évacue", "Compostage sur place", "Client s'en charge", "Broyage sur place"],
        suggested: !lowerDesc.match(/(évacuation|déchet|compost)/),
        priority: "medium"
      }
    ],

    transport: [
      {
        label: "Type de transport",
        type: "select",
        options: ["Déménagement complet", "Transport mobilier", "Livraison colis", "Transport personnes", "Évacuation encombrants", "Transport spécialisé"],
        suggested: !lowerDesc.match(/(déménagement|livraison|transport|colis)/),
        priority: "high"
      },
      {
        label: "Distance approximative",
        type: "select",
        options: ["Local (< 30km)", "Régional (30-100km)", "National (> 100km)", "International"],
        suggested: !lowerDesc.match(/(km|distance|local|national)/),
        priority: "high"
      },
      {
        label: "Volume à transporter",
        type: "select",
        options: ["Quelques objets", "Fourgonnette", "Camion 12m³", "Camion 20m³", "Semi-remorque", "Très volumineux"],
        suggested: !lowerDesc.match(/(volume|m3|camion|fourgon)/),
        priority: "high"
      },
      {
        label: "Services additionnels",
        type: "multiselect",
        options: ["Emballage/Protection", "Montage/Démontage", "Portage étage", "Assurance renforcée", "Stockage temporaire", "Nettoyage après"],
        suggested: !lowerDesc.match(/(emballage|montage|portage|assurance)/),
        priority: "medium"
      },
      {
        label: "Contraintes spéciales",
        type: "multiselect",
        options: ["Objets fragiles", "Piano/Objets lourds", "Œuvres d'art", "Créneaux stricts", "Étages sans ascenseur", "Parking difficile"],
        suggested: !lowerDesc.match(/(fragile|lourd|art|créneau|étage|parking)/),
        priority: "medium"
      }
    ],

    beaute_bienetre: [
      {
        label: "Type de prestation",
        type: "multiselect",
        options: ["Coiffure", "Coloration", "Coupe homme", "Esthétique visage", "Manucure", "Pédicure", "Maquillage", "Épilation", "Massage", "Soins corps"],
        suggested: !lowerDesc.match(/(coiffure|esthétique|manucure|massage|maquillage)/),
        priority: "high"
      },
      {
        label: "Lieu de prestation",
        type: "select",
        options: ["À domicile client", "Dans mon salon", "En déplacement événement", "Institut partenaire"],
        suggested: !lowerDesc.match(/(domicile|salon|déplacement)/),
        priority: "high"
      },
      {
        label: "Durée estimée",
        type: "select",
        options: ["30 min", "1 heure", "1h30", "2 heures", "2h30", "3 heures+", "Journée complète"],
        suggested: !lowerDesc.match(/(durée|heure|minute)/),
        priority: "medium"
      },
      {
        label: "Préférences produits",
        type: "multiselect",
        options: ["Bio/Naturel", "Vegan", "Hypoallergénique", "Haut de gamme", "Spécifique allergie", "Marques précises"],
        suggested: !lowerDesc.match(/(bio|naturel|vegan|allergie)/),
        priority: "medium"
      },
      {
        label: "Occasion spéciale",
        type: "select",
        options: ["Quotidien", "Mariage", "Événement professionnel", "Soirée/Gala", "Shooting photo", "Autre événement"],
        suggested: !lowerDesc.match(/(mariage|événement|soirée|shooting)/),
        priority: "low"
      }
    ],

    services_pro: [
      {
        label: "Type de service",
        type: "select",
        options: ["Comptabilité", "Conseil juridique", "Conseil stratégique", "Formation", "Audit", "Expertise technique", "Coaching", "Gestion projet"],
        suggested: !lowerDesc.match(/(comptabilité|juridique|conseil|formation|audit)/),
        priority: "high"
      },
      {
        label: "Secteur d'activité",
        type: "select",
        options: ["Commerce/Retail", "Industrie", "Services", "Tech/Digital", "Santé", "Immobilier", "Association", "Artisanat", "Agriculture"],
        suggested: !lowerDesc.match(/(commerce|industrie|service|tech|santé)/),
        priority: "high"
      },
      {
        label: "Taille entreprise",
        type: "select",
        options: ["Auto-entrepreneur", "TPE (1-9 salariés)", "PME (10-49)", "ETI (50-249)", "Grande entreprise (250+)", "Association"],
        suggested: !lowerDesc.match(/(auto.*entrepreneur|tpe|pme|salarié)/),
        priority: "medium"
      },
      {
        label: "Fréquence",
        type: "select",
        options: ["Mission ponctuelle", "Mensuel", "Trimestriel", "Semestriel", "Annuel", "Selon besoins"],
        suggested: !lowerDesc.match(/(ponctuel|mensuel|trimestriel|annuel)/),
        priority: "medium"
      },
      {
        label: "Modalité",
        type: "select",
        options: ["Présentiel uniquement", "Distanciel possible", "Mixte", "Déplacement chez client"],
        suggested: !lowerDesc.match(/(présentiel|distanciel|déplacement)/),
        priority: "medium"
      }
    ],

    evenementiel: [
      {
        label: "Type d'événement",
        type: "select",
        options: ["Mariage", "Anniversaire", "Baptême/Communion", "Séminaire entreprise", "Cocktail/Réception", "Lancement produit", "Gala/Soirée", "Team building"],
        suggested: !lowerDesc.match(/(mariage|anniversaire|baptême|séminaire|cocktail|gala)/),
        priority: "high"
      },
      {
        label: "Nombre d'invités",
        type: "select",
        options: ["< 20 personnes", "20-50 personnes", "50-100 personnes", "100-200 personnes", "200-500 personnes", "> 500 personnes"],
        suggested: !lowerDesc.match(/\d+\s*(?:personne|invité|participant)/),
        priority: "high"
      },
      {
        label: "Services souhaités",
        type: "multiselect",
        options: ["Traiteur/Restauration", "Animation/DJ", "Décoration", "Photographe", "Lieu/Salle", "Fleurs", "Éclairage", "Coordination générale"],
        suggested: !lowerDesc.match(/(traiteur|animation|décoration|photo|salle)/),
        priority: "high"
      },
      {
        label: "Budget approximatif",
        type: "select",
        options: ["< 2000€", "2000€ - 5000€", "5000€ - 10000€", "10000€ - 20000€", "> 20000€"],
        suggested: true,
        priority: "medium"
      },
      {
        label: "Date souhaitée",
        type: "date",
        suggested: !lowerDesc.match(/(date|jour|mois)/),
        priority: "medium"
      },
      {
        label: "Contraintes particulières",
        type: "text",
        placeholder: "Ex: Régimes alimentaires, accessibilité, thème...",
        suggested: !lowerDesc.match(/(régime|allergie|thème|contrainte)/),
        priority: "low"
      }
    ],

    enseignement: [
      {
        label: "Niveau scolaire",
        type: "select",
        options: ["Primaire (CP-CM2)", "Collège (6ème-3ème)", "Lycée (2nde-Term)", "Supérieur (Bac+1 à +5)", "Adulte/Professionnel", "Préparation concours"],
        suggested: !lowerDesc.match(/(primaire|collège|lycée|supérieur|cp|ce1|ce2|cm1|cm2|6ème|5ème|4ème|3ème|seconde|première|terminale)/),
        priority: "high"
      },
      {
        label: "Matières enseignées",
        type: "multiselect",
        options: ["Mathématiques", "Français", "Anglais", "Espagnol", "Allemand", "Sciences (SVT)", "Physique-Chimie", "Histoire-Géo", "Philosophie", "Économie"],
        suggested: !lowerDesc.match(/(mathématiques|français|anglais|sciences|physique|histoire|philosophie)/),
        priority: "high"
      },
      {
        label: "Objectifs pédagogiques",
        type: "multiselect",
        options: ["Soutien scolaire", "Remise à niveau", "Perfectionnement", "Préparation examen", "Préparation concours", "Aide aux devoirs", "Méthodologie"],
        suggested: !lowerDesc.match(/(soutien|rattrapage|perfectionnement|préparation|examen|méthodologie)/),
        priority: "medium"
      },
      {
        label: "Fréquence des cours",
        type: "select",
        options: ["1 fois/semaine", "2 fois/semaine", "3 fois/semaine", "Stage intensif", "Selon besoins", "Préparation ponctuelle"],
        suggested: !lowerDesc.match(/(fois.*semaine|intensif|régulier)/),
        priority: "medium"
      },
      {
        label: "Mode de cours",
        type: "select",
        options: ["À domicile élève", "Déplacement professeur", "Cours en ligne", "Lieu neutre", "Mixte présentiel/distanciel"],
        suggested: !lowerDesc.match(/(domicile|ligne|distanciel|skype|zoom)/),
        priority: "medium"
      }
    ],

    animaux: [
      {
        label: "Type d'animal",
        type: "multiselect",
        options: ["Chien", "Chat", "Oiseau", "Rongeur (lapin, hamster...)", "Reptile", "Poisson", "Cheval", "Autres NAC"],
        suggested: !lowerDesc.match(/(chien|chat|oiseau|rongeur|reptile|poisson|cheval)/),
        priority: "high"
      },
      {
        label: "Service souhaité",
        type: "select",
        options: ["Garde à domicile", "Promenade chien", "Pension chez prestataire", "Toilettage", "Dressage/Éducation", "Soins vétérinaires", "Transport animal"],
        suggested: !lowerDesc.match(/(garde|promenade|pension|toilettage|dressage|vétérinaire)/),
        priority: "high"
      },
      {
        label: "Âge et taille animal",
        type: "text",
        placeholder: "Ex: Chien 3 ans, taille moyenne (20kg)",
        suggested: !lowerDesc.match(/(âge|mois|ans|taille|poids|petit|moyen|grand)/),
        priority: "high"
      },
      {
        label: "Durée de garde",
        type: "select",
        options: ["Quelques heures", "Journée", "Week-end", "Semaine", "Vacances longues", "Régulier"],
        suggested: !lowerDesc.match(/(heure|jour|week.*end|semaine|vacances|régulier)/),
        priority: "medium"
      },
      {
        label: "Tempérament animal",
        type: "multiselect",
        options: ["Calme/Tranquille", "Joueur/Énergique", "Sociable autres animaux", "Craintif/Anxieux", "Dominant", "Facile à vivre"],
        suggested: !lowerDesc.match(/(calme|joueur|sociable|craintif|dominant)/),
        priority: "medium"
      },
      {
        label: "Contraintes spéciales",
        type: "text",
        placeholder: "Ex: Médicaments, allergies, interdictions...",
        suggested: !lowerDesc.match(/(contrainte|médicament|allergie|interdit)/),
        priority: "low"
      }
    ]
  };

  const categoryFields = fieldsByCategory[category] || fieldsByCategory['developpement'];

  // Retourner seulement les champs suggérés avec priorité high ou medium
  return categoryFields
    .filter(field => field.suggested && field.priority !== 'low')
    .sort((a, b) => a.priority === 'high' ? -1 : 1)
    .slice(0, 6); // Augmenter à 6 champs maximum
}

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
    developpement: {
      title: 'Développement Logiciel',
      livrables: [
        '• Code source propre et documenté avec versioning Git',
        '• Tests unitaires et d\'intégration automatisés',
        '• Documentation technique complète (API, installation, utilisation)',
        '• Déploiement sécurisé et mise en production',
        '• Formation utilisateur et support technique post-livraison',
        '• Optimisation performance et SEO technique',
        '• Sauvegardes automatiques et plan de reprise'
      ],
      competences: [
        '• Maîtrise des technologies modernes (React, Vue.js, Angular, Node.js, Python, PHP)',
        '• Expérience en architecture logicielle scalable et microservices',
        '• Connaissance approfondies des bonnes pratiques de sécurité (OWASP, RGPD)',
        '• Méthodologies agiles (Scrum, Kanban) et DevOps (CI/CD)',
        '• Expertise bases de données (SQL, NoSQL) et optimisation requêtes',
        '• Compétences en cloud computing (AWS, Azure, Google Cloud)',
        '• Maîtrise des API REST, GraphQL et intégrations tierces'
      ],
      criteres: [
        '• Portfolio de projets similaires avec code visible (GitHub)',
        '• Expérience prouvée avec les technologies requises (minimum 3 ans)',
        '• Références clients vérifiables dans le développement',
        '• Capacité démontrée à respecter délais et budgets',
        '• Communication claire et reporting régulier',
        '• Maintenance et évolutions post-livraison',
        '• Certifications techniques valorisées'
      ]
    },
    design: {
      title: 'Projet Design & Créatif',
      livrables: [
        '• Maquettes graphiques haute fidélité (desktop, mobile, tablette)',
        '• Charte graphique complète (couleurs, typographies, pictogrammes)',
        '• Fichiers sources modifiables (PSD, AI, Figma, Sketch)',
        '• Guide de style et règles d\'utilisation de la marque',
        '• Adaptations multi-supports (print, web, réseaux sociaux)',
        '• Prototypes interactifs pour validation UX',
        '• Assets optimisés pour le développement (SVG, PNG, etc.)'
      ],
      competences: [
        '• Maîtrise experte des outils Adobe Creative Suite et Figma',
        '• Expertise UX/UI design et design thinking',
        '• Connaissance approfondie des tendances visuelles actuelles',
        '• Compétences en illustration et création d\'icônes',
        '• Expérience en design système et atomic design',
        '• Notions de front-end pour collaboration développeurs',
        '• Sens artistique développé et créativité innovante'
      ],
      criteres: [
        '• Portfolio créatif démontrant la diversité des styles',
        '• Expérience dans votre secteur d\'activité',
        '• Processus créatif structuré avec phases de validation',
        '• Capacité d\'adaptation au brief et feedback client',
        '• Respect des délais et réactivité',
        '• Références clients avec retours positifs',
        '• Formation continue et veille créative'
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
    travaux: {
      title: 'Travaux & Rénovation',
      livrables: [
        '• Réalisation des travaux selon les règles de l\'art et DTU',
        '• Fourniture des matériaux conformes aux normes européennes',
        '• Nettoyage méticuleux et évacuation complète des déchets',
        '• Garantie décennale et responsabilité civile professionnelle',
        '• Attestations de conformité et certificats qualité',
        '• Photos avant/après et carnet d\'entretien',
        '• Conseils personnalisés pour l\'entretien futur'
      ],
      competences: [
        '• Qualification professionnelle RGE et certifications métier',
        '• Maîtrise des normes actuelles (RT2012, RE2020, handicap)',
        '• Expertise multi-corps de métier et coordination chantier',
        '• Matériel professionnel certifié et dernière génération',
        '• Connaissance matériaux écologiques et innovations',
        '• Respect strict des règles de sécurité chantier',
        '• Formation continue aux nouvelles techniques'
      ],
      criteres: [
        '• Portfolio de réalisations récentes avec photos',
        '• Assurances décennale et RC professionnelle valides',
        '• Références clients vérifiables et contactables',
        '• Devis détaillé transparent sans surprise',
        '• Respect des délais et planning rigoureux',
        '• Entreprise locale avec pignon sur rue',
        '• Certifications RGE pour aides financières'
      ]
    },
    services_personne: {
      title: 'Services à la personne',
      livrables: [
        '• Prestations réalisées selon planning personnalisé convenu',
        '• Matériel et produits professionnels écologiques inclus',
        '• Compte-rendu détaillé après chaque intervention',
        '• Flexibilité horaires et service de remplacement garanti',
        '• Assurance responsabilité civile et protection accidents',
        '• Suivi qualité avec évaluations régulières',
        '• Service client disponible pour ajustements'
      ],
      competences: [
        '• Expérience confirmée dans les services à domicile (minimum 3 ans)',
        '• Formation certifiée aux techniques professionnelles',
        '• Discrétion absolue, ponctualité et excellence du service',
        '• Maîtrise produits écologiques et normes d\'hygiène',
        '• Premiers secours et gestes d\'urgence si applicable',
        '• Adaptation aux besoins spécifiques (seniors, enfants)',
        '• Communication bienveillante et empathique'
      ],
      criteres: [
        '• Recommandations clients authentiques et vérifiables',
        '• Disponibilité parfaitement compatible avec vos besoins',
        '• Tarification transparente avec devis détaillé',
        '• Période d\'essai avec évaluation mutuelle',
        '• Casier judiciaire vierge et vérifications effectuées',
        '• Formation continue et mise à jour compétences',
        '• Réactivité et communication proactive'
      ]
    },
    jardinage: {
      title: 'Jardinage & Espaces Verts',
      livrables: [
        '• Entretien professionnel selon plan personnalisé',
        '• Taille respectueuse des végétaux et saisons',
        '• Évacuation complète déchets verts en déchetterie',
        '• Conseils saisonniers et planning d\'entretien',
        '• Traitements écologiques préventifs et curatifs',
        '• Photos avant/après et carnet de suivi',
        '• Garantie reprise sur plantations nouvelles'
      ],
      competences: [
        '• Expertise horticole et connaissance botanique approfondie',
        '• Maîtrise outillage professionnel et techniques modernes',
        '• Certification phytosanitaire et traitements biologiques',
        '• Connaissance sols, exposition et besoins spécifiques',
        '• Techniques d\'élagage et taille respectueuses',
        '• Création et entretien systèmes d\'arrosage',
        '• Respect biodiversité et écosystème jardin'
      ],
      criteres: [
        '• Références de jardins entretenus avec photos',
        '• Expertise reconnue et formation horticole',
        '• Équipement professionnel et véhicule adapté',
        '• Assurance responsabilité civile professionnelle',
        '• Respect environnement et méthodes durables',
        '• Ponctualité et régularité des interventions',
        '• Conseils personnalisés et accompagnement'
      ]
    },
    transport: {
      title: 'Transport & Livraison',
      livrables: [
        '• Transport sécurisé avec matériel de protection adapté',
        '• Manutention professionnelle et emballage soigné',
        '• Livraison ponctuelle avec accusé de réception',
        '• Assurance marchandises transportées incluse',
        '• Montage/démontage mobilier si nécessaire',
        '• Évacuation emballages et nettoyage post-livraison',
        '• Traçabilité complète et suivi en temps réel'
      ],
      competences: [
        '• Permis poids lourds et formations conduite défensive',
        '• Expertise manutention et techniques de portage',
        '• Connaissance réglementation transport et sécurité',
        '• Matériel professionnel (sangles, diable, gerbeur)',
        '• Expérience objets fragiles et œuvres d\'art',
        '• Optimisation itinéraires et gestion planning',
        '• Service client et communication proactive'
      ],
      criteres: [
        '• Véhicule adapté en excellent état avec contrôles à jour',
        '• Assurances complètes (RC, marchandises, professionnelle)',
        '• Références clients pour prestations similaires',
        '• Tarification transparente kilométrage et prestations',
        '• Disponibilité flexible et réactivité',
        '• Réputation fiabilité et ponctualité',
        '• Capacité adaptation contraintes spécifiques'
      ]
    },
    beaute_bienetre: {
      title: 'Beauté & Bien-être',
      livrables: [
        '• Prestation personnalisée selon morphologie et désirs',
        '• Produits professionnels haut de gamme et hypoallergéniques',
        '• Conseils beauté et routine d\'entretien sur-mesure',
        '• Protocole d\'hygiène strict et matériel stérilisé',
        '• Suivi post-prestation et retouches si nécessaire',
        '• Diagnostic beauté et recommandations expertes',
        '• Service à domicile avec équipement professionnel portable'
      ],
      competences: [
        '• Diplômes professionnels (CAP, BP, BTS Esthétique)',
        '• Maîtrise techniques modernes et innovations beauté',
        '• Connaissance anatomie, physiologie et dermatologie',
        '• Expertise produits cosmétiques et leurs compositions',
        '• Formation continue aux dernières tendances',
        '• Sens artistique développé et créativité',
        '• Communication bienveillante et mise en confiance'
      ],
      criteres: [
        '• Portfolio avant/après démontrant savoir-faire',
        '• Diplômes et certifications professionnelles valides',
        '• Hygiène irréprochable et respect protocoles sanitaires',
        '• Avis clients positifs et recommandations authentiques',
        '• Matériel professionnel et produits de qualité',
        '• Flexibilité horaires et service personnalisé',
        '• Discrétion et confidentialité absolues'
      ]
    },
    services_pro: {
      title: 'Services Professionnels',
      livrables: [
        '• Analyse approfondie et diagnostic personnalisé',
        '• Conseil stratégique adapté à votre secteur',
        '• Documentation complète et recommandations écrites',
        '• Formation équipes et accompagnement changement',
        '• Suivi post-mission et support technique continu',
        '• Livrables conformes aux normes professionnelles',
        '• Garantie satisfaction et ajustements inclus'
      ],
      competences: [
        '• Diplômes supérieurs et certifications professionnelles',
        '• Expertise sectorielle approfondie minimum 5 ans',
        '• Maîtrise outils et méthodologies modernes',
        '• Connaissance réglementaire et veille juridique',
        '• Capacités pédagogiques et transmission savoir',
        '• Réseau professionnel et partenaires qualifiés',
        '• Déontologie stricte et confidentialité'
      ],
      criteres: [
        '• Expérience prouvée dans votre domaine d\'activité',
        '• Références clients de taille et secteur similaires',
        '• Méthode de travail structurée et transparente',
        '• Tarification claire avec devis détaillé',
        '• Disponibilité et réactivité aux demandes',
        '• Formation continue et mise à jour compétences',
        '• Assurance responsabilité civile professionnelle'
      ]
    },
    evenementiel: {
      title: 'Événementiel & Réception',
      livrables: [
        '• Organisation complète clés en main selon cahier des charges',
        '• Coordination prestataires et planning détaillé',
        '• Décoration personnalisée et mise en scène soignée',
        '• Service traiteur adapté nombre invités et régimes',
        '• Animation et programme sur-mesure',
        '• Reportage photo/vidéo professionnel inclus',
        '• Nettoyage et remise en état des lieux'
      ],
      competences: [
        '• Expérience organisation événements similaires (minimum 50)',
        '• Réseau prestataires qualifiés et références fiables',
        '• Créativité et sens esthétique développé',
        '• Gestion stress et résolution problèmes temps réel',
        '• Connaissance protocole et savoir-vivre',
        '• Compétences logistiques et coordination équipes',
        '• Maîtrise budgets et négociation fournisseurs'
      ],
      criteres: [
        '• Portfolio événements réalisés avec photos témoignages',
        '• Références organisateurs et retours clients positifs',
        '• Transparence budgétaire et devis détaillé par poste',
        '• Assurances complètes (RC, annulation, intempéries)',
        '• Flexibilité et capacité adaptation dernière minute',
        '• Communication régulière et réactivité',
        '• Solutions alternatives et plan B anticipés'
      ]
    },
    enseignement: {
      title: 'Enseignement & Formation',
      livrables: [
        '• Programme pédagogique personnalisé selon niveau',
        '• Supports de cours adaptés et exercices corrigés',
        '• Évaluations régulières et suivi progression',
        '• Méthodologie de travail et techniques mémorisation',
        '• Préparation examens avec annales et simulations',
        '• Bilan pédagogique avec parents/élève',
        '• Recommandations pour poursuite autonome'
      ],
      competences: [
        '• Diplômes universitaires dans matières enseignées',
        '• Expérience pédagogique confirmée tous niveaux',
        '• Maîtrise techniques d\'apprentissage modernes',
        '• Adaptation méthodes selon profil apprenant',
        '• Patience, bienveillance et pédagogie claire',
        '• Connaissance programmes scolaires actuels',
        '• Formation continue et veille éducative'
      ],
      criteres: [
        '• Résultats prouvés élèves précédents (progression notes)',
        '• Références familles et recommandations authentiques',
        '• Méthode pédagogique adaptée et personnalisée',
        '• Ponctualité et régularité des cours',
        '• Communication transparente avec parents',
        '• Tarification claire et reports possibles',
        '• Passion transmission et motivation élèves'
      ]
    },
    animaux: {
      title: 'Services Animaliers',
      livrables: [
        '• Soins personnalisés selon besoins spécifiques animal',
        '• Surveillance attentive et signalement anomalies',
        '• Respect routine et habitudes de l\'animal',
        '• Compte-rendu détaillé après chaque intervention',
        '• Photos/nouvelles régulières pendant garde',
        '• Urgence vétérinaire prise en charge si nécessaire',
        '• Conseils bien-être et comportement animal'
      ],
      competences: [
        '• Formation comportement animal et premiers secours',
        '• Expérience confirmée garde différentes espèces',
        '• Connaissance besoins nutritionnels et exercice',
        '• Détection signes stress ou maladie',
        '• Techniques dressage positif et socialisation',
        '• Patience et empathie avec animaux anxieux',
        '• Réseau vétérinaires partenaires'
      ],
      criteres: [
        '• Références propriétaires avec animaux similaires',
        '• Assurance responsabilité civile spécialisée',
        '• Disponibilité flexible et service urgence',
        '• Domicile adapté garde si pension proposée',
        '• Communication régulière et transparente',
        '• Passion animaux et bien-être prioritaire',
        '• Tarification claire selon services demandés'
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