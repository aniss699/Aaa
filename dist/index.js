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
    category: "development",
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
    return res.status(404).json({ error: "Mission non trouv\xE9e" });
  }
  res.json(mission);
});
app.get("/api/missions-demo", (req, res) => {
  const demoMissions = [
    {
      id: "mission1",
      title: "D\xE9veloppement d'une application mobile de e-commerce",
      description: "Je recherche un d\xE9veloppeur exp\xE9riment\xE9 pour cr\xE9er une application mobile compl\xE8te de vente en ligne avec syst\xE8me de paiement int\xE9gr\xE9.",
      category: "development",
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
      category: "development",
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
app.post("/api/ai/analyze-bid", (req, res) => {
  const { projectData, bidData } = req.body;
  const mockAnalysis = {
    score: Math.floor(Math.random() * 100),
    priceAnalysis: {
      competitiveness: Math.floor(Math.random() * 100),
      marketPosition: "competitive"
    },
    riskAssessment: {
      technical: Math.floor(Math.random() * 100),
      timeline: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 100)
    },
    recommendations: [
      "Consid\xE9rez ajuster le prix de 5-10%",
      "Mettez en avant votre exp\xE9rience similaire",
      "Proposez un d\xE9lai plus pr\xE9cis"
    ]
  };
  res.json(mockAnalysis);
});
app.post("/api/ai/match-missions", (req, res) => {
  const { providerProfile } = req.body;
  const mockMatches = [
    {
      id: 1,
      title: "D\xE9veloppement d'application mobile",
      matchScore: 85,
      reasons: ["Comp\xE9tences React Native", "Exp\xE9rience mobile", "Localisation proche"]
    },
    {
      id: 2,
      title: "Site web e-commerce",
      matchScore: 72,
      reasons: ["Stack technique compatible", "Budget align\xE9"]
    }
  ];
  res.json(mockMatches);
});
app.post("/api/ai/price-analysis", (req, res) => {
  const { category, description, location, complexity } = req.body;
  const basePrice = {
    "development": 5e3,
    "design": 2e3,
    "marketing": 1500,
    "mobile": 8e3,
    "ai": 12e3
  }[category] || 3e3;
  const complexityMultiplier = complexity / 5;
  const suggestedPrice = Math.round(basePrice * complexityMultiplier);
  const priceRange = {
    min: Math.round(suggestedPrice * 0.8),
    max: Math.round(suggestedPrice * 1.3)
  };
  const mockAnalysis = {
    suggestedPrice,
    priceRange,
    reasoning: `Bas\xE9 sur la cat\xE9gorie ${category}, complexit\xE9 ${complexity}/10 et analyse du march\xE9`,
    marketContext: {
      demandLevel: Math.random() > 0.5 ? "high" : "medium",
      competitionLevel: Math.random() > 0.5 ? "medium" : "low"
    }
  };
  res.json(mockAnalysis);
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
  if (!description.toLowerCase().includes("budget") && !description.includes("\u20AC")) {
    improvements.push("Mentionner une fourchette budg\xE9taire indicative");
    missingElements.push("Budget non pr\xE9cis\xE9");
  }
  if (!description.toLowerCase().includes("d\xE9lai") && !description.toLowerCase().includes("quand")) {
    improvements.push("Pr\xE9ciser les d\xE9lais souhait\xE9s");
    missingElements.push("D\xE9lais absents");
  }
  if (!description.toLowerCase().match(/(react|vue|angular|php|python|javascript|node)/)) {
    improvements.push("Sp\xE9cifier les technologies pr\xE9f\xE9r\xE9es si applicables");
    missingElements.push("Technologies non mentionn\xE9es");
  }
  if (!description.toLowerCase().includes("livrable")) {
    improvements.push("D\xE9tailler les livrables attendus");
    missingElements.push("Livrables flous");
  }
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
      demandLevel: Math.random() > 0.5 ? "high" : "medium",
      competitionLevel: Math.random() > 0.5 ? "medium" : "low",
      suggestedBudgetRange: suggestBudgetRange(description, category)
    }
  };
  res.json(analysis);
});
function generateOptimizedDescription(description, category, title) {
  const baseDesc = description || "Description du projet";
  return `**${title || "Projet \xE0 d\xE9finir"}**

**Contexte et Objectifs :**
${baseDesc}

**Livrables Attendus :**
\u2022 Solution compl\xE8te et fonctionnelle
\u2022 Code source document\xE9 et comment\xE9
\u2022 Tests unitaires et documentation technique
\u2022 Formation/support utilisateur inclus

**Comp\xE9tences Techniques Recherch\xE9es :**
\u2022 Ma\xEEtrise des technologies modernes du ${category || "d\xE9veloppement"}
\u2022 Exp\xE9rience en bonnes pratiques de d\xE9veloppement
\u2022 Capacit\xE9 \xE0 travailler en m\xE9thodologie agile
\u2022 Communication fluide et r\xE9guli\xE8re

**Crit\xE8res de S\xE9lection :**
\u2022 Portfolio de projets similaires
\u2022 R\xE9f\xE9rences clients v\xE9rifiables
\u2022 M\xE9thodologie de travail structur\xE9e
\u2022 Disponibilit\xE9 et r\xE9activit\xE9

**Budget et Modalit\xE9s :**
\u2022 Budget \xE0 d\xE9finir selon proposition d\xE9taill\xE9e
\u2022 Paiement \xE9chelonn\xE9 selon avancement
\u2022 Possibilit\xE9 de facturation en r\xE9gie ou forfait

**Suivi et Communication :**
\u2022 Points d'avancement r\xE9guliers
\u2022 Livraison par phases si n\xE9cessaire
\u2022 Support post-livraison inclus`;
}
function extractSkillsFromDescription(description) {
  const skillsMap = {
    "react": "React.js",
    "vue": "Vue.js",
    "angular": "Angular",
    "php": "PHP",
    "python": "Python",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "node": "Node.js",
    "sql": "SQL/Database",
    "mongodb": "MongoDB",
    "postgresql": "PostgreSQL",
    "docker": "Docker",
    "aws": "AWS Cloud"
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
  let complexity = 3;
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("api") || lowerDesc.includes("int\xE9gration")) complexity += 1;
  if (lowerDesc.includes("paiement") || lowerDesc.includes("payment")) complexity += 2;
  if (lowerDesc.includes("mobile") && lowerDesc.includes("web")) complexity += 2;
  if (lowerDesc.includes("temps r\xE9el") || lowerDesc.includes("real-time")) complexity += 2;
  if (lowerDesc.includes("ia") || lowerDesc.includes("intelligence artificielle")) complexity += 3;
  if (lowerDesc.includes("blockchain") || lowerDesc.includes("crypto")) complexity += 3;
  return Math.min(complexity, 10);
}
function suggestCategories(description) {
  const lowerDesc = description.toLowerCase();
  const categories = [];
  if (lowerDesc.includes("site") || lowerDesc.includes("web")) {
    categories.push("development");
  }
  if (lowerDesc.includes("mobile") || lowerDesc.includes("application")) {
    categories.push("mobile");
  }
  if (lowerDesc.includes("design") || lowerDesc.includes("ui") || lowerDesc.includes("ux")) {
    categories.push("design");
  }
  if (lowerDesc.includes("marketing") || lowerDesc.includes("publicit\xE9")) {
    categories.push("marketing");
  }
  if (lowerDesc.includes("ia") || lowerDesc.includes("intelligence")) {
    categories.push("ai");
  }
  return categories.length > 0 ? categories : ["development"];
}
function suggestBudgetRange(description, category) {
  const baseBudgets = {
    "development": [2e3, 8e3],
    "mobile": [3e3, 12e3],
    "design": [800, 3e3],
    "marketing": [1e3, 5e3],
    "ai": [5e3, 2e4]
  };
  const baseRange = baseBudgets[category] || [2e3, 6e3];
  const complexity = estimateComplexity(description);
  const multiplier = 0.5 + complexity / 10 * 1.5;
  return {
    min: Math.round(baseRange[0] * multiplier),
    max: Math.round(baseRange[1] * multiplier)
  };
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
