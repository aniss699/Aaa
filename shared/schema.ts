import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(), // 'client' or 'provider'
  rating: decimal("rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  location: text("location"),
  clientId: varchar("client_id").references(() => users.id),
  clientName: text("client_name").notNull(),
  status: text("status").default("open"), // 'open', 'in_progress', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionId: varchar("mission_id").references(() => missions.id),
  providerId: varchar("provider_id").references(() => users.id),
  providerName: text("provider_name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  timeline: text("timeline").notNull(),
  proposal: text("proposal").notNull(),
  originalProposal: text("original_proposal"), // Stocke la version originale avant optimisation IA
  isAiOptimized: boolean("is_ai_optimized").default(false), // Indique si l'offre a été optimisée
  aiOptimizationScore: decimal("ai_optimization_score", { precision: 3, scale: 2 }), // Score de qualité IA
  rating: decimal("rating", { precision: 3, scale: 2 }),
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;

// Extended types for API responses
export type MissionWithBids = Mission & {
  bids: Bid[];
};
