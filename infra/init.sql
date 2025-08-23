
-- Script d'initialisation pour la plateforme d'appels d'offres inversés

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('client', 'provider')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des profils prestataires
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skills JSONB NOT NULL DEFAULT '[]',
  location VARCHAR(255),
  hourly_rate DECIMAL(10,2),
  categories JSONB NOT NULL DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  completed_projects INTEGER DEFAULT 0,
  response_time DECIMAL(5,2) DEFAULT 24.0, -- heures
  success_rate DECIMAL(3,2) DEFAULT 0.80,
  bio TEXT,
  portfolio JSONB DEFAULT '[]',
  availability JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des missions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  skills_required JSONB NOT NULL DEFAULT '[]',
  urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  complexity VARCHAR(20) DEFAULT 'medium' CHECK (complexity IN ('low', 'medium', 'high')),
  duration_weeks INTEGER DEFAULT 4,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  selected_bid_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des offres/enchères
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  timeline VARCHAR(255) NOT NULL,
  proposal TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  ai_score JSONB, -- Score IA multi-objectif
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(mission_id, provider_id)
);

-- Table pour les scores IA détaillés
CREATE TABLE ai_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2) NOT NULL,
  score_breakdown JSONB NOT NULL,
  explanations JSONB NOT NULL DEFAULT '[]',
  confidence DECIMAL(5,2) NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  model_version VARCHAR(50),
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour la détection d'abus
CREATE TABLE abuse_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('bid', 'mission', 'user')),
  entity_id UUID NOT NULL,
  abuse_type VARCHAR(50) NOT NULL CHECK (abuse_type IN ('collusion', 'dumping', 'spam', 'fraud')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  confidence DECIMAL(5,2) NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'confirmed', 'dismissed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les recommandations de prix
CREATE TABLE price_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id),
  recommended_price DECIMAL(10,2) NOT NULL,
  price_range JSONB NOT NULL, -- {min, max, recommended}
  confidence DECIMAL(5,2) NOT NULL,
  reasoning JSONB NOT NULL DEFAULT '[]',
  market_position VARCHAR(50),
  competition_level VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour l'apprentissage continu
CREATE TABLE model_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_type VARCHAR(50) NOT NULL,
  prediction JSONB NOT NULL,
  actual_outcome JSONB,
  feedback_score DECIMAL(3,2), -- -1 à 1
  context JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les créneaux de disponibilité
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  booking_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les réservations payantes
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES availability_slots(id),
  total_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les introductions ciblées
CREATE TABLE introductions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  proposed_price DECIMAL(10,2) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  ai_match_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Index pour les performances
CREATE INDEX idx_missions_status_created ON missions(status, created_at DESC);
CREATE INDEX idx_bids_mission_id ON bids(mission_id);
CREATE INDEX idx_bids_provider_id ON bids(provider_id);
CREATE INDEX idx_ai_scores_bid_id ON ai_scores(bid_id);
CREATE INDEX idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX idx_abuse_reports_entity ON abuse_reports(entity_type, entity_id);
CREATE INDEX idx_availability_slots_provider_date ON availability_slots(provider_id, date);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données de test pour développement
INSERT INTO users (id, email, password, name, type) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'client@test.com', 'password', 'Client Test', 'client'),
  ('550e8400-e29b-41d4-a716-446655440002', 'provider@test.com', 'password', 'Provider Test', 'provider');

INSERT INTO provider_profiles (user_id, skills, location, hourly_rate, categories, rating, completed_projects, response_time, success_rate) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '["React", "Node.js", "TypeScript"]', 'Paris', 75.00, '["web-development", "backend"]', 4.8, 25, 2.5, 0.92);

COMMIT;
