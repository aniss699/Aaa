
export type UserRole = "client" | "provider";

export interface BaseProfile {
  userId: string;
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: { city?: string; country?: string; lat?: number; lng?: number };
  languages?: string[];               // ex: ["fr","en"]
  keywords?: string[];                // mots-clés libres
  skills?: Array<{ name: string; level?: 1|2|3|4|5 }>;
  industries?: string[];
  portfolio?: Array<{ title: string; url?: string; image?: string; description?: string }>;
  certifications?: Array<{ name: string; issuer?: string; year?: number }>;
  availability?: { modes?: ("on-site"|"remote")[]; hoursPerWeek?: number; timezones?: string[]; earliestStartDate?: string };
  rates?: { currency: "EUR"; rateType?: "hourly"|"fixed"; min?: number; max?: number };
  preferences?: { visibility?: "public"|"private"|"anonymized"; gdprConsent?: boolean };
  completeness?: number;              // calculé
  badges?: string[];
  createdAt: string; 
  updatedAt: string;
}

export interface ClientProfile extends BaseProfile {
  company?: { name?: string; siret?: string; size?: "solo"|"TPE"|"PME"|"ETI"|"GE" };
  pastBudgets?: number[];
}

export interface ProviderProfile extends BaseProfile {
  yearsExperience?: number;
  serviceAreas?: string[];
  equipment?: string[];
}

export type AnyProfile = ClientProfile | ProviderProfile;
