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
    category: "development",
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
      category: "development",
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
      category: "development",
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

  if (!description.toLowerCase().match(/(react|vue|angular|php|python|javascript|node)/)) {
    improvements.push("Spécifier les technologies préférées si applicables");
    missingElements.push("Technologies non mentionnées");
  }

  if (!description.toLowerCase().includes('livrable')) {
    improvements.push("Détailler les livrables attendus");
    missingElements.push("Livrables flous");
  }

  // Génération d'une version optimisée
  const optimizedDescription = generateOptimizedDescription(description, category, title);

  const analysis = {
    qualityScore,
    improvements,
    missingElements,
    optimizedDescription,
    detectedSkills: extractSkillsFromDescription(description),
    estimatedComplexity: estimateComplexity(description),
    suggestedCategories: category ? [category] : suggestCategories(description),
    marketInsights: {
      demandLevel: Math.random() > 0.5 ? 'high' : 'medium',
      competitionLevel: Math.random() > 0.5 ? 'medium' : 'low',
      suggestedBudgetRange: suggestBudgetRange(description, category)
    }
  };

  res.json(analysis);
});

function generateOptimizedDescription(description, category, title) {
  const baseDesc = description || "Description du projet";
  
  return `**${title || 'Projet à définir'}**

**Contexte et Objectifs :**
${baseDesc}

**Livrables Attendus :**
• Solution complète et fonctionnelle
• Code source documenté et commenté
• Tests unitaires et documentation technique
• Formation/support utilisateur inclus

**Compétences Techniques Recherchées :**
• Maîtrise des technologies modernes du ${category || 'développement'}
• Expérience en bonnes pratiques de développement
• Capacité à travailler en méthodologie agile
• Communication fluide et régulière

**Critères de Sélection :**
• Portfolio de projets similaires
• Références clients vérifiables
• Méthodologie de travail structurée
• Disponibilité et réactivité

**Budget et Modalités :**
• Budget à définir selon proposition détaillée
• Paiement échelonné selon avancement
• Possibilité de facturation en régie ou forfait

**Suivi et Communication :**
• Points d'avancement réguliers
• Livraison par phases si nécessaire
• Support post-livraison inclus`;
}

function extractSkillsFromDescription(description) {
  const skillsMap = {
    'react': 'React.js',
    'vue': 'Vue.js', 
    'angular': 'Angular',
    'php': 'PHP',
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'node': 'Node.js',
    'sql': 'SQL/Database',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'docker': 'Docker',
    'aws': 'AWS Cloud'
  };

  const detectedSkills = [];
  const lowerDesc = description.toLowerCase();

  Object.entries(skillsMap).forEach(([key, skill]) => {
    if (lowerDesc.includes(key)) {
      detectedSkills.push(skill);
    }
  });

  return detectedSkills;
}

function estimateComplexity(description) {
  let complexity = 3; // Base complexity
  const lowerDesc = description.toLowerCase();

  // Facteurs qui augmentent la complexité
  if (lowerDesc.includes('api') || lowerDesc.includes('intégration')) complexity += 1;
  if (lowerDesc.includes('paiement') || lowerDesc.includes('payment')) complexity += 2;
  if (lowerDesc.includes('mobile') && lowerDesc.includes('web')) complexity += 2;
  if (lowerDesc.includes('temps réel') || lowerDesc.includes('real-time')) complexity += 2;
  if (lowerDesc.includes('ia') || lowerDesc.includes('intelligence artificielle')) complexity += 3;
  if (lowerDesc.includes('blockchain') || lowerDesc.includes('crypto')) complexity += 3;

  return Math.min(complexity, 10); // Cap à 10
}

function suggestCategories(description) {
  const lowerDesc = description.toLowerCase();
  const categories = [];

  if (lowerDesc.includes('site') || lowerDesc.includes('web')) {
    categories.push('development');
  }
  if (lowerDesc.includes('mobile') || lowerDesc.includes('application')) {
    categories.push('mobile');
  }
  if (lowerDesc.includes('design') || lowerDesc.includes('ui') || lowerDesc.includes('ux')) {
    categories.push('design');
  }
  if (lowerDesc.includes('marketing') || lowerDesc.includes('publicité')) {
    categories.push('marketing');
  }
  if (lowerDesc.includes('ia') || lowerDesc.includes('intelligence')) {
    categories.push('ai');
  }

  return categories.length > 0 ? categories : ['development'];
}

function suggestBudgetRange(description, category) {
  const baseBudgets = {
    'development': [2000, 8000],
    'mobile': [3000, 12000],
    'design': [800, 3000],
    'marketing': [1000, 5000],
    'ai': [5000, 20000]
  };

  const baseRange = baseBudgets[category] || [2000, 6000];
  const complexity = estimateComplexity(description);
  
  // Ajuster selon la complexité
  const multiplier = 0.5 + (complexity / 10) * 1.5; // 0.5x à 2x selon complexité
  
  return {
    min: Math.round(baseRange[0] * multiplier),
    max: Math.round(baseRange[1] * multiplier)
  };
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