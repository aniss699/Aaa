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
    const providerId = req.params.id;

    // Mock provider profile data
    const mockProfile = {
      id: providerId,
      name: 'Jean Dupont',
      email: 'jean@example.com',
      rating: '4.8',
      location: 'Paris, France',
      joinedAt: '2023-06-15',
      description: 'Développeur full-stack avec 5 ans d\'expérience spécialisé dans React, Node.js et les applications web modernes.',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS'],
      totalProjects: 47,
      availability: [
        {
          date: new Date('2024-01-20'),
          slots: [
            { start: '09:00', end: '12:00', rate: 65 },
            { start: '14:00', end: '18:00', rate: 65 }
          ]
        },
        {
          date: new Date('2024-01-22'),
          slots: [
            { start: '10:00', end: '16:00', rate: 70 }
          ]
        },
        {
          date: new Date('2024-01-25'),
          slots: [
            { start: '09:00', end: '17:00', rate: 65 }
          ]
        }
      ],
      evaluations: [
        {
          id: 'eval1',
          rating: 5,
          comment: 'Excellent travail, très professionnel et à l\'écoute des besoins.',
          clientName: 'Marie L.',
          createdAt: '2024-01-10',
          photos: []
        },
        {
          id: 'eval2',
          rating: 4,
          comment: 'Bon développeur, travail de qualité et dans les temps.',
          clientName: 'Pierre M.',
          createdAt: '2024-01-05',
          photos: []
        }
      ],
      portfolio: [
        {
          id: 'portfolio1',
          title: 'E-commerce pour boutique de mode',
          description: 'Développement complet d\'une boutique en ligne avec système de paiement intégré.',
          images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300'],
          category: 'E-commerce',
          completedAt: '2024-01-01'
        },
        {
          id: 'portfolio2',
          title: 'Application de gestion RH',
          description: 'Interface d\'administration pour la gestion des employés et des congés.',
          images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300'],
          category: 'Web App',
          completedAt: '2023-12-15'
        }
      ]
    };

    res.json(mockProfile);
  });

  app.use(router); // Mount the router

  const httpServer = createServer(app);
  return httpServer;
}