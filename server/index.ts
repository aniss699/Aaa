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
    return res.status(400).json({ error: 'Mission non trouvée' });
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

app.post('/api/ai/quick-analysis', async (req, res) => {
  try {
    const { description, title, category } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description requise' });
    }

    // Analyse plus sophistiquée avec calcul de prix
    const words = description.toLowerCase().split(' ');
    const complexity = Math.min(Math.floor(words.length / 10) + 3, 10);
    const qualityScore = Math.min(Math.floor(words.length * 2) + 60, 100);

    // Détection de compétences et calcul de prix basé sur les mots-clés
    const skillPricing = {
      'développement web': { keywords: ['site', 'web', 'react', 'vue', 'angular', 'javascript', 'typescript', 'node', 'php', 'python', 'django', 'flask'], basePrice: 2000, complexity: 0.8 },
      'application mobile': { keywords: ['app', 'mobile', 'ios', 'android', 'flutter', 'react native'], basePrice: 3500, complexity: 1.2 },
      'design graphique': { keywords: ['logo', 'graphique', 'design', 'photoshop', 'illustrator', 'figma', 'ui', 'ux'], basePrice: 800, complexity: 0.6 },
      'marketing digital': { keywords: ['seo', 'adwords', 'facebook', 'instagram', 'social', 'marketing', 'publicité'], basePrice: 1200, complexity: 0.7 },
      'rédaction': { keywords: ['article', 'blog', 'contenu', 'copywriting', 'texte'], basePrice: 500, complexity: 0.4 },
      'e-commerce': { keywords: ['boutique', 'e-commerce', 'vente', 'shop', 'prestashop', 'woocommerce', 'magento'], basePrice: 2500, complexity: 1.0 },
      'intelligence artificielle': { keywords: ['ia', 'machine learning', 'ai', 'chatbot', 'automation', 'data science'], basePrice: 5000, complexity: 1.5 },
      'construction': { keywords: ['maison', 'bâtiment', 'travaux', 'construction', 'rénovation', 'plomberie', 'électricité', 'peinture'], basePrice: 3000, complexity: 1.1 },
      'service à la personne': { keywords: ['aide', 'domicile', 'ménage', 'enfant', 'personne âgée', 'jardinage'], basePrice: 600, complexity: 0.3 },
      'transport': { keywords: ['livraison', 'déménagement', 'transport', 'colis'], basePrice: 400, complexity: 0.3 },
      'création de site web': { keywords: ['création site web', 'site vitrine', 'site institutionnel'], basePrice: 1500, complexity: 0.7 }
    };

    let detectedCategory = 'autre';
    let basePrice = 1000;
    let complexityMultiplier = 0.8;
    const detectedSkills: string[] = [];

    // Analyser le contenu pour détecter la catégorie et calculer le prix
    Object.entries(skillPricing).forEach(([skill, config]) => {
      const matches = config.keywords.filter(keyword => 
        description.toLowerCase().includes(keyword) || 
        (title && title.toLowerCase().includes(keyword))
      );

      if (matches.length > 0) {
        detectedSkills.push(skill);
        if (matches.length > 1) { // Priorité aux catégories avec plus de matches
          detectedCategory = skill;
          basePrice = config.basePrice;
          complexityMultiplier = config.complexity;
        } else if (detectedCategory === 'autre') { // Si aucune catégorie prioritaire trouvée
          detectedCategory = skill;
          basePrice = config.basePrice;
          complexityMultiplier = config.complexity;
        }
      }
    });

    // Calcul intelligent du prix basé sur la complexité et le contenu
    const wordComplexityBonus = Math.min(words.length / 50, 2); // Bonus basé sur la longueur
    const urgencyDetected = /urgent|rapide|vite|asap|pressé|immédiat/i.test(description);
    const urgencyMultiplier = urgencyDetected ? 1.3 : 1;

    const estimatedPrice = Math.round(
      basePrice * complexityMultiplier * (1 + wordComplexityBonus * 0.2) * urgencyMultiplier
    );

    // Fourchette de prix
    const priceRange = {
      min: Math.round(estimatedPrice * 0.7),
      max: Math.round(estimatedPrice * 1.4)
    };

    // Estimation du délai basée sur la complexité
    const estimatedDelay = Math.max(
      Math.round(complexity * complexityMultiplier * 3 + (urgencyDetected ? -2 : 2)),
      3
    );

    // Nombre de prestataires intéressés basé sur la demande
    const demandFactors = {
      'développement web': 45,
      'design graphique': 35,
      'marketing digital': 25,
      'rédaction': 20,
      'application mobile': 30,
      'e-commerce': 40,
      'intelligence artificielle': 15,
      'construction': 30,
      'service à la personne': 20,
      'transport': 15,
      'création de site web': 35
    };

    const estimatedProviders = demandFactors[detectedCategory] || Math.floor(Math.random() * 30) + 15;

    // Génération d'une description optimisée
    let optimizedDescription = description;
    const improvements = [];

    if (!description.toLowerCase().includes('budget') && !description.toLowerCase().includes('€') && !description.toLowerCase().includes('prix')) {
      improvements.push('Précisez votre budget pour attirer des prestataires qualifiés');
      optimizedDescription += `\n\nBudget estimé : ${estimatedPrice}€`;
    }

    if (!description.toLowerCase().includes('délai') && !description.toLowerCase().includes('livraison') && !description.toLowerCase().includes('quand')) {
      improvements.push('Indiquez vos délais pour une meilleure planification');
      optimizedDescription += `\nDélai souhaité : ${estimatedDelay} jours`;
    }

    if (detectedSkills.length > 0 && !description.toLowerCase().includes('compétences') && !description.toLowerCase().includes('technique')) {
      improvements.push('Listez les compétences techniques requises');
      optimizedDescription += `\nCompétences requises : ${detectedSkills.slice(0, 3).join(', ')}`;
    }

    if (detectedCategory !== 'autre' && !description.toLowerCase().includes('catégorie')) {
        improvements.push(`Confirmez la catégorie du projet : ${detectedCategory}`);
    }

    const analysis = {
      qualityScore,
      brief_quality_score: qualityScore,
      detectedSkills,
      estimatedComplexity: complexity,
      price_suggested_med: estimatedPrice,
      price_range_min: priceRange.min,
      price_range_max: priceRange.max,
      delay_suggested_days: estimatedDelay,
      optimizedDescription: optimizedDescription !== description ? optimizedDescription : null,
      improvements,
      market_insights: {
        estimated_providers_interested: estimatedProviders,
        competition_level: estimatedProviders > 30 ? 'forte' : estimatedProviders > 15 ? 'moyenne' : 'faible',
        demand_level: detectedCategory !== 'autre' ? 'forte' : 'moyenne',
        category_detected: detectedCategory,
        urgency_detected: urgencyDetected,
        suggested_budget_range: priceRange
      }
    };

    res.json(analysis);
  } catch (error) {
    console.error('Erreur analyse IA rapide:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse' });
  }
});

// Endpoint pour l'analyse de prix IA
app.post('/api/ai/price-analysis', async (req, res) => {
  try {
    const { category, description, location, complexity, urgency } = req.body;

    // Base de données enrichie des catégories avec métriques de marché
    const categoryMarketData = {
      'developpement': {
        avgBudget: 3500, priceRange: [800, 15000], avgDuration: 21, 
        availableProviders: 850, competitionLevel: 'high',
        seasonalMultiplier: 1.2, urgencyPremium: 0.3,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PHP'],
        demandTrend: 'growing', clientSatisfactionRate: 0.87
      },
      'design': {
        avgBudget: 1500, priceRange: [300, 5000], avgDuration: 14,
        availableProviders: 620, competitionLevel: 'medium',
        seasonalMultiplier: 0.9, urgencyPremium: 0.1,
        skills: ['Figma', 'Photoshop', 'UX/UI', 'Illustrator'],
        demandTrend: 'stable', clientSatisfactionRate: 0.91
      },
      'marketing': {
        avgBudget: 1200, priceRange: [200, 4000], avgDuration: 10,
        availableProviders: 470, competitionLevel: 'medium',
        seasonalMultiplier: 1.1, urgencyPremium: 0.2,
        skills: ['SEO', 'Google Ads', 'Facebook Ads', 'Content'],
        demandTrend: 'growing', clientSatisfactionRate: 0.83
      },
      'travaux': {
        avgBudget: 2800, priceRange: [500, 20000], avgDuration: 28,
        availableProviders: 1200, competitionLevel: 'high',
        seasonalMultiplier: 1.3, urgencyPremium: 0.4,
        skills: ['Plomberie', 'Électricité', 'Peinture', 'Maçonnerie'],
        demandTrend: 'seasonal', clientSatisfactionRate: 0.89
      },
      'services_personne': {
        avgBudget: 800, priceRange: [100, 2000], avgDuration: 7,
        availableProviders: 950, competitionLevel: 'high',
        seasonalMultiplier: 1.0, urgencyPremium: 0.5,
        skills: ['Ménage', 'Garde enfants', 'Aide domicile'],
        demandTrend: 'stable', clientSatisfactionRate: 0.94
      },
      'jardinage': {
        avgBudget: 600, priceRange: [80, 1500], avgDuration: 5,
        availableProviders: 380, competitionLevel: 'medium',
        seasonalMultiplier: 1.8, urgencyPremium: 0.1,
        skills: ['Élagage', 'Tonte', 'Plantation', 'Paysagisme'],
        demandTrend: 'seasonal', clientSatisfactionRate: 0.88
      },
      'transport': {
        avgBudget: 400, priceRange: [50, 1200], avgDuration: 3,
        availableProviders: 320, competitionLevel: 'medium',
        seasonalMultiplier: 1.1, urgencyPremium: 0.6,
        skills: ['Permis B', 'Véhicule utilitaire', 'Manutention'],
        demandTrend: 'stable', clientSatisfactionRate: 0.85
      },
      'beaute_bienetre': {
        avgBudget: 300, priceRange: [30, 800], avgDuration: 4,
        availableProviders: 280, competitionLevel: 'low',
        seasonalMultiplier: 0.8, urgencyPremium: 0.0,
        skills: ['Coiffure', 'Esthétique', 'Massage', 'Manucure'],
        demandTrend: 'stable', clientSatisfactionRate: 0.92
      },
      'services_pro': {
        avgBudget: 2500, priceRange: [500, 10000], avgDuration: 14,
        availableProviders: 420, competitionLevel: 'low',
        seasonalMultiplier: 1.0, urgencyPremium: 0.2,
        skills: ['Comptabilité', 'Juridique', 'Conseil', 'Formation'],
        demandTrend: 'stable', clientSatisfactionRate: 0.90
      },
      'evenementiel': {
        avgBudget: 1800, priceRange: [300, 8000], avgDuration: 21,
        availableProviders: 180, competitionLevel: 'low',
        seasonalMultiplier: 1.5, urgencyPremium: 0.3,
        skills: ['Organisation', 'Traiteur', 'Décoration', 'Animation'],
        demandTrend: 'seasonal', clientSatisfactionRate: 0.86
      },
      'enseignement': {
        avgBudget: 900, priceRange: [200, 3000], avgDuration: 30,
        availableProviders: 650, competitionLevel: 'medium',
        seasonalMultiplier: 1.4, urgencyPremium: 0.1,
        skills: ['Pédagogie', 'Français', 'Mathématiques', 'Langues'],
        demandTrend: 'seasonal', clientSatisfactionRate: 0.91
      },
      'animaux': {
        avgBudget: 250, priceRange: [20, 600], avgDuration: 5,
        availableProviders: 150, competitionLevel: 'low',
        seasonalMultiplier: 1.0, urgencyPremium: 0.4,
        skills: ['Vétérinaire', 'Garde animaux', 'Toilettage', 'Dressage'],
        demandTrend: 'stable', clientSatisfactionRate: 0.93
      }
    };

    const marketData = categoryMarketData[category] || categoryMarketData['developpement'];

    // Calcul de prix intelligent basé sur multiples facteurs
    let baseBudget = marketData.avgBudget;

    // Ajustement complexité (1-10)
    const complexityMultiplier = 0.7 + (complexity * 0.06); // 0.7 à 1.3
    baseBudget *= complexityMultiplier;

    // Ajustement urgence
    const urgencyMultiplier = urgency === 'high' ? (1 + marketData.urgencyPremium) : 
                             urgency === 'medium' ? 1.05 : 1.0;
    baseBudget *= urgencyMultiplier;

    // Ajustement saisonnier
    baseBudget *= marketData.seasonalMultiplier;

    // Calcul du nombre de prestataires potentiellement intéressés
    const descriptionQuality = Math.min(1.0, description.length / 200);
    const budgetAttractiveness = baseBudget > marketData.avgBudget ? 1.2 : 0.8;
    const urgencyFactor = urgency === 'high' ? 0.7 : 1.0; // Moins de prestataires dispo en urgence

    const estimatedInterestedProviders = Math.round(
      marketData.availableProviders * 
      descriptionQuality * 
      budgetAttractiveness * 
      urgencyFactor * 
      0.05 // 5% des prestataires généralement intéressés par une mission
    );

    // Délai suggéré intelligent
    let suggestedDuration = marketData.avgDuration;

    // Ajustement complexité
    suggestedDuration += (complexity - 5) * 2;

    // Ajustement urgence
    if (urgency === 'high') suggestedDuration *= 0.7;
    else if (urgency === 'medium') suggestedDuration *= 0.9;

    suggestedDuration = Math.max(1, Math.round(suggestedDuration));

    const analysis = {
      recommendedBudget: {
        min: Math.round(baseBudget * 0.8),
        optimal: Math.round(baseBudget),
        max: Math.round(baseBudget * 1.3),
        reasoning: `Basé sur ${marketData.avgBudget}€ (moyenne ${category}), ajusté pour complexité (x${complexityMultiplier.toFixed(2)}) et urgence (x${urgencyMultiplier.toFixed(2)})`
      },
      marketInsights: {
        categoryDemand: marketData.demandTrend,
        competitionLevel: marketData.competitionLevel,
        availableProviders: marketData.availableProviders,
        estimatedApplications: estimatedInterestedProviders,
        successRate: marketData.clientSatisfactionRate,
        averageDelay: marketData.avgDuration,
        priceRange: marketData.priceRange
      },
      timeline: {
        suggestedDays: suggestedDuration,
        reasoning: `Durée type ${marketData.avgDuration}j, ajustée pour complexité et urgence`
      },
      providerAvailability: {
        total: marketData.availableProviders,
        estimated_interested: estimatedInterestedProviders,
        competition_level: marketData.competitionLevel,
        advice: marketData.competitionLevel === 'high' ? 
          'Marché très concurrentiel - soyez précis dans vos exigences' :
          'Bonne disponibilité des prestataires'
      },
      optimization_tips: [
        baseBudget > marketData.priceRange[1] * 0.8 ? 
          'Budget attractif - vous devriez recevoir de nombreuses candidatures' :
          'Considérez augmenter le budget pour plus de candidatures',

        urgency === 'high' ? 
          'Mission urgente - préparez-vous à payer une prime d\'urgence de 20-40%' :
          'Délai raisonnable - bonne flexibilité sur le planning',

        `Compétences clés pour cette catégorie: ${marketData.skills.join(', ')}`,

        marketData.seasonalMultiplier > 1.1 ? 
          'Période de forte demande - les prix peuvent être plus élevés' :
          'Période favorable pour négocier les prix'
      ],
      confidence: 0.85
    };

    res.json(analysis);
  } catch (error) {
    console.error('Erreur analyse prix IA:', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse' });
  }
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

// ============ NOUVEAUX ENDPOINTS AMÉLIORATION IA 2.0 ============

// POST /ai/projects/:id/improve - Amélioration complète d'un projet
app.post('/api/ai/projects/:id/improve', async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la mission
    const mission = missions.find(m => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }

    // Appel au service ML d'amélioration
    const mlResponse = await fetch('http://localhost:8001/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project: {
          title: mission.title,
          description: mission.description,
          category: mission.category,
          budget: parseFloat(mission.budget || '0'),
          location: mission.location,
          client_id: mission.clientId
        },
        context: {
          market_heat: 0.7 // Simulation contexte marché
        }
      })
    });

    if (!mlResponse.ok) {
      throw new Error('Service ML indisponible');
    }

    const improvement = await mlResponse.json();

    // Persistance en base (simulation avec stockage en mémoire)
    const standardizationId = `std_${Date.now()}`;
    const standardization = {
      id: standardizationId,
      projectId: id,
      ...improvement,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Stockage simulation (remplacer par vraie DB)
    if (!global.projectStandardizations) {
      global.projectStandardizations = new Map();
    }
    global.projectStandardizations.set(id, standardization);

    res.json({
      success: true,
      standardization,
      improvements: {
        title_diff: mission.title !== improvement.title_std,
        description_diff: mission.description !== improvement.summary_std,
        price_suggestions: {
          min: improvement.price_suggested_min,
          med: improvement.price_suggested_med,
          max: improvement.price_suggested_max,
          current: parseFloat(mission.budget || '0')
        },
        delay_suggestion: improvement.delay_suggested_days,
        loc_improvement: improvement.improvement_potential
      }
    });

  } catch (error) {
    console.error('Erreur amélioration projet:', error);
    res.status(500).json({ error: 'Erreur lors de l\'amélioration du projet' });
  }
});

// GET /ai/projects/:id/preview - Prévisualisation des améliorations
app.get('/api/ai/projects/:id/preview', (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer la mission et sa standardisation
    const mission = missions.find(m => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }

    const standardization = global.projectStandardizations?.get(id);
    if (!standardization) {
      return res.status(404).json({ error: 'Analyse IA non disponible - lancez d\'abord l\'amélioration' });
    }

    // Calcul des différences
    const preview = {
      original: {
        title: mission.title,
        description: mission.description,
        budget: parseFloat(mission.budget || '0'),
        category: mission.category
      },
      improved: {
        title: standardization.title_std,
        description: standardization.summary_std,
        acceptance_criteria: standardization.acceptance_criteria,
        tasks: standardization.tasks_std,
        deliverables: standardization.deliverables_std,
        skills: standardization.skills_std,
        constraints: standardization.constraints_std
      },
      pricing: {
        current: parseFloat(mission.budget || '0'),
        suggested_min: standardization.price_suggested_min,
        suggested_med: standardization.price_suggested_med,
        suggested_max: standardization.price_suggested_max,
        rationale: standardization.price_rationale
      },
      timing: {
        suggested_days: standardization.delay_suggested_days
      },
      quality_scores: {
        brief_quality: standardization.brief_quality_score,
        richness: standardization.richness_score,
        loc_base: standardization.loc_base,
        improvement_potential: standardization.improvement_potential
      },
      missing_info: standardization.missing_info,
      loc_uplift: standardization.loc_uplift_reco,
      recommendations: standardization.loc_recommendations
    };

    res.json(preview);

  } catch (error) {
    console.error('Erreur prévisualisation:', error);
    res.status(500).json({ error: 'Erreur lors de la prévisualisation' });
  }
});

// POST /ai/projects/:id/brief/complete - Compléter les informations manquantes
app.post('/api/ai/projects/:id/brief/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, apply = false } = req.body;

    const mission = missions.find(m => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }

    // Appel au service ML pour recalcul
    const mlResponse = await fetch('http://localhost:8001/brief/recompute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: id,
        answers,
        project_data: {
          title: mission.title,
          description: mission.description,
          category: mission.category,
          budget: parseFloat(mission.budget || '0'),
          location: mission.location
        }
      })
    });

    if (!mlResponse.ok) {
      throw new Error('Service ML indisponible');
    }

    const updatedStandardization = await mlResponse.json();

    // Mise à jour du stockage
    global.projectStandardizations?.set(id, {
      ...global.projectStandardizations.get(id),
      ...updatedStandardization,
      updatedAt: new Date().toISOString()
    });

    // Application automatique si demandée
    if (apply) {
      // Mise à jour de la mission avec les nouvelles données
      const missionIndex = missions.findIndex(m => m.id === id);
      if (missionIndex !== -1) {
        missions[missionIndex] = {
          ...missions[missionIndex],
          description: updatedStandardization.summary_std,
          updatedAt: new Date().toISOString()
        };

        // Log du changement
        if (!global.projectChangeLogs) {
          global.projectChangeLogs = [];
        }
        global.projectChangeLogs.push({
          id: `log_${Date.now()}`,
          projectId: id,
          before: { description: mission.description },
          after: { description: updatedStandardization.summary_std },
          appliedBy: 'system',
          reason: 'Réponses aux questions manquantes intégrées',
          createdAt: new Date().toISOString()
        });
      }
    }

    res.json({
      success: true,
      updated_standardization: updatedStandardization,
      applied: apply
    });

  } catch (error) {
    console.error('Erreur complétion brief:', error);
    res.status(500).json({ error: 'Erreur lors de la complétion du brief' });
  }
});

// POST /ai/projects/:id/apply - Appliquer les suggestions IA
app.post('/api/ai/projects/:id/apply', (req, res) => {
  try {
    const { id } = req.params;
    const { apply_budget, apply_delay, apply_title, apply_summary } = req.body;

    const mission = missions.find(m => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: 'Mission non trouvée' });
    }

    const standardization = global.projectStandardizations?.get(id);
    if (!standardization) {
      return res.status(404).json({ error: 'Standardisation non disponible' });
    }

    const before = { ...mission };
    const changes = {};

    // Application du budget
    if (apply_budget && ['min', 'med', 'max'].includes(apply_budget)) {
      const budgetKey = `price_suggested_${apply_budget}`;
      const newBudget = standardization[budgetKey];
      if (newBudget) {
        mission.budget = newBudget.toString();
        changes.budget = { from: before.budget, to: mission.budget };
      }
    }

    // Application du titre
    if (apply_title && standardization.title_std) {
      mission.title = standardization.title_std;
      changes.title = { from: before.title, to: mission.title };
    }

    // Application du résumé
    if (apply_summary && standardization.summary_std) {
      mission.description = standardization.summary_std;
      changes.description = { from: before.description, to: mission.description };
    }

    mission.updatedAt = new Date().toISOString();

    // Enregistrement du changelog
    if (!global.projectChangeLogs) {
      global.projectChangeLogs = [];
    }

    global.projectChangeLogs.push({
      id: `log_${Date.now()}`,
      projectId: id,
      before,
      after: { ...mission },
      appliedBy: 'user',
      reason: `Application suggestions IA: ${Object.keys(changes).join(', ')}`,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      updated_mission: mission,
      changes_applied: changes,
      changelog_entry: global.projectChangeLogs[global.projectChangeLogs.length - 1]
    });

  } catch (error) {
    console.error('Erreur application suggestions:', error);
    res.status(500).json({ error: 'Erreur lors de l\'application des suggestions' });
  }
});

// GET /projects/:id/changelog - Historique des modifications
app.get('/api/projects/:id/changelog', (req, res) => {
  try {
    const { id } = req.params;

    const changeLogs = global.projectChangeLogs?.filter(log => log.projectId === id) || [];

    res.json({
      project_id: id,
      total_changes: changeLogs.length,
      changes: changeLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });

  } catch (error) {
    console.error('Erreur récupération changelog:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
  }
});

// Endpoint pour l'analyse de brief IA (utilisé dans create-mission.tsx)
app.post('/api/ai/brief-analysis', (req, res) => {
  const { description, category, title } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description requise' });
  }

  const qualityScore = Math.floor(Math.random() * 40) + 60;
  const improvements = [];
  const missingElements = [];

  if (description.length < 100) {
    improvements.push('Développer davantage la description pour plus de clarté');
    missingElements.push('Description trop courte');
  }

  if (!description.includes('budget') && !description.includes('€') && !description.includes('prix')) {
    improvements.push('Mentionner une fourchette budgétaire indicative');
    missingElements.push('Budget non précisé');
  }

  if (!description.includes('délai') && !description.includes('quand')) {
    improvements.push('Préciser les délais souhaités');
    missingElements.push('Délais absents');
  }

  const categorySpecificAnalysis = analyzeCategorySpecific(description, category || 'autre');
  improvements.push(...categorySpecificAnalysis.improvements);
  missingElements.push(...categorySpecificAnalysis.missing);

  const optimizedDescription = generateOptimizedDescription(description, title, categorySpecificAnalysis, category || 'autre');

  const mockAnalysis = {
    qualityScore,
    improvements,
    missingElements,
    technicalComplexity: categorySpecificAnalysis.complexity,
    optimizedDescription,
    marketInsights: {
      competitionLevel: Math.random() > 0.6 ? 'high' : 'medium',
      suggestedBudgetRange: {
        min: 1500,
        max: 3500
      }
    }
  };

  res.json(mockAnalysis);
});

function analyzeCategorySpecific(description, category) {
  const analysis = {
    complexity: 'medium',
    improvements: [],
    missing: [],
    suggestedDeliverables: [],
    isUrgent: false,
    needsDatabase: false,
    hasComplexFeatures: false,
    needsMaintenance: false,
    isRenovation: false,
    needsCertification: false,
    isRecurring: false
  };

  const lowerDesc = description.toLowerCase();

  // Analyse générale
  if (lowerDesc.includes('urgent') || lowerDesc.includes('rapide') || lowerDesc.includes('vite')) {
    analysis.isUrgent = true;
  }
  if (lowerDesc.includes('base de données') || lowerDesc.includes('utilisateur') || lowerDesc.includes('compte')) {
    analysis.needsDatabase = true;
  }
  if (lowerDesc.includes('api') || lowerDesc.includes('intégration') || lowerDesc.includes('complexe')) {
    analysis.hasComplexFeatures = true;
  }
  if (lowerDesc.includes('maintenance') || lowerDesc.includes('support') || lowerDesc.includes('évolution')) {
    analysis.needsMaintenance = true;
  }
  if (lowerDesc.includes('rénovation') || lowerDesc.includes('réhabilitation')) {
    analysis.isRenovation = true;
  }
  if (lowerDesc.includes('norme') || lowerDesc.includes('certification') || lowerDesc.includes('conforme')) {
    analysis.needsCertification = true;
  }
  if (lowerDesc.includes('régulier') || lowerDesc.includes('hebdomadaire') || lowerDesc.includes('mensuel')) {
    analysis.isRecurring = true;
  }

  // Analyse spécifique par catégorie
  const categoryAnalysis = {
    development: () => {
      if (!lowerDesc.match(/(react|vue|angular|php|python|javascript|node|laravel|symfony)/)) {
        analysis.improvements.push("Spécifier les technologies préférées");
        analysis.missing.push("Technologies non mentionnées");
      }
      if (!lowerDesc.includes('api') && !lowerDesc.includes('base de données')) {
        analysis.improvements.push("Préciser les intégrations techniques");
      }
      if (!lowerDesc.includes('responsive') && !lowerDesc.includes('mobile')) {
        analysis.improvements.push("Indiquer si compatibilité mobile requise");
      }
      if (analysis.needsDatabase) {
        analysis.suggestedDeliverables.push('Base de données optimisée');
      }
      if (analysis.hasComplexFeatures) {
        analysis.suggestedDeliverables.push('Documentation API');
      }
      analysis.complexity = 'high';
    },

    mobile: () => {
      if (!lowerDesc.includes('ios') && !lowerDesc.includes('android')) {
        analysis.improvements.push("Préciser les plateformes cibles (iOS/Android)");
        analysis.missing.push("Plateformes non spécifiées");
      }
      if (!lowerDesc.includes('store') && !lowerDesc.includes('publication')) {
        analysis.improvements.push("Indiquer si publication sur stores nécessaire");
      }
      if (analysis.hasComplexFeatures) {
        analysis.suggestedDeliverables.push('Mode hors-ligne');
      }
      analysis.complexity = 'high';
    },

    construction: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Préciser la surface en m²");
        analysis.missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('étage') && !lowerDesc.includes('niveau')) {
        analysis.improvements.push("Indiquer le nombre d'étages");
      }
      if (!lowerDesc.includes('accès') && !lowerDesc.includes('parking')) {
        analysis.improvements.push("Mentionner les contraintes d\'accès");
      }
      if (analysis.isRenovation) {
        analysis.suggestedDeliverables.push('Diagnostic initial');
      }
      if (analysis.needsCertification) {
        analysis.suggestedDeliverables.push('Certificats de conformité');
      }
      analysis.complexity = 'medium';
    },

    plomberie: () => {
      if (!lowerDesc.includes('urgent') && !lowerDesc.includes('délai')) {
        analysis.improvements.push("Préciser l'urgence de l'intervention");
      }
      if (!lowerDesc.includes('étage') && !lowerDesc.includes('niveau')) {
        analysis.improvements.push("Indiquer l'étage de l'intervention");
      }
      analysis.complexity = 'medium';
    },

    electricite: () => {
      if (!lowerDesc.includes('norme') && !lowerDesc.includes('consuel')) {
        analysis.improvements.push("Préciser si mise aux normes nécessaire");
      }
      if (!lowerDesc.includes('tableau') && !lowerDesc.includes('disjoncteur')) {
        analysis.improvements.push("Détailler l'installation électrique existante");
      }
      if (analysis.needsCertification) {
        analysis.suggestedDeliverables.push('Attestation Consuel');
      }
      analysis.complexity = 'medium';
    },

    menage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Préciser la surface du logement");
        analysis.missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('fréquence') && !lowerDesc.includes('semaine')) {
        analysis.improvements.push("Indiquer la fréquence souhaitée");
      }
      if (analysis.isRecurring) {
        analysis.suggestedDeliverables.push('Planning récurrent');
      }
      analysis.complexity = 'low';
    },

    garde_enfants: () => {
      if (!lowerDesc.match(/\d+\s*(?:ans?|années?)/)) {
        analysis.improvements.push("Préciser l'âge des enfants");
        analysis.missing.push("Âge des enfants non précisé");
      }
      if (!lowerDesc.includes('horaire') && !lowerDesc.includes('heure')) {
        analysis.improvements.push("Détailler les horaires de garde");
      }
      analysis.complexity = 'low';
    },

    jardinage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Préciser la surface du jardin");
        analysis.missing.push("Surface non indiquée");
      }
      if (!lowerDesc.includes('tonte') && !lowerDesc.includes('taille') && !lowerDesc.includes('entretien')) {
        analysis.improvements.push("Détailler les travaux de jardinage souhaités");
      }
      analysis.complexity = 'low';
    },

    comptabilite: () => {
      if (!lowerDesc.includes('entreprise') && !lowerDesc.includes('société')) {
        analysis.improvements.push("Préciser le type d'entreprise");
      }
      if (!lowerDesc.includes('mensuel') && !lowerDesc.includes('trimestre') && !lowerDesc.includes('annuel')) {
        analysis.improvements.push("Indiquer la périodicité souhaitée");
      }
      analysis.complexity = 'medium';
    },

    design: () => {
      if (!lowerDesc.includes('logo') && !lowerDesc.includes('identité visuelle')) {
        analysis.improvements.push("Préciser les éléments graphiques souhaités (logo, charte...)");
        analysis.missing.push("Éléments graphiques non spécifiés");
      }
      if (!lowerDesc.includes('responsive') && !lowerDesc.includes('mobile')) {
        analysis.improvements.push("Indiquer si le design doit être responsive");
      }
      analysis.complexity = 'medium';
    },

    marketing: () => {
      if (!lowerDesc.includes('objectif') && !lowerDesc.includes('cible')) {
        analysis.improvements.push("Définir clairement les objectifs marketing");
        analysis.missing.push("Objectifs non définis");
      }
      if (!lowerDesc.includes('budget') && !lowerDesc.includes('investissement')) {
        analysis.improvements.push("Indiquer une enveloppe budgétaire");
      }
      analysis.complexity = 'high';
    },

    ai: () => {
      if (!lowerDesc.includes('modèle') && !lowerDesc.includes('algorithme')) {
        analysis.improvements.push("Spécifier le type de modèle IA ou algorithme souhaité");
        analysis.missing.push("Modèle IA non spécifié");
      }
      if (!lowerDesc.includes('données') && !lowerDesc.includes('dataset')) {
        analysis.improvements.push("Préciser les données d'entraînement disponibles");
      }
      analysis.complexity = 'high';
    },

    services_personne: () => {
      if (!lowerDesc.includes('fréquence') && !lowerDesc.includes('régulier')) {
        analysis.improvements.push("Indiquer la fréquence de la prestation");
      }
      if (!lowerDesc.includes('horaire') && !lowerDesc.includes('disponible')) {
        analysis.improvements.push("Préciser les disponibilités");
      }
      if (analysis.isRecurring) {
        analysis.suggestedDeliverables.push('Planning de service');
      }
      analysis.complexity = 'low';
    }
  };

  const analyzer = categoryAnalysis[category];
  if (analyzer) {
    analyzer();
  }

  return analysis;
}

function generateOptimizedDescription(description, title, analysis, category) {
  const projectTitle = title || generateProjectTitle(description, category);

  const categoryTemplates = {
    'development': generateWebDevOptimizedDescription,
    'mobile': generateMobileDevOptimizedDescription,
    'design': generateDesignOptimizedDescription,
    'marketing': generateMarketingOptimizedDescription,
    'content': generateContentOptimizedDescription,
    'translation': generateTranslationOptimizedDescription,
    'consulting': generateConsultingOptimizedDescription,
    'e-commerce': generateEcommerceOptimizedDescription,
    'construction': generateConstructionOptimizedDescription,
    'renovation': generateRenovationOptimizedDescription,
    'plomberie': generatePlomberieOptimizedDescription,
    'electricite': generateElectriciteOptimizedDescription,
    'peinture': generatePeintureOptimizedDescription,
    'services_personne': generateServicesPersonneOptimizedDescription,
    'ai': generateAIOptimizedDescription,
    'menage': generateMenageOptimizedDescription,
    'garde_enfants': generateGardeEnfantsOptimizedDescription,
    'jardinage': generateJardinageOptimizedDescription,
    'comptabilite': generateComptabiliteOptimizedDescription,
    'travaux': generateConstructionOptimizedDescription, // Alias for construction
    'transport': generateTransportOptimizedDescription,
    'beaute_bienetre': generateBeauteBienEtreOptimizedDescription,
    'services_pro': generateServicesProOptimizedDescription,
    'evenementiel': generateEvenementielOptimizedDescription,
    'enseignement': generateEnseignementOptimizedDescription,
    'animaux': generateAnimauxOptimizedDescription,
  };

  const generator = categoryTemplates[category] || generateGenericOptimizedDescription;
  return generator(description, projectTitle, analysis);
}

function generateProjectTitle(description, category) {
  const categoryTitles = {
    'development': 'Développement de Solution Digitale sur Mesure',
    'mobile': 'Création d\'Application Mobile Performante',
    'design': 'Conception Graphique et Identité Visuelle',
    'marketing': 'Stratégie Marketing Digital & Acquisition Client',
    'content': 'Création de Contenu Professionnel Engageant',
    'translation': 'Service de Traduction Spécialisée',
    'consulting': 'Mission de Conseil Stratégique',
    'e-commerce': 'Développement Boutique en Ligne Optimisée',
    'construction': 'Travaux de Construction et Gros Œuvre',
    'renovation': 'Projet de Rénovation Intérieure/Extérieure',
    'plomberie': 'Intervention Plomberie Urgente ou Planifiée',
    'electricite': 'Installation et Mise aux Normes Électriques',
    'peinture': 'Travaux de Peinture Intérieure et Extérieure',
    'services_personne': 'Prestation de Services à la Personne',
    'ai': 'Projet Intelligence Artificielle & Machine Learning',
    'menage': 'Service de Nettoyage et Entretien',
    'garde_enfants': 'Garde d\'Enfants et Soutien Familial',
    'jardinage': 'Entretien de Jardin et Espaces Verts',
    'comptabilite': 'Expertise Comptable et Fiscale',
    'travaux': 'Travaux de Construction et Rénovation',
    'transport': 'Service de Transport et Déménagement',
    'beaute_bienetre': 'Prestation de Beauté et Bien-être à Domicile',
    'services_pro': 'Conseil et Services aux Professionnels',
    'evenementiel': 'Organisation d\'Événements Sur Mesure',
    'enseignement': 'Soutien Scolaire et Cours Particuliers',
    'animaux': 'Services pour Animaux de Compagnie',
  };

  return categoryTitles[category] || 'Projet Professionnel';
}

function generateWebDevOptimizedDescription(description, title, analysis) {
  const techStack = extractTechFromDescription(description);
  const features = extractFeaturesFromDescription(description);

  return `**${title}**

**Contexte et Objectifs :**
${description.length > 50 ? description : 'Nous cherchons à développer une solution web moderne et performante qui répond parfaitement à nos besoins métier.'}

**Fonctionnalités Attendues :**
${features.length > 0 ? features.map(f => `• ${f}`).join('\n') : `• Interface utilisateur intuitive et responsive
• Backend robuste et sécurisé
• Base de données optimisée
• Panel d\'administration complet`}

**Stack Technique Souhaitée :**
${techStack.length > 0 ? techStack.map(t => `• ${t}`).join('\n') : `• Frontend moderne (React, Vue.js ou Angular)
• Backend performant (Node.js, PHP Laravel ou Python)
• Base de données relationnelle ou NoSQL selon besoins
• Hébergement cloud avec SSL`}

**Livrables Attendus :**
• Code source complet et documenté
• Tests unitaires et d\'intégration
• Documentation technique et utilisateur
• Formation à l\'utilisation
• 3 mois de support technique inclus

**Critères de Sélection :**
• Portfolio avec projets similaires récents
• Maîtrise des technologies requises
• Méthodologie de développement agile
• Communication fluide en français
• Respect des délais et budget

**Budget et Délais :**
• Budget indicatif : À définir selon proposition détaillée
• Délai souhaité : ${analysis.isUrgent ? '2-4 semaines' : '6-8 semaines'}
• Paiement échelonné selon jalons

**Modalités de Candidature :**
Merci de présenter votre approche, exemples de réalisations similaires, planning prévisionnel et devis détaillé.`;
}

function generateMobileDevOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Vision du Projet :**
${description.length > 50 ? description : 'Développement d\'une application mobile native ou hybride avec une expérience utilisateur exceptionnelle.'}

**Plateformes Ciblées :**
• iOS (App Store)
• Android (Google Play)
• ${analysis.hasComplexFeatures ? 'Version web progressive (PWA) en complément' : 'Cross-platform pour optimiser les coûts'}

**Fonctionnalités Clés :**
• Interface utilisateur moderne et intuitive
• Authentification sécurisée
• Notifications push intelligentes
• Mode hors-ligne pour fonctions essentielles
• Synchronisation cloud temps réel
• Analytics et tracking utilisateur

**Exigences Techniques :**
• Performance optimale sur tous appareils
• Compatibilité iOS 13+ et Android 8+
• Conformité aux guidelines Apple et Google
• Architecture scalable et maintenable
• Sécurité renforcée (chiffrement, API)

**Livrables :**
• Applications natives ou hybrides publiées
• Code source avec documentation complète
• Kit de ressources (icônes, assets)
• Guide de maintenance et évolution
• Formation équipe technique

**Profil Recherché :**
• 3+ ans d\'expérience développement mobile
• Portfolio d\'applications publiées sur stores
• Maîtrise React Native, Flutter ou développement natif
• Connaissance UX/UI mobile
• Capacité à gérer publication sur stores

**Timeline et Budget :**
• Phase de conception : 1-2 semaines
• Développement : ${analysis.isUrgent ? '4-6 semaines' : '8-12 semaines'}
• Tests et publication : 1-2 semaines
• Budget : Devis détaillé souhaité avec options`;
}

function generateDesignOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Brief Créatif :**
${description.length > 50 ? description : 'Création d\'une identité visuelle forte et d\'éléments graphiques impactants qui reflètent parfaitement notre vision.'}

**Éléments à Créer :**
• Logo principal et déclinaisons
• Charte graphique complète
• Palette couleurs et typographies
• Templates et supports de communication
• Éléments pour web et print
• ${analysis.hasComplexFeatures ? 'Animation et motion design' : 'Déclinaisons réseaux sociaux'}

**Style et Orientation :**
• Design moderne et intemporel
• Adaptation multi-supports
• Respect des tendances actuelles
• Originalité et mémorabilité
• Cohérence sur tous les supports

**Spécifications Techniques :**
• Fichiers vectoriels haute résolution
• Formats multiples (AI, EPS, PNG, JPG, PDF)
• Versions couleur, noir/blanc, monochrome
• Guide d'utilisation détaillé
• Templates modifiables

**Livrables :**
• Logo final avec déclinaisons
• Charte graphique PDF complète
• Tous fichiers sources modifiables
• Mockups de présentation
• Guide d'application de la marque

**Profil Designer :**
• Portfolio créatif et diversifié
• Maîtrise Suite Adobe (Illustrator, Photoshop, InDesign)
• Expérience en identité visuelle
• Sens artistique développé
• Communication créative fluide

**Process de Collaboration :**
• Briefing créatif détaillé initial
• 3 propositions de concepts différents
• 2-3 phases de révisions incluses
• Validation par étapes
• Livraison finale organisée

**Délais et Budget :**
• Délai souhaité : ${analysis.isUrgent ? '1-2 semaines' : '3-4 semaines'}
• Budget : Merci d\'indiquer vos tarifs selon éléments
• Paiement : 50% à la commande, 50% à la livraison`;
}

function generateMarketingOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte Business :**
${description.length > 50 ? description : 'Nous cherchons à développer notre visibilité digitale et acquérir de nouveaux clients grâce à une stratégie marketing performante.'}

**Objectifs Marketing :**
• Augmenter la visibilité de la marque
• Générer des leads qualifiés
• Améliorer le taux de conversion
• Optimiser le ROI publicitaire
• ${analysis.hasComplexFeatures ? 'Développer la notoriété sectorielle' : 'Fidéliser la clientèle existante'}

**Canaux Prioritaires :**
• Google Ads (Search et Display)
• Facebook et Instagram Ads
• LinkedIn Ads (BtoB)
• SEO et content marketing
• Email marketing
• Influenceurs et partenariats

**Stratégie Attendue :**
• Audit marketing initial complet
• Définition personas et parcours client
• Stratégie de contenu adaptée
• Planning éditorial mensuel
• Campagnes publicitaires optimisées
• Reporting et optimisation continue

**Compétences Requises :**
• Expertise Google Ads et Facebook Business
• Maîtrise des outils analytics
• Connaissance du secteur d\'activité
• Capacités rédactionnelles
• Sens de l\'analyse et optimisation

**Livrables Mensuels :**
• Stratégie marketing documentée
• Campagnes publicitaires opérationnelles
• Contenus créatifs (visuels, textes)
• Rapports de performance détaillés
• Recommandations d\'optimisation

**Budget et Durée :**
• Mission sur ${analysis.isUrgent ? '3-6 mois' : '6-12 mois'}
• Budget publicitaire : À définir séparément
• Honoraires : Forfait mensuel ou commission résultats
• ROI cible : Définition d\'objectifs mesurables

**Modalités de Collaboration :**
• Réunions hebdomadaires de suivi
• Accès outils analytics et plateformes
• Reporting transparent et régulier
• Flexibilité selon évolutions marché`;
}

function generateContentOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Projet Éditorial :**
${description.length > 50 ? description : 'Création de contenus de qualité professionnelle pour développer notre communication et engager notre audience.'}

**Types de Contenus :**
• Articles de blog SEO-optimisés
• Pages web et fiches produits
• Newsletters et emailing
• Contenus réseaux sociaux
• Livres blancs et guides
• ${analysis.hasComplexFeatures ? 'Scripts vidéo et podcasts' : 'Communiqués de presse'}

**Exigences Qualité :**
• Écriture fluide et engageante
• Respect de la ligne éditoriale
• Optimisation SEO native
• Recherche et documentation rigoureuse
• Originalité et valeur ajoutée
• Adaptation aux différents formats

**Spécifications Techniques :**
• Longueur selon brief spécifique
• Intégration mots-clés stratégiques
• Structure H1, H2, H3 optimisée
• Méta-descriptions et titres SEO
• Appels à l\'action pertinents

**Secteur et Ton :**
• Adaptation parfaite à notre secteur
• Ton professionnel mais accessible
• Expertise technique démontrée
• Style cohérent sur tous contenus
• Respect de l\'image de marque

**Livrables :**
• Contenus finalisés et relus
• Optimisation SEO intégrée
• Suggestions visuels et illustrations
• Planning éditorial si récurrent
• Droits de propriété complets

**Profil Rédacteur :**
• Portfolio de contenus similaires
• Maîtrise techniques SEO
• Capacité de recherche documentaire
• Respect strict des délais
• Communication professionnelle

**Organisation :**
• Brief détaillé pour chaque contenu
• 1-2 révisions incluses par contenu
• Délai : ${analysis.isUrgent ? '48-72h par article' : '1 semaine par contenu'}
• Tarification : Au mot ou forfait selon volume`;
}

function generateTranslationOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Projet de Traduction :**
${description.length > 50 ? description : 'Traduction professionnelle de haute qualité respectant le sens, le style et les spécificités culturelles.'}

**Langues de Travail :**
• Langue source : À préciser
• Langue cible : À préciser
• Variantes régionales si nécessaires
• Localisation culturelle adaptée

**Types de Documents :**
• Documents techniques et manuels
• Contenus web et marketing
• Contrats et documents légaux
• Présentations et rapports
• ${analysis.hasComplexFeatures ? 'Logiciels et interfaces' : 'Courriers et communications'}

**Exigences Qualité :**
• Traduction humaine professionnelle
• Respect du registre et du ton
• Adaptation culturelle pertinente
• Cohérence terminologique
• Relecture et correction incluses

**Spécialisations :**
• Domaine d\'expertise requis
• Maîtrise vocabulaire technique
• Connaissance secteur d\'activité
• Normes de qualité ISO 17100
• Confidentialité garantie

**Processus de Travail :**
• Analyse et devis préalables
• Glossaire et guide de style
• Traduction par natif expert
• Relecture par second traducteur
• Livraison dans formats originaux

**Livrables :**
• Documents traduits finalisés
• Glossaire terminologique créé
• Rapport de traduction si souhaité
• Fichiers dans formats demandés
• Support post-livraison

**Délais et Tarification :**
• Délai : ${analysis.isUrgent ? '24-48h urgence' : 'Standard selon volume'}
• Tarification : Au mot ou forfait
• Révisions mineures incluses
• Certification possible si requise

**Modalités :**
• Confidentialité stricte garantie
• Formats acceptés : Word, PDF, Excel, etc.
• Communication directe privilégiée
• Paiement sécurisé échelonné`;
}

function generateConsultingOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte de la Mission :**
${description.length > 50 ? description : 'Nous recherchons un consultant expert pour nous accompagner dans l\'analyse et l\'optimisation de nos processus métier.'}

**Objectifs de Consultation :**
• Diagnostic complet de la situation
• Identification des axes d\'amélioration
• Recommandations stratégiques
• Plan d\'action opérationnel
• ${analysis.hasComplexFeatures ? 'Conduite du changement' : 'Formation des équipes'}

**Domaines d\'Expertise :**
• Stratégie et organisation
• Processus et efficacité opérationnelle
• Transformation digitale
• Management et RH
• Finance et contrôle de gestion

**Méthodologie Attendue :**
• Audit initial approfondi
• Entretiens avec parties prenantes
• Analyse de données et benchmarking
• Ateliers collaboratifs
• Restitution et recommandations

**Livrables Consultants :**
• Rapport de diagnostic détaillé
• Présentation des recommandations
• Plan d\'action priorisé et chiffré
• Outils et méthodologies
• Formation équipes si nécessaire

**Profil Expert :**
• 5+ ans expérience consulting
• Expertise sectorielle démontrée
• Portfolio de missions similaires
• Références clients vérifiables
• Capacité d\'analyse et synthèse

**Modalités d\'Intervention :**
• Mission sur ${analysis.isUrgent ? '2-4 semaines' : '1-3 mois'}
• Interventions sur site et distanciel
• Points d\'avancement réguliers
• Flexibilité selon contraintes terrain

**Budget et Conditions :**
• TJM ou forfait mission selon préférence
• Frais de déplacement si nécessaires
• Confidentialité stricte requise
• Paiement selon jalons définis

**Suivi Post-Mission :**
• Support mise en œuvre recommandations
• Points de suivi à 3 et 6 mois
• Ajustements méthodologies si besoin
• Bilan final et ROI mesuré`;
}

function generateEcommerceOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Vision E-commerce :**
${description.length > 50 ? description : 'Création d\'une boutique en ligne performante et convertissante avec une expérience client exceptionnelle.'}

**Fonctionnalités E-commerce :**
• Catalogue produits avec filtres avancés
• Panier et tunnel de commande optimisé
• Gestion multi-moyens de paiement
• Espace client complet
• Système de reviews et avis
• ${analysis.hasComplexFeatures ? 'Marketplace multi-vendeurs' : 'Programme de fidélité'}

**Intégrations Requises :**
• Passerelles de paiement (Stripe, PayPal)
• Solutions d\'expédition (Colissimo, Chronopost)
• Outils marketing (MailChimp, Google Analytics)
• ERP/CRM si existant
• Réseaux sociaux et comparateurs

**Design et UX :**
• Design responsive mobile-first
• Interface intuitive et moderne
• Optimisation taux de conversion
• Tunnel de commande fluide
• Performance et temps de chargement

**Fonctionnalités Admin :**
• Gestion complète des produits
• Suivi des commandes en temps réel
• Statistiques et reporting avancés
• Gestion des stocks automatisée
• Outils marketing intégrés

**Aspects Techniques :**
• Hébergement haute performance
• Sécurité et certificats SSL
• Sauvegarde automatique
• SEO on-page optimisé
• Conformité RGPD

**Livrables :**
• Boutique e-commerce complète
• Formation administration
• Documentation utilisateur
• 3 mois de support technique
• Garantie de fonctionnement

**Expertise Requise :**
• Portfolio boutiques e-commerce
• Maîtrise Shopify, WooCommerce ou Prestashop
• Connaissance conversion et UX
• Expérience intégrations paiement
• Support et maintenance

**Timeline Projet :**
• Conception et setup : 1-2 semaines
• Développement : ${analysis.isUrgent ? '3-4 semaines' : '6-8 semaines'}  
• Tests et formation : 1 semaine
• Mise en production assistée

**Investissement :**
• Développement : Devis selon fonctionnalités
• Hébergement et licences séparés
• Formation et support inclus
• Options de maintenance disponibles`;
}

function generateConstructionOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description des Travaux :**
${description.length > 50 ? description : 'Réalisation de travaux de construction ou rénovation dans le respect des normes et délais impartis.'}

**Nature des Travaux :**
• Gros œuvre / Second œuvre
• Extension / Surélévation
• Rénovation énergétique
• Aménagement intérieur/extérieur
• Isolation thermique / acoustique
• ${analysis.hasComplexFeatures ? 'Mise en conformité réglementaire' : 'Finitions et décoration'}

**Spécificités du Site :**
• Surface : ${analysis.missing.includes("Surface non indiquée") ? 'À préciser' : description.match(/\d+\s*m[²2]/)?.[0] || 'À préciser'}
• Type de bâtiment : ${analysis.missing.includes("Type de bâtiment non spécifié") ? 'À préciser' : description.match(/^(Maison|Appartement|Immeuble|Local commercial|Bureau)/i)?.[0] || 'À préciser'}
• Accessibilité : ${analysis.missing.includes("Contraintes d'accès non mentionnées") ? 'À préciser' : description.match(/accès|parking|difficile|facile/i)?.[0] || 'À préciser'}
• État actuel : ${analysis.missing.includes("État du bâti non spécifié") ? 'À préciser' : description.match(/bon état|délabré|ancien|neuf/i)?.[0] || 'À préciser'}

**Exigences Techniques :**
• Respect des normes DTU et RT/RE
• Matériaux de qualité et durables
• Savoir-faire artisanal ou technique
• Coordination des corps de métier
• Gestion du chantier et sécurité

**Livrables :**
• Travaux réalisés selon cahier des charges
• Garantie décennale et de parfait achèvement
• Certificats de conformité si requis
• Nettoyage final du chantier
• Factures détaillées et transparentes

**Profil Entreprise :**
• Qualification professionnelle reconnue (Qualibat, RGE...)
• Assurance responsabilité civile et décennale
• Expérience confirmée sur projets similaires
• Références clients disponibles
• Devis gratuit et détaillé

**Planning :**
• Durée estimée : ${analysis.isUrgent ? '2-4 semaines' : '1-3 mois'}
• Début des travaux : Date souhaitée

**Budget :**
• Enveloppe budgétaire indicative : À définir
• Paiement : Acompte, paiements intermédiaires, solde à réception`;
}

function generateRenovationOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte du Projet :**
${description.length > 50 ? description : 'Rénovation complète ou partielle d\'un bien immobilier pour améliorer son confort, sa performance et son esthétique.'}

**Nature de la Rénovation :**
• Rénovation intérieure complète
• Rénovation partielle (cuisine, SDB...)
• Rénovation extérieure (façade, toiture...)
• Optimisation énergétique
• Mise aux normes (électricité, plomberie)
• ${analysis.hasComplexFeatures ? 'Restauration patrimoniale' : 'Amélioration esthétique'}

**Ampleur des Travaux :**
• Surface concernée : ${analysis.missing.includes("Surface non indiquée") ? 'À préciser' : description.match(/\d+\s*m[²2]/)?.[0] || 'À préciser'}
• Nombre de pièces : À préciser
• Travaux spécifiques : ${analysis.suggestedDeliverables.length > 0 ? analysis.suggestedDeliverables.join(', ') : 'À définir'}

**Exigences Techniques :**
• Qualité des matériaux et finitions
• Respect des styles architecturaux
• Performance thermique et acoustique
• Normes de sécurité et accessibilité
• Coordination des artisans

**Livrables :**
• Travaux de rénovation exécutés selon cahier des charges
• Garantie décennale et de parfait achèvement
• Propreté et remise en état des lieux
• Facturation détaillée et transparente

**Profil Artisan/Entreprise :**
• Expérience significative en rénovation
• Portfolio de réalisations variées
• Compétences multi-métiers ou coordination
• Assurance professionnelle valide
• Devis précis et respecté

**Planning et Budget :**
• Durée estimée : ${analysis.isUrgent ? '4-8 semaines' : '2-4 mois'}
• Budget indicatif : À définir selon devis
• Paiement : Acompte, paiements intermédiaires, solde à réception`;
}

function generatePlomberieOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin Urgent/Planifié :**
${analysis.isUrgent ? 'Intervention plomberie urgente nécessaire.' : 'Demande d\'intervention plomberie pour installation ou réparation.'}

**Nature de l\'Intervention :**
• Dépannage (fuite, robinet, WC...)
• Installation (sanitaire, chauffage...)
• Rénovation (réseau, salle de bain...)
• Recherche de fuite
• Débouchage canalisation
• ${analysis.hasComplexFeatures ? 'Mise aux normes installation gaz' : 'Entretien chaudière'}

**Informations Complémentaires :**
• Lieu de l\'intervention : ${description.match(/(\d+\s*(?:rue|avenue|boulevard)\s*[\w\s-]+)/i)?.[1] || 'Adresse à préciser'}
• Étage : ${analysis.missing.includes("Étage non spécifié") ? 'À préciser' : description.match(/(?:au|au\s)(\d+)(?:er|ème)\sétage/i)?.[1] || 'Rez-de-chaussée'}
• Accessibilité : Facile / Difficile
• Contexte : Maison / Appartement / Local commercial

**Exigences Professionnelles :**
• Plombier qualifié et certifié
• Interventions dans le respect des normes
• Utilisation de matériel professionnel
• Diagnostic précis et devis clair
• Garantie sur les travaux effectués

**Livrables :**
• Réparation ou installation fonctionnelle
• Nettoyage de la zone d\'intervention
• Explication des travaux réalisés
• Facture détaillée avec garantie

**Disponibilité et Tarifs :**
• Urgence : Intervention sous 2-4h
• Standard : Sur RDV sous 48h
• Tarifs : Déplacement + Taux horaire / Forfait intervention
• Devis gratuit sur demande`;
}

function generateElectriciteOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature de l\'Intervention :**
${description.length > 50 ? description : 'Installation, modification ou dépannage électrique dans le respect des normes de sécurité.'}

**Type de Prestation :**
• Installation électrique neuve (maison, appartement)
• Rénovation électrique complète
• Modification de tableau électrique
• Installation de prises, interrupteurs
• Dépannage électrique (court-circuit, panne)
• ${analysis.hasComplexFeatures ? 'Installation domotique' : 'Mise en place éclairage'}

**Contexte Technique :**
• Type de bâtiment : Maison / Appartement / Bureau / Local
• Âge de l\'installation : Ancienne / Rénovée / Neuve
• Normes à respecter : NF C 15-100 / Consuel
• Complexité : Faible / Moyenne / Élevée

**Exigences Professionnelles :**
• Électricien habilité et certifié
• Respect strict des normes de sécurité
• Utilisation de matériel homologué
• Diagnostic précis et devis détaillé
• Garantie sur les travaux et le matériel

**Livrables :**
• Installation électrique conforme et fonctionnelle
• Attestation Consuel si nécessaire
• Nettoyage de la zone d\'intervention
• Explication des travaux réalisés
• Facture détaillée

**Disponibilité et Tarifs :**
• Urgence : Intervention rapide
• Standard : Sur rendez-vous
• Tarifs : Déplacement + Taux horaire / Forfait
• Devis gratuit et détaillé`;
}

function generatePeintureOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description des Travaux de Peinture :**
${description.length > 50 ? description : 'Application de peinture de qualité pour embellir et protéger vos murs et boiseries.'}

**Nature des Travaux :**
• Peinture intérieure (murs, plafonds, boiseries)
• Peinture extérieure (façades, volets)
• Rénovation peinture (recouvrement papier peint, lessivage)
• Pose revêtement mural (intissé, toile de verre)
• Travaux de préparation (ponçage, enduit)
• ${analysis.hasComplexFeatures ? 'Effets décoratifs (patine, enduit à la chaux)' : 'Peinture écologique'}

**Informations sur la Surface :**
• Type de surface : Placo / Enduit / Bois / Métal
• Surface à peindre : ${analysis.missing.includes("Surface non indiquée") ? 'À préciser' : description.match(/\d+\s*m[²2]/)?.[0] || 'À préciser'}
• Nombre de pièces/façades : À préciser
• État actuel : Bon état / Travaux de préparation nécessaires

**Exigences Professionnelles :**
• Peintre qualifié et expérimenté
• Utilisation de peintures de qualité et adaptées
• Respect des techniques d\'application
• Soin apporté aux finitions
• Protection du mobilier et des sols
• Nettoyage après travaux

**Livrables :**
• Surfaces peintes uniformément et proprement
• Finitions soignées
• Zone de travail nettoyée
• Facture détaillée

**Disponibilité et Tarifs :**
• Planning : Selon disponibilité et urgence
• Tarifs : Au m² ou forfait par pièce/chantier
• Devis gratuit et détaillé`;
}

function generateServicesPersonneOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Type de Prestation :**
${description.length > 50 ? description : 'Service personnalisé pour répondre à vos besoins quotidiens ou ponctuels.'}

**Domaine de Service :**
• Aide à domicile (ménage, courses, repas)
• Assistance aux personnes âgées ou handicapées
• Soutien scolaire / Aide aux devoirs
• Garde d\'enfants / Baby-sitting
• Jardinage / Petit bricolage
• ${analysis.hasComplexFeatures ? 'Accompagnement administratif' : 'Tâches ménagères'}

**Informations Clés :**
• Fréquence : Quotidienne / Hebdomadaire / Mensuelle / Ponctuelle
• Durée par intervention : À préciser
• Période souhaitée : Matin / Après-midi / Soir / Week-end
• Âge des personnes aidées : ${analysis.missing.includes("Âge des personnes aidées non spécifié") ? 'À préciser' : description.match(/\d+\s*(?:ans?|années?)/i)?.[0] || 'À préciser'}

**Attentes du Prestataire :**
• Ponctualité et fiabilité
• Discrétion et respect de la vie privée
• Bienveillance et patience
• Compétences adaptées au service
• Propreté et soin

**Livrables :**
• Prestation réalisée conformément à la demande
• Retour sur les tâches effectuées
• Respect des horaires convenus

**Modalités :**
• Tarifs : Horaire ou forfait selon prestation
• Possibilité de devis personnalisé
• Assurance responsabilité civile professionnelle
• Déclaration simplifiée CESU possible`;
}

function generateAIOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin en Intelligence Artificielle :**
${description.length > 50 ? description : 'Développement et intégration de solutions basées sur l\'IA pour optimiser vos processus et vos prises de décision.'}

**Domaine d\'Application :**
• Analyse prédictive
• Traitement du langage naturel (NLP)
• Vision par ordinateur
• Machine Learning / Deep Learning
• Chatbots / Assistants virtuels
• Automatisation des tâches
• ${analysis.hasComplexFeatures ? 'Systèmes de recommandation' : 'Optimisation des flux'}

**Objectifs Spécifiques :**
• Améliorer la performance
• Personnaliser l\'expérience client
• Automatiser des tâches répétitives
• Extraire des insights des données
• Prédire des événements futurs
• ${analysis.needsDatabase ? 'Gérer de grands volumes de données' : 'Optimiser l\'utilisation des ressources'}

**Compétences Techniques Requises :**
• Maîtrise Python et librairies IA (TensorFlow, PyTorch, Scikit-learn)
• Connaissance des algorithmes de ML/DL
• Expérience en traitement de données
• Compétences en déploiement de modèles
• Connaissance des API IA

**Livrables Attendus :**
• Modèle IA entraîné et optimisé
• API d\'intégration pour vos systèmes
• Documentation technique et utilisateur
• Métriques de performance et validation
• Support et maintenance

**Planning et Budget :**
• Durée : ${analysis.isUrgent ? '4-8 semaines' : '2-4 mois'}
• Budget : Devis détaillé requis
• Paiement : Selon jalons`;
}

function generateMenageOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature de la Prestation :**
${description.length > 50 ? description : 'Nettoyage et entretien de votre domicile pour un environnement sain et agréable.'}

**Type de Nettoyage :**
• Nettoyage régulier (hebdomadaire, bi-mensuel)
• Nettoyage ponctuel (après travaux, déménagement)
• Grand ménage de printemps
• Nettoyage de vitres
• Entretien des sols et surfaces
• ${analysis.hasComplexFeatures ? 'Nettoyage spécialisé (taches tenaces)' : 'Entretien courant'}

**Informations sur le Logement :**
• Surface approximative : ${analysis.missing.includes("Surface non indiquée") ? 'À préciser' : description.match(/\d+\s*m[²2]/)?.[0] || 'À préciser'}
• Nombre de pièces : À préciser
• Type de logement : Appartement / Maison / Bureau
• Fréquence souhaitée : ${analysis.isRecurring ? analysis.missing.includes("Fréquence non spécifiée") ? 'À préciser' : description.match(/(?:hebdomadaire|bi-mensuel|mensuel|ponctuel)/i)?.[0] || 'À préciser' : 'Ponctuelle'}

**Exigences :**
• Produits d\'entretien écologiques et efficaces
• Matériel professionnel fourni
• Soin et discrétion
• Ponctualité et fiabilité
• Respect de vos consignes

**Livrables :**
• Logement propre et désinfecté
• Surfaces brillantes et sans traces
• Sols impeccables
• Environnement sain et agréable

**Tarifs :**
• Forfait horaire ou forfait par prestation
• Devis gratuit sur demande
• Possibilité d\'intervention rapide`;
}

function generateGardeEnfantsOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Garde d\'Enfants :**
${description.length > 50 ? description : 'Garde d\'enfants fiable et attentionnée pour assurer leur bien-être et leur épanouissement.'}

**Informations sur les Enfants :**
• Âge(s) : ${analysis.missing.includes("Âge des enfants non précisé") ? 'À préciser' : description.match(/\d+\s*(?:ans?|années?)/i)?.[0] || 'À préciser'}
• Nombre d\'enfants : À préciser
• Besoins spécifiques : (Allergies, suivi scolaire, activités...)

**Conditions de Garde :**
• Période : Journée / Soirée / Week-end / Vacances scolaires
• Horaires : ${analysis.missing.includes("Horaires non spécifiés") ? 'À préciser' : description.match(/(\d{1,2}h(?::\d{2})?)\s*(?:à|-)\s*(\d{1,2}h(?::\d{2})?)/i)?.[0] || 'À préciser'}
• Lieu : Domicile des parents / Domicile de la nounou
• Tâches : Jeux, repas, aide aux devoirs, accompagnement activités

**Profil du Gardien/de la Gardienne :**
• Expérience significative avec les enfants
• Qualifications pertinentes (BAFA,PSC1...)
• Bienveillance, patience et dynamisme
• Fiabilité et ponctualité
• Références vérifiables

**Livrables :**
• Enfants en sécurité et bienveillés
• Activités stimulantes et adaptées
• Respect des consignes parentales
• Communication transparente avec les parents

**Tarifs :**
• Taux horaire selon expérience et horaires
• Forfait possible pour garde régulière
• Devis personnalisé sur demande`;
}

function generateJardinageOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature des Travaux de Jardinage :**
${description.length > 50 ? description : 'Entretien et aménagement de votre jardin pour un espace extérieur agréable et bien entretenu.'}

**Prestations Proposées :**
• Tonte de pelouse
• Taille de haies et arbustes
• Désherbage et entretien massifs
• Plantation et entretien fleurs/plantes
• Évacuation des déchets verts
• ${analysis.hasComplexFeatures ? 'Aménagement paysager' : 'Arrosage'}

**Informations sur le Jardin :**
• Surface approximative : ${analysis.missing.includes("Surface non indiquée") ? 'À préciser' : description.match(/\d+\s*m[²2]/)?.[0] || 'À préciser'}
• Type d\'espace : Jardin / Terrasse / Balcon
• Fréquence souhaitée : Ponctuelle / Régulière (hebdomadaire, mensuelle)
• Travaux spécifiques : À définir

**Exigences :**
• Jardinier expérimenté et fiable
• Utilisation de matériel professionnel adapté
• Respect de l\'environnement
• Soin apporté aux végétaux
• Propreté après intervention

**Livrables :**
• Jardin propre, taillé et entretenu
• Pelouse soignée
• Espaces verts désherbés et ordonnés
• Déchets verts évacués

**Tarifs :**
• Taux horaire ou forfait par intervention/surface
• Devis gratuit sur demande
• Tarifs dégressifs pour interventions régulières`;
}

function generateComptabiliteOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin en Expertise Comptable :**
${description.length > 50 ? description : 'Accompagnement professionnel pour la gestion de votre comptabilité et optimisation fiscale.'}

**Nature de la Prestation :**
• Tenue comptable complète
• Révision comptable
• Établissement des comptes annuels
• Déclarations fiscales (TVA, IS...)
• Conseil fiscal et optimisation
• ${analysis.hasComplexFeatures ? 'Audit financier' : 'Paie et gestion sociale'}

**Contexte de l\'Entreprise :**
• Type d\'entreprise : SA / SARL / SAS / Auto-entrepreneur / Association
• Secteur d\'activité : À préciser
• Chiffre d\'affaires annuel : À définir
• Périodicité souhaitée : Mensuelle / Trimestrielle / Annuelle

**Attentes du Client :**
• Fiabilité et rigueur
• Respect des délais réglementaires
• Confidentialité des données
• Conseil personnalisé et réactif
• Optimisation de la charge fiscale

**Livrables :**
• Comptes annuels conformes
• Déclarations fiscales et sociales à jour
• Bilans et comptes de résultat
• Tableaux de bord et indicateurs clés
• Conseils stratégiques

**Profil Expert-Comptable :**
• Diplôme d\'expertise comptable
• Expérience dans votre secteur
• Références clients
• Proximité géographique ou digitale

**Modalités :**
• Contrat de mission adapté
• Tarifs clairs et transparents
• Confidentialité garantie
• Accompagnement personnalisé`;
}

function generateGenericOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description du Projet :**
${description.length > 50 ? description : 'Nous recherchons un professionnel qualifié pour réaliser ce projet avec succès.'}

**Objectifs :**
• Livraison d\'un résultat de haute qualité
• Respect des délais convenus
• Communication transparente tout au long du projet
• ${analysis.hasComplexFeatures ? 'Innovation et créativité' : 'Satisfaction client garantie'}

**Exigences :**
• Expérience prouvée dans le domaine
• Compréhension approfondie du besoin
• Proactivité et réactivité
• Professionnalisme et rigueur

**Livrables Attendus :**
• Produit fini conforme aux attentes
• Documentation complète si nécessaire
• Support post-livraison

**Budget et Délais :**
• Budget : À définir selon proposition
• Délai : ${analysis.isUrgent ? 'Court' : 'Moyen'}

**Pour Postuler :**
Merci de présenter votre expérience et votre approche pour ce projet.`;
}

function extractTechFromDescription(description) {
  const technologies = [];
  const techKeywords = {
    'React': ['react', 'reactjs'],
    'Vue.js': ['vue', 'vuejs', 'vue.js'],
    'Angular': ['angular', 'angularjs'],
    'Node.js': ['node', 'nodejs', 'node.js'],
    'PHP': ['php'],
    'Laravel': ['laravel'],
    'Symfony': ['symfony'],
    'Python': ['python', 'django', 'flask'],
    'WordPress': ['wordpress', 'wp'],
    'Shopify': ['shopify'],
    'Magento': ['magento'],
    'MongoDB': ['mongodb', 'mongo'],
    'MySQL': ['mysql'],
    'PostgreSQL': ['postgresql', 'postgres']
  };

  const descLower = description.toLowerCase();

  for (const [tech, keywords] of Object.entries(techKeywords)) {
    if (keywords.some(keyword => descLower.includes(keyword))) {
      technologies.push(tech);
    }
  }

  return technologies;
}

function extractFeaturesFromDescription(description) {
  const features = [];
  const featureKeywords = [
    'authentification', 'login', 'connexion',
    'paiement', 'payment', 'stripe', 'paypal',
    'recherche', 'search', 'filtre',
    'admin', 'administration', 'gestion',
    'mobile', 'responsive', 'adaptatif',
    'api', 'intégration', 'webhook',
    'chat', 'messaging', 'notification',
    'analytics', 'statistiques', 'tracking'
  ];

  const descLower = description.toLowerCase();

  featureKeywords.forEach(keyword => {
    if (descLower.includes(keyword)) {
      switch(keyword) {
        case 'authentification':
        case 'login':
        case 'connexion':
          if (!features.includes('Système d\'authentification sécurisé'))
            features.push('Système d\'authentification sécurisé');
          break;
        case 'paiement':
        case 'payment':
        case 'stripe':
        case 'paypal':
          if (!features.includes('Intégration paiements en ligne'))
            features.push('Intégration paiements en ligne');
          break;
        case 'recherche':
        case 'search':
        case 'filtre':
          if (!features.includes('Système de recherche avancée'))
            features.push('Système de recherche avancée');
          break;
        case 'admin':
        case 'administration':
        case 'gestion':
          if (!features.includes('Interface d\'administration'))
            features.push('Interface d\'administration');
          break;
        case 'mobile':
        case 'responsive':
        case 'adaptatif':
          if (!features.includes('Design responsive multi-appareils'))
            features.push('Design responsive multi-appareils');
          break;
      }
    }
  });

  return features;
}

// Helper functions for specific categories (placeholder for now)
function generateTransportOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Type de Transport :**
${description.length > 50 ? description : 'Service de transport fiable pour vos besoins logistiques ou personnels.'}

**Nature de la Prestation :**
• Déménagement (particulier, professionnel)
• Livraison de marchandises
• Transport de colis
• Location de véhicule utilitaire avec chauffeur
• Transfert aéroport/gare
• ${analysis.hasComplexFeatures ? 'Transport de matériel spécialisé' : 'Trajet ponctuel'}

**Informations Clés :**
• Origine : À préciser
• Destination : À préciser
• Type de véhicule requis : Camionnette / Camion / Voiture
• Volume / Poids : À estimer
• Urgence : ${analysis.isUrgent ? 'Urgente' : 'Standard'}

**Exigences :**
• Ponctualité et professionnalisme
• Soin dans la manutention
• Respect des délais
• Véhicule adapté et entretenu
• Assurance transport

**Livrables :**
• Objet livré à destination en bon état
• Respect des horaires convenus
• Facture claire

**Tarifs :**
• Devis gratuit sur demande
• Tarification selon distance, volume et urgence`;
}

function generateBeauteBienEtreOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Soins Beauté/Bien-être :**
${description.length > 50 ? description : 'Profitez de prestations de beauté et de bien-être personnalisées à votre domicile.'}

**Type de Prestation :**
• Coiffure (coupe, couleur, brushing)
• Soins esthétiques (manucure, pédicure, épilation)
• Modelage et massage relaxant
• Maquillage professionnel
• ${analysis.hasComplexFeatures ? 'Conseil en image' : 'Soins du visage'}

**Informations sur la Prestation :**
• Lieu : Domicile / Studio
• Période souhaitée : Journée / Soirée / Week-end
• Fréquence : Ponctuelle / Régulière

**Profil du Professionnel :**
• Diplômé(e) et expérimenté(e)
• Matériel professionnel et produits de qualité
• Hygiène et discrétion irréprochables
• Ponctualité et professionnalisme

**Livrables :**
• Résultat conforme aux attentes
• Moment de détente et de bien-être

**Tarifs :**
• Tarifs à la prestation ou forfait
• Devis personnalisé sur demande`;
}

function generateServicesProOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Services Professionnels :**
${description.length > 50 ? description : 'Accompagnement de votre activité professionnelle par des experts dans divers domaines.'}

**Domaine de Service :**
• Conseil juridique / fiscal
• Aide à la création d'entreprise
• Gestion administrative et comptable
• Formation professionnelle
• Développement web / mobile
• ${analysis.hasComplexFeatures ? 'Audit de sécurité' : 'Stratégie commerciale'}

**Objectifs :**
• Optimiser la gestion de votre entreprise
• Améliorer votre performance
• Respecter vos obligations légales
• Développer vos compétences

**Profil du Prestataire :**
• Expertise reconnue dans son domaine
• Expérience significative auprès des entreprises
• Capacité d'analyse et de conseil
• Confidentialité et rigueur

**Livrables :**
• Rapports d\'audit, analyses
• Documents juridiques et fiscaux
• Plans d\'action et recommandations
• Formations adaptées

**Modalités :**
• Devis gratuit sur demande
• Interventions sur site ou à distance
• Confidentialité garantie`;
}

function generateEvenementielOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Organisation d'Événement :**
${description.length > 50 ? description : 'Conception et réalisation d\'événements mémorables et réussis pour vos besoins professionnels ou personnels.'}

**Type d\'Événement :**
• Mariage
• Anniversaire
• Séminaire d'entreprise
• Lancement de produit
• Soirée de gala
• ${analysis.hasComplexFeatures ? 'Festival / Concert' : 'Cocktail'}

**Prestations :**
• Recherche de lieu
• Conception du concept
• Gestion du budget
• Coordination des prestataires (traiteur, DJ, photographe...)
• Décoration et ambiance
• Logistique et accueil

**Exigences :**
• Créativité et sens de l'organisation
• Réactivité et gestion du stress
• Souci du détail
• Respect des délais et du budget

**Livrables :**
• Événement clé en main parfaitement orchestré
• Expérience mémorable pour les participants

**Tarifs :**
• Forfait d'organisation selon l'événement
• Commission sur les prestataires
• Devis personnalisé sur demande`;
}

function generateEnseignementOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Soutien Scolaire/Cours :**
${description.length > 50 ? description : 'Accompagnement pédagogique personnalisé pour favoriser la réussite scolaire et le développement des compétences.'}

**Niveau Concerné :**
• Primaire
• Collège
• Lycée
• Supérieur
• Adulte

**Matières Proposées :**
• Français
• Mathématiques
• Anglais / Autres langues
• Physique-Chimie
• Histoire-Géographie
• ${analysis.hasComplexFeatures ? 'Informatique / Programmation' : 'SVT'}

**Objectifs :**
• Soutien méthodologique
• Consolidation des acquis
• Préparation aux examens
• Approfondissement des connaissances
• Développement de l\'autonomie

**Profil du Formateur :**
• Pédagogue et patient
• Diplômé(e) ou expert(e) dans sa matière
• Expérience dans l\'enseignement / soutien scolaire
• Capacité d\'adaptation

**Livrables :**
• Progression mesurable de l\'apprenant
• Meilleure compréhension des matières
• Confiance en soi renforcée

**Tarifs :**
• Taux horaire selon niveau et matière
• Forfait possible pour stages intensifs
• Devis personnalisé sur demande`;
}

function generateAnimauxOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Service pour Animaux :**
${description.length > 50 ? description : 'Prestations professionnelles et attentionnées pour le bien-être de vos compagnons à quatre pattes.'}

**Type de Service :**
• Garde d'animaux (pension, famille d'accueil)
• Promenade / Lâcher
• Toilettage
• Dressage / Éducation canine
• Visite à domicile
• ${analysis.hasComplexFeatures ? 'Transport d\'animaux' : 'Garde ponctuelle'}

**Informations sur l\'Animal :**
• Espèce : Chien / Chat / Autre
• Race : À préciser
• Âge : À préciser
• Comportement / Besoins spécifiques : (Santé, alimentation, caractère...)

**Exigences :**
• Amour et respect des animaux
• Expérience et compétences adaptées
• Patience et bienveillance
• Fiabilité et ponctualité
• Environnement sécurisé et stimulant

**Livrables :**
• Animal soigné, heureux et en sécurité
• Compte-rendu des activités
• Animal propre et bien présenté (toilettage)

**Tarifs :**
• Tarification à la journée, à la semaine ou à la prestation
• Devis personnalisé sur demande`;
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


// Import advanced AI routes
import { registerAdvancedAIRoutes } from './routes-ai-advanced.js';

// Register advanced AI routes
try {
  await registerAdvancedAIRoutes(app as any);
  console.log('✅ Advanced AI routes registered');
} catch (error) {
  console.warn('⚠️ Advanced AI routes registration failed:', error);
}

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