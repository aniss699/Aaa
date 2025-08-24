
export interface User {
  id: string;
  email: string;
  role: 'CLIENT' | 'PRO' | 'PERSON' | 'ADMIN';
  rating_mean?: number;
  rating_count?: number;
  created_at: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  quality_target?: 'low' | 'medium' | 'high';
  risk_tolerance?: number;
  geo_required?: boolean;
  onsite_radius_km?: number;
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  loc_score?: number;
  client_id: string;
  created_at: Date;
  updated_at: Date;
}

// NOUVEAU: Standardisation d'annonces
export interface ProjectStandardization {
  id: string;
  project_id: string;
  title_std: string;
  summary_std: string;
  acceptance_criteria: string[];
  category_std: string;
  sub_category_std: string;
  tags_std: string[];
  tasks_std: any[];
  deliverables_std: any[];
  skills_std: string[];
  constraints_std: string[];
  brief_quality_score: number;
  richness_score: number;
  missing_info: any[];
  price_suggested_min?: number;
  price_suggested_med?: number;
  price_suggested_max?: number;
  delay_suggested_days?: number;
  loc_uplift_reco?: any;
  rewrite_version: string;
  created_at: Date;
  updated_at: Date;
}

// NOUVEAU: Sources Web
export interface WebSource {
  id: string;
  domain: string;
  robots_txt?: any;
  crawl_policy?: any;
  last_ok_at?: Date;
  blocked: boolean;
  created_at: Date;
}

export interface WebDoc {
  id: string;
  url: string;
  domain: string;
  type: 'HOME' | 'ABOUT' | 'SERVICES' | 'PORTFOLIO' | 'PRICING' | 'CONTACT' | 'OTHER';
  title: string;
  text_summary: string;
  lang: string;
  published_at?: Date;
  fetched_at: Date;
  etag?: string;
  hash: string;
  source_type: 'RSS' | 'SITEMAP' | 'CRAWL';
  meta?: any;
}

export interface ExternalCompany {
  id: string;
  name: string;
  siren?: string;
  siret?: string;
  naf_code?: string;
  website?: string;
  emails: string[];
  phones: string[];
  address?: any;
  city?: string;
  postal_code?: string;
  country?: string;
  geo?: { lat: number; lng: number };
  social?: any;
  raw_tags: string[];
  skills: string[];
  confidence: number;
  first_seen_at: Date;
  last_seen_at: Date;
}

export interface ExternalCompanySignal {
  id: string;
  company_id: string;
  kind: 'PRICE' | 'AVAILABILITY' | 'PORTFOLIO' | 'RATING' | 'CLAIMED';
  payload: any;
  score: number;
  seen_at: Date;
}

export interface SourcingMatch {
  id: string;
  project_id: string;
  company_id: string;
  lead_score: number;
  reasons: any;
  status: 'CANDIDATE' | 'CONTACTED' | 'REFUSED' | 'CONVERTED';
  created_at: Date;
}

// Existing interfaces...
export interface Bid {
  id: string;
  project_id: string;
  provider_id: string;
  amount: number;
  timeline_days: number;
  message: string;
  score_breakdown?: any;
  is_leading: boolean;
  flagged: boolean;
  created_at: Date;
}
