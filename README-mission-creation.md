
# Création de Mission avec IA - AppelsPro

## Vue d'ensemble

Le système de création de mission intègre une intelligence artificielle pour améliorer automatiquement les annonces, suggérer des prix et délais réalistes, et poser des questions pertinentes pour compléter le brief.

## Fonctionnalités

### 1. Formulaire de Création Intelligent

- **Validation en temps réel** : Vérification des champs avec messages d'erreur clairs
- **Idempotence** : Évite les doublons en cas de rejeu de requête
- **Interface responsive** : Adaptée mobile et desktop

### 2. IA d'Amélioration

#### Analyse Automatique
- **Normalisation du texte** : Extraction des quantités, contraintes, mots-clés
- **Classification taxonomique** : Catégorisation et identification des compétences
- **Analyse qualité** : Score de qualité du brief et richesse du contenu

#### Suggestions Intelligentes
- **Réécriture** : Titre et résumé améliorés avec structure professionnelle
- **Prix et délais** : Estimations basées sur les données marché
- **Questions manquantes** : Identification des informations à compléter
- **Score LOC** : Évaluation de la probabilité de succès

### 3. Application en Un Clic

- **Sélection granulaire** : Choisir quelles suggestions appliquer
- **Preview en temps réel** : Voir les changements avant application
- **Historique** : Traçabilité des modifications IA

## Utilisation

### Création Basique

```bash
# Accéder au formulaire
GET /missions/new

# Créer une mission
POST /api/missions
{
  "title": "Développement site e-commerce",
  "description": "Site de vente en ligne avec paiement sécurisé",
  "category": "développement",
  "budget_min": 5000,
  "budget_max": 15000,
  "deadline_ts": "2025-06-01"
}
```

### Avec IA

```bash
# 1. Obtenir des suggestions
POST /api/ai/missions/suggest
{
  "title": "Site web",
  "description": "Besoin d'un site pour vendre en ligne",
  "category": "développement"
}

# Réponse
{
  "suggestion": {
    "title": "Développement Site E-commerce - Vente en ligne",
    "summary": "**Vision et objectifs** : Création d'une plateforme...",
    "brief_quality_score": 0.75,
    "price_suggested_med": 8500,
    "missing_info": [
      {"id": "payment", "q": "Quels moyens de paiement souhaitez-vous ?"}
    ]
  }
}

# 2. Créer avec suggestions appliquées
POST /api/missions
{
  "title": "Site web",
  "description": "Besoin d'un site pour vendre en ligne",
  "category": "développement",
  "budget_min": 6000,
  "budget_max": 12000,
  "applied_ai_suggestion": {
    "applied_settings": {
      "text": true,
      "budget": "med",
      "delay": true
    },
    "suggestion": { /* objet suggestion complet */ }
  },
  "missing_info_answers": {
    "payment": "CB, PayPal, virement"
  }
}
```

## API Endpoints

### Missions

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/missions/new` | Formulaire de création |
| `POST` | `/api/missions` | Créer une mission |
| `GET` | `/api/missions/:id` | Détail mission |
| `PUT` | `/api/missions/:id` | Modifier mission |

### IA

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/ai/missions/suggest` | Générer suggestions |
| `POST` | `/api/ai/missions/apply-suggestion` | Appliquer suggestions |
| `POST` | `/api/brief/recompute` | Recalculer après réponses |

### Administration

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/admin/diagnostics` | État du système |
| `GET` | `/api/logs/errors` | Logs d'erreurs |

## Gestion des Erreurs

### Codes de Retour

- **201** : Mission créée avec succès
- **422** : Erreur de validation (détail par champ)
- **409** : Conflit d'idempotence
- **500** : Erreur interne (avec trace_id)

### Exemples d'Erreurs

```json
// Validation
{
  "code": "VALIDATION_ERROR",
  "field": "budget_max", 
  "message": "Le budget maximum doit être supérieur au minimum",
  "hint": "Le budget maximum doit être supérieur ou égal au minimum"
}

// Idempotence
{
  "code": "IDEMPOTENCY_CONFLICT",
  "message": "Cette clé d'idempotence a déjà été utilisée"
}
```

## Idempotence

Le système supporte l'idempotence via le header `Idempotency-Key` :

```bash
curl -X POST /api/missions \
  -H "Idempotency-Key: mission-abc-001" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test mission",...}'
```

- **Durée de cache** : 15 minutes
- **Comportement** : Retourne la même réponse pour la même clé
- **Nettoyage automatique** : Cache vidé périodiquement

## Tests

### Tests E2E

```bash
npm run test:e2e
```

Couvre :
- Création de mission complète
- Suggestions IA
- Application des suggestions  
- Gestion des erreurs
- Idempotence

### Tests Unitaires

```bash
npm run test:unit
```

Couvre :
- Validateurs Zod
- Helpers d'idempotence
- Mappers de suggestions

## Données IA

### Taxonomie des Compétences

Le fichier `infra/data/taxonomy_skills_fr.csv` contient :
- **Catégories** : développement, design, marketing, etc.
- **Sous-catégories** : web, mobile, ui_ux, etc.
- **Compétences** : React, Figma, SEO, etc.
- **Mots-clés** : Termes de reconnaissance

### Prix de Référence  

Le fichier `infra/data/price_terms_fr.csv` contient :
- **Tarifs horaires** : min/med/max par catégorie
- **Tarifs journaliers** : équivalents
- **Facteurs de complexité** : Ajustements selon difficulté
- **Délais moyens** : Durées types par projet

## Monitoring

### Métriques Disponibles

```bash
GET /api/admin/diagnostics
```

Retourne :
- État des routes et formulaires
- Nombre de missions créées
- Suggestions IA générées
- Taille du cache d'idempotence
- Dernières erreurs

### Logs

```bash
GET /api/logs/errors?since=2025-01-01
```

Historique des erreurs avec :
- Timestamp
- Message et stack trace
- Contexte (route, méthode)
- Trace ID pour debugging

## Bonnes Pratiques

### Côté Client

1. **Validation progressive** : Valider les champs au fur et à mesure
2. **Feedback utilisateur** : Messages clairs et actions possibles
3. **Gestion réseau** : Retry automatique et offline handling
4. **UX IA** : Rendre les suggestions compréhensibles et actionnables

### Côté Serveur

1. **Idempotence systématique** : Tous les endpoints de création
2. **Validation robuste** : Zod + validation métier
3. **Logging détaillé** : Traçabilité complète des actions
4. **Graceful degradation** : Fallback si IA indisponible

## Exemples Complets

### cURL de Test

```bash
# Suggestion IA
curl -X POST http://localhost:5000/api/ai/missions/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Peinture salon",
    "description": "Peindre murs 40 m², 2 couches satin", 
    "category": "travaux",
    "budget_min": 6000,
    "budget_max": 12000
  }'

# Création avec IA
curl -X POST http://localhost:5000/api/missions \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: mission-abc-001" \
  -d '{
    "title": "Peinture salon (amélioré)",
    "description": "...",
    "category": "travaux", 
    "budget_min": 7000,
    "budget_max": 12000,
    "deadline_ts": "2025-10-01",
    "applied_ai_suggestion": {
      "applied_settings": {"budget": "med", "delay": true},
      "suggestion": {...}
    }
  }'
```

Cette implémentation fournit un système complet de création de mission avec IA intégrée, robuste et user-friendly.
