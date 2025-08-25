
# Enrichissements IA - Documentation

## Vue d'ensemble

Ce document décrit les nouvelles capacités IA ajoutées à la plateforme AppelsPro. Tous les enrichissements sont **additifs** et activables par feature flags, sans impact sur l'existant.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Gateway    │────│   ML Services   │
│   (lazy-load)   │    │   (adapters)     │    │   (Python)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │   (additive)     │
                       └──────────────────┘
```

## Services disponibles

### 1. Normalisation (`normalize`)
**Objectif** : Structure et enrichit les briefs clients

**Activation** : `ENABLE_NORMALIZE=true`

**Endpoint** : `POST /api/ai/normalize`

**Entrée** :
```json
{
  "title": "Site web",
  "description": "Je veux un site pour vendre mes produits",
  "category": "web-development"
}
```

**Sortie** :
```json
{
  "success": true,
  "data": {
    "title_std": "Site web e-commerce",
    "completeness_score": 65,
    "missing_info": ["Budget", "Délais"],
    "skills_std": ["HTML", "CSS", "E-commerce"],
    "structured": {...}
  }
}
```

### 2. Génération (`generator`)
**Objectif** : Crée 3 variantes d'annonces optimisées

**Activation** : `ENABLE_GENERATOR=true`

**Endpoint** : `POST /api/ai/generate`

**Sortie** :
```json
{
  "variants": [
    {
      "type": "clair",
      "title": "...",
      "description": "...",
      "explanation": "Version accessible..."
    },
    {
      "type": "pro", 
      "title": "...",
      "description": "...",
      "explanation": "Version professionnelle..."
    },
    {
      "type": "premium",
      "title": "...", 
      "description": "...",
      "explanation": "Version premium..."
    }
  ],
  "sow": {...},
  "questions": [...]
}
```

### 3. Questions adaptatives (`questioner`)
**Objectif** : Pose max 5 questions ciblées par Value of Information

**Activation** : `ENABLE_QUESTIONER=true`

**Endpoint** : `POST /api/ai/questions`

**Sortie** :
```json
{
  "questions": [
    {
      "text": "Quel est votre budget approximatif ?",
      "type": "choice",
      "options": ["< 500€", "500-1500€", "..."],
      "category": "budget"
    }
  ],
  "completion_gain": {
    "current_score": 60,
    "potential_score": 85
  }
}
```

## Base de données (additif)

### Nouvelles tables

- `taxonomies` : Catégories hiérarchiques avec synonymes
- `embeddings` : Vecteurs pour matching sémantique (pgvector)
- `events` : Log pour observabilité et apprentissage
- `experiments` : A/B tests
- `verifications` : Badges prestataires

### Colonnes ajoutées

**missions** :
- `structured` (jsonb) : Données enrichies
- `completeness_score` (int) : Score de complétude
- `sow` (jsonb) : Statement of Work généré
- `price_estimation` (jsonb) : Estimations IA

**providers** :
- `skills` (jsonb) : Compétences extraites
- `quality_score` (float) : Score qualité
- `badges` (jsonb) : Certifications

## Interface utilisateur

### Composant `BriefEnhancer`

Lazy-loaded, apparaît uniquement si :
- Au moins un feature flag activé
- Brief minimum rempli (titre + description > 20 chars)

**Onglets** :
1. **Analyse** : Score complétude, infos manquantes, compétences détectées
2. **Variantes** : 3 versions optimisées avec explications
3. **Questions** : Questions ciblées pour améliorer l'annonce

## Compatibilité

### ✅ Garanties de non-régression

- Tous les endpoints existants fonctionnent inchangés
- Même structure de réponse pour les APIs legacy
- Fallbacks automatiques si services ML indisponibles
- Performance des fonctions existantes préservée

### 🔧 Intégration transparente

- Enrichissements ajoutés dans `/api/ai/missions/suggest` sans casser la structure
- Adaptateurs pour consommer l'existant
- Feature flags pour activation progressive

## Déploiement

### Flags recommandés pour production

```bash
# Démarrage conservateur
ENABLE_NORMALIZE=true      # Stable, améliore UX
ENABLE_GENERATOR=true      # Valeur ajoutée élevée  
ENABLE_QUESTIONER=true     # Augmente complétude
ENABLE_PRICER=false        # À tester d'abord
ENABLE_METRICS=true        # Observabilité

# Features avancées (OFF par défaut)
ENABLE_VISION_TO_BRIEF=false
ENABLE_CONCIERGE=false
ENABLE_GUARANTEED_PRICE=false
```

### Ordre d'activation recommandé

1. **normalize** : Améliore immédiatement la qualité des briefs
2. **generator** : Aide les clients à mieux rédiger
3. **questioner** : Augmente la complétude des annonces
4. **pricer** : Active après validation des estimations
5. Features avancées : Une par une avec monitoring

## Monitoring

### Métriques clés

```
/api/ai/health - Status des services
- features_enabled: {...}
- ml_service_available: boolean

KPIs à surveiller :
- completion_without_ai vs with_ai
- time_to_publish (impact UX)
- mape_price (précision estimations)
- offers_24h (efficacité matching)
```

### Fallbacks

Tous les services ont des fallbacks gracieux :
- Services ML indisponibles → version simplifiée 
- Timeout → réponse rapide dégradée
- Erreurs → logs + mode dégradé transparent

## Support & Débogage

### Logs utiles

```bash
# Vérifier connectivité ML
curl http://localhost:8001/health

# Tester normalisation
curl -X POST http://localhost:3000/api/ai/normalize \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test description"}'

# Status features
curl http://localhost:3000/api/ai/health
```

### Problèmes courants

1. **Services ML indisponibles** : Vérifier port 8001, logs Python
2. **Flags ignorés** : Redémarrer server après changement .env
3. **Performance** : Vérifier timeouts et taille caches
4. **UI vide** : Vérifier NEXT_PUBLIC_ENABLE_* côté client

## Roadmap

**V1 (actuel)** : Normalisation, génération, questions

**V2 (à venir)** :
- Vision-to-brief (analyse images)
- Audio-to-text (briefs vocaux)
- Pricing avancé (élasticité locale)
- Concierge automatique

**V3** :
- Matching sémantique (pgvector)
- Anti-dumping intelligent
- Apprentissage continu
