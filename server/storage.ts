import { type User, type InsertUser, type Mission, type InsertMission, type Bid, type InsertBid, type MissionWithBids } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Missions
  getMission(id: string): Promise<Mission | undefined>;
  getMissionWithBids(id: string): Promise<MissionWithBids | undefined>;
  getAllMissions(): Promise<Mission[]>;
  getAllMissionsWithBids(): Promise<MissionWithBids[]>;
  getUserMissions(clientId: string): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;

  // Bids
  getBid(id: string): Promise<Bid | undefined>;
  getMissionBids(missionId: string): Promise<Bid[]>;
  getUserBids(providerId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private missions: Map<string, Mission>;
  private bids: Map<string, Bid>;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.bids = new Map();
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo users
    const demoUsers = [
      {
        id: "client1",
        name: "Marie Dubois",
        email: "marie@example.com",
        password: "password123",
        type: "client" as const,
        rating: null,
        createdAt: new Date("2024-01-01"),
        availability: []
      },
      {
        id: "provider1",
        name: "TechCorp Solutions",
        email: "contact@techcorp.com",
        password: "password123",
        type: "provider" as const,
        rating: "4.8",
        createdAt: new Date("2024-01-01"),
        availability: [
          { start: new Date("2024-03-10T09:00:00"), end: new Date("2024-03-10T17:00:00") },
          { start: new Date("2024-03-11T10:00:00"), end: new Date("2024-03-11T12:00:00") },
          { start: new Date("2024-03-12T14:00:00"), end: new Date("2024-03-12T18:00:00") },
        ]
      },
      {
        id: "provider2",
        name: "Digital Masters",
        email: "hello@digitalmasters.com",
        password: "password123",
        type: "provider" as const,
        rating: "4.9",
        createdAt: new Date("2024-01-01"),
        availability: [
          { start: new Date("2024-03-10T08:00:00"), end: new Date("2024-03-10T12:00:00") },
          { start: new Date("2024-03-11T13:00:00"), end: new Date("2024-03-11T17:00:00") },
        ]
      },
      {
        id: "provider3",
        name: "Creative Studio",
        email: "info@creativestudio.com",
        password: "password123",
        type: "provider" as const,
        rating: "4.7",
        createdAt: new Date("2024-01-01"),
        availability: [
          { start: new Date("2024-03-11T09:00:00"), end: new Date("2024-03-11T18:00:00") },
          { start: new Date("2024-03-13T10:00:00"), end: new Date("2024-03-13T16:00:00") },
        ]
      },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Demo missions
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
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "mission2",
        title: "Refonte complète du site web d'entreprise",
        description: "Modernisation du site vitrine de notre entreprise avec nouveau design responsive et optimisation SEO.",
        category: "design",
        budget: "3000",
        location: "Lyon, France",
        clientId: "client1",
        clientName: "Pierre Martin",
        status: "open",
        createdAt: new Date("2024-01-18"),
      },
      {
        id: "mission3",
        title: "Campagne marketing digital et réseaux sociaux",
        description: "Lancement d'une campagne complète sur les réseaux sociaux pour augmenter la notoriété de notre marque.",
        category: "marketing",
        budget: "2000",
        location: "Marseille, France",
        clientId: "client1",
        clientName: "Sophie Leclerc",
        status: "open",
        createdAt: new Date("2024-01-20"),
      },
    ];

    demoMissions.forEach(mission => this.missions.set(mission.id, mission));

    // Demo bids
    const demoBids = [
      {
        id: "bid1",
        missionId: "mission1",
        providerId: "provider1",
        providerName: "TechCorp Solutions",
        price: "4500",
        timeline: "8 semaines",
        proposal: "Nous proposons une solution complète avec React Native et backend Node.js. Livraison en 8 semaines.",
        rating: "4.8",
        status: "pending",
        createdAt: new Date("2024-01-16"),
      },
      {
        id: "bid2",
        missionId: "mission1",
        providerId: "provider2",
        providerName: "Digital Masters",
        price: "5200",
        timeline: "10 semaines",
        proposal: "Application native iOS/Android avec design sur mesure et intégration Stripe.",
        rating: "4.9",
        status: "pending",
        createdAt: new Date("2024-01-17"),
      },
    ];

    demoBids.forEach(bid => this.bids.set(bid.id, bid));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      rating: insertUser.type === "provider" ? "5.0" : null,
      availability: [] // Default empty availability for new users
    };
    this.users.set(id, user);
    return user;
  }

  // Missions
  async getMission(id: string): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async getMissionWithBids(id: string): Promise<MissionWithBids | undefined> {
    const mission = this.missions.get(id);
    if (!mission) return undefined;

    const bids = Array.from(this.bids.values()).filter(bid => bid.missionId === id);
    return { ...mission, bids };
  }

  async getAllMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getAllMissionsWithBids(): Promise<MissionWithBids[]> {
    const missions = await this.getAllMissions();
    return missions.map(mission => ({
      ...mission,
      bids: Array.from(this.bids.values()).filter(bid => bid.missionId === mission.id)
    }));
  }

  async getUserMissions(clientId: string): Promise<Mission[]> {
    return Array.from(this.missions.values())
      .filter(mission => mission.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createMission(insertMission: InsertMission): Promise<Mission> {
    const id = randomUUID();
    const mission: Mission = { 
      ...insertMission, 
      id, 
      createdAt: new Date(),
      status: "open"
    };
    this.missions.set(id, mission);
    return mission;
  }

  // Bids
  async getBid(id: string): Promise<Bid | undefined> {
    return this.bids.get(id);
  }

  async getMissionBids(missionId: string): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.missionId === missionId)
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  async getUserBids(providerId: string): Promise<Bid[]> {
    return Array.from(this.bids.values())
      .filter(bid => bid.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createBid(insertBid: InsertBid): Promise<Bid> {
    const id = randomUUID();
    const bid: Bid = { 
      ...insertBid, 
      id, 
      createdAt: new Date(),
      status: "pending"
    };
    this.bids.set(id, bid);
    return bid;
  }
}

export const storage = new MemStorage();