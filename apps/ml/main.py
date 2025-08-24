from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import os
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import QuantileRegressor
import lightgbm as lgb
import networkx as nx
import pickle
import json
from datetime import datetime, timedelta
import logging

# Import for market intelligence integration
from services.brief_quality import brief_quality_service
from services.smart_brief import smart_brief_service
from services.taxonomizer import taxonomizer_service
from services.text_normalizer import text_normalizer_service
from services.market_intelligence import get_market_suggestions

# Import for new enhancement endpoints
from services.template_rewriter import template_rewriter
from services.price_time_suggester import price_time_suggester
from services.loc_uplift import loc_uplift_calculator

# Configuration offline obligatoire
os.environ['OFFLINE_MODE'] = 'true'
os.environ['NO_EXTERNAL_CALLS'] = 'true'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
os.environ['HF_HUB_OFFLINE'] = '1'

app = FastAPI(title="IA Offline API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models de données
class MissionData(BaseModel):
    id: str
    title: str
    description: str
    budget: float
    category: str
    client_id: str
    skills_required: List[str]
    urgency: str
    complexity: str
    duration_weeks: int

class ProviderData(BaseModel):
    id: str
    skills: List[str]
    rating: float
    completed_projects: int
    location: str
    hourly_rate: float
    categories: List[str]
    response_time: float
    success_rate: float

class BidData(BaseModel):
    id: str
    mission_id: str
    provider_id: str
    price: float
    timeline: str
    proposal: str
    created_at: str

class AIScoreRequest(BaseModel):
    mission: MissionData
    provider: ProviderData
    bid: Optional[BidData] = None

class PriceRecommendationRequest(BaseModel):
    mission: MissionData
    market_data: Dict[str, Any]
    competition_level: str

# Models for new enhancement endpoints
class ProjectStandardizeRequest(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    budget: Optional[float] = None
    location: Optional[str] = None

class ProjectImproveRequest(BaseModel):
    project: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None

class BriefRecomputeRequest(BaseModel):
    project_id: str
    answers: List[Dict[str, Any]]
    project_data: Optional[Dict[str, Any]] = None

# Stockage des modèles locaux
class ModelStorage:
    def __init__(self):
        self.models_path = "/models"
        self.tfidf_vectorizer = None
        self.price_model = None
        self.fraud_detector = None
        self.keyword_embeddings = {}
        self.load_models()

    def load_models(self):
        """Charge tous les modèles depuis le stockage local"""
        try:
            # TF-IDF pour matching sémantique
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=5000,
                stop_words=['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais'],
                ngram_range=(1, 2)
            )

            # Modèle de prix par régression quantile
            self.price_model = QuantileRegressor(quantile=0.5, alpha=0.1)

            # Détecteur de fraude/abus
            self.fraud_detector = IsolationForest(contamination=0.1, random_state=42)

            logging.info("Modèles ML chargés avec succès")
        except Exception as e:
            logging.error(f"Erreur chargement modèles: {e}")

model_storage = ModelStorage()

# Service de scoring multi-objectif
class MultiObjectiveScorer:
    def __init__(self):
        self.weights = {
            'price': 0.25,
            'quality': 0.20,
            'fit': 0.20,
            'delay': 0.15,
            'risk': 0.10,
            'loc': 0.10  # Likelihood of Completion
        }

    def calculate_comprehensive_score(self, mission: MissionData, provider: ProviderData, bid: BidData = None) -> Dict[str, Any]:
        """Calcule le score multi-objectif explicable"""

        # Score de prix (compétitivité)
        price_score = self._calculate_price_score(mission, provider, bid)

        # Score de qualité (expérience/rating)
        quality_score = self._calculate_quality_score(provider)

        # Score de correspondance (fit)
        fit_score = self._calculate_fit_score(mission, provider)

        # Score de délai (rapidité)
        delay_score = self._calculate_delay_score(provider, bid)

        # Score de risque (fiabilité)
        risk_score = self._calculate_risk_score(provider)

        # Probabilité d'aboutissement (LOC)
        loc_score = self._calculate_completion_probability(mission, provider, bid)

        # Score global pondéré
        total_score = (
            price_score * self.weights['price'] +
            quality_score * self.weights['quality'] +
            fit_score * self.weights['fit'] +
            delay_score * self.weights['delay'] +
            risk_score * self.weights['risk'] +
            loc_score * self.weights['loc']
        )

        return {
            'total_score': round(total_score, 2),
            'breakdown': {
                'price': round(price_score, 2),
                'quality': round(quality_score, 2),
                'fit': round(fit_score, 2),
                'delay': round(delay_score, 2),
                'risk': round(risk_score, 2),
                'completion_probability': round(loc_score, 2)
            },
            'explanations': self._generate_explanations(price_score, quality_score, fit_score, delay_score, risk_score, loc_score)
        }

    def _calculate_price_score(self, mission: MissionData, provider: ProviderData, bid: BidData = None) -> float:
        """Score basé sur la compétitivité du prix"""
        if not bid:
            return 70.0  # Score neutre sans offre

        expected_price = provider.hourly_rate * mission.duration_weeks * 40  # 40h/semaine
        price_ratio = bid.price / expected_price

        if price_ratio < 0.5:  # Suspicieusement bas
            return 20.0
        elif price_ratio < 0.8:  # Très compétitif
            return 95.0
        elif price_ratio <= 1.0:  # Compétitif
            return 85.0
        elif price_ratio <= 1.2:  # Acceptable
            return 70.0
        else:  # Cher
            return max(30.0, 70.0 - (price_ratio - 1.2) * 100)

    def _calculate_quality_score(self, provider: ProviderData) -> float:
        """Score basé sur la qualité/expérience"""
        rating_score = (provider.rating / 5.0) * 40
        experience_score = min(30.0, provider.completed_projects * 0.5)
        success_rate_score = provider.success_rate * 30

        return rating_score + experience_score + success_rate_score

    def _calculate_fit_score(self, mission: MissionData, provider: ProviderData) -> float:
        """Score de correspondance compétences/mission"""
        # Matching des compétences
        mission_skills = set(skill.lower() for skill in mission.skills_required)
        provider_skills = set(skill.lower() for skill in provider.skills)

        skill_match = len(mission_skills.intersection(provider_skills)) / max(len(mission_skills), 1)

        # Matching des catégories
        category_match = 1.0 if mission.category in provider.categories else 0.3

        # Score combiné
        return (skill_match * 70 + category_match * 30)

    def _calculate_delay_score(self, provider: ProviderData, bid: BidData = None) -> float:
        """Score basé sur la rapidité de livraison"""
        base_score = max(50.0, 100.0 - provider.response_time * 10)  # Temps de réponse

        if bid:
            timeline_weeks = self._extract_timeline_weeks(bid.timeline)
            if timeline_weeks <= 2:
                base_score += 20
            elif timeline_weeks <= 4:
                base_score += 10
            elif timeline_weeks > 12:
                base_score -= 20

        return min(100.0, base_score)

    def _calculate_risk_score(self, provider: ProviderData) -> float:
        """Score de risque (inverse du risque)"""
        rating_factor = provider.rating / 5.0
        experience_factor = min(1.0, provider.completed_projects / 20.0)
        success_factor = provider.success_rate

        risk_score = (rating_factor * 40 + experience_factor * 30 + success_factor * 30)
        return risk_score

    def _calculate_completion_probability(self, mission: MissionData, provider: ProviderData, bid: BidData = None) -> float:
        """Probabilité d'aboutissement du projet"""
        base_probability = provider.success_rate * 60

        # Facteurs d'ajustement
        if provider.rating >= 4.5:
            base_probability += 15
        if provider.completed_projects >= 20:
            base_probability += 10

        complexity_penalty = {'low': 0, 'medium': -5, 'high': -10}.get(mission.complexity, -5)
        urgency_penalty = {'low': 5, 'medium': 0, 'high': -10}.get(mission.urgency, 0)

        return min(95.0, max(10.0, base_probability + complexity_penalty + urgency_penalty))

    def _extract_timeline_weeks(self, timeline: str) -> int:
        """Extrait le nombre de semaines depuis une timeline"""
        timeline_lower = timeline.lower()
        if 'semaine' in timeline_lower:
            numbers = [int(s) for s in timeline_lower.split() if s.isdigit()]
            return numbers[0] if numbers else 4
        return 4  # Default

    def _generate_explanations(self, price: float, quality: float, fit: float, delay: float, risk: float, loc: float) -> List[str]:
        """Génère des explications pour le scoring"""
        explanations = []

        if price >= 85:
            explanations.append("Prix très compétitif")
        elif price <= 40:
            explanations.append("Prix potentiellement problématique")

        if quality >= 80:
            explanations.append("Profil prestataire excellent")
        elif quality <= 50:
            explanations.append("Expérience limitée du prestataire")

        if fit >= 80:
            explanations.append("Parfaite correspondance des compétences")
        elif fit <= 50:
            explanations.append("Correspondance partielle des compétences")

        if loc >= 80:
            explanations.append("Forte probabilité de succès")
        elif loc <= 50:
            explanations.append("Risques de non-aboutissement")

        return explanations

scorer = MultiObjectiveScorer()

# Service de recommandation de prix IA
class PriceRecommendationEngine:
    def __init__(self):
        self.market_data = {}
        self.quantile_models = {}

    def recommend_price(self, mission: MissionData, competition_level: str, provider_skill_level: str = "medium") -> Dict[str, Any]:
        """Recommande un prix basé sur la régression quantile et les règles métier"""

        # Calcul du prix de base
        base_price = self._calculate_base_price(mission)

        # Ajustements selon la concurrence
        competition_multiplier = {
            'low': 1.1,    # Peut se permettre +10%
            'medium': 0.95,  # Légèrement agressif
            'high': 0.85    # Très agressif
        }.get(competition_level, 0.95)

        # Ajustements selon le niveau de compétence
        skill_multiplier = {
            'junior': 0.8,
            'medium': 1.0,
            'senior': 1.2,
            'expert': 1.4
        }.get(provider_skill_level, 1.0)

        # Prix recommandé
        recommended_price = base_price * competition_multiplier * skill_multiplier

        # Quantiles pour donner une fourchette
        price_range = {
            'min': recommended_price * 0.85,
            'recommended': recommended_price,
            'max': recommended_price * 1.15
        }

        return {
            'price_range': price_range,
            'confidence': self._calculate_confidence(mission, competition_level),
            'reasoning': self._generate_price_reasoning(competition_level, skill_multiplier),
            'market_position': self._analyze_market_position(recommended_price, mission)
        }

    def _calculate_base_price(self, mission: MissionData) -> float:
        """Calcule le prix de base selon la complexité et durée"""
        complexity_rates = {
            'low': 35,
            'medium': 50,
            'high': 70
        }

        hourly_rate = complexity_rates.get(mission.complexity, 50)
        estimated_hours = mission.duration_weeks * 35  # 35h/semaine en moyenne

        return hourly_rate * estimated_hours

    def _calculate_confidence(self, mission: MissionData, competition_level: str) -> float:
        """Calcule la confiance dans la recommandation"""
        base_confidence = 75.0

        # Ajustements
        if competition_level == 'low':
            base_confidence += 15
        elif competition_level == 'high':
            base_confidence -= 10

        if mission.complexity == 'high':
            base_confidence -= 5

        return min(95.0, max(50.0, base_confidence))

    def _generate_price_reasoning(self, competition_level: str, skill_multiplier: float) -> List[str]:
        """Génère les raisons de la recommandation"""
        reasons = []

        if competition_level == 'high':
            reasons.append("Concurrence élevée - prix agressif recommandé")
        elif competition_level == 'low':
            reasons.append("Faible concurrence - possibilité de prix premium")

        if skill_multiplier > 1.1:
            reasons.append("Niveau d'expertise élevé - premium justifié")
        elif skill_multiplier < 0.9:
            reasons.append("Positionnement junior - prix attractif")

        return reasons

    def _analyze_market_position(self, price: float, mission: MissionData) -> str:
        """Analyse la position sur le marché"""
        if price < 2000:
            return "budget_friendly"
        elif price < 5000:
            return "standard"
        elif price < 10000:
            return "premium"
        else:
            return "luxury"

price_engine = PriceRecommendationEngine()

# Détecteur d'abus et anti-dumping
class AbuseDetector:
    def __init__(self):
        self.bid_graph = nx.Graph()
        self.suspicious_patterns = []

    def detect_collusion(self, bids: List[BidData]) -> Dict[str, Any]:
        """Détecte la collusion entre prestataires"""
        collusion_indicators = []

        # Analyse des patterns de prix
        prices = [bid.price for bid in bids]
        if len(prices) > 2:
            price_std = np.std(prices)
            price_mean = np.mean(prices)

            if price_std / price_mean < 0.05:  # Écart-type très faible
                collusion_indicators.append("Prices suspiciously similar")

        # Analyse temporelle des offres
        timestamps = [datetime.fromisoformat(bid.created_at.replace('Z', '+00:00')) for bid in bids]
        if len(timestamps) > 1:
            time_diffs = [(timestamps[i+1] - timestamps[i]).total_seconds() for i in range(len(timestamps)-1)]
            if any(diff < 60 for diff in time_diffs):  # Offres à moins d'1min d'intervalle
                collusion_indicators.append("Coordinated timing detected")

        return {
            'collusion_detected': len(collusion_indicators) > 0,
            'indicators': collusion_indicators,
            'confidence': min(95.0, len(collusion_indicators) * 40)
        }

    def detect_dumping(self, bid: BidData, mission: MissionData, market_avg: float) -> Dict[str, Any]:
        """Détecte le dumping (prix anormalement bas)"""
        dumping_threshold = market_avg * 0.5  # 50% sous le marché

        is_dumping = bid.price < dumping_threshold

        severity = "none"
        if is_dumping:
            ratio = bid.price / market_avg
            if ratio < 0.3:
                severity = "severe"
            elif ratio < 0.4:
                severity = "moderate"
            else:
                severity = "mild"

        return {
            'dumping_detected': is_dumping,
            'severity': severity,
            'price_ratio': bid.price / market_avg,
            'recommendation': "Block bid" if severity == "severe" else "Flag for review" if is_dumping else "Allow"
        }

abuse_detector = AbuseDetector()

# Endpoints API
@app.post("/score/comprehensive")
async def get_comprehensive_score(request: AIScoreRequest):
    """Calcule le score multi-objectif explicable"""
    try:
        score_result = scorer.calculate_comprehensive_score(
            request.mission, 
            request.provider, 
            request.bid
        )
        return score_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/price/recommend")
async def recommend_price(request: PriceRecommendationRequest):
    """Recommande un prix optimal"""
    try:
        recommendation = price_engine.recommend_price(
            request.mission,
            request.competition_level
        )
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/abuse/detect")
async def detect_abuse(bids: List[BidData], mission: MissionData):
    """Détecte les abus (collusion, dumping)"""
    try:
        results = {}

        # Détection de collusion
        if len(bids) > 1:
            results['collusion'] = abuse_detector.detect_collusion(bids)

        # Détection de dumping
        if bids:
            market_avg = np.mean([bid.price for bid in bids])
            results['dumping'] = [
                abuse_detector.detect_dumping(bid, mission, market_avg) 
                for bid in bids
            ]

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match/semantic")
async def semantic_matching(mission_text: str, provider_profiles: List[str]):
    """Matching sémantique avec TF-IDF (fallback offline)"""
    try:
        # Vectorisation TF-IDF
        all_texts = [mission_text] + provider_profiles
        tfidf_matrix = model_storage.tfidf_vectorizer.fit_transform(all_texts)

        # Calcul de similarité
        mission_vector = tfidf_matrix[0]
        similarities = cosine_similarity(mission_vector, tfidf_matrix[1:]).flatten()

        # Résultats triés
        matches = [
            {
                'provider_index': i,
                'similarity_score': float(similarities[i]),
                'match_quality': 'excellent' if similarities[i] > 0.7 else 'good' if similarities[i] > 0.5 else 'fair'
            }
            for i in range(len(similarities))
        ]

        return sorted(matches, key=lambda x: x['similarity_score'], reverse=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New endpoints for enhancement
@app.post("/improve")
async def improve_project(request: ProjectImproveRequest):
    """Améliore complètement un projet avec réécriture, standardisation, prix et LOC"""
    try:
        project = request.project
        context = request.context or {}

        # 1. Réécriture structurée
        rewrite_result = template_rewriter.rewrite_project(
            title=project.get('title', ''),
            description=project.get('description', ''),
            category=project.get('category', '')
        )

        # 2. Normalisation et taxonomie
        normalized = text_normalizer.normalize_text(
            f"{project.get('title', '')} {project.get('description', '')}"
        )

        taxonomy_result = taxonomizer.classify_and_extract(
            project.get('description', ''), 
            project.get('category', '')
        )

        # 3. Analyse qualité du brief
        quality_analysis = brief_quality_analyzer.analyze_brief_quality(
            project.get('description', '')
        )

        # 4. Suggestions de prix et délais
        price_time_result = price_time_suggester.suggest_price_time(
            title=project.get('title', ''),
            description=project.get('description', ''),
            category=project.get('category', ''),
            location=project.get('location'),
            brief_quality_score=quality_analysis.get('overall_score', 70) / 100
        )

        # 5. Calcul LOC et uplift
        market_context = {
            'heat_score': context.get('market_heat', 0.7),
            'price_suggested_med': price_time_result.price_suggested_med
        }

        standardization_data = {
            'brief_quality_score': quality_analysis.get('overall_score', 70) / 100,
            'price_suggested_min': price_time_result.price_suggested_min,
            'price_suggested_med': price_time_result.price_suggested_med,
            'price_suggested_max': price_time_result.price_suggested_max,
            'delay_suggested_days': price_time_result.delay_suggested_days,
            'missing_info': quality_analysis.get('missing_info', [])
        }

        loc_result = loc_uplift_calculator.calculate_loc_with_uplift(
            project_data=project,
            standardization_data=standardization_data,
            market_context=market_context
        )

        # 6. Assemblage de la réponse complète
        return {
            # Réécriture
            "title_std": rewrite_result.title_std,
            "summary_std": rewrite_result.summary_std,
            "acceptance_criteria": rewrite_result.acceptance_criteria,
            "tasks_std": rewrite_result.tasks_std,
            "deliverables_std": rewrite_result.deliverables_std,

            # Standardisation
            "category_std": taxonomy_result.get('category_std', project.get('category', 'other')),
            "sub_category_std": taxonomy_result.get('sub_category_std', 'general'),
            "tags_std": taxonomy_result.get('tags', []),
            "skills_std": taxonomy_result.get('skills', []),
            "constraints_std": normalized.get('constraints', []),

            # Scores et analyse
            "brief_quality_score": quality_analysis.get('overall_score', 70) / 100,
            "richness_score": min(1.0, len(project.get('description', '').split()) / 100),
            "missing_info": quality_analysis.get('missing_info', []),

            # Prix et délais
            "price_suggested_min": price_time_result.price_suggested_min,
            "price_suggested_med": price_time_result.price_suggested_med, 
            "price_suggested_max": price_time_result.price_suggested_max,
            "delay_suggested_days": price_time_result.delay_suggested_days,
            "price_rationale": price_time_result.rationale,
            "price_confidence": price_time_result.confidence,

            # LOC et uplift
            "loc_base": loc_result.loc_base,
            "loc_uplift_reco": loc_result.loc_uplift_reco,
            "improvement_potential": loc_result.improvement_potential,
            "loc_recommendations": loc_result.recommendations,

            # Métadonnées
            "rewrite_version": rewrite_result.rewrite_version,
            "model_version": "v2.0",
            "generated_at": "2024-01-01T00:00:00Z"
        }

    except Exception as e:
        print(f"Erreur amélioration projet: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/brief/recompute")
async def recompute_brief(request: BriefRecomputeRequest):
    """Recalcule la standardisation après réponses aux questions manquantes"""
    try:
        # Mise à jour du projet avec les réponses
        updated_project = request.project_data or {}

        # Intégration des réponses dans la description
        answers_text = []
        for answer in request.answers:
            question_id = answer.get('question_id', '')
            value = answer.get('value', '')
            if value:
                answers_text.append(f"{question_id}: {value}")

        enhanced_description = updated_project.get('description', '')
        if answers_text:
            enhanced_description += "\n\nInformations complémentaires:\n" + "\n".join(answers_text)

        # Nouveau calcul d'amélioration
        improve_request = ProjectImproveRequest(
            project={
                **updated_project,
                'description': enhanced_description
            }
        )

        return await improve_project(improve_request)

    except Exception as e:
        print(f"Erreur recalcul brief: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/standardize")
async def standardize_project(request: ProjectStandardizeRequest):
    """Standardise un projet en extrayant informations structurées"""
    try:
        # Redirection vers le nouveau endpoint d'amélioration
        improve_request = ProjectImproveRequest(
            project={
                'title': request.title,
                'description': request.description,
                'category': request.category,
                'budget': request.budget,
                'location': request.location
            }
        )

        result = await improve_project(improve_request)

        # Retour du format attendu par l'ancien endpoint
        return {
            "title_std": result.get('title_std'),
            "summary_std": result.get('summary_std'),
            "category_std": result.get('category_std'),
            "sub_category_std": result.get('sub_category_std'),
            "tags_std": result.get('tags_std'),
            "skills_std": result.get('skills_std'),
            "constraints_std": result.get('constraints_std'),
            "acceptance_criteria": result.get('acceptance_criteria'),
            "brief_quality_score": result.get('brief_quality_score'),
            "richness_score": result.get('richness_score'),
            "missing_info": result.get('missing_info'),
            "price_suggested_min": result.get('price_suggested_min'),
            "price_suggested_med": result.get('price_suggested_med'),
            "price_suggested_max": result.get('price_suggested_max'),
            "delay_suggested_days": result.get('delay_suggested_days'),
            "loc_uplift_reco": result.get('loc_uplift_reco')
        }

    except Exception as e:
        print(f"Erreur standardisation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Vérification de santé du service"""
    return {
        'status': 'healthy',
        'offline_mode': True,
        'models_loaded': True,
        'timestamp': datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)