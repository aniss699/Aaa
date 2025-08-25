// server/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var port = parseInt(process.env.PORT || "5000", 10);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist/public")));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AppelsPro API is running" });
});
var missions = [
  {
    id: "mission1",
    title: "D\xE9veloppement d'une application mobile de e-commerce",
    description: "Je recherche un d\xE9veloppeur exp\xE9riment\xE9 pour cr\xE9er une application mobile compl\xE8te de vente en ligne avec syst\xE8me de paiement int\xE9gr\xE9.",
    category: "developpement",
    budget: "5000",
    location: "Paris, France",
    clientId: "client1",
    clientName: "Marie Dubois",
    status: "open",
    createdAt: (/* @__PURE__ */ new Date("2024-01-15")).toISOString(),
    bids: []
  }
  // ... autres missions
];
app.get("/api/missions", (req, res) => {
  res.json(missions);
});
app.post("/api/missions", (req, res) => {
  const { title, description, category, budget, location, clientId, clientName } = req.body;
  if (!title || !description || !category || !budget || !clientId || !clientName) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }
  const newMission = {
    id: `mission_${Date.now()}`,
    title,
    description,
    category,
    budget,
    location: location || "Non sp\xE9cifi\xE9",
    clientId,
    clientName,
    status: "open",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    bids: []
  };
  missions.push(newMission);
  res.status(201).json(newMission);
});
app.get("/api/missions/:id", (req, res) => {
  const { id } = req.params;
  const mission = missions.find((m) => m.id === id);
  if (!mission) {
    return res.status(400).json({ error: "Mission non trouv\xE9e" });
  }
  res.json(mission);
});
app.get("/api/missions-demo", (req, res) => {
  const demoMissions = [
    {
      id: "mission1",
      title: "D\xE9veloppement d'une application mobile de e-commerce",
      description: "Je recherche un d\xE9veloppeur exp\xE9riment\xE9 pour cr\xE9er une application mobile compl\xE8te de vente en ligne avec syst\xE8me de paiement int\xE9gr\xE9.",
      category: "developpement",
      budget: "5000",
      location: "Paris, France",
      clientId: "client1",
      clientName: "Marie Dubois",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-15")).toISOString(),
      bids: []
    },
    {
      id: "mission2",
      title: "Refonte compl\xE8te du site web d'entreprise",
      description: "Modernisation du site vitrine de notre entreprise avec nouveau design responsive et optimisation SEO.",
      category: "design",
      budget: "3000",
      location: "Lyon, France",
      clientId: "client2",
      clientName: "Pierre Martin",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-18")).toISOString(),
      bids: []
    },
    {
      id: "mission3",
      title: "Campagne marketing digital et r\xE9seaux sociaux",
      description: "Lancement d'une campagne compl\xE8te sur les r\xE9seaux sociaux pour augmenter la notori\xE9t\xE9 de notre marque.",
      category: "marketing",
      budget: "2000",
      location: "Marseille, France",
      clientId: "client3",
      clientName: "Sophie Leclerc",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-20")).toISOString(),
      bids: []
    },
    {
      id: "mission4",
      title: "D\xE9veloppement d'une plateforme SaaS",
      description: "Cr\xE9ation d'une plateforme SaaS compl\xE8te avec tableau de bord, API, authentification et facturation.",
      category: "developpement",
      budget: "15000",
      location: "Remote",
      clientId: "client4",
      clientName: "Tech Startup",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-22")).toISOString(),
      bids: []
    },
    {
      id: "mission5",
      title: "Application mobile React Native",
      description: "D\xE9veloppement d'une application mobile cross-platform avec React Native pour la gestion de t\xE2ches.",
      category: "mobile",
      budget: "8000",
      location: "Lille, France",
      clientId: "client5",
      clientName: "Productivity Corp",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-25")).toISOString(),
      bids: []
    },
    {
      id: "mission6",
      title: "Int\xE9gration IA et Machine Learning",
      description: "Int\xE9gration d'intelligence artificielle dans une plateforme existante pour l'analyse pr\xE9dictive.",
      category: "ai",
      budget: "12000",
      location: "Paris, France",
      clientId: "client6",
      clientName: "AI Solutions",
      status: "open",
      createdAt: (/* @__PURE__ */ new Date("2024-01-28")).toISOString(),
      bids: []
    }
  ];
  res.json(demoMissions);
});
app.post("/api/ai/quick-analysis", async (req, res) => {
  try {
    const { description, title, category } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description requise" });
    }
    const words = description.toLowerCase().split(" ");
    const complexity = Math.min(Math.floor(words.length / 10) + 3, 10);
    const qualityScore = Math.min(Math.floor(words.length * 2) + 60, 100);
    const skillPricing = {
      "d\xE9veloppement web": { keywords: ["site", "web", "react", "vue", "angular", "javascript", "typescript", "node", "php", "python", "django", "flask"], basePrice: 2e3, complexity: 0.8 },
      "application mobile": { keywords: ["app", "mobile", "ios", "android", "flutter", "react native"], basePrice: 3500, complexity: 1.2 },
      "design graphique": { keywords: ["logo", "graphique", "design", "photoshop", "illustrator", "figma", "ui", "ux"], basePrice: 800, complexity: 0.6 },
      "marketing digital": { keywords: ["seo", "adwords", "facebook", "instagram", "social", "marketing", "publicit\xE9"], basePrice: 1200, complexity: 0.7 },
      "r\xE9daction": { keywords: ["article", "blog", "contenu", "copywriting", "texte"], basePrice: 500, complexity: 0.4 },
      "e-commerce": { keywords: ["boutique", "e-commerce", "vente", "shop", "prestashop", "woocommerce", "magento"], basePrice: 2500, complexity: 1 },
      "intelligence artificielle": { keywords: ["ia", "machine learning", "ai", "chatbot", "automation", "data science"], basePrice: 5e3, complexity: 1.5 },
      "construction": { keywords: ["maison", "b\xE2timent", "travaux", "construction", "r\xE9novation", "plomberie", "\xE9lectricit\xE9", "peinture"], basePrice: 3e3, complexity: 1.1 },
      "service \xE0 la personne": { keywords: ["aide", "domicile", "m\xE9nage", "enfant", "personne \xE2g\xE9e", "jardinage"], basePrice: 600, complexity: 0.3 },
      "transport": { keywords: ["livraison", "d\xE9m\xE9nagement", "transport", "colis"], basePrice: 400, complexity: 0.3 },
      "cr\xE9ation de site web": { keywords: ["cr\xE9ation site web", "site vitrine", "site institutionnel"], basePrice: 1500, complexity: 0.7 }
    };
    let detectedCategory = "autre";
    let basePrice = 1e3;
    let complexityMultiplier = 0.8;
    const detectedSkills = [];
    Object.entries(skillPricing).forEach(([skill, config]) => {
      const matches = config.keywords.filter(
        (keyword) => description.toLowerCase().includes(keyword) || title && title.toLowerCase().includes(keyword)
      );
      if (matches.length > 0) {
        detectedSkills.push(skill);
        if (matches.length > 1) {
          detectedCategory = skill;
          basePrice = config.basePrice;
          complexityMultiplier = config.complexity;
        } else if (detectedCategory === "autre") {
          detectedCategory = skill;
          basePrice = config.basePrice;
          complexityMultiplier = config.complexity;
        }
      }
    });
    const wordComplexityBonus = Math.min(words.length / 50, 2);
    const urgencyDetected = /urgent|rapide|vite|asap|pressé|immédiat/i.test(description);
    const urgencyMultiplier = urgencyDetected ? 1.3 : 1;
    const estimatedPrice = Math.round(
      basePrice * complexityMultiplier * (1 + wordComplexityBonus * 0.2) * urgencyMultiplier
    );
    const priceRange = {
      min: Math.round(estimatedPrice * 0.7),
      max: Math.round(estimatedPrice * 1.4)
    };
    const estimatedDelay = Math.max(
      Math.round(complexity * complexityMultiplier * 3 + (urgencyDetected ? -2 : 2)),
      3
    );
    const demandFactors = {
      "d\xE9veloppement web": 45,
      "design graphique": 35,
      "marketing digital": 25,
      "r\xE9daction": 20,
      "application mobile": 30,
      "e-commerce": 40,
      "intelligence artificielle": 15,
      "construction": 30,
      "service \xE0 la personne": 20,
      "transport": 15,
      "cr\xE9ation de site web": 35
    };
    const estimatedProviders = demandFactors[detectedCategory] || Math.floor(Math.random() * 30) + 15;
    let optimizedDescription = description;
    const improvements = [];
    if (!description.toLowerCase().includes("budget") && !description.toLowerCase().includes("\u20AC") && !description.toLowerCase().includes("prix")) {
      improvements.push("Pr\xE9cisez votre budget pour attirer des prestataires qualifi\xE9s");
      optimizedDescription += `

Budget estim\xE9 : ${estimatedPrice}\u20AC`;
    }
    if (!description.toLowerCase().includes("d\xE9lai") && !description.toLowerCase().includes("livraison") && !description.toLowerCase().includes("quand")) {
      improvements.push("Indiquez vos d\xE9lais pour une meilleure planification");
      optimizedDescription += `
D\xE9lai souhait\xE9 : ${estimatedDelay} jours`;
    }
    if (detectedSkills.length > 0 && !description.toLowerCase().includes("comp\xE9tences") && !description.toLowerCase().includes("technique")) {
      improvements.push("Listez les comp\xE9tences techniques requises");
      optimizedDescription += `
Comp\xE9tences requises : ${detectedSkills.slice(0, 3).join(", ")}`;
    }
    if (detectedCategory !== "autre" && !description.toLowerCase().includes("cat\xE9gorie")) {
      improvements.push(`Confirmez la cat\xE9gorie du projet : ${detectedCategory}`);
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
        competition_level: estimatedProviders > 30 ? "forte" : estimatedProviders > 15 ? "moyenne" : "faible",
        demand_level: detectedCategory !== "autre" ? "forte" : "moyenne",
        category_detected: detectedCategory,
        urgency_detected: urgencyDetected,
        suggested_budget_range: priceRange
      }
    };
    res.json(analysis);
  } catch (error) {
    console.error("Erreur analyse IA rapide:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
});
app.post("/api/ai/price-analysis", async (req, res) => {
  try {
    const { category, description, location, complexity, urgency } = req.body;
    const categoryMarketData = {
      "developpement": {
        avgBudget: 3500,
        priceRange: [800, 15e3],
        avgDuration: 21,
        availableProviders: 850,
        competitionLevel: "high",
        seasonalMultiplier: 1.2,
        urgencyPremium: 0.3,
        skills: ["JavaScript", "React", "Node.js", "Python", "PHP"],
        demandTrend: "growing",
        clientSatisfactionRate: 0.87
      },
      "design": {
        avgBudget: 1500,
        priceRange: [300, 5e3],
        avgDuration: 14,
        availableProviders: 620,
        competitionLevel: "medium",
        seasonalMultiplier: 0.9,
        urgencyPremium: 0.1,
        skills: ["Figma", "Photoshop", "UX/UI", "Illustrator"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.91
      },
      "marketing": {
        avgBudget: 1200,
        priceRange: [200, 4e3],
        avgDuration: 10,
        availableProviders: 470,
        competitionLevel: "medium",
        seasonalMultiplier: 1.1,
        urgencyPremium: 0.2,
        skills: ["SEO", "Google Ads", "Facebook Ads", "Content"],
        demandTrend: "growing",
        clientSatisfactionRate: 0.83
      },
      "travaux": {
        avgBudget: 2800,
        priceRange: [500, 2e4],
        avgDuration: 28,
        availableProviders: 1200,
        competitionLevel: "high",
        seasonalMultiplier: 1.3,
        urgencyPremium: 0.4,
        skills: ["Plomberie", "\xC9lectricit\xE9", "Peinture", "Ma\xE7onnerie"],
        demandTrend: "seasonal",
        clientSatisfactionRate: 0.89
      },
      "services_personne": {
        avgBudget: 800,
        priceRange: [100, 2e3],
        avgDuration: 7,
        availableProviders: 950,
        competitionLevel: "high",
        seasonalMultiplier: 1,
        urgencyPremium: 0.5,
        skills: ["M\xE9nage", "Garde enfants", "Aide domicile"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.94
      },
      "jardinage": {
        avgBudget: 600,
        priceRange: [80, 1500],
        avgDuration: 5,
        availableProviders: 380,
        competitionLevel: "medium",
        seasonalMultiplier: 1.8,
        urgencyPremium: 0.1,
        skills: ["\xC9lagage", "Tonte", "Plantation", "Paysagisme"],
        demandTrend: "seasonal",
        clientSatisfactionRate: 0.88
      },
      "transport": {
        avgBudget: 400,
        priceRange: [50, 1200],
        avgDuration: 3,
        availableProviders: 320,
        competitionLevel: "medium",
        seasonalMultiplier: 1.1,
        urgencyPremium: 0.6,
        skills: ["Permis B", "V\xE9hicule utilitaire", "Manutention"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.85
      },
      "beaute_bienetre": {
        avgBudget: 300,
        priceRange: [30, 800],
        avgDuration: 4,
        availableProviders: 280,
        competitionLevel: "low",
        seasonalMultiplier: 0.8,
        urgencyPremium: 0,
        skills: ["Coiffure", "Esth\xE9tique", "Massage", "Manucure"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.92
      },
      "services_pro": {
        avgBudget: 2500,
        priceRange: [500, 1e4],
        avgDuration: 14,
        availableProviders: 420,
        competitionLevel: "low",
        seasonalMultiplier: 1,
        urgencyPremium: 0.2,
        skills: ["Comptabilit\xE9", "Juridique", "Conseil", "Formation"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.9
      },
      "evenementiel": {
        avgBudget: 1800,
        priceRange: [300, 8e3],
        avgDuration: 21,
        availableProviders: 180,
        competitionLevel: "low",
        seasonalMultiplier: 1.5,
        urgencyPremium: 0.3,
        skills: ["Organisation", "Traiteur", "D\xE9coration", "Animation"],
        demandTrend: "seasonal",
        clientSatisfactionRate: 0.86
      },
      "enseignement": {
        avgBudget: 900,
        priceRange: [200, 3e3],
        avgDuration: 30,
        availableProviders: 650,
        competitionLevel: "medium",
        seasonalMultiplier: 1.4,
        urgencyPremium: 0.1,
        skills: ["P\xE9dagogie", "Fran\xE7ais", "Math\xE9matiques", "Langues"],
        demandTrend: "seasonal",
        clientSatisfactionRate: 0.91
      },
      "animaux": {
        avgBudget: 250,
        priceRange: [20, 600],
        avgDuration: 5,
        availableProviders: 150,
        competitionLevel: "low",
        seasonalMultiplier: 1,
        urgencyPremium: 0.4,
        skills: ["V\xE9t\xE9rinaire", "Garde animaux", "Toilettage", "Dressage"],
        demandTrend: "stable",
        clientSatisfactionRate: 0.93
      }
    };
    const marketData = categoryMarketData[category] || categoryMarketData["developpement"];
    let baseBudget = marketData.avgBudget;
    const complexityMultiplier = 0.7 + complexity * 0.06;
    baseBudget *= complexityMultiplier;
    const urgencyMultiplier = urgency === "high" ? 1 + marketData.urgencyPremium : urgency === "medium" ? 1.05 : 1;
    baseBudget *= urgencyMultiplier;
    baseBudget *= marketData.seasonalMultiplier;
    const descriptionQuality = Math.min(1, description.length / 200);
    const budgetAttractiveness = baseBudget > marketData.avgBudget ? 1.2 : 0.8;
    const urgencyFactor = urgency === "high" ? 0.7 : 1;
    const estimatedInterestedProviders = Math.round(
      marketData.availableProviders * descriptionQuality * budgetAttractiveness * urgencyFactor * 0.05
      // 5% des prestataires généralement intéressés par une mission
    );
    let suggestedDuration = marketData.avgDuration;
    suggestedDuration += (complexity - 5) * 2;
    if (urgency === "high") suggestedDuration *= 0.7;
    else if (urgency === "medium") suggestedDuration *= 0.9;
    suggestedDuration = Math.max(1, Math.round(suggestedDuration));
    const analysis = {
      recommendedBudget: {
        min: Math.round(baseBudget * 0.8),
        optimal: Math.round(baseBudget),
        max: Math.round(baseBudget * 1.3),
        reasoning: `Bas\xE9 sur ${marketData.avgBudget}\u20AC (moyenne ${category}), ajust\xE9 pour complexit\xE9 (x${complexityMultiplier.toFixed(2)}) et urgence (x${urgencyMultiplier.toFixed(2)})`
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
        reasoning: `Dur\xE9e type ${marketData.avgDuration}j, ajust\xE9e pour complexit\xE9 et urgence`
      },
      providerAvailability: {
        total: marketData.availableProviders,
        estimated_interested: estimatedInterestedProviders,
        competition_level: marketData.competitionLevel,
        advice: marketData.competitionLevel === "high" ? "March\xE9 tr\xE8s concurrentiel - soyez pr\xE9cis dans vos exigences" : "Bonne disponibilit\xE9 des prestataires"
      },
      optimization_tips: [
        baseBudget > marketData.priceRange[1] * 0.8 ? "Budget attractif - vous devriez recevoir de nombreuses candidatures" : "Consid\xE9rez augmenter le budget pour plus de candidatures",
        urgency === "high" ? "Mission urgente - pr\xE9parez-vous \xE0 payer une prime d'urgence de 20-40%" : "D\xE9lai raisonnable - bonne flexibilit\xE9 sur le planning",
        `Comp\xE9tences cl\xE9s pour cette cat\xE9gorie: ${marketData.skills.join(", ")}`,
        marketData.seasonalMultiplier > 1.1 ? "P\xE9riode de forte demande - les prix peuvent \xEAtre plus \xE9lev\xE9s" : "P\xE9riode favorable pour n\xE9gocier les prix"
      ],
      confidence: 0.85
    };
    res.json(analysis);
  } catch (error) {
    console.error("Erreur analyse prix IA:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse" });
  }
});
app.post("/api/ai/optimize-brief", (req, res) => {
  const { description } = req.body;
  const optimizedBrief = {
    optimizedDescription: `${description}

[Optimis\xE9 par IA] Objectifs clairs, fonctionnalit\xE9s d\xE9taill\xE9es, contraintes techniques sp\xE9cifi\xE9es.`,
    improvements: [
      "Structure am\xE9lior\xE9e",
      "D\xE9tails techniques ajout\xE9s",
      "Crit\xE8res de succ\xE8s d\xE9finis"
    ],
    qualityScore: Math.floor(Math.random() * 30) + 70
  };
  res.json(optimizedBrief);
});
app.post("/api/ai/projects/:id/improve", async (req, res) => {
  try {
    const { id } = req.params;
    const mission = missions.find((m) => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: "Mission non trouv\xE9e" });
    }
    const mlResponse = await fetch("http://localhost:8001/improve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: {
          title: mission.title,
          description: mission.description,
          category: mission.category,
          budget: parseFloat(mission.budget || "0"),
          location: mission.location,
          client_id: mission.clientId
        },
        context: {
          market_heat: 0.7
          // Simulation contexte marché
        }
      })
    });
    if (!mlResponse.ok) {
      throw new Error("Service ML indisponible");
    }
    const improvement = await mlResponse.json();
    const standardizationId = `std_${Date.now()}`;
    const standardization = {
      id: standardizationId,
      projectId: id,
      ...improvement,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!global.projectStandardizations) {
      global.projectStandardizations = /* @__PURE__ */ new Map();
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
          current: parseFloat(mission.budget || "0")
        },
        delay_suggestion: improvement.delay_suggested_days,
        loc_improvement: improvement.improvement_potential
      }
    });
  } catch (error) {
    console.error("Erreur am\xE9lioration projet:", error);
    res.status(500).json({ error: "Erreur lors de l'am\xE9lioration du projet" });
  }
});
app.get("/api/ai/projects/:id/preview", (req, res) => {
  try {
    const { id } = req.params;
    const mission = missions.find((m) => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: "Mission non trouv\xE9e" });
    }
    const standardization = global.projectStandardizations?.get(id);
    if (!standardization) {
      return res.status(404).json({ error: "Analyse IA non disponible - lancez d'abord l'am\xE9lioration" });
    }
    const preview = {
      original: {
        title: mission.title,
        description: mission.description,
        budget: parseFloat(mission.budget || "0"),
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
        current: parseFloat(mission.budget || "0"),
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
    console.error("Erreur pr\xE9visualisation:", error);
    res.status(500).json({ error: "Erreur lors de la pr\xE9visualisation" });
  }
});
app.post("/api/ai/projects/:id/brief/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, apply = false } = req.body;
    const mission = missions.find((m) => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: "Mission non trouv\xE9e" });
    }
    const mlResponse = await fetch("http://localhost:8001/brief/recompute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: id,
        answers,
        project_data: {
          title: mission.title,
          description: mission.description,
          category: mission.category,
          budget: parseFloat(mission.budget || "0"),
          location: mission.location
        }
      })
    });
    if (!mlResponse.ok) {
      throw new Error("Service ML indisponible");
    }
    const updatedStandardization = await mlResponse.json();
    global.projectStandardizations?.set(id, {
      ...global.projectStandardizations.get(id),
      ...updatedStandardization,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (apply) {
      const missionIndex = missions.findIndex((m) => m.id === id);
      if (missionIndex !== -1) {
        missions[missionIndex] = {
          ...missions[missionIndex],
          description: updatedStandardization.summary_std,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        if (!global.projectChangeLogs) {
          global.projectChangeLogs = [];
        }
        global.projectChangeLogs.push({
          id: `log_${Date.now()}`,
          projectId: id,
          before: { description: mission.description },
          after: { description: updatedStandardization.summary_std },
          appliedBy: "system",
          reason: "R\xE9ponses aux questions manquantes int\xE9gr\xE9es",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    res.json({
      success: true,
      updated_standardization: updatedStandardization,
      applied: apply
    });
  } catch (error) {
    console.error("Erreur compl\xE9tion brief:", error);
    res.status(500).json({ error: "Erreur lors de la compl\xE9tion du brief" });
  }
});
app.post("/api/ai/projects/:id/apply", (req, res) => {
  try {
    const { id } = req.params;
    const { apply_budget, apply_delay, apply_title, apply_summary } = req.body;
    const mission = missions.find((m) => m.id === id);
    if (!mission) {
      return res.status(404).json({ error: "Mission non trouv\xE9e" });
    }
    const standardization = global.projectStandardizations?.get(id);
    if (!standardization) {
      return res.status(404).json({ error: "Standardisation non disponible" });
    }
    const before = { ...mission };
    const changes = {};
    if (apply_budget && ["min", "med", "max"].includes(apply_budget)) {
      const budgetKey = `price_suggested_${apply_budget}`;
      const newBudget = standardization[budgetKey];
      if (newBudget) {
        mission.budget = newBudget.toString();
        changes.budget = { from: before.budget, to: mission.budget };
      }
    }
    if (apply_title && standardization.title_std) {
      mission.title = standardization.title_std;
      changes.title = { from: before.title, to: mission.title };
    }
    if (apply_summary && standardization.summary_std) {
      mission.description = standardization.summary_std;
      changes.description = { from: before.description, to: mission.description };
    }
    mission.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!global.projectChangeLogs) {
      global.projectChangeLogs = [];
    }
    global.projectChangeLogs.push({
      id: `log_${Date.now()}`,
      projectId: id,
      before,
      after: { ...mission },
      appliedBy: "user",
      reason: `Application suggestions IA: ${Object.keys(changes).join(", ")}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({
      success: true,
      updated_mission: mission,
      changes_applied: changes,
      changelog_entry: global.projectChangeLogs[global.projectChangeLogs.length - 1]
    });
  } catch (error) {
    console.error("Erreur application suggestions:", error);
    res.status(500).json({ error: "Erreur lors de l'application des suggestions" });
  }
});
app.get("/api/projects/:id/changelog", (req, res) => {
  try {
    const { id } = req.params;
    const changeLogs = global.projectChangeLogs?.filter((log) => log.projectId === id) || [];
    res.json({
      project_id: id,
      total_changes: changeLogs.length,
      changes: changeLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error) {
    console.error("Erreur r\xE9cup\xE9ration changelog:", error);
    res.status(500).json({ error: "Erreur lors de la r\xE9cup\xE9ration de l'historique" });
  }
});
app.post("/api/ai/brief-analysis", (req, res) => {
  const { description, category, title } = req.body;
  if (!description) {
    return res.status(400).json({ error: "Description requise" });
  }
  const qualityScore = Math.floor(Math.random() * 40) + 60;
  const improvements = [];
  const missingElements = [];
  if (description.length < 100) {
    improvements.push("D\xE9velopper davantage la description pour plus de clart\xE9");
    missingElements.push("Description trop courte");
  }
  if (!description.includes("budget") && !description.includes("\u20AC") && !description.includes("prix")) {
    improvements.push("Mentionner une fourchette budg\xE9taire indicative");
    missingElements.push("Budget non pr\xE9cis\xE9");
  }
  if (!description.includes("d\xE9lai") && !description.includes("quand")) {
    improvements.push("Pr\xE9ciser les d\xE9lais souhait\xE9s");
    missingElements.push("D\xE9lais absents");
  }
  const categorySpecificAnalysis = analyzeCategorySpecific(description, category || "autre");
  improvements.push(...categorySpecificAnalysis.improvements);
  missingElements.push(...categorySpecificAnalysis.missing);
  const optimizedDescription = generateOptimizedDescription(description, title, categorySpecificAnalysis, category || "autre");
  const mockAnalysis = {
    qualityScore,
    improvements,
    missingElements,
    technicalComplexity: categorySpecificAnalysis.complexity,
    optimizedDescription,
    marketInsights: {
      competitionLevel: Math.random() > 0.6 ? "high" : "medium",
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
    complexity: "medium",
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
  if (lowerDesc.includes("urgent") || lowerDesc.includes("rapide") || lowerDesc.includes("vite")) {
    analysis.isUrgent = true;
  }
  if (lowerDesc.includes("base de donn\xE9es") || lowerDesc.includes("utilisateur") || lowerDesc.includes("compte")) {
    analysis.needsDatabase = true;
  }
  if (lowerDesc.includes("api") || lowerDesc.includes("int\xE9gration") || lowerDesc.includes("complexe")) {
    analysis.hasComplexFeatures = true;
  }
  if (lowerDesc.includes("maintenance") || lowerDesc.includes("support") || lowerDesc.includes("\xE9volution")) {
    analysis.needsMaintenance = true;
  }
  if (lowerDesc.includes("r\xE9novation") || lowerDesc.includes("r\xE9habilitation")) {
    analysis.isRenovation = true;
  }
  if (lowerDesc.includes("norme") || lowerDesc.includes("certification") || lowerDesc.includes("conforme")) {
    analysis.needsCertification = true;
  }
  if (lowerDesc.includes("r\xE9gulier") || lowerDesc.includes("hebdomadaire") || lowerDesc.includes("mensuel")) {
    analysis.isRecurring = true;
  }
  const categoryAnalysis = {
    development: () => {
      if (!lowerDesc.match(/(react|vue|angular|php|python|javascript|node|laravel|symfony)/)) {
        analysis.improvements.push("Sp\xE9cifier les technologies pr\xE9f\xE9r\xE9es");
        analysis.missing.push("Technologies non mentionn\xE9es");
      }
      if (!lowerDesc.includes("api") && !lowerDesc.includes("base de donn\xE9es")) {
        analysis.improvements.push("Pr\xE9ciser les int\xE9grations techniques");
      }
      if (!lowerDesc.includes("responsive") && !lowerDesc.includes("mobile")) {
        analysis.improvements.push("Indiquer si compatibilit\xE9 mobile requise");
      }
      if (analysis.needsDatabase) {
        analysis.suggestedDeliverables.push("Base de donn\xE9es optimis\xE9e");
      }
      if (analysis.hasComplexFeatures) {
        analysis.suggestedDeliverables.push("Documentation API");
      }
      analysis.complexity = "high";
    },
    mobile: () => {
      if (!lowerDesc.includes("ios") && !lowerDesc.includes("android")) {
        analysis.improvements.push("Pr\xE9ciser les plateformes cibles (iOS/Android)");
        analysis.missing.push("Plateformes non sp\xE9cifi\xE9es");
      }
      if (!lowerDesc.includes("store") && !lowerDesc.includes("publication")) {
        analysis.improvements.push("Indiquer si publication sur stores n\xE9cessaire");
      }
      if (analysis.hasComplexFeatures) {
        analysis.suggestedDeliverables.push("Mode hors-ligne");
      }
      analysis.complexity = "high";
    },
    construction: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Pr\xE9ciser la surface en m\xB2");
        analysis.missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("\xE9tage") && !lowerDesc.includes("niveau")) {
        analysis.improvements.push("Indiquer le nombre d'\xE9tages");
      }
      if (!lowerDesc.includes("acc\xE8s") && !lowerDesc.includes("parking")) {
        analysis.improvements.push("Mentionner les contraintes d'acc\xE8s");
      }
      if (analysis.isRenovation) {
        analysis.suggestedDeliverables.push("Diagnostic initial");
      }
      if (analysis.needsCertification) {
        analysis.suggestedDeliverables.push("Certificats de conformit\xE9");
      }
      analysis.complexity = "medium";
    },
    plomberie: () => {
      if (!lowerDesc.includes("urgent") && !lowerDesc.includes("d\xE9lai")) {
        analysis.improvements.push("Pr\xE9ciser l'urgence de l'intervention");
      }
      if (!lowerDesc.includes("\xE9tage") && !lowerDesc.includes("niveau")) {
        analysis.improvements.push("Indiquer l'\xE9tage de l'intervention");
      }
      analysis.complexity = "medium";
    },
    electricite: () => {
      if (!lowerDesc.includes("norme") && !lowerDesc.includes("consuel")) {
        analysis.improvements.push("Pr\xE9ciser si mise aux normes n\xE9cessaire");
      }
      if (!lowerDesc.includes("tableau") && !lowerDesc.includes("disjoncteur")) {
        analysis.improvements.push("D\xE9tailler l'installation \xE9lectrique existante");
      }
      if (analysis.needsCertification) {
        analysis.suggestedDeliverables.push("Attestation Consuel");
      }
      analysis.complexity = "medium";
    },
    menage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Pr\xE9ciser la surface du logement");
        analysis.missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("fr\xE9quence") && !lowerDesc.includes("semaine")) {
        analysis.improvements.push("Indiquer la fr\xE9quence souhait\xE9e");
      }
      if (analysis.isRecurring) {
        analysis.suggestedDeliverables.push("Planning r\xE9current");
      }
      analysis.complexity = "low";
    },
    garde_enfants: () => {
      if (!lowerDesc.match(/\d+\s*(?:ans?|années?)/)) {
        analysis.improvements.push("Pr\xE9ciser l'\xE2ge des enfants");
        analysis.missing.push("\xC2ge des enfants non pr\xE9cis\xE9");
      }
      if (!lowerDesc.includes("horaire") && !lowerDesc.includes("heure")) {
        analysis.improvements.push("D\xE9tailler les horaires de garde");
      }
      analysis.complexity = "low";
    },
    jardinage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        analysis.improvements.push("Pr\xE9ciser la surface du jardin");
        analysis.missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("tonte") && !lowerDesc.includes("taille") && !lowerDesc.includes("entretien")) {
        analysis.improvements.push("D\xE9tailler les travaux de jardinage souhait\xE9s");
      }
      analysis.complexity = "low";
    },
    comptabilite: () => {
      if (!lowerDesc.includes("entreprise") && !lowerDesc.includes("soci\xE9t\xE9")) {
        analysis.improvements.push("Pr\xE9ciser le type d'entreprise");
      }
      if (!lowerDesc.includes("mensuel") && !lowerDesc.includes("trimestre") && !lowerDesc.includes("annuel")) {
        analysis.improvements.push("Indiquer la p\xE9riodicit\xE9 souhait\xE9e");
      }
      analysis.complexity = "medium";
    },
    design: () => {
      if (!lowerDesc.includes("logo") && !lowerDesc.includes("identit\xE9 visuelle")) {
        analysis.improvements.push("Pr\xE9ciser les \xE9l\xE9ments graphiques souhait\xE9s (logo, charte...)");
        analysis.missing.push("\xC9l\xE9ments graphiques non sp\xE9cifi\xE9s");
      }
      if (!lowerDesc.includes("responsive") && !lowerDesc.includes("mobile")) {
        analysis.improvements.push("Indiquer si le design doit \xEAtre responsive");
      }
      analysis.complexity = "medium";
    },
    marketing: () => {
      if (!lowerDesc.includes("objectif") && !lowerDesc.includes("cible")) {
        analysis.improvements.push("D\xE9finir clairement les objectifs marketing");
        analysis.missing.push("Objectifs non d\xE9finis");
      }
      if (!lowerDesc.includes("budget") && !lowerDesc.includes("investissement")) {
        analysis.improvements.push("Indiquer une enveloppe budg\xE9taire");
      }
      analysis.complexity = "high";
    },
    ai: () => {
      if (!lowerDesc.includes("mod\xE8le") && !lowerDesc.includes("algorithme")) {
        analysis.improvements.push("Sp\xE9cifier le type de mod\xE8le IA ou algorithme souhait\xE9");
        analysis.missing.push("Mod\xE8le IA non sp\xE9cifi\xE9");
      }
      if (!lowerDesc.includes("donn\xE9es") && !lowerDesc.includes("dataset")) {
        analysis.improvements.push("Pr\xE9ciser les donn\xE9es d'entra\xEEnement disponibles");
      }
      analysis.complexity = "high";
    },
    services_personne: () => {
      if (!lowerDesc.includes("fr\xE9quence") && !lowerDesc.includes("r\xE9gulier")) {
        analysis.improvements.push("Indiquer la fr\xE9quence de la prestation");
      }
      if (!lowerDesc.includes("horaire") && !lowerDesc.includes("disponible")) {
        analysis.improvements.push("Pr\xE9ciser les disponibilit\xE9s");
      }
      if (analysis.isRecurring) {
        analysis.suggestedDeliverables.push("Planning de service");
      }
      analysis.complexity = "low";
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
    "development": generateWebDevOptimizedDescription,
    "mobile": generateMobileDevOptimizedDescription,
    "design": generateDesignOptimizedDescription,
    "marketing": generateMarketingOptimizedDescription,
    "content": generateContentOptimizedDescription,
    "translation": generateTranslationOptimizedDescription,
    "consulting": generateConsultingOptimizedDescription,
    "e-commerce": generateEcommerceOptimizedDescription,
    "construction": generateConstructionOptimizedDescription,
    "renovation": generateRenovationOptimizedDescription,
    "plomberie": generatePlomberieOptimizedDescription,
    "electricite": generateElectriciteOptimizedDescription,
    "peinture": generatePeintureOptimizedDescription,
    "services_personne": generateServicesPersonneOptimizedDescription,
    "ai": generateAIOptimizedDescription,
    "menage": generateMenageOptimizedDescription,
    "garde_enfants": generateGardeEnfantsOptimizedDescription,
    "jardinage": generateJardinageOptimizedDescription,
    "comptabilite": generateComptabiliteOptimizedDescription,
    "travaux": generateConstructionOptimizedDescription,
    // Alias for construction
    "transport": generateTransportOptimizedDescription,
    "beaute_bienetre": generateBeauteBienEtreOptimizedDescription,
    "services_pro": generateServicesProOptimizedDescription,
    "evenementiel": generateEvenementielOptimizedDescription,
    "enseignement": generateEnseignementOptimizedDescription,
    "animaux": generateAnimauxOptimizedDescription
  };
  const generator = categoryTemplates[category] || generateGenericOptimizedDescription;
  return generator(description, projectTitle, analysis);
}
function generateProjectTitle(description, category) {
  const categoryTitles = {
    "development": "D\xE9veloppement de Solution Digitale sur Mesure",
    "mobile": "Cr\xE9ation d'Application Mobile Performante",
    "design": "Conception Graphique et Identit\xE9 Visuelle",
    "marketing": "Strat\xE9gie Marketing Digital & Acquisition Client",
    "content": "Cr\xE9ation de Contenu Professionnel Engageant",
    "translation": "Service de Traduction Sp\xE9cialis\xE9e",
    "consulting": "Mission de Conseil Strat\xE9gique",
    "e-commerce": "D\xE9veloppement Boutique en Ligne Optimis\xE9e",
    "construction": "Travaux de Construction et Gros \u0152uvre",
    "renovation": "Projet de R\xE9novation Int\xE9rieure/Ext\xE9rieure",
    "plomberie": "Intervention Plomberie Urgente ou Planifi\xE9e",
    "electricite": "Installation et Mise aux Normes \xC9lectriques",
    "peinture": "Travaux de Peinture Int\xE9rieure et Ext\xE9rieure",
    "services_personne": "Prestation de Services \xE0 la Personne",
    "ai": "Projet Intelligence Artificielle & Machine Learning",
    "menage": "Service de Nettoyage et Entretien",
    "garde_enfants": "Garde d'Enfants et Soutien Familial",
    "jardinage": "Entretien de Jardin et Espaces Verts",
    "comptabilite": "Expertise Comptable et Fiscale",
    "travaux": "Travaux de Construction et R\xE9novation",
    "transport": "Service de Transport et D\xE9m\xE9nagement",
    "beaute_bienetre": "Prestation de Beaut\xE9 et Bien-\xEAtre \xE0 Domicile",
    "services_pro": "Conseil et Services aux Professionnels",
    "evenementiel": "Organisation d'\xC9v\xE9nements Sur Mesure",
    "enseignement": "Soutien Scolaire et Cours Particuliers",
    "animaux": "Services pour Animaux de Compagnie"
  };
  return categoryTitles[category] || "Projet Professionnel";
}
function generateWebDevOptimizedDescription(description, title, analysis) {
  const techStack = extractTechFromDescription(description);
  const features = extractFeaturesFromDescription(description);
  return `**${title}**

**Contexte et Objectifs :**
${description.length > 50 ? description : "Nous cherchons \xE0 d\xE9velopper une solution web moderne et performante qui r\xE9pond parfaitement \xE0 nos besoins m\xE9tier."}

**Fonctionnalit\xE9s Attendues :**
${features.length > 0 ? features.map((f) => `\u2022 ${f}`).join("\n") : `\u2022 Interface utilisateur intuitive et responsive
\u2022 Backend robuste et s\xE9curis\xE9
\u2022 Base de donn\xE9es optimis\xE9e
\u2022 Panel d'administration complet`}

**Stack Technique Souhait\xE9e :**
${techStack.length > 0 ? techStack.map((t) => `\u2022 ${t}`).join("\n") : `\u2022 Frontend moderne (React, Vue.js ou Angular)
\u2022 Backend performant (Node.js, PHP Laravel ou Python)
\u2022 Base de donn\xE9es relationnelle ou NoSQL selon besoins
\u2022 H\xE9bergement cloud avec SSL`}

**Livrables Attendus :**
\u2022 Code source complet et document\xE9
\u2022 Tests unitaires et d'int\xE9gration
\u2022 Documentation technique et utilisateur
\u2022 Formation \xE0 l'utilisation
\u2022 3 mois de support technique inclus

**Crit\xE8res de S\xE9lection :**
\u2022 Portfolio avec projets similaires r\xE9cents
\u2022 Ma\xEEtrise des technologies requises
\u2022 M\xE9thodologie de d\xE9veloppement agile
\u2022 Communication fluide en fran\xE7ais
\u2022 Respect des d\xE9lais et budget

**Budget et D\xE9lais :**
\u2022 Budget indicatif : \xC0 d\xE9finir selon proposition d\xE9taill\xE9e
\u2022 D\xE9lai souhait\xE9 : ${analysis.isUrgent ? "2-4 semaines" : "6-8 semaines"}
\u2022 Paiement \xE9chelonn\xE9 selon jalons

**Modalit\xE9s de Candidature :**
Merci de pr\xE9senter votre approche, exemples de r\xE9alisations similaires, planning pr\xE9visionnel et devis d\xE9taill\xE9.`;
}
function generateMobileDevOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Vision du Projet :**
${description.length > 50 ? description : "D\xE9veloppement d'une application mobile native ou hybride avec une exp\xE9rience utilisateur exceptionnelle."}

**Plateformes Cibl\xE9es :**
\u2022 iOS (App Store)
\u2022 Android (Google Play)
\u2022 ${analysis.hasComplexFeatures ? "Version web progressive (PWA) en compl\xE9ment" : "Cross-platform pour optimiser les co\xFBts"}

**Fonctionnalit\xE9s Cl\xE9s :**
\u2022 Interface utilisateur moderne et intuitive
\u2022 Authentification s\xE9curis\xE9e
\u2022 Notifications push intelligentes
\u2022 Mode hors-ligne pour fonctions essentielles
\u2022 Synchronisation cloud temps r\xE9el
\u2022 Analytics et tracking utilisateur

**Exigences Techniques :**
\u2022 Performance optimale sur tous appareils
\u2022 Compatibilit\xE9 iOS 13+ et Android 8+
\u2022 Conformit\xE9 aux guidelines Apple et Google
\u2022 Architecture scalable et maintenable
\u2022 S\xE9curit\xE9 renforc\xE9e (chiffrement, API)

**Livrables :**
\u2022 Applications natives ou hybrides publi\xE9es
\u2022 Code source avec documentation compl\xE8te
\u2022 Kit de ressources (ic\xF4nes, assets)
\u2022 Guide de maintenance et \xE9volution
\u2022 Formation \xE9quipe technique

**Profil Recherch\xE9 :**
\u2022 3+ ans d'exp\xE9rience d\xE9veloppement mobile
\u2022 Portfolio d'applications publi\xE9es sur stores
\u2022 Ma\xEEtrise React Native, Flutter ou d\xE9veloppement natif
\u2022 Connaissance UX/UI mobile
\u2022 Capacit\xE9 \xE0 g\xE9rer publication sur stores

**Timeline et Budget :**
\u2022 Phase de conception : 1-2 semaines
\u2022 D\xE9veloppement : ${analysis.isUrgent ? "4-6 semaines" : "8-12 semaines"}
\u2022 Tests et publication : 1-2 semaines
\u2022 Budget : Devis d\xE9taill\xE9 souhait\xE9 avec options`;
}
function generateDesignOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Brief Cr\xE9atif :**
${description.length > 50 ? description : "Cr\xE9ation d'une identit\xE9 visuelle forte et d'\xE9l\xE9ments graphiques impactants qui refl\xE8tent parfaitement notre vision."}

**\xC9l\xE9ments \xE0 Cr\xE9er :**
\u2022 Logo principal et d\xE9clinaisons
\u2022 Charte graphique compl\xE8te
\u2022 Palette couleurs et typographies
\u2022 Templates et supports de communication
\u2022 \xC9l\xE9ments pour web et print
\u2022 ${analysis.hasComplexFeatures ? "Animation et motion design" : "D\xE9clinaisons r\xE9seaux sociaux"}

**Style et Orientation :**
\u2022 Design moderne et intemporel
\u2022 Adaptation multi-supports
\u2022 Respect des tendances actuelles
\u2022 Originalit\xE9 et m\xE9morabilit\xE9
\u2022 Coh\xE9rence sur tous les supports

**Sp\xE9cifications Techniques :**
\u2022 Fichiers vectoriels haute r\xE9solution
\u2022 Formats multiples (AI, EPS, PNG, JPG, PDF)
\u2022 Versions couleur, noir/blanc, monochrome
\u2022 Guide d'utilisation d\xE9taill\xE9
\u2022 Templates modifiables

**Livrables :**
\u2022 Logo final avec d\xE9clinaisons
\u2022 Charte graphique PDF compl\xE8te
\u2022 Tous fichiers sources modifiables
\u2022 Mockups de pr\xE9sentation
\u2022 Guide d'application de la marque

**Profil Designer :**
\u2022 Portfolio cr\xE9atif et diversifi\xE9
\u2022 Ma\xEEtrise Suite Adobe (Illustrator, Photoshop, InDesign)
\u2022 Exp\xE9rience en identit\xE9 visuelle
\u2022 Sens artistique d\xE9velopp\xE9
\u2022 Communication cr\xE9ative fluide

**Process de Collaboration :**
\u2022 Briefing cr\xE9atif d\xE9taill\xE9 initial
\u2022 3 propositions de concepts diff\xE9rents
\u2022 2-3 phases de r\xE9visions incluses
\u2022 Validation par \xE9tapes
\u2022 Livraison finale organis\xE9e

**D\xE9lais et Budget :**
\u2022 D\xE9lai souhait\xE9 : ${analysis.isUrgent ? "1-2 semaines" : "3-4 semaines"}
\u2022 Budget : Merci d'indiquer vos tarifs selon \xE9l\xE9ments
\u2022 Paiement : 50% \xE0 la commande, 50% \xE0 la livraison`;
}
function generateMarketingOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte Business :**
${description.length > 50 ? description : "Nous cherchons \xE0 d\xE9velopper notre visibilit\xE9 digitale et acqu\xE9rir de nouveaux clients gr\xE2ce \xE0 une strat\xE9gie marketing performante."}

**Objectifs Marketing :**
\u2022 Augmenter la visibilit\xE9 de la marque
\u2022 G\xE9n\xE9rer des leads qualifi\xE9s
\u2022 Am\xE9liorer le taux de conversion
\u2022 Optimiser le ROI publicitaire
\u2022 ${analysis.hasComplexFeatures ? "D\xE9velopper la notori\xE9t\xE9 sectorielle" : "Fid\xE9liser la client\xE8le existante"}

**Canaux Prioritaires :**
\u2022 Google Ads (Search et Display)
\u2022 Facebook et Instagram Ads
\u2022 LinkedIn Ads (BtoB)
\u2022 SEO et content marketing
\u2022 Email marketing
\u2022 Influenceurs et partenariats

**Strat\xE9gie Attendue :**
\u2022 Audit marketing initial complet
\u2022 D\xE9finition personas et parcours client
\u2022 Strat\xE9gie de contenu adapt\xE9e
\u2022 Planning \xE9ditorial mensuel
\u2022 Campagnes publicitaires optimis\xE9es
\u2022 Reporting et optimisation continue

**Comp\xE9tences Requises :**
\u2022 Expertise Google Ads et Facebook Business
\u2022 Ma\xEEtrise des outils analytics
\u2022 Connaissance du secteur d'activit\xE9
\u2022 Capacit\xE9s r\xE9dactionnelles
\u2022 Sens de l'analyse et optimisation

**Livrables Mensuels :**
\u2022 Strat\xE9gie marketing document\xE9e
\u2022 Campagnes publicitaires op\xE9rationnelles
\u2022 Contenus cr\xE9atifs (visuels, textes)
\u2022 Rapports de performance d\xE9taill\xE9s
\u2022 Recommandations d'optimisation

**Budget et Dur\xE9e :**
\u2022 Mission sur ${analysis.isUrgent ? "3-6 mois" : "6-12 mois"}
\u2022 Budget publicitaire : \xC0 d\xE9finir s\xE9par\xE9ment
\u2022 Honoraires : Forfait mensuel ou commission r\xE9sultats
\u2022 ROI cible : D\xE9finition d'objectifs mesurables

**Modalit\xE9s de Collaboration :**
\u2022 R\xE9unions hebdomadaires de suivi
\u2022 Acc\xE8s outils analytics et plateformes
\u2022 Reporting transparent et r\xE9gulier
\u2022 Flexibilit\xE9 selon \xE9volutions march\xE9`;
}
function generateContentOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Projet \xC9ditorial :**
${description.length > 50 ? description : "Cr\xE9ation de contenus de qualit\xE9 professionnelle pour d\xE9velopper notre communication et engager notre audience."}

**Types de Contenus :**
\u2022 Articles de blog SEO-optimis\xE9s
\u2022 Pages web et fiches produits
\u2022 Newsletters et emailing
\u2022 Contenus r\xE9seaux sociaux
\u2022 Livres blancs et guides
\u2022 ${analysis.hasComplexFeatures ? "Scripts vid\xE9o et podcasts" : "Communiqu\xE9s de presse"}

**Exigences Qualit\xE9 :**
\u2022 \xC9criture fluide et engageante
\u2022 Respect de la ligne \xE9ditoriale
\u2022 Optimisation SEO native
\u2022 Recherche et documentation rigoureuse
\u2022 Originalit\xE9 et valeur ajout\xE9e
\u2022 Adaptation aux diff\xE9rents formats

**Sp\xE9cifications Techniques :**
\u2022 Longueur selon brief sp\xE9cifique
\u2022 Int\xE9gration mots-cl\xE9s strat\xE9giques
\u2022 Structure H1, H2, H3 optimis\xE9e
\u2022 M\xE9ta-descriptions et titres SEO
\u2022 Appels \xE0 l'action pertinents

**Secteur et Ton :**
\u2022 Adaptation parfaite \xE0 notre secteur
\u2022 Ton professionnel mais accessible
\u2022 Expertise technique d\xE9montr\xE9e
\u2022 Style coh\xE9rent sur tous contenus
\u2022 Respect de l'image de marque

**Livrables :**
\u2022 Contenus finalis\xE9s et relus
\u2022 Optimisation SEO int\xE9gr\xE9e
\u2022 Suggestions visuels et illustrations
\u2022 Planning \xE9ditorial si r\xE9current
\u2022 Droits de propri\xE9t\xE9 complets

**Profil R\xE9dacteur :**
\u2022 Portfolio de contenus similaires
\u2022 Ma\xEEtrise techniques SEO
\u2022 Capacit\xE9 de recherche documentaire
\u2022 Respect strict des d\xE9lais
\u2022 Communication professionnelle

**Organisation :**
\u2022 Brief d\xE9taill\xE9 pour chaque contenu
\u2022 1-2 r\xE9visions incluses par contenu
\u2022 D\xE9lai : ${analysis.isUrgent ? "48-72h par article" : "1 semaine par contenu"}
\u2022 Tarification : Au mot ou forfait selon volume`;
}
function generateTranslationOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Projet de Traduction :**
${description.length > 50 ? description : "Traduction professionnelle de haute qualit\xE9 respectant le sens, le style et les sp\xE9cificit\xE9s culturelles."}

**Langues de Travail :**
\u2022 Langue source : \xC0 pr\xE9ciser
\u2022 Langue cible : \xC0 pr\xE9ciser
\u2022 Variantes r\xE9gionales si n\xE9cessaires
\u2022 Localisation culturelle adapt\xE9e

**Types de Documents :**
\u2022 Documents techniques et manuels
\u2022 Contenus web et marketing
\u2022 Contrats et documents l\xE9gaux
\u2022 Pr\xE9sentations et rapports
\u2022 ${analysis.hasComplexFeatures ? "Logiciels et interfaces" : "Courriers et communications"}

**Exigences Qualit\xE9 :**
\u2022 Traduction humaine professionnelle
\u2022 Respect du registre et du ton
\u2022 Adaptation culturelle pertinente
\u2022 Coh\xE9rence terminologique
\u2022 Relecture et correction incluses

**Sp\xE9cialisations :**
\u2022 Domaine d'expertise requis
\u2022 Ma\xEEtrise vocabulaire technique
\u2022 Connaissance secteur d'activit\xE9
\u2022 Normes de qualit\xE9 ISO 17100
\u2022 Confidentialit\xE9 garantie

**Processus de Travail :**
\u2022 Analyse et devis pr\xE9alables
\u2022 Glossaire et guide de style
\u2022 Traduction par natif expert
\u2022 Relecture par second traducteur
\u2022 Livraison dans formats originaux

**Livrables :**
\u2022 Documents traduits finalis\xE9s
\u2022 Glossaire terminologique cr\xE9\xE9
\u2022 Rapport de traduction si souhait\xE9
\u2022 Fichiers dans formats demand\xE9s
\u2022 Support post-livraison

**D\xE9lais et Tarification :**
\u2022 D\xE9lai : ${analysis.isUrgent ? "24-48h urgence" : "Standard selon volume"}
\u2022 Tarification : Au mot ou forfait
\u2022 R\xE9visions mineures incluses
\u2022 Certification possible si requise

**Modalit\xE9s :**
\u2022 Confidentialit\xE9 stricte garantie
\u2022 Formats accept\xE9s : Word, PDF, Excel, etc.
\u2022 Communication directe privil\xE9gi\xE9e
\u2022 Paiement s\xE9curis\xE9 \xE9chelonn\xE9`;
}
function generateConsultingOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte de la Mission :**
${description.length > 50 ? description : "Nous recherchons un consultant expert pour nous accompagner dans l'analyse et l'optimisation de nos processus m\xE9tier."}

**Objectifs de Consultation :**
\u2022 Diagnostic complet de la situation
\u2022 Identification des axes d'am\xE9lioration
\u2022 Recommandations strat\xE9giques
\u2022 Plan d'action op\xE9rationnel
\u2022 ${analysis.hasComplexFeatures ? "Conduite du changement" : "Formation des \xE9quipes"}

**Domaines d'Expertise :**
\u2022 Strat\xE9gie et organisation
\u2022 Processus et efficacit\xE9 op\xE9rationnelle
\u2022 Transformation digitale
\u2022 Management et RH
\u2022 Finance et contr\xF4le de gestion

**M\xE9thodologie Attendue :**
\u2022 Audit initial approfondi
\u2022 Entretiens avec parties prenantes
\u2022 Analyse de donn\xE9es et benchmarking
\u2022 Ateliers collaboratifs
\u2022 Restitution et recommandations

**Livrables Consultants :**
\u2022 Rapport de diagnostic d\xE9taill\xE9
\u2022 Pr\xE9sentation des recommandations
\u2022 Plan d'action prioris\xE9 et chiffr\xE9
\u2022 Outils et m\xE9thodologies
\u2022 Formation \xE9quipes si n\xE9cessaire

**Profil Expert :**
\u2022 5+ ans exp\xE9rience consulting
\u2022 Expertise sectorielle d\xE9montr\xE9e
\u2022 Portfolio de missions similaires
\u2022 R\xE9f\xE9rences clients v\xE9rifiables
\u2022 Capacit\xE9 d'analyse et synth\xE8se

**Modalit\xE9s d'Intervention :**
\u2022 Mission sur ${analysis.isUrgent ? "2-4 semaines" : "1-3 mois"}
\u2022 Interventions sur site et distanciel
\u2022 Points d'avancement r\xE9guliers
\u2022 Flexibilit\xE9 selon contraintes terrain

**Budget et Conditions :**
\u2022 TJM ou forfait mission selon pr\xE9f\xE9rence
\u2022 Frais de d\xE9placement si n\xE9cessaires
\u2022 Confidentialit\xE9 stricte requise
\u2022 Paiement selon jalons d\xE9finis

**Suivi Post-Mission :**
\u2022 Support mise en \u0153uvre recommandations
\u2022 Points de suivi \xE0 3 et 6 mois
\u2022 Ajustements m\xE9thodologies si besoin
\u2022 Bilan final et ROI mesur\xE9`;
}
function generateEcommerceOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Vision E-commerce :**
${description.length > 50 ? description : "Cr\xE9ation d'une boutique en ligne performante et convertissante avec une exp\xE9rience client exceptionnelle."}

**Fonctionnalit\xE9s E-commerce :**
\u2022 Catalogue produits avec filtres avanc\xE9s
\u2022 Panier et tunnel de commande optimis\xE9
\u2022 Gestion multi-moyens de paiement
\u2022 Espace client complet
\u2022 Syst\xE8me de reviews et avis
\u2022 ${analysis.hasComplexFeatures ? "Marketplace multi-vendeurs" : "Programme de fid\xE9lit\xE9"}

**Int\xE9grations Requises :**
\u2022 Passerelles de paiement (Stripe, PayPal)
\u2022 Solutions d'exp\xE9dition (Colissimo, Chronopost)
\u2022 Outils marketing (MailChimp, Google Analytics)
\u2022 ERP/CRM si existant
\u2022 R\xE9seaux sociaux et comparateurs

**Design et UX :**
\u2022 Design responsive mobile-first
\u2022 Interface intuitive et moderne
\u2022 Optimisation taux de conversion
\u2022 Tunnel de commande fluide
\u2022 Performance et temps de chargement

**Fonctionnalit\xE9s Admin :**
\u2022 Gestion compl\xE8te des produits
\u2022 Suivi des commandes en temps r\xE9el
\u2022 Statistiques et reporting avanc\xE9s
\u2022 Gestion des stocks automatis\xE9e
\u2022 Outils marketing int\xE9gr\xE9s

**Aspects Techniques :**
\u2022 H\xE9bergement haute performance
\u2022 S\xE9curit\xE9 et certificats SSL
\u2022 Sauvegarde automatique
\u2022 SEO on-page optimis\xE9
\u2022 Conformit\xE9 RGPD

**Livrables :**
\u2022 Boutique e-commerce compl\xE8te
\u2022 Formation administration
\u2022 Documentation utilisateur
\u2022 3 mois de support technique
\u2022 Garantie de fonctionnement

**Expertise Requise :**
\u2022 Portfolio boutiques e-commerce
\u2022 Ma\xEEtrise Shopify, WooCommerce ou Prestashop
\u2022 Connaissance conversion et UX
\u2022 Exp\xE9rience int\xE9grations paiement
\u2022 Support et maintenance

**Timeline Projet :**
\u2022 Conception et setup : 1-2 semaines
\u2022 D\xE9veloppement : ${analysis.isUrgent ? "3-4 semaines" : "6-8 semaines"}  
\u2022 Tests et formation : 1 semaine
\u2022 Mise en production assist\xE9e

**Investissement :**
\u2022 D\xE9veloppement : Devis selon fonctionnalit\xE9s
\u2022 H\xE9bergement et licences s\xE9par\xE9s
\u2022 Formation et support inclus
\u2022 Options de maintenance disponibles`;
}
function generateConstructionOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description des Travaux :**
${description.length > 50 ? description : "R\xE9alisation de travaux de construction ou r\xE9novation dans le respect des normes et d\xE9lais impartis."}

**Nature des Travaux :**
\u2022 Gros \u0153uvre / Second \u0153uvre
\u2022 Extension / Sur\xE9l\xE9vation
\u2022 R\xE9novation \xE9nerg\xE9tique
\u2022 Am\xE9nagement int\xE9rieur/ext\xE9rieur
\u2022 Isolation thermique / acoustique
\u2022 ${analysis.hasComplexFeatures ? "Mise en conformit\xE9 r\xE9glementaire" : "Finitions et d\xE9coration"}

**Sp\xE9cificit\xE9s du Site :**
\u2022 Surface : ${analysis.missing.includes("Surface non indiqu\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*m[²2]/)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Type de b\xE2timent : ${analysis.missing.includes("Type de b\xE2timent non sp\xE9cifi\xE9") ? "\xC0 pr\xE9ciser" : description.match(/^(Maison|Appartement|Immeuble|Local commercial|Bureau)/i)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Accessibilit\xE9 : ${analysis.missing.includes("Contraintes d'acc\xE8s non mentionn\xE9es") ? "\xC0 pr\xE9ciser" : description.match(/accès|parking|difficile|facile/i)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 \xC9tat actuel : ${analysis.missing.includes("\xC9tat du b\xE2ti non sp\xE9cifi\xE9") ? "\xC0 pr\xE9ciser" : description.match(/bon état|délabré|ancien|neuf/i)?.[0] || "\xC0 pr\xE9ciser"}

**Exigences Techniques :**
\u2022 Respect des normes DTU et RT/RE
\u2022 Mat\xE9riaux de qualit\xE9 et durables
\u2022 Savoir-faire artisanal ou technique
\u2022 Coordination des corps de m\xE9tier
\u2022 Gestion du chantier et s\xE9curit\xE9

**Livrables :**
\u2022 Travaux r\xE9alis\xE9s selon cahier des charges
\u2022 Garantie d\xE9cennale et de parfait ach\xE8vement
\u2022 Certificats de conformit\xE9 si requis
\u2022 Nettoyage final du chantier
\u2022 Factures d\xE9taill\xE9es et transparentes

**Profil Entreprise :**
\u2022 Qualification professionnelle reconnue (Qualibat, RGE...)
\u2022 Assurance responsabilit\xE9 civile et d\xE9cennale
\u2022 Exp\xE9rience confirm\xE9e sur projets similaires
\u2022 R\xE9f\xE9rences clients disponibles
\u2022 Devis gratuit et d\xE9taill\xE9

**Planning :**
\u2022 Dur\xE9e estim\xE9e : ${analysis.isUrgent ? "2-4 semaines" : "1-3 mois"}
\u2022 D\xE9but des travaux : Date souhait\xE9e

**Budget :**
\u2022 Enveloppe budg\xE9taire indicative : \xC0 d\xE9finir
\u2022 Paiement : Acompte, paiements interm\xE9diaires, solde \xE0 r\xE9ception`;
}
function generateRenovationOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Contexte du Projet :**
${description.length > 50 ? description : "R\xE9novation compl\xE8te ou partielle d'un bien immobilier pour am\xE9liorer son confort, sa performance et son esth\xE9tique."}

**Nature de la R\xE9novation :**
\u2022 R\xE9novation int\xE9rieure compl\xE8te
\u2022 R\xE9novation partielle (cuisine, SDB...)
\u2022 R\xE9novation ext\xE9rieure (fa\xE7ade, toiture...)
\u2022 Optimisation \xE9nerg\xE9tique
\u2022 Mise aux normes (\xE9lectricit\xE9, plomberie)
\u2022 ${analysis.hasComplexFeatures ? "Restauration patrimoniale" : "Am\xE9lioration esth\xE9tique"}

**Ampleur des Travaux :**
\u2022 Surface concern\xE9e : ${analysis.missing.includes("Surface non indiqu\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*m[²2]/)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Nombre de pi\xE8ces : \xC0 pr\xE9ciser
\u2022 Travaux sp\xE9cifiques : ${analysis.suggestedDeliverables.length > 0 ? analysis.suggestedDeliverables.join(", ") : "\xC0 d\xE9finir"}

**Exigences Techniques :**
\u2022 Qualit\xE9 des mat\xE9riaux et finitions
\u2022 Respect des styles architecturaux
\u2022 Performance thermique et acoustique
\u2022 Normes de s\xE9curit\xE9 et accessibilit\xE9
\u2022 Coordination des artisans

**Livrables :**
\u2022 Travaux de r\xE9novation ex\xE9cut\xE9s selon cahier des charges
\u2022 Garantie d\xE9cennale et de parfait ach\xE8vement
\u2022 Propret\xE9 et remise en \xE9tat des lieux
\u2022 Facturation d\xE9taill\xE9e et transparente

**Profil Artisan/Entreprise :**
\u2022 Exp\xE9rience significative en r\xE9novation
\u2022 Portfolio de r\xE9alisations vari\xE9es
\u2022 Comp\xE9tences multi-m\xE9tiers ou coordination
\u2022 Assurance professionnelle valide
\u2022 Devis pr\xE9cis et respect\xE9

**Planning et Budget :**
\u2022 Dur\xE9e estim\xE9e : ${analysis.isUrgent ? "4-8 semaines" : "2-4 mois"}
\u2022 Budget indicatif : \xC0 d\xE9finir selon devis
\u2022 Paiement : Acompte, paiements interm\xE9diaires, solde \xE0 r\xE9ception`;
}
function generatePlomberieOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin Urgent/Planifi\xE9 :**
${analysis.isUrgent ? "Intervention plomberie urgente n\xE9cessaire." : "Demande d'intervention plomberie pour installation ou r\xE9paration."}

**Nature de l'Intervention :**
\u2022 D\xE9pannage (fuite, robinet, WC...)
\u2022 Installation (sanitaire, chauffage...)
\u2022 R\xE9novation (r\xE9seau, salle de bain...)
\u2022 Recherche de fuite
\u2022 D\xE9bouchage canalisation
\u2022 ${analysis.hasComplexFeatures ? "Mise aux normes installation gaz" : "Entretien chaudi\xE8re"}

**Informations Compl\xE9mentaires :**
\u2022 Lieu de l'intervention : ${description.match(/(\d+\s*(?:rue|avenue|boulevard)\s*[\w\s-]+)/i)?.[1] || "Adresse \xE0 pr\xE9ciser"}
\u2022 \xC9tage : ${analysis.missing.includes("\xC9tage non sp\xE9cifi\xE9") ? "\xC0 pr\xE9ciser" : description.match(/(?:au|au\s)(\d+)(?:er|ème)\sétage/i)?.[1] || "Rez-de-chauss\xE9e"}
\u2022 Accessibilit\xE9 : Facile / Difficile
\u2022 Contexte : Maison / Appartement / Local commercial

**Exigences Professionnelles :**
\u2022 Plombier qualifi\xE9 et certifi\xE9
\u2022 Interventions dans le respect des normes
\u2022 Utilisation de mat\xE9riel professionnel
\u2022 Diagnostic pr\xE9cis et devis clair
\u2022 Garantie sur les travaux effectu\xE9s

**Livrables :**
\u2022 R\xE9paration ou installation fonctionnelle
\u2022 Nettoyage de la zone d'intervention
\u2022 Explication des travaux r\xE9alis\xE9s
\u2022 Facture d\xE9taill\xE9e avec garantie

**Disponibilit\xE9 et Tarifs :**
\u2022 Urgence : Intervention sous 2-4h
\u2022 Standard : Sur RDV sous 48h
\u2022 Tarifs : D\xE9placement + Taux horaire / Forfait intervention
\u2022 Devis gratuit sur demande`;
}
function generateElectriciteOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature de l'Intervention :**
${description.length > 50 ? description : "Installation, modification ou d\xE9pannage \xE9lectrique dans le respect des normes de s\xE9curit\xE9."}

**Type de Prestation :**
\u2022 Installation \xE9lectrique neuve (maison, appartement)
\u2022 R\xE9novation \xE9lectrique compl\xE8te
\u2022 Modification de tableau \xE9lectrique
\u2022 Installation de prises, interrupteurs
\u2022 D\xE9pannage \xE9lectrique (court-circuit, panne)
\u2022 ${analysis.hasComplexFeatures ? "Installation domotique" : "Mise en place \xE9clairage"}

**Contexte Technique :**
\u2022 Type de b\xE2timent : Maison / Appartement / Bureau / Local
\u2022 \xC2ge de l'installation : Ancienne / R\xE9nov\xE9e / Neuve
\u2022 Normes \xE0 respecter : NF C 15-100 / Consuel
\u2022 Complexit\xE9 : Faible / Moyenne / \xC9lev\xE9e

**Exigences Professionnelles :**
\u2022 \xC9lectricien habilit\xE9 et certifi\xE9
\u2022 Respect strict des normes de s\xE9curit\xE9
\u2022 Utilisation de mat\xE9riel homologu\xE9
\u2022 Diagnostic pr\xE9cis et devis d\xE9taill\xE9
\u2022 Garantie sur les travaux et le mat\xE9riel

**Livrables :**
\u2022 Installation \xE9lectrique conforme et fonctionnelle
\u2022 Attestation Consuel si n\xE9cessaire
\u2022 Nettoyage de la zone d'intervention
\u2022 Explication des travaux r\xE9alis\xE9s
\u2022 Facture d\xE9taill\xE9e

**Disponibilit\xE9 et Tarifs :**
\u2022 Urgence : Intervention rapide
\u2022 Standard : Sur rendez-vous
\u2022 Tarifs : D\xE9placement + Taux horaire / Forfait
\u2022 Devis gratuit et d\xE9taill\xE9`;
}
function generatePeintureOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description des Travaux de Peinture :**
${description.length > 50 ? description : "Application de peinture de qualit\xE9 pour embellir et prot\xE9ger vos murs et boiseries."}

**Nature des Travaux :**
\u2022 Peinture int\xE9rieure (murs, plafonds, boiseries)
\u2022 Peinture ext\xE9rieure (fa\xE7ades, volets)
\u2022 R\xE9novation peinture (recouvrement papier peint, lessivage)
\u2022 Pose rev\xEAtement mural (intiss\xE9, toile de verre)
\u2022 Travaux de pr\xE9paration (pon\xE7age, enduit)
\u2022 ${analysis.hasComplexFeatures ? "Effets d\xE9coratifs (patine, enduit \xE0 la chaux)" : "Peinture \xE9cologique"}

**Informations sur la Surface :**
\u2022 Type de surface : Placo / Enduit / Bois / M\xE9tal
\u2022 Surface \xE0 peindre : ${analysis.missing.includes("Surface non indiqu\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*m[²2]/)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Nombre de pi\xE8ces/fa\xE7ades : \xC0 pr\xE9ciser
\u2022 \xC9tat actuel : Bon \xE9tat / Travaux de pr\xE9paration n\xE9cessaires

**Exigences Professionnelles :**
\u2022 Peintre qualifi\xE9 et exp\xE9riment\xE9
\u2022 Utilisation de peintures de qualit\xE9 et adapt\xE9es
\u2022 Respect des techniques d'application
\u2022 Soin apport\xE9 aux finitions
\u2022 Protection du mobilier et des sols
\u2022 Nettoyage apr\xE8s travaux

**Livrables :**
\u2022 Surfaces peintes uniform\xE9ment et proprement
\u2022 Finitions soign\xE9es
\u2022 Zone de travail nettoy\xE9e
\u2022 Facture d\xE9taill\xE9e

**Disponibilit\xE9 et Tarifs :**
\u2022 Planning : Selon disponibilit\xE9 et urgence
\u2022 Tarifs : Au m\xB2 ou forfait par pi\xE8ce/chantier
\u2022 Devis gratuit et d\xE9taill\xE9`;
}
function generateServicesPersonneOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Type de Prestation :**
${description.length > 50 ? description : "Service personnalis\xE9 pour r\xE9pondre \xE0 vos besoins quotidiens ou ponctuels."}

**Domaine de Service :**
\u2022 Aide \xE0 domicile (m\xE9nage, courses, repas)
\u2022 Assistance aux personnes \xE2g\xE9es ou handicap\xE9es
\u2022 Soutien scolaire / Aide aux devoirs
\u2022 Garde d'enfants / Baby-sitting
\u2022 Jardinage / Petit bricolage
\u2022 ${analysis.hasComplexFeatures ? "Accompagnement administratif" : "T\xE2ches m\xE9nag\xE8res"}

**Informations Cl\xE9s :**
\u2022 Fr\xE9quence : Quotidienne / Hebdomadaire / Mensuelle / Ponctuelle
\u2022 Dur\xE9e par intervention : \xC0 pr\xE9ciser
\u2022 P\xE9riode souhait\xE9e : Matin / Apr\xE8s-midi / Soir / Week-end
\u2022 \xC2ge des personnes aid\xE9es : ${analysis.missing.includes("\xC2ge des personnes aid\xE9es non sp\xE9cifi\xE9") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*(?:ans?|années?)/i)?.[0] || "\xC0 pr\xE9ciser"}

**Attentes du Prestataire :**
\u2022 Ponctualit\xE9 et fiabilit\xE9
\u2022 Discr\xE9tion et respect de la vie priv\xE9e
\u2022 Bienveillance et patience
\u2022 Comp\xE9tences adapt\xE9es au service
\u2022 Propret\xE9 et soin

**Livrables :**
\u2022 Prestation r\xE9alis\xE9e conform\xE9ment \xE0 la demande
\u2022 Retour sur les t\xE2ches effectu\xE9es
\u2022 Respect des horaires convenus

**Modalit\xE9s :**
\u2022 Tarifs : Horaire ou forfait selon prestation
\u2022 Possibilit\xE9 de devis personnalis\xE9
\u2022 Assurance responsabilit\xE9 civile professionnelle
\u2022 D\xE9claration simplifi\xE9e CESU possible`;
}
function generateAIOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin en Intelligence Artificielle :**
${description.length > 50 ? description : "D\xE9veloppement et int\xE9gration de solutions bas\xE9es sur l'IA pour optimiser vos processus et vos prises de d\xE9cision."}

**Domaine d'Application :**
\u2022 Analyse pr\xE9dictive
\u2022 Traitement du langage naturel (NLP)
\u2022 Vision par ordinateur
\u2022 Machine Learning / Deep Learning
\u2022 Chatbots / Assistants virtuels
\u2022 Automatisation des t\xE2ches
\u2022 ${analysis.hasComplexFeatures ? "Syst\xE8mes de recommandation" : "Optimisation des flux"}

**Objectifs Sp\xE9cifiques :**
\u2022 Am\xE9liorer la performance
\u2022 Personnaliser l'exp\xE9rience client
\u2022 Automatiser des t\xE2ches r\xE9p\xE9titives
\u2022 Extraire des insights des donn\xE9es
\u2022 Pr\xE9dire des \xE9v\xE9nements futurs
\u2022 ${analysis.needsDatabase ? "G\xE9rer de grands volumes de donn\xE9es" : "Optimiser l'utilisation des ressources"}

**Comp\xE9tences Techniques Requises :**
\u2022 Ma\xEEtrise Python et librairies IA (TensorFlow, PyTorch, Scikit-learn)
\u2022 Connaissance des algorithmes de ML/DL
\u2022 Exp\xE9rience en traitement de donn\xE9es
\u2022 Comp\xE9tences en d\xE9ploiement de mod\xE8les
\u2022 Connaissance des API IA

**Livrables Attendus :**
\u2022 Mod\xE8le IA entra\xEEn\xE9 et optimis\xE9
\u2022 API d'int\xE9gration pour vos syst\xE8mes
\u2022 Documentation technique et utilisateur
\u2022 M\xE9triques de performance et validation
\u2022 Support et maintenance

**Planning et Budget :**
\u2022 Dur\xE9e : ${analysis.isUrgent ? "4-8 semaines" : "2-4 mois"}
\u2022 Budget : Devis d\xE9taill\xE9 requis
\u2022 Paiement : Selon avancement et jalons`;
}
function generateMenageOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature de la Prestation :**
${description.length > 50 ? description : "Nettoyage et entretien de votre domicile pour un environnement sain et agr\xE9able."}

**Type de Nettoyage :**
\u2022 Nettoyage r\xE9gulier (hebdomadaire, bi-mensuel)
\u2022 Nettoyage ponctuel (apr\xE8s travaux, d\xE9m\xE9nagement)
\u2022 Grand m\xE9nage de printemps
\u2022 Nettoyage de vitres
\u2022 Entretien des sols et surfaces
\u2022 ${analysis.hasComplexFeatures ? "Nettoyage sp\xE9cialis\xE9 (taches tenaces)" : "Entretien courant"}

**Informations sur le Logement :**
\u2022 Surface approximative : ${analysis.missing.includes("Surface non indiqu\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*m[²2]/)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Nombre de pi\xE8ces : \xC0 pr\xE9ciser
\u2022 Type de logement : Appartement / Maison / Bureau
\u2022 Fr\xE9quence souhait\xE9e : ${analysis.isRecurring ? analysis.missing.includes("Fr\xE9quence non sp\xE9cifi\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/(?:hebdomadaire|bi-mensuel|mensuel|ponctuel)/i)?.[0] || "\xC0 pr\xE9ciser" : "Ponctuelle"}

**Exigences :**
\u2022 Produits d'entretien \xE9cologiques et efficaces
\u2022 Mat\xE9riel professionnel fourni
\u2022 Soin et discr\xE9tion
\u2022 Ponctualit\xE9 et fiabilit\xE9
\u2022 Respect de vos consignes

**Livrables :**
\u2022 Logement propre et d\xE9sinfect\xE9
\u2022 Surfaces brillantes et sans traces
\u2022 Sols impeccables
\u2022 Environnement sain et agr\xE9able

**Tarifs :**
\u2022 Forfait horaire ou forfait par prestation
\u2022 Devis gratuit sur demande
\u2022 Possibilit\xE9 d'intervention rapide`;
}
function generateGardeEnfantsOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Garde d'Enfants :**
${description.length > 50 ? description : "Garde d'enfants fiable et attentionn\xE9e pour assurer leur bien-\xEAtre et leur \xE9panouissement."}

**Informations sur les Enfants :**
\u2022 \xC2ge(s) : ${analysis.missing.includes("\xC2ge des enfants non pr\xE9cis\xE9") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*(?:ans?|années?)/i)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Nombre d'enfants : \xC0 pr\xE9ciser
\u2022 Besoins sp\xE9cifiques : (Allergies, suivi scolaire, activit\xE9s...)

**Conditions de Garde :**
\u2022 P\xE9riode : Journ\xE9e / Soir\xE9e / Week-end / Vacances scolaires
\u2022 Horaires : ${analysis.missing.includes("Horaires non sp\xE9cifi\xE9s") ? "\xC0 pr\xE9ciser" : description.match(/(\d{1,2}h(?::\d{2})?)\s*(?:à|-)\s*(\d{1,2}h(?::\d{2})?)/i)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Lieu : Domicile des parents / Domicile de la nounou
\u2022 T\xE2ches : Jeux, repas, aide aux devoirs, accompagnement activit\xE9s

**Profil du Gardien/de la Gardienne :**
\u2022 Exp\xE9rience significative avec les enfants
\u2022 Qualifications pertinentes (BAFA,PSC1...)
\u2022 Bienveillance, patience et dynamisme
\u2022 Fiabilit\xE9 et ponctualit\xE9
\u2022 R\xE9f\xE9rences v\xE9rifiables

**Livrables :**
\u2022 Enfants en s\xE9curit\xE9 et bienveill\xE9s
\u2022 Activit\xE9s stimulantes et adapt\xE9es
\u2022 Respect des consignes parentales
\u2022 Communication transparente avec les parents

**Tarifs :**
\u2022 Taux horaire selon exp\xE9rience et horaires
\u2022 Forfait possible pour garde r\xE9guli\xE8re
\u2022 Devis personnalis\xE9 sur demande`;
}
function generateJardinageOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Nature des Travaux de Jardinage :**
${description.length > 50 ? description : "Entretien et am\xE9nagement de votre jardin pour un espace ext\xE9rieur agr\xE9able et bien entretenu."}

**Prestations Propos\xE9es :**
\u2022 Tonte de pelouse
\u2022 Taille de haies et arbustes
\u2022 D\xE9sherbage et entretien massifs
\u2022 Plantation et entretien fleurs/plantes
\u2022 \xC9vacuation des d\xE9chets verts
\u2022 ${analysis.hasComplexFeatures ? "Am\xE9nagement paysager" : "Arrosage"}

**Informations sur le Jardin :**
\u2022 Surface approximative : ${analysis.missing.includes("Surface non indiqu\xE9e") ? "\xC0 pr\xE9ciser" : description.match(/\d+\s*m[²2]/)?.[0] || "\xC0 pr\xE9ciser"}
\u2022 Type d'espace : Jardin / Terrasse / Balcon
\u2022 Fr\xE9quence souhait\xE9e : Ponctuelle / R\xE9guli\xE8re (hebdomadaire, mensuelle)
\u2022 Travaux sp\xE9cifiques : \xC0 d\xE9finir

**Exigences :**
\u2022 Jardinier exp\xE9riment\xE9 et fiable
\u2022 Utilisation de mat\xE9riel professionnel adapt\xE9
\u2022 Respect de l'environnement
\u2022 Soin apport\xE9 aux v\xE9g\xE9taux
\u2022 Propret\xE9 apr\xE8s intervention

**Livrables :**
\u2022 Jardin propre, taill\xE9 et entretenu
\u2022 Pelouse soign\xE9e
\u2022 Espaces verts d\xE9sherb\xE9s et ordonn\xE9s
\u2022 D\xE9chets verts \xE9vacu\xE9s

**Tarifs :**
\u2022 Taux horaire ou forfait par intervention/surface
\u2022 Devis gratuit sur demande
\u2022 Tarifs d\xE9gressifs pour interventions r\xE9guli\xE8res`;
}
function generateComptabiliteOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin en Expertise Comptable :**
${description.length > 50 ? description : "Accompagnement professionnel pour la gestion de votre comptabilit\xE9 et optimisation fiscale."}

**Nature de la Prestation :**
\u2022 Tenue comptable compl\xE8te
\u2022 R\xE9vision comptable
\u2022 \xC9tablissement des comptes annuels
\u2022 D\xE9clarations fiscales (TVA, IS...)
\u2022 Conseil fiscal et optimisation
\u2022 ${analysis.hasComplexFeatures ? "Audit financier" : "Paie et gestion sociale"}

**Contexte de l'Entreprise :**
\u2022 Type d'entreprise : SA / SARL / SAS / Auto-entrepreneur / Association
\u2022 Secteur d'activit\xE9 : \xC0 pr\xE9ciser
\u2022 Chiffre d'affaires annuel : \xC0 d\xE9finir
\u2022 P\xE9riodicit\xE9 souhait\xE9e : Mensuelle / Trimestrielle / Annuelle

**Attentes du Client :**
\u2022 Fiabilit\xE9 et rigueur
\u2022 Respect des d\xE9lais r\xE9glementaires
\u2022 Confidentialit\xE9 des donn\xE9es
\u2022 Conseil personnalis\xE9 et r\xE9actif
\u2022 Optimisation de la charge fiscale

**Livrables :**
\u2022 Comptes annuels conformes
\u2022 D\xE9clarations fiscales et sociales \xE0 jour
\u2022 Bilans et comptes de r\xE9sultat
\u2022 Tableaux de bord et indicateurs cl\xE9s
\u2022 Conseils strat\xE9giques

**Profil Expert-Comptable :**
\u2022 Dipl\xF4me d'expertise comptable
\u2022 Exp\xE9rience dans votre secteur
\u2022 R\xE9f\xE9rences clients
\u2022 Proximit\xE9 g\xE9ographique ou digitale

**Modalit\xE9s :**
\u2022 Contrat de mission adapt\xE9
\u2022 Tarifs clairs et transparents
\u2022 Confidentialit\xE9 garantie
\u2022 Accompagnement personnalis\xE9`;
}
function generateGenericOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Description du Projet :**
${description.length > 50 ? description : "Nous recherchons un professionnel qualifi\xE9 pour r\xE9aliser ce projet avec succ\xE8s."}

**Objectifs :**
\u2022 Livraison d'un r\xE9sultat de haute qualit\xE9
\u2022 Respect des d\xE9lais convenus
\u2022 Communication transparente tout au long du projet
\u2022 ${analysis.hasComplexFeatures ? "Innovation et cr\xE9ativit\xE9" : "Satisfaction client garantie"}

**Exigences :**
\u2022 Exp\xE9rience prouv\xE9e dans le domaine
\u2022 Compr\xE9hension approfondie du besoin
\u2022 Proactivit\xE9 et r\xE9activit\xE9
\u2022 Professionnalisme et rigueur

**Livrables Attendus :**
\u2022 Produit fini conforme aux attentes
\u2022 Documentation compl\xE8te si n\xE9cessaire
\u2022 Support post-livraison

**Budget et D\xE9lais :**
\u2022 Budget : \xC0 d\xE9finir selon proposition
\u2022 D\xE9lai : ${analysis.isUrgent ? "Court" : "Moyen"}

**Pour Postuler :**
Merci de pr\xE9senter votre exp\xE9rience et votre approche pour ce projet.`;
}
function extractTechFromDescription(description) {
  const technologies = [];
  const techKeywords = {
    "React": ["react", "reactjs"],
    "Vue.js": ["vue", "vuejs", "vue.js"],
    "Angular": ["angular", "angularjs"],
    "Node.js": ["node", "nodejs", "node.js"],
    "PHP": ["php"],
    "Laravel": ["laravel"],
    "Symfony": ["symfony"],
    "Python": ["python", "django", "flask"],
    "WordPress": ["wordpress", "wp"],
    "Shopify": ["shopify"],
    "Magento": ["magento"],
    "MongoDB": ["mongodb", "mongo"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"]
  };
  const descLower = description.toLowerCase();
  for (const [tech, keywords] of Object.entries(techKeywords)) {
    if (keywords.some((keyword) => descLower.includes(keyword))) {
      technologies.push(tech);
    }
  }
  return technologies;
}
function extractFeaturesFromDescription(description) {
  const features = [];
  const featureKeywords = [
    "authentification",
    "login",
    "connexion",
    "paiement",
    "payment",
    "stripe",
    "paypal",
    "recherche",
    "search",
    "filtre",
    "admin",
    "administration",
    "gestion",
    "mobile",
    "responsive",
    "adaptatif",
    "api",
    "int\xE9gration",
    "webhook",
    "chat",
    "messaging",
    "notification",
    "analytics",
    "statistiques",
    "tracking"
  ];
  const descLower = description.toLowerCase();
  featureKeywords.forEach((keyword) => {
    if (descLower.includes(keyword)) {
      switch (keyword) {
        case "authentification":
        case "login":
        case "connexion":
          if (!features.includes("Syst\xE8me d'authentification s\xE9curis\xE9"))
            features.push("Syst\xE8me d'authentification s\xE9curis\xE9");
          break;
        case "paiement":
        case "payment":
        case "stripe":
        case "paypal":
          if (!features.includes("Int\xE9gration paiements en ligne"))
            features.push("Int\xE9gration paiements en ligne");
          break;
        case "recherche":
        case "search":
        case "filtre":
          if (!features.includes("Syst\xE8me de recherche avanc\xE9e"))
            features.push("Syst\xE8me de recherche avanc\xE9e");
          break;
        case "admin":
        case "administration":
        case "gestion":
          if (!features.includes("Interface d'administration"))
            features.push("Interface d'administration");
          break;
        case "mobile":
        case "responsive":
        case "adaptatif":
          if (!features.includes("Design responsive multi-appareils"))
            features.push("Design responsive multi-appareils");
          break;
      }
    }
  });
  return features;
}
function generateTransportOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Type de Transport :**
${description.length > 50 ? description : "Service de transport fiable pour vos besoins logistiques ou personnels."}

**Nature de la Prestation :**
\u2022 D\xE9m\xE9nagement (particulier, professionnel)
\u2022 Livraison de marchandises
\u2022 Transport de colis
\u2022 Location de v\xE9hicule utilitaire avec chauffeur
\u2022 Transfert a\xE9roport/gare
\u2022 ${analysis.hasComplexFeatures ? "Transport de mat\xE9riel sp\xE9cialis\xE9" : "Trajet ponctuel"}

**Informations Cl\xE9s :**
\u2022 Origine : \xC0 pr\xE9ciser
\u2022 Destination : \xC0 pr\xE9ciser
\u2022 Type de v\xE9hicule requis : Camionnette / Camion / Voiture
\u2022 Volume / Poids : \xC0 estimer
\u2022 Urgence : ${analysis.isUrgent ? "Urgente" : "Standard"}

**Exigences :**
\u2022 Ponctualit\xE9 et professionnalisme
\u2022 Soin dans la manutention
\u2022 Respect des d\xE9lais
\u2022 V\xE9hicule adapt\xE9 et entretenu
\u2022 Assurance transport

**Livrables :**
\u2022 Objet livr\xE9 \xE0 destination en bon \xE9tat
\u2022 Respect des horaires convenus
\u2022 Facture claire

**Tarifs :**
\u2022 Devis gratuit sur demande
\u2022 Tarification selon distance, volume et urgence`;
}
function generateBeauteBienEtreOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Soins Beaut\xE9/Bien-\xEAtre :**
${description.length > 50 ? description : "Profitez de prestations de beaut\xE9 et de bien-\xEAtre personnalis\xE9es \xE0 votre domicile."}

**Type de Prestation :**
\u2022 Coiffure (coupe, couleur, brushing)
\u2022 Soins esth\xE9tiques (manucure, p\xE9dicure, \xE9pilation)
\u2022 Modelage et massage relaxant
\u2022 Maquillage professionnel
\u2022 ${analysis.hasComplexFeatures ? "Conseil en image" : "Soins du visage"}

**Informations sur la Prestation :**
\u2022 Lieu : Domicile / Studio
\u2022 P\xE9riode souhait\xE9e : Journ\xE9e / Soir\xE9e / Week-end
\u2022 Fr\xE9quence : Ponctuelle / R\xE9guli\xE8re

**Profil du Professionnel :**
\u2022 Dipl\xF4m\xE9(e) et exp\xE9riment\xE9(e)
\u2022 Mat\xE9riel professionnel et produits de qualit\xE9
\u2022 Hygi\xE8ne et discr\xE9tion irr\xE9prochables
\u2022 Ponctualit\xE9 et professionnalisme

**Livrables :**
\u2022 R\xE9sultat conforme aux attentes
\u2022 Moment de d\xE9tente et de bien-\xEAtre

**Tarifs :**
\u2022 Tarifs \xE0 la prestation ou forfait
\u2022 Devis personnalis\xE9 sur demande`;
}
function generateServicesProOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Services Professionnels :**
${description.length > 50 ? description : "Accompagnement de votre activit\xE9 professionnelle par des experts dans divers domaines."}

**Domaine de Service :**
\u2022 Conseil juridique / fiscal
\u2022 Aide \xE0 la cr\xE9ation d'entreprise
\u2022 Gestion administrative et comptable
\u2022 Formation professionnelle
\u2022 D\xE9veloppement web / mobile
\u2022 ${analysis.hasComplexFeatures ? "Audit de s\xE9curit\xE9" : "Strat\xE9gie commerciale"}

**Objectifs :**
\u2022 Optimiser la gestion de votre entreprise
\u2022 Am\xE9liorer votre performance
\u2022 Respecter vos obligations l\xE9gales
\u2022 D\xE9velopper vos comp\xE9tences

**Profil du Prestataire :**
\u2022 Expertise reconnue dans son domaine
\u2022 Exp\xE9rience significative aupr\xE8s des entreprises
\u2022 Capacit\xE9 d'analyse et de conseil
\u2022 Confidentialit\xE9 et rigueur

**Livrables :**
\u2022 Rapports d'audit, analyses
\u2022 Documents juridiques et fiscaux
\u2022 Plans d'action et recommandations
\u2022 Formations adapt\xE9es

**Modalit\xE9s :**
\u2022 Devis gratuit sur demande
\u2022 Interventions sur site ou \xE0 distance
\u2022 Confidentialit\xE9 garantie`;
}
function generateEvenementielOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Organisation d'\xC9v\xE9nement :**
${description.length > 50 ? description : "Conception et r\xE9alisation d'\xE9v\xE9nements m\xE9morables et r\xE9ussis pour vos besoins professionnels ou personnels."}

**Type d'\xC9v\xE9nement :**
\u2022 Mariage
\u2022 Anniversaire
\u2022 S\xE9minaire d'entreprise
\u2022 Lancement de produit
\u2022 Soir\xE9e de gala
\u2022 ${analysis.hasComplexFeatures ? "Festival / Concert" : "Cocktail"}

**Prestations :**
\u2022 Recherche de lieu
\u2022 Conception du concept
\u2022 Gestion du budget
\u2022 Coordination des prestataires (traiteur, DJ, photographe...)
\u2022 D\xE9coration et ambiance
\u2022 Logistique et accueil

**Exigences :**
\u2022 Cr\xE9ativit\xE9 et sens de l'organisation
\u2022 R\xE9activit\xE9 et gestion du stress
\u2022 Souci du d\xE9tail
\u2022 Respect des d\xE9lais et du budget

**Livrables :**
\u2022 \xC9v\xE9nement cl\xE9 en main parfaitement orchestr\xE9
\u2022 Exp\xE9rience m\xE9morable pour les participants

**Tarifs :**
\u2022 Forfait d'organisation selon l'\xE9v\xE9nement
\u2022 Commission sur les prestataires
\u2022 Devis personnalis\xE9 sur demande`;
}
function generateEnseignementOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Besoin de Soutien Scolaire/Cours :**
${description.length > 50 ? description : "Accompagnement p\xE9dagogique personnalis\xE9 pour favoriser la r\xE9ussite scolaire et le d\xE9veloppement des comp\xE9tences."}

**Niveau Concern\xE9 :**
\u2022 Primaire
\u2022 Coll\xE8ge
\u2022 Lyc\xE9e
\u2022 Sup\xE9rieur
\u2022 Adulte

**Mati\xE8res Propos\xE9es :**
\u2022 Fran\xE7ais
\u2022 Math\xE9matiques
\u2022 Anglais / Autres langues
\u2022 Physique-Chimie
\u2022 Histoire-G\xE9ographie
\u2022 ${analysis.hasComplexFeatures ? "Informatique / Programmation" : "SVT"}

**Objectifs :**
\u2022 Soutien m\xE9thodologique
\u2022 Consolidation des acquis
\u2022 Pr\xE9paration aux examens
\u2022 Approfondissement des connaissances
\u2022 D\xE9veloppement de l'autonomie

**Profil du Formateur :**
\u2022 P\xE9dagogue et patient
\u2022 Dipl\xF4m\xE9(e) ou expert(e) dans sa mati\xE8re
\u2022 Exp\xE9rience dans l'enseignement / soutien scolaire
\u2022 Capacit\xE9 d'adaptation

**Livrables :**
\u2022 Progression mesurable de l'apprenant
\u2022 Meilleure compr\xE9hension des mati\xE8res
\u2022 Confiance en soi renforc\xE9e

**Tarifs :**
\u2022 Taux horaire selon niveau et mati\xE8re
\u2022 Forfait possible pour stages intensifs
\u2022 Devis personnalis\xE9 sur demande`;
}
function generateAnimauxOptimizedDescription(description, title, analysis) {
  return `**${title}**

**Service pour Animaux :**
${description.length > 50 ? description : "Prestations professionnelles et attentionn\xE9es pour le bien-\xEAtre de vos compagnons \xE0 quatre pattes."}

**Type de Service :**
\u2022 Garde d'animaux (pension, famille d'accueil)
\u2022 Promenade / L\xE2cher
\u2022 Toilettage
\u2022 Dressage / \xC9ducation canine
\u2022 Visite \xE0 domicile
\u2022 ${analysis.hasComplexFeatures ? "Transport d'animaux" : "Garde ponctuelle"}

**Informations sur l'Animal :**
\u2022 Esp\xE8ce : Chien / Chat / Autre
\u2022 Race : \xC0 pr\xE9ciser
\u2022 \xC2ge : \xC0 pr\xE9ciser
\u2022 Comportement / Besoins sp\xE9cifiques : (Sant\xE9, alimentation, caract\xE8re...)

**Exigences :**
\u2022 Amour et respect des animaux
\u2022 Exp\xE9rience et comp\xE9tences adapt\xE9es
\u2022 Patience et bienveillance
\u2022 Fiabilit\xE9 et ponctualit\xE9
\u2022 Environnement s\xE9curis\xE9 et stimulant

**Livrables :**
\u2022 Animal soign\xE9, heureux et en s\xE9curit\xE9
\u2022 Compte-rendu des activit\xE9s
\u2022 Animal propre et bien pr\xE9sent\xE9 (toilettage)

**Tarifs :**
\u2022 Tarification \xE0 la journ\xE9e, \xE0 la semaine ou \xE0 la prestation
\u2022 Devis personnalis\xE9 sur demande`;
}
app.post("/api/ai/predict-revenue", (req, res) => {
  const { missionData, providerData } = req.body;
  const mockPrediction = {
    estimatedRevenue: Math.floor(Math.random() * 1e4) + 2e3,
    confidence: Math.floor(Math.random() * 40) + 60,
    factors: [
      "Historique de prix similaires",
      "Complexit\xE9 du projet",
      "Demande du march\xE9"
    ]
  };
  res.json(mockPrediction);
});
app.post("/api/ai/detect-dumping", (req, res) => {
  const { bidData } = req.body;
  const mockDetection = {
    isDumping: Math.random() > 0.7,
    confidenceLevel: Math.floor(Math.random() * 50) + 50,
    reasons: Math.random() > 0.5 ? [
      "Prix 40% en dessous de la moyenne march\xE9",
      "Pattern inhabituel dans les ench\xE8res"
    ] : [],
    recommendedMinPrice: Math.floor(Math.random() * 2e3) + 1e3
  };
  res.json(mockDetection);
});
app.post("/api/ai/detect-abuse", (req, res) => {
  const { bidData } = req.body;
  const mockAbuse = {
    isAbuse: Math.random() > 0.8,
    confidence: Math.floor(Math.random() * 40) + 60,
    reasons: Math.random() > 0.5 ? [
      "Pattern de soumission suspect",
      "Prix anormalement bas r\xE9p\xE9t\xE9"
    ] : [],
    severity: Math.random() > 0.7 ? "high" : "medium"
  };
  res.json(mockAbuse);
});
app.post("/api/ai/bidding-guidance", (req, res) => {
  const { missionData, providerData } = req.body;
  const basePrice = missionData.budget || 5e3;
  const suggestedBid = Math.round(basePrice * (0.7 + Math.random() * 0.3));
  const mockGuidance = {
    suggestedBid,
    reasoning: [
      "Bas\xE9 sur votre profil et l'historique de prix",
      "Tient compte de la concurrence actuelle",
      "Optimis\xE9 pour maximiser vos chances de succ\xE8s"
    ],
    confidence: Math.floor(Math.random() * 30) + 70,
    competitorAnalysis: {
      averageBid: basePrice * 0.85,
      yourPosition: "competitive",
      winProbability: Math.floor(Math.random() * 40) + 60
    }
  };
  res.json(mockGuidance);
});
app.post("/api/ai/market-analysis", (req, res) => {
  const { category, location } = req.body;
  const mockAnalysis = {
    demandLevel: Math.random() > 0.5 ? "high" : "medium",
    competitionLevel: Math.random() > 0.5 ? "medium" : "low",
    averageBudget: Math.floor(Math.random() * 5e3) + 2e3,
    trendingSkills: ["React", "Node.js", "TypeScript", "Python"],
    marketHeat: Math.floor(Math.random() * 100),
    recommendations: [
      "Forte demande en d\xE9veloppement web",
      "Les projets IA sont en hausse",
      "Comp\xE9titivit\xE9 mod\xE9r\xE9e dans votre r\xE9gion"
    ]
  };
  res.json(mockAnalysis);
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const user = {
    id: 1,
    name: email.split("@")[0],
    email,
    type: "client"
  };
  res.json({ user });
});
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, type } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caract\xE8res" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format d'email invalide" });
  }
  const user = {
    id: Date.now(),
    name: name || email.split("@")[0],
    email: email.trim().toLowerCase(),
    type: type || "client"
  };
  res.status(201).json({
    user,
    message: "Compte cr\xE9\xE9 avec succ\xE8s"
  });
});
app.get("*", (req, res) => {
  try {
    const indexPath = path.join(__dirname, "../dist/public/index.html");
    res.sendFile(indexPath);
  } catch (error) {
    console.error("Error serving index.html:", error);
    res.status(500).send("<!DOCTYPE html><html><body><h1>AppelsPro Loading...</h1><script>window.location.reload()</script></body></html>");
  }
});
app.listen(port, "0.0.0.0", () => {
  console.log(`\u{1F680} AppelsPro server running on http://0.0.0.0:${port}`);
  console.log(`\u{1F4F1} Frontend: http://0.0.0.0:${port}`);
  console.log(`\u{1F527} API Health: http://0.0.0.0:${port}/api/health`);
}).on("error", (err) => {
  console.error("\u274C Server failed to start:", err.message);
  process.exit(1);
});
