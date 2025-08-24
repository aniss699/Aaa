
# 🚀 Marketplace d'Appels d'Offres Inversés - Mode ÉCO

Plateforme française complète avec standardisation d'annonces, matching IA, enchère inversée guidée, et sourcing web gratuit.

## 🎯 Fonctionnalités Principales

### ✅ Implémenté
- **Standardisation d'annonces IA** : Analyse automatique et structuration des briefs
- **Scoring multicritère explicable** : Évaluation transparente des offres
- **Enchères inversées guidées** : Accompagnement intelligent des prestataires
- **LOC (Likelihood of Completion)** : Probabilité de succès des projets
- **Anti-abus** : Détection collusion et dumping
- **Sourcing web gratuit** : Découverte via RSS/Sitemap sans APIs payantes
- **Fusion candidats** : Internes + externes avec scoring unifié

### 🎨 Interface Moderne
- Interface React/TypeScript responsive
- Dashboard IA avec métriques temps réel
- Composants UI avancés (shadcn/ui)
- Système de notifications intelligentes

## 🏗️ Architecture

```
/apps
  /api        # Node.js, TypeScript, Fastify, Prisma
  /ml         # Python, FastAPI, scikit-learn, LightGBM
  /worker     # BullMQ, jobs asynchrones
  /ingestion  # Sourcing web, crawling, enrichissement
/packages
  /core       # Utilitaires scoring, fairness, diversity
/client       # React, TypeScript, Vite
/infra        # Docker, PostgreSQL, Redis, données
```

## 🚀 Démarrage Rapide

```bash
# Mode Docker (recommandé)
docker-compose up --build

# Mode développement
npm install
npm run dev
```

**Accès:**
- App: http://localhost:5000
- API: http://localhost:3000
- ML Service: http://localhost:8001

## ⚙️ Configuration Mode ÉCO

Le projet fonctionne en **mode gratuit** par défaut :

```env
# Mode ÉCO - Pas d'APIs payantes
OFFLINE_MODE=false
FEATURE_SOURCING=true
FEATURE_API_CONNECTORS=false
FEATURE_CRAWLER=true

# Sourcing web gratuit
DOMAIN_WHITELIST="*.gouv.fr,*.insee.fr,*.cci.fr,*.pagesjaunes.fr"
RATE_LIMIT_PER_DOMAIN_RPS=1
USER_AGENT="TestMarketplaceBot/0.1 (+contact@exemple.fr)"

# ML local
EMBEDDINGS_ENABLED=false
BM25_ENABLED=true
```

## 🤖 Fonctionnalités IA

### 1. Standardisation Automatique
```typescript
// Analyse et structure un brief client
const standardization = await aiService.standardizeProject({
  title: "Site e-commerce",
  description: "Je veux un site pour vendre mes produits...",
  category: "web-development"
});
```

### 2. Scoring Multicritère
```typescript
// Score explicable avec ajustements standardisation
const score = scoringEngine.calculateScore(factors, weights, market, {
  brief_quality_score: 85,
  richness_score: 70,
  missing_info_count: 2
});
```

### 3. Sourcing Web Gratuit
```typescript
// Découverte de candidats sans APIs payantes
const discovery = await rssDiscovery.discoverFromDomain("entreprise.fr");
const companies = await companyParser.parseFromHtml(html, url);
```

## 📊 Données et ML

### Services Python (FastAPI)
- **TextNormalizer** : Extraction quantités, prix, contraintes géo
- **Taxonomizer** : Classification automatique + compétences
- **BriefQualityAnalyzer** : Score qualité + informations manquantes
- **AbuseDetector** : Détection collusion/dumping

### Scoring Avancé
- Poids adaptatifs selon contexte (urgence, complexité, marché)
- Ajustements ML basés sur l'historique
- Détection d'anomalies sophistiquée
- Recommandations intelligentes

## 🌐 Sourcing Web

### Mode ÉCO (Gratuit)
- Découverte via RSS feeds et sitemaps
- Respect robots.txt et rate limiting
- Parsing intelligent des pages entreprises
- Extraction automatique : SIREN, compétences, contact

### Pipeline de Traitement
1. **Découverte** : RSS/Sitemap discovery
2. **Crawling** : Respect rate limits + robots.txt  
3. **Extraction** : Parsing entreprises + signaux
4. **Enrichissement** : Classification + scoring
5. **Matching** : Fusion avec candidats internes

## 📈 Système de Scoring

### Critères Principaux
- **Prix** (25%) : Compétitivité vs marché
- **Qualité** (20%) : Expérience + rating
- **Correspondance** (20%) : Skills matching
- **Délai** (15%) : Temps de réponse
- **Risque** (10%) : Taux de succès
- **LOC** (10%) : Probabilité d'aboutissement

### Ajustements Intelligents
- Poids adaptatifs selon urgence/complexité
- Bonus qualité brief standardisé
- Pénalités informations manquantes
- Détection dumping/prix suspects

## 🛡️ Anti-Abus

### Détection Automatique
- **Collusion** : Patterns suspects entre offres
- **Dumping** : Prix anormalement bas
- **Profils artificiels** : Scores trop parfaits
- **Incohérences** : Expérience vs prix

## 📱 Interface Utilisateur

### Composants Clés
- **ProjectStandardizer** : Interface standardisation IA
- **AdvancedScoringEngine** : Scoring transparent
- **IntelligentBiddingGuide** : Accompagnement enchères
- **MarketHeatIndicator** : Tension marché temps réel
- **SmartNotifications** : Alertes contextuelles

## 🔧 APIs Principales

```typescript
// Standardisation
POST /api/ai/projects/:id/standardize
GET  /api/projects/:id/standardized

// Sourcing
POST /api/sourcing/discover
GET  /api/sourcing/project/:id/candidates

// Fusion candidats
GET  /api/ai/projects/:id/candidates?diversity=true

// Scoring
POST /api/ai/score
GET  /api/ai/projects/:id/preview-scoring
```

## 📦 Technologies

### Backend
- **Node.js** + TypeScript + Fastify
- **Python** + FastAPI + scikit-learn
- **PostgreSQL** + Prisma ORM
- **Redis** + BullMQ
- **Docker** + docker-compose

### Frontend
- **React** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui
- **TanStack Query** + Zustand
- **Recharts** + Lucide Icons

### ML/IA
- **scikit-learn** : Classification, clustering
- **LightGBM** : Gradient boosting
- **TF-IDF/BM25** : Matching sémantique
- **sentence-transformers** : Embeddings (optionnel)

## 🎯 Roadmap

### Phase 1 : Core ✅
- [x] Standardisation d'annonces
- [x] Scoring multicritère
- [x] Sourcing web gratuit
- [x] Interface React complète

### Phase 2 : Avancé 🚧
- [ ] ML adaptatif avec feedback
- [ ] Intégration APIs payantes (optionnel)
- [ ] Système de réputation avancé
- [ ] Analytics prédictives

### Phase 3 : Scale 📈
- [ ] Multi-tenant
- [ ] API publique
- [ ] Mobile app
- [ ] IA conversationnelle

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

---

**💡 Astuce** : Utilisez `docker-compose up` pour un démarrage complet en une commande !
