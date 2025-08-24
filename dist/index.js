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
  const categorySpecificAnalysis = analyzeCategorySpecific(description, category);
  improvements.push(...categorySpecificAnalysis.improvements);
  missingElements.push(...categorySpecificAnalysis.missing);
  const optimizedDescription = generateOptimizedDescription(description, category, title);
  const suggestedFields = generateSuggestedFields(description, category);
  const analysis = {
    qualityScore,
    improvements,
    missingElements,
    optimizedDescription,
    detectedSkills: extractSkillsFromDescription(description, category),
    estimatedComplexity: estimateComplexity(description, category),
    suggestedCategories: category ? [category] : suggestCategories(description),
    suggestedFields,
    // Nouveaux champs dynamiques
    marketInsights: {
      demandLevel: Math.random() > 0.5 ? "high" : "medium",
      competitionLevel: Math.random() > 0.5 ? "medium" : "low",
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
        improvements.push("Sp\xE9cifier les technologies pr\xE9f\xE9r\xE9es");
        missing.push("Technologies non mentionn\xE9es");
      }
      if (!lowerDesc.includes("api") && !lowerDesc.includes("base de donn\xE9es")) {
        improvements.push("Pr\xE9ciser les int\xE9grations techniques");
      }
      if (!lowerDesc.includes("responsive") && !lowerDesc.includes("mobile")) {
        improvements.push("Indiquer si compatibilit\xE9 mobile requise");
      }
    },
    mobile: () => {
      if (!lowerDesc.includes("ios") && !lowerDesc.includes("android")) {
        improvements.push("Pr\xE9ciser les plateformes cibles (iOS/Android)");
        missing.push("Plateformes non sp\xE9cifi\xE9es");
      }
      if (!lowerDesc.includes("store") && !lowerDesc.includes("publication")) {
        improvements.push("Indiquer si publication sur stores n\xE9cessaire");
      }
    },
    construction: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Pr\xE9ciser la surface en m\xB2");
        missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("\xE9tage") && !lowerDesc.includes("niveau")) {
        improvements.push("Indiquer le nombre d'\xE9tages");
      }
      if (!lowerDesc.includes("acc\xE8s") && !lowerDesc.includes("parking")) {
        improvements.push("Mentionner les contraintes d'acc\xE8s");
      }
    },
    plomberie: () => {
      if (!lowerDesc.includes("urgent") && !lowerDesc.includes("d\xE9lai")) {
        improvements.push("Pr\xE9ciser l'urgence de l'intervention");
      }
      if (!lowerDesc.includes("\xE9tage") && !lowerDesc.includes("niveau")) {
        improvements.push("Indiquer l'\xE9tage de l'intervention");
      }
    },
    electricite: () => {
      if (!lowerDesc.includes("norme") && !lowerDesc.includes("consuel")) {
        improvements.push("Pr\xE9ciser si mise aux normes n\xE9cessaire");
      }
      if (!lowerDesc.includes("tableau") && !lowerDesc.includes("disjoncteur")) {
        improvements.push("D\xE9tailler l'installation \xE9lectrique existante");
      }
    },
    menage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Pr\xE9ciser la surface du logement");
        missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("fr\xE9quence") && !lowerDesc.includes("semaine")) {
        improvements.push("Indiquer la fr\xE9quence souhait\xE9e");
      }
    },
    garde_enfants: () => {
      if (!lowerDesc.match(/\d+\s*(?:ans?|années?)/)) {
        improvements.push("Pr\xE9ciser l'\xE2ge des enfants");
        missing.push("\xC2ge des enfants non pr\xE9cis\xE9");
      }
      if (!lowerDesc.includes("horaire") && !lowerDesc.includes("heure")) {
        improvements.push("D\xE9tailler les horaires de garde");
      }
    },
    jardinage: () => {
      if (!lowerDesc.match(/\d+\s*m[²2]/)) {
        improvements.push("Pr\xE9ciser la surface du jardin");
        missing.push("Surface non indiqu\xE9e");
      }
      if (!lowerDesc.includes("tonte") && !lowerDesc.includes("taille") && !lowerDesc.includes("entretien")) {
        improvements.push("D\xE9tailler les travaux de jardinage souhait\xE9s");
      }
    },
    comptabilite: () => {
      if (!lowerDesc.includes("entreprise") && !lowerDesc.includes("soci\xE9t\xE9")) {
        improvements.push("Pr\xE9ciser le type d'entreprise");
      }
      if (!lowerDesc.includes("mensuel") && !lowerDesc.includes("trimestre") && !lowerDesc.includes("annuel")) {
        improvements.push("Indiquer la p\xE9riodicit\xE9 souhait\xE9e");
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
        label: "Technologies pr\xE9f\xE9r\xE9es",
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
        label: "Nombre de pages/fonctionnalit\xE9s",
        type: "number",
        placeholder: "Ex: 5 pages principales",
        suggested: !lowerDesc.includes("page"),
        priority: "medium"
      }
    ],
    mobile: [
      {
        label: "Plateformes cibles",
        type: "multiselect",
        options: ["iOS", "Android", "Cross-platform"],
        suggested: !lowerDesc.includes("ios") && !lowerDesc.includes("android"),
        priority: "high"
      },
      {
        label: "Publication sur stores",
        type: "boolean",
        suggested: !lowerDesc.includes("store"),
        priority: "high"
      },
      {
        label: "Fonctionnalit\xE9s sp\xE9ciales",
        type: "multiselect",
        options: ["G\xE9olocalisation", "Push notifications", "Paiement int\xE9gr\xE9", "Mode offline", "Appareil photo"],
        suggested: true,
        priority: "medium"
      }
    ],
    construction: [
      {
        label: "Surface des travaux (m\xB2)",
        type: "number",
        placeholder: "Surface en m\xE8tres carr\xE9s",
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
        label: "Contraintes d'acc\xE8s",
        type: "text",
        placeholder: "Ex: 3\xE8me \xE9tage sans ascenseur, parking possible",
        suggested: !lowerDesc.includes("acc\xE8s"),
        priority: "medium"
      }
    ],
    plomberie: [
      {
        label: "Urgence de l'intervention",
        type: "select",
        options: ["Urgence imm\xE9diate", "Dans la semaine", "Sous 15 jours", "Flexible"],
        suggested: !lowerDesc.includes("urgent"),
        priority: "high"
      },
      {
        label: "Type d'intervention",
        type: "select",
        options: ["R\xE9paration fuite", "Installation neuve", "Maintenance", "D\xE9pannage"],
        suggested: true,
        priority: "high"
      },
      {
        label: "\xC9tage de l'intervention",
        type: "select",
        options: ["Rez-de-chauss\xE9e", "1er \xE9tage", "2\xE8me \xE9tage", "Plus haut"],
        suggested: !lowerDesc.includes("\xE9tage"),
        priority: "medium"
      }
    ],
    electricite: [
      {
        label: "Mise aux normes n\xE9cessaire",
        type: "boolean",
        suggested: !lowerDesc.includes("norme"),
        priority: "high"
      },
      {
        label: "Type d'installation",
        type: "multiselect",
        options: ["\xC9clairage", "Prises \xE9lectriques", "Tableau \xE9lectrique", "Domotique", "Borne de recharge"],
        suggested: true,
        priority: "high"
      },
      {
        label: "Certification Consuel requise",
        type: "boolean",
        suggested: !lowerDesc.includes("consuel"),
        priority: "medium"
      }
    ],
    menage: [
      {
        label: "Surface du logement (m\xB2)",
        type: "number",
        placeholder: "Surface en m\xE8tres carr\xE9s",
        suggested: !lowerDesc.match(/\d+\s*m[²2]/),
        priority: "high"
      },
      {
        label: "Fr\xE9quence souhait\xE9e",
        type: "select",
        options: ["Hebdomadaire", "Bi-mensuelle", "Mensuelle", "Ponctuelle"],
        suggested: !lowerDesc.includes("fr\xE9quence"),
        priority: "high"
      },
      {
        label: "T\xE2ches sp\xE9cifiques",
        type: "multiselect",
        options: ["Repassage", "M\xE9nage int\xE9rieur", "Vitres", "Cuisine", "Sanitaires"],
        suggested: true,
        priority: "medium"
      }
    ],
    garde_enfants: [
      {
        label: "\xC2ge des enfants",
        type: "text",
        placeholder: "Ex: 3 et 7 ans",
        suggested: !lowerDesc.match(/\d+\s*(?:ans?|années?)/),
        priority: "high"
      },
      {
        label: "Horaires de garde",
        type: "text",
        placeholder: "Ex: 8h-18h du lundi au vendredi",
        suggested: !lowerDesc.includes("horaire"),
        priority: "high"
      },
      {
        label: "Activit\xE9s souhait\xE9es",
        type: "multiselect",
        options: ["Aide aux devoirs", "Activit\xE9s cr\xE9atives", "Sorties parc", "Jeux \xE9ducatifs", "Cuisine simple"],
        suggested: true,
        priority: "medium"
      }
    ]
  };
  const categoryFields = fieldsByCategory[category] || [];
  return categoryFields.filter((field) => field.suggested && field.priority !== "low").sort((a, b) => a.priority === "high" ? -1 : 1).slice(0, 4);
}
function generateOptimizedDescription(description, category, title) {
  const baseDesc = description || "Description du projet";
  const categoryTemplates = {
    "development": {
      title: "D\xE9veloppement Logiciel",
      livrables: [
        "\u2022 Code source propre et document\xE9",
        "\u2022 Tests unitaires et d'int\xE9gration",
        "\u2022 Documentation technique compl\xE8te",
        "\u2022 D\xE9ploiement et mise en production",
        "\u2022 Formation utilisateur si n\xE9cessaire"
      ],
      competences: [
        "\u2022 Ma\xEEtrise des technologies modernes (React, Vue.js, Node.js, etc.)",
        "\u2022 Exp\xE9rience en architecture logicielle",
        "\u2022 Connaissance des bonnes pratiques de s\xE9curit\xE9",
        "\u2022 M\xE9thodologies agiles (Scrum, Kanban)"
      ],
      criteres: [
        "\u2022 Portfolio de projets similaires",
        "\u2022 Exp\xE9rience avec les technologies requises",
        "\u2022 R\xE9f\xE9rences clients dans le d\xE9veloppement",
        "\u2022 Capacit\xE9 \xE0 respecter les d\xE9lais"
      ]
    },
    "design": {
      title: "Projet Design",
      livrables: [
        "\u2022 Maquettes graphiques haute fid\xE9lit\xE9",
        "\u2022 Charte graphique compl\xE8te",
        "\u2022 Fichiers sources (PSD, Figma, etc.)",
        "\u2022 Guide d'utilisation de la marque",
        "\u2022 Adaptations pour diff\xE9rents supports"
      ],
      competences: [
        "\u2022 Ma\xEEtrise des outils de design (Photoshop, Illustrator, Figma)",
        "\u2022 Connaissance UX/UI et ergonomie",
        "\u2022 Sens artistique et cr\xE9ativit\xE9",
        "\u2022 Compr\xE9hension des tendances visuelles"
      ],
      criteres: [
        "\u2022 Portfolio cr\xE9atif et diversifi\xE9",
        "\u2022 Style en ad\xE9quation avec le projet",
        "\u2022 Exp\xE9rience dans le secteur d'activit\xE9",
        "\u2022 Capacit\xE9 d'adaptation et d'\xE9coute"
      ]
    },
    "marketing": {
      title: "Campagne Marketing",
      livrables: [
        "\u2022 Strat\xE9gie marketing document\xE9e",
        "\u2022 Contenus cr\xE9atifs (visuels, textes)",
        "\u2022 Calendrier de publication",
        "\u2022 Reporting et analytics d\xE9taill\xE9s",
        "\u2022 Recommandations d'optimisation"
      ],
      competences: [
        "\u2022 Expertise en marketing digital et r\xE9seaux sociaux",
        "\u2022 Ma\xEEtrise des outils analytics (Google Analytics, etc.)",
        "\u2022 Connaissance des tendances marketing",
        "\u2022 Capacit\xE9 de cr\xE9ation de contenu engageant"
      ],
      criteres: [
        "\u2022 Exp\xE9rience dans des campagnes similaires",
        "\u2022 R\xE9sultats mesurables sur projets pr\xE9c\xE9dents",
        "\u2022 Connaissance du secteur d'activit\xE9",
        "\u2022 Cr\xE9ativit\xE9 et innovation"
      ]
    },
    "mobile": {
      title: "Application Mobile",
      livrables: [
        "\u2022 Application native ou cross-platform",
        "\u2022 Code source et documentation",
        "\u2022 Tests sur diff\xE9rents appareils",
        "\u2022 Publication sur les stores (si demand\xE9e)",
        "\u2022 Guide de maintenance"
      ],
      competences: [
        "\u2022 D\xE9veloppement mobile (React Native, Flutter, natif)",
        "\u2022 Connaissance des guidelines iOS/Android",
        "\u2022 Exp\xE9rience UX mobile",
        "\u2022 Int\xE9gration API et services backend"
      ],
      criteres: [
        "\u2022 Portfolio d'applications mobiles",
        "\u2022 Exp\xE9rience avec les technologies requises",
        "\u2022 Applications publi\xE9es sur les stores",
        "\u2022 Connaissance des bonnes pratiques mobiles"
      ]
    },
    "ai": {
      title: "Projet Intelligence Artificielle",
      livrables: [
        "\u2022 Mod\xE8le IA entra\xEEn\xE9 et optimis\xE9",
        "\u2022 Documentation technique d\xE9taill\xE9e",
        "\u2022 API d'int\xE9gration",
        "\u2022 M\xE9triques de performance",
        "\u2022 Guide de d\xE9ploiement et maintenance"
      ],
      competences: [
        "\u2022 Expertise en Machine Learning et Deep Learning",
        "\u2022 Ma\xEEtrise Python, TensorFlow, PyTorch",
        "\u2022 Connaissance des algorithmes d'IA",
        "\u2022 Exp\xE9rience en d\xE9ploiement de mod\xE8les"
      ],
      criteres: [
        "\u2022 Projets IA r\xE9alis\xE9s avec succ\xE8s",
        "\u2022 Publications ou certifications en IA",
        "\u2022 Compr\xE9hension des enjeux m\xE9tier",
        "\u2022 Capacit\xE9 d'innovation technique"
      ]
    },
    "construction": {
      title: "Travaux de Construction",
      livrables: [
        "\u2022 R\xE9alisation des travaux selon les r\xE8gles de l'art",
        "\u2022 Fourniture des mat\xE9riaux conformes aux normes",
        "\u2022 Nettoyage et \xE9vacuation des d\xE9chets de chantier",
        "\u2022 Garantie d\xE9cennale sur les travaux r\xE9alis\xE9s",
        "\u2022 Attestation de conformit\xE9 et factures d\xE9taill\xE9es"
      ],
      competences: [
        "\u2022 Qualification professionnelle dans le corps de m\xE9tier",
        "\u2022 Connaissance des normes du b\xE2timent (RT2012, RE2020)",
        "\u2022 Mat\xE9riel et outillage professionnel certifi\xE9",
        "\u2022 Assurance responsabilit\xE9 civile et d\xE9cennale"
      ],
      criteres: [
        "\u2022 Photos de r\xE9alisations similaires",
        "\u2022 Certifications RGE si applicable",
        "\u2022 Assurance d\xE9cennale valide",
        "\u2022 Respect des d\xE9lais et devis transparent"
      ]
    },
    "renovation": {
      title: "Travaux de R\xE9novation",
      livrables: [
        "\u2022 R\xE9novation compl\xE8te selon cahier des charges",
        "\u2022 Mise aux normes \xE9lectriques et plomberie si n\xE9cessaire",
        "\u2022 Finitions soign\xE9es (peinture, rev\xEAtements)",
        "\u2022 Nettoyage approfondi post-travaux",
        "\u2022 Garantie sur l'ensemble des prestations"
      ],
      competences: [
        "\u2022 Multi-comp\xE9tences en second \u0153uvre",
        "\u2022 Exp\xE9rience en r\xE9novation d'anciens b\xE2timents",
        "\u2022 Connaissance des mat\xE9riaux \xE9cologiques",
        "\u2022 Coordination avec diff\xE9rents corps de m\xE9tier"
      ],
      criteres: [
        "\u2022 Portfolio de r\xE9novations r\xE9ussies",
        "\u2022 Avis clients v\xE9rifi\xE9s",
        "\u2022 Capacit\xE9 d'adaptation aux impr\xE9vus",
        "\u2022 Transparence sur les co\xFBts additionnels"
      ]
    },
    "plomberie": {
      title: "Travaux de Plomberie",
      livrables: [
        "\u2022 Installation ou r\xE9paration selon normes DTU",
        "\u2022 Test d'\xE9tanch\xE9it\xE9 et mise en pression",
        "\u2022 Remise en \xE9tat des surfaces (carrelage, cloisons)",
        "\u2022 Nettoyage et \xE9vacuation des d\xE9chets",
        "\u2022 Garantie pi\xE8ces et main d'\u0153uvre"
      ],
      competences: [
        "\u2022 Qualification plombier certifi\xE9",
        "\u2022 Connaissance installations gaz et eau",
        "\u2022 Diagnostic et d\xE9pannage rapide",
        "\u2022 Outillage professionnel de d\xE9tection"
      ],
      criteres: [
        "\u2022 Interventions d'urgence disponibles",
        "\u2022 Devis gratuit et d\xE9taill\xE9",
        "\u2022 Assurance d\xE9cennale plomberie",
        "\u2022 Respect des normes sanitaires"
      ]
    },
    "electricite": {
      title: "Travaux d'\xC9lectricit\xE9",
      livrables: [
        "\u2022 Installation \xE9lectrique aux normes NF C 15-100",
        "\u2022 Attestation de conformit\xE9 Consuel",
        "\u2022 Sch\xE9mas \xE9lectriques mis \xE0 jour",
        "\u2022 Test de bon fonctionnement des circuits",
        "\u2022 Garantie d\xE9cennale sur l'installation"
      ],
      competences: [
        "\u2022 Habilitation \xE9lectrique BR/B2V",
        "\u2022 Connaissance domotique et objets connect\xE9s",
        "\u2022 Installation bornes de recharge v\xE9hicules",
        "\u2022 Mise aux normes tableaux \xE9lectriques"
      ],
      criteres: [
        "\u2022 Certification Qualifelec",
        "\u2022 Interventions urgentes 24h/24",
        "\u2022 Devis gratuit avec plan d'installation",
        "\u2022 Assurance d\xE9cennale \xE9lectricit\xE9"
      ]
    },
    "peinture": {
      title: "Travaux de Peinture",
      livrables: [
        "\u2022 Pr\xE9paration soign\xE9e des supports",
        "\u2022 Application peinture selon techniques appropri\xE9es",
        "\u2022 Finitions et protection des surfaces",
        "\u2022 Nettoyage et remise en \xE9tat des lieux",
        "\u2022 Garantie sur la tenue de la peinture"
      ],
      competences: [
        "\u2022 Ma\xEEtrise techniques de peinture d\xE9corative",
        "\u2022 Connaissance peintures \xE9cologiques",
        "\u2022 Pr\xE9paration et traitement des supports",
        "\u2022 Conseil couleurs et harmonies"
      ],
      criteres: [
        "\u2022 Portfolio de r\xE9alisations vari\xE9es",
        "\u2022 Utilisation peintures de qualit\xE9",
        "\u2022 Respect des d\xE9lais de s\xE9chage",
        "\u2022 Devis d\xE9taill\xE9 par pi\xE8ce et surface"
      ]
    }
  };
  const template = categoryTemplates[category] || categoryTemplates["development"];
  return `**${title || template.title}**

**Contexte et Objectifs :**
${baseDesc}

**Livrables Attendus :**
${template.livrables.join("\n")}

**Comp\xE9tences Recherch\xE9es :**
${template.competences.join("\n")}

**Crit\xE8res de S\xE9lection :**
${template.criteres.join("\n")}

**Budget et Modalit\xE9s :**
\u2022 Budget \xE0 d\xE9finir selon proposition d\xE9taill\xE9e
\u2022 Paiement \xE9chelonn\xE9 selon avancement
\u2022 Possibilit\xE9 de facturation en r\xE9gie ou forfait

**Suivi et Communication :**
\u2022 Points d'avancement r\xE9guliers
\u2022 Livraison par phases si n\xE9cessaire
\u2022 Support post-livraison inclus`;
}
function extractSkillsFromDescription(description, category) {
  const skillsByCategory = {
    "development": {
      "react": "React.js",
      "vue": "Vue.js",
      "angular": "Angular",
      "php": "PHP",
      "python": "Python",
      "javascript": "JavaScript",
      "typescript": "TypeScript",
      "node": "Node.js",
      "laravel": "Laravel",
      "symfony": "Symfony",
      "django": "Django",
      "flask": "Flask",
      "sql": "SQL/Database",
      "mongodb": "MongoDB",
      "postgresql": "PostgreSQL",
      "mysql": "MySQL",
      "docker": "Docker",
      "aws": "AWS Cloud",
      "git": "Git/Version Control",
      "api": "API Development",
      "rest": "REST API",
      "graphql": "GraphQL"
    },
    "mobile": {
      "react native": "React Native",
      "flutter": "Flutter",
      "swift": "Swift (iOS)",
      "kotlin": "Kotlin (Android)",
      "java": "Java (Android)",
      "ionic": "Ionic",
      "xamarin": "Xamarin",
      "cordova": "Apache Cordova",
      "firebase": "Firebase",
      "push notification": "Push Notifications",
      "app store": "App Store Publication",
      "play store": "Play Store Publication"
    },
    "design": {
      "photoshop": "Adobe Photoshop",
      "illustrator": "Adobe Illustrator",
      "figma": "Figma",
      "sketch": "Sketch",
      "xd": "Adobe XD",
      "indesign": "Adobe InDesign",
      "ui": "UI Design",
      "ux": "UX Design",
      "wireframe": "Wireframing",
      "prototype": "Prototyping",
      "branding": "Branding",
      "logo": "Logo Design",
      "motion": "Motion Design",
      "animation": "Animation"
    },
    "marketing": {
      "seo": "SEO",
      "sem": "SEM",
      "google ads": "Google Ads",
      "facebook ads": "Facebook Ads",
      "instagram": "Instagram Marketing",
      "linkedin": "LinkedIn Marketing",
      "email marketing": "Email Marketing",
      "mailchimp": "Mailchimp",
      "analytics": "Google Analytics",
      "content": "Content Marketing",
      "copywriting": "Copywriting",
      "social media": "Social Media Management",
      "influencer": "Influencer Marketing"
    },
    "ai": {
      "machine learning": "Machine Learning",
      "deep learning": "Deep Learning",
      "tensorflow": "TensorFlow",
      "pytorch": "PyTorch",
      "python": "Python",
      "r": "R",
      "nlp": "Natural Language Processing",
      "computer vision": "Computer Vision",
      "neural network": "Neural Networks",
      "chatbot": "Chatbot Development",
      "data science": "Data Science",
      "pandas": "Pandas",
      "numpy": "NumPy",
      "scikit": "Scikit-learn"
    },
    "construction": {
      "plomberie": "Plomberie",
      "\xE9lectricit\xE9": "\xC9lectricit\xE9",
      "ma\xE7onnerie": "Ma\xE7onnerie",
      "peinture": "Peinture",
      "carrelage": "Carrelage",
      "parquet": "Parquet",
      "isolation": "Isolation",
      "charpente": "Charpente",
      "toiture": "Toiture",
      "cloisons": "Cloisons",
      "r\xE9novation": "R\xE9novation",
      "am\xE9nagement": "Am\xE9nagement"
    }
  };
  const categorySkills = skillsByCategory[category] || skillsByCategory["development"];
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
  let complexity = 3;
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("api") || lowerDesc.includes("int\xE9gration")) complexity += 1;
  if (lowerDesc.includes("paiement") || lowerDesc.includes("payment")) complexity += 2;
  if (lowerDesc.includes("temps r\xE9el") || lowerDesc.includes("real-time")) complexity += 2;
  const categoryComplexityFactors = {
    "development": [
      { keywords: ["microservices", "architecture"], points: 2 },
      { keywords: ["ia", "intelligence artificielle", "ml"], points: 3 },
      { keywords: ["blockchain", "crypto"], points: 3 },
      { keywords: ["mobile", "web"], points: 2 },
      { keywords: ["base de donn\xE9es", "database"], points: 1 },
      { keywords: ["s\xE9curit\xE9", "authentification"], points: 2 }
    ],
    "mobile": [
      { keywords: ["ios", "android"], points: 1 },
      { keywords: ["cross-platform", "hybride"], points: 2 },
      { keywords: ["push notification", "g\xE9olocalisation"], points: 1 },
      { keywords: ["ar", "r\xE9alit\xE9 augment\xE9e"], points: 3 },
      { keywords: ["offline", "synchronisation"], points: 2 }
    ],
    "design": [
      { keywords: ["logo", "identit\xE9 visuelle"], points: 1 },
      { keywords: ["site web", "interface"], points: 2 },
      { keywords: ["animation", "motion"], points: 2 },
      { keywords: ["3d", "mod\xE9lisation"], points: 3 },
      { keywords: ["print", "impression"], points: 1 }
    ],
    "marketing": [
      { keywords: ["campagne", "strat\xE9gie"], points: 1 },
      { keywords: ["multicanal", "omnicanal"], points: 2 },
      { keywords: ["automation", "automatisation"], points: 2 },
      { keywords: ["influencer", "partenariat"], points: 2 },
      { keywords: ["international", "multilingue"], points: 2 }
    ],
    "ai": [
      { keywords: ["deep learning", "neural"], points: 3 },
      { keywords: ["nlp", "computer vision"], points: 2 },
      { keywords: ["chatbot", "assistant"], points: 2 },
      { keywords: ["big data", "donn\xE9es massives"], points: 3 },
      { keywords: ["temps r\xE9el", "streaming"], points: 2 }
    ],
    "construction": [
      { keywords: ["r\xE9novation compl\xE8te", "gros \u0153uvre"], points: 3 },
      { keywords: ["extension", "agrandissement"], points: 2 },
      { keywords: ["isolation", "\xE9nerg\xE9tique"], points: 2 },
      { keywords: ["plomberie", "\xE9lectricit\xE9"], points: 2 },
      { keywords: ["design", "architecture"], points: 1 }
    ]
  };
  const factors = categoryComplexityFactors[category] || categoryComplexityFactors["development"];
  factors.forEach((factor) => {
    if (factor.keywords.some((keyword) => lowerDesc.includes(keyword))) {
      complexity += factor.points;
    }
  });
  return Math.min(complexity, 10);
}
function suggestCategories(description) {
  const lowerDesc = description.toLowerCase();
  const categories = [];
  if (lowerDesc.includes("travaux") || lowerDesc.includes("chantier") || lowerDesc.includes("b\xE2timent")) {
    categories.push("construction");
  }
  if (lowerDesc.includes("plomberie") || lowerDesc.includes("plombier") || lowerDesc.includes("fuite") || lowerDesc.includes("canalisation")) {
    categories.push("plomberie");
  }
  if (lowerDesc.includes("\xE9lectricit\xE9") || lowerDesc.includes("\xE9lectricien") || lowerDesc.includes("installation \xE9lectrique") || lowerDesc.includes("tableau \xE9lectrique")) {
    categories.push("electricite");
  }
  if (lowerDesc.includes("peinture") || lowerDesc.includes("peindre") || lowerDesc.includes("repeindre") || lowerDesc.includes("peintre")) {
    categories.push("peinture");
  }
  if (lowerDesc.includes("r\xE9novation") || lowerDesc.includes("r\xE9nover") || lowerDesc.includes("r\xE9habilitation")) {
    categories.push("renovation");
  }
  if (lowerDesc.includes("carrelage") || lowerDesc.includes("carreleur") || lowerDesc.includes("fa\xEFence")) {
    categories.push("construction");
  }
  if (lowerDesc.includes("ma\xE7onnerie") || lowerDesc.includes("ma\xE7on") || lowerDesc.includes("mur") || lowerDesc.includes("cloison")) {
    categories.push("construction");
  }
  if (lowerDesc.includes("site") || lowerDesc.includes("web") || lowerDesc.includes("d\xE9veloppement")) {
    categories.push("development");
  }
  if (lowerDesc.includes("mobile") || lowerDesc.includes("application") || lowerDesc.includes("app")) {
    categories.push("mobile");
  }
  if (lowerDesc.includes("design") || lowerDesc.includes("ui") || lowerDesc.includes("ux") || lowerDesc.includes("graphique")) {
    categories.push("design");
  }
  if (lowerDesc.includes("marketing") || lowerDesc.includes("publicit\xE9") || lowerDesc.includes("communication")) {
    categories.push("marketing");
  }
  if (lowerDesc.includes("ia") || lowerDesc.includes("intelligence") || lowerDesc.includes("machine learning")) {
    categories.push("ai");
  }
  return categories.length > 0 ? categories : ["construction"];
}
function suggestBudgetRange(description, category, complexity) {
  const baseBudgets = {
    "development": {
      ranges: [2e3, 8e3],
      factors: {
        "frontend": 1,
        "backend": 1.2,
        "fullstack": 1.4,
        "mobile": 1.3,
        "api": 1.1,
        "e-commerce": 1.5
      }
    },
    "mobile": {
      ranges: [3e3, 12e3],
      factors: {
        "native": 1.5,
        "cross-platform": 1.2,
        "ios": 1.3,
        "android": 1.3,
        "publication": 1.1
      }
    },
    "design": {
      ranges: [800, 3e3],
      factors: {
        "logo": 0.8,
        "site web": 1.2,
        "application": 1.3,
        "branding": 1.4,
        "print": 1
      }
    },
    "marketing": {
      ranges: [1e3, 5e3],
      factors: {
        "seo": 1.1,
        "publicit\xE9": 1.3,
        "r\xE9seaux sociaux": 1,
        "content": 1.2,
        "strat\xE9gie": 1.4
      }
    },
    "ai": {
      ranges: [5e3, 2e4],
      factors: {
        "machine learning": 1.3,
        "deep learning": 1.6,
        "chatbot": 1.1,
        "computer vision": 1.4,
        "nlp": 1.3
      }
    },
    "construction": {
      ranges: [1500, 15e3],
      factors: {
        "peinture": 0.8,
        "plomberie": 1.2,
        "\xE9lectricit\xE9": 1.3,
        "r\xE9novation": 1.5,
        "extension": 2
      }
    }
  };
  const categoryData = baseBudgets[category] || baseBudgets["development"];
  let baseRange = categoryData.ranges;
  const lowerDesc = description.toLowerCase();
  let multiplier = 1;
  Object.entries(categoryData.factors).forEach(([key, factor]) => {
    if (lowerDesc.includes(key)) {
      multiplier = Math.max(multiplier, factor);
    }
  });
  const complexityMultiplier = 0.7 + complexity / 10 * 1.3;
  const finalMultiplier = multiplier * complexityMultiplier;
  return {
    min: Math.round(baseRange[0] * finalMultiplier),
    max: Math.round(baseRange[1] * finalMultiplier),
    reasoning: `Bas\xE9 sur la cat\xE9gorie ${category}, complexit\xE9 ${complexity}/10 et mots-cl\xE9s d\xE9tect\xE9s`
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
