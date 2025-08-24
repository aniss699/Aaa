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
app.get("/api/missions", (req, res) => {
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
