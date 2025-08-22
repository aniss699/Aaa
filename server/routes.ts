import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMissionSchema, insertBidSchema } from "@shared/schema";
import { z } from "zod";
import { Router } from "express";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();

  // Auth routes
  router.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  router.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Un compte avec cet email existe déjà" });
      }

      const user = await storage.createUser(userData);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Mission routes
  router.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getAllMissionsWithBids();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  router.get("/api/missions/:id", async (req, res) => {
    try {
      const mission = await storage.getMissionWithBids(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: "Mission non trouvée" });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  router.post("/api/missions", async (req, res) => {
    try {
      const missionData = insertMissionSchema.parse(req.body);
      const mission = await storage.createMission(missionData);
      res.json(mission);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  router.get("/api/users/:id/missions", async (req, res) => {
    try {
      const missions = await storage.getUserMissions(req.params.id);
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Bid routes
  router.post("/api/bids", async (req, res) => {
    try {
      const bidData = insertBidSchema.parse(req.body);

      // Check if user already bid on this mission
      const existingBids = await storage.getMissionBids(bidData.missionId);
      const userAlreadyBid = existingBids.some(bid => bid.providerId === bidData.providerId);

      if (userAlreadyBid) {
        return res.status(400).json({ message: "Vous avez déjà fait une offre pour cette mission" });
      }

      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Respond to a bid
  router.post("/api/bids/respond", async (req, res) => {
    try {
      const { bidId, action, message } = req.body;

      if (!bidId || !action) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Here you would typically update the bid status and send a notification
      // For now, we'll just return success
      res.json({ 
        success: true, 
        message: `Response sent for bid ${bidId}`,
        action,
        responseMessage: message 
      });
    } catch (error) {
      console.error("Error responding to bid:", error);
      res.status(400).json({ error: "Error processing response" });
    }
  });

  router.get("/api/users/:id/bids", async (req, res) => {
    try {
      const bids = await storage.getUserBids(req.params.id);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Get provider profile
  router.get('/api/providers/:id/profile', (req, res) => {
    const { id } = req.params;

    // Simulation d'un profil prestataire détaillé
    const profile = {
      id,
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      rating: "4.8",
      location: "Paris, France",
      joinedAt: "2023-01-15",
      description: "Développeur full-stack passionné avec plus de 8 ans d'expérience. Spécialisé dans React, Node.js et les architectures cloud. J'aime créer des solutions élégantes et performantes pour mes clients.",
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
      totalProjects: 47,
      availability: [
        {
          date: '2024-12-20T00:00:00.000Z',
          slots: [
            { start: '09:00', end: '12:00', rate: 75 },
            { start: '14:00', end: '18:00', rate: 75 }
          ]
        },
        {
          date: '2024-12-21T00:00:00.000Z',
          slots: [
            { start: '10:00', end: '16:00', rate: 80 }
          ]
        },
        {
          date: '2024-12-23T00:00:00.000Z',
          slots: [
            { start: '08:00', end: '12:00', rate: 85 },
            { start: '13:00', end: '17:00', rate: 85 }
          ]
        },
        {
          date: '2024-12-24T00:00:00.000Z',
          slots: [
            { start: '09:00', end: '13:00', rate: 90 }
          ]
        }
      ],
      evaluations: [
        {
          id: "eval1",
          rating: 5,
          comment: "Excellent travail ! Jean a livré le projet en avance et la qualité dépasse nos attentes. Communication parfaite tout au long du projet.",
          clientName: "Marie Martin",
          createdAt: "2024-11-15",
          photos: []
        },
        {
          id: "eval2",
          rating: 5,
          comment: "Très professionnel et réactif. Le site développé fonctionne parfaitement et respecte toutes nos spécifications.",
          clientName: "Pierre Leblanc",
          createdAt: "2024-10-28",
          photos: []
        },
        {
          id: "eval3",
          rating: 4,
          comment: "Bon développeur, travail de qualité. Quelques retards mineurs mais le résultat final est satisfaisant.",
          clientName: "Sophie Chen",
          createdAt: "2024-09-12",
          photos: []
        }
      ],
      portfolio: [
        {
          id: "project1",
          title: "E-commerce Platform",
          description: "Développement d'une plateforme e-commerce complète avec React et Node.js. Intégration de Stripe pour les paiements.",
          images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"],
          category: "Développement web",
          completedAt: "2024-11-01"
        },
        {
          id: "project2",
          title: "Application Mobile",
          description: "Application React Native pour la gestion d'inventaire avec synchronisation cloud temps réel.",
          images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"],
          category: "Développement mobile",
          completedAt: "2024-09-15"
        },
        {
          id: "project3",
          title: "Dashboard Analytics",
          description: "Tableau de bord interactif avec D3.js pour visualiser des données complexes en temps réel.",
          images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
          category: "Data Visualization",
          completedAt: "2024-08-20"
        },
        {
          id: "project4",
          title: "API REST",
          description: "API scalable avec Node.js, Express et PostgreSQL pour une application fintech.",
          images: ["https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400"],
          category: "Backend",
          completedAt: "2024-07-10"
        }
      ]
    };

    res.json(profile);
  });

  app.use(router); // Mount the router

  const httpServer = createServer(app);
  return httpServer;
}