
"""
Price Time Suggester - Suggestions intelligentes de prix et délais
"""

import json
import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

@dataclass
class PriceTimeSuggestion:
    price_suggested_min: int
    price_suggested_med: int 
    price_suggested_max: int
    delay_suggested_days: int
    rationale: List[str]
    confidence: float

class PriceTimeSuggester:
    def __init__(self):
        # Base de données des prix par catégorie (en centimes)
        self.category_base_prices = {
            'web_development': {
                'simple': {'min': 150000, 'med': 300000, 'max': 500000, 'days': 21},
                'medium': {'min': 300000, 'med': 600000, 'max': 900000, 'days': 35},
                'complex': {'min': 600000, 'med': 1200000, 'max': 2000000, 'days': 56}
            },
            'mobile_development': {
                'simple': {'min': 250000, 'med': 500000, 'max': 800000, 'days': 28},
                'medium': {'min': 500000, 'med': 1000000, 'max': 1500000, 'days': 42},
                'complex': {'min': 1000000, 'med': 2000000, 'max': 3500000, 'days': 70}
            },
            'design_graphique': {
                'simple': {'min': 50000, 'med': 120000, 'max': 200000, 'days': 7},
                'medium': {'min': 120000, 'med': 250000, 'max': 400000, 'days': 14},
                'complex': {'min': 250000, 'med': 500000, 'max': 800000, 'days': 21}
            },
            'marketing_digital': {
                'simple': {'min': 80000, 'med': 180000, 'max': 300000, 'days': 14},
                'medium': {'min': 180000, 'med': 400000, 'max': 700000, 'days': 28},
                'complex': {'min': 400000, 'med': 800000, 'max': 1500000, 'days': 42}
            },
            'construction': {
                'simple': {'min': 200000, 'med': 500000, 'max': 800000, 'days': 14},
                'medium': {'min': 500000, 'med': 1200000, 'max': 2000000, 'days': 28},
                'complex': {'min': 1200000, 'med': 3000000, 'max': 6000000, 'days': 56}
            },
            'services_personne': {
                'simple': {'min': 2000, 'med': 4000, 'max': 6000, 'days': 1},
                'medium': {'min': 4000, 'med': 8000, 'max': 12000, 'days': 2},
                'complex': {'min': 8000, 'med': 15000, 'max': 25000, 'days': 3}
            }
        }

        # Facteurs d'ajustement
        self.adjustment_factors = {
            'urgency': {'urgent': 1.3, 'normal': 1.0, 'flexible': 0.9},
            'location': {'paris': 1.2, 'grande_ville': 1.1, 'petite_ville': 0.9, 'rural': 0.8},
            'client_type': {'entreprise': 1.1, 'particulier': 0.95, 'association': 0.85},
            'season': {'high': 1.1, 'normal': 1.0, 'low': 0.9},
            'quality_requirement': {'premium': 1.4, 'standard': 1.0, 'budget': 0.7}
        }

        # Mots-clés de complexité
        self.complexity_keywords = {
            'simple': ['simple', 'basique', 'standard', 'classique'],
            'medium': ['personnalisé', 'spécifique', 'adapté', 'intégration'],
            'complex': ['complexe', 'avancé', 'sur-mesure', 'architecture', 'scalable', 'enterprise']
        }

        # Mots-clés d'urgence
        self.urgency_keywords = {
            'urgent': ['urgent', 'rapide', 'vite', 'asap', 'pressé', 'immédiat'],
            'flexible': ['flexible', 'pas pressé', 'quand possible']
        }

    def suggest_price_time(self, 
                          title: str, 
                          description: str, 
                          category: str,
                          location: Optional[str] = None,
                          brief_quality_score: float = 0.7) -> PriceTimeSuggestion:
        """Suggère prix et délais basés sur l'analyse du projet"""
        
        # 1. Déterminer la complexité
        complexity = self._analyze_complexity(description)
        
        # 2. Récupérer les prix de base
        base_prices = self._get_base_prices(category, complexity)
        
        # 3. Analyser les facteurs d'ajustement
        adjustments = self._analyze_adjustments(description, location)
        
        # 4. Calculer les prix ajustés
        final_prices = self._apply_adjustments(base_prices, adjustments, brief_quality_score)
        
        # 5. Générer la justification
        rationale = self._generate_rationale(category, complexity, adjustments, brief_quality_score)
        
        # 6. Calculer la confiance
        confidence = self._calculate_confidence(brief_quality_score, adjustments)
        
        return PriceTimeSuggestion(
            price_suggested_min=final_prices['min'],
            price_suggested_med=final_prices['med'],
            price_suggested_max=final_prices['max'],
            delay_suggested_days=final_prices['days'],
            rationale=rationale,
            confidence=confidence
        )

    def _analyze_complexity(self, description: str) -> str:
        """Analyse la complexité du projet"""
        desc_lower = description.lower()
        
        # Comptage des mots-clés par niveau
        complexity_scores = {}
        for level, keywords in self.complexity_keywords.items():
            score = sum(1 for keyword in keywords if keyword in desc_lower)
            complexity_scores[level] = score
        
        # Facteurs additionnels de complexité
        complexity_indicators = {
            'integrations': len([w for w in ['api', 'intégration', 'webhook', 'sync'] if w in desc_lower]),
            'custom_features': len([w for w in ['personnalisé', 'spécifique', 'unique'] if w in desc_lower]),
            'technical_terms': len([w for w in ['architecture', 'scalable', 'performance', 'sécurité'] if w in desc_lower]),
            'platforms': len([w for w in ['ios', 'android', 'web', 'desktop'] if w in desc_lower])
        }
        
        # Score de complexité global
        total_complexity = (
            complexity_scores.get('complex', 0) * 3 +
            complexity_scores.get('medium', 0) * 2 +
            complexity_scores.get('simple', 0) * 1 +
            sum(complexity_indicators.values())
        )
        
        if total_complexity >= 6:
            return 'complex'
        elif total_complexity >= 3:
            return 'medium'
        else:
            return 'simple'

    def _get_base_prices(self, category: str, complexity: str) -> Dict:
        """Récupère les prix de base pour la catégorie et complexité"""
        
        # Mapping des catégories
        category_mapping = {
            'developpement': 'web_development',
            'web-development': 'web_development',
            'mobile': 'mobile_development',
            'design': 'design_graphique',
            'marketing': 'marketing_digital',
            'construction': 'construction',
            'travaux': 'construction',
            'plomberie': 'construction',
            'electricite': 'construction',
            'menage': 'services_personne',
            'garde_enfants': 'services_personne',
            'jardinage': 'services_personne'
        }
        
        mapped_category = category_mapping.get(category, 'web_development')
        
        if mapped_category in self.category_base_prices:
            return self.category_base_prices[mapped_category][complexity].copy()
        else:
            # Fallback sur web_development
            return self.category_base_prices['web_development'][complexity].copy()

    def _analyze_adjustments(self, description: str, location: Optional[str]) -> Dict:
        """Analyse les facteurs d'ajustement"""
        desc_lower = description.lower()
        adjustments = {}
        
        # Urgence
        if any(keyword in desc_lower for keyword in self.urgency_keywords['urgent']):
            adjustments['urgency'] = 'urgent'
        elif any(keyword in desc_lower for keyword in self.urgency_keywords['flexible']):
            adjustments['urgency'] = 'flexible'
        else:
            adjustments['urgency'] = 'normal'
        
        # Localisation
        if location:
            location_lower = location.lower()
            if 'paris' in location_lower:
                adjustments['location'] = 'paris'
            elif any(city in location_lower for city in ['lyon', 'marseille', 'lille', 'toulouse', 'bordeaux']):
                adjustments['location'] = 'grande_ville'
            else:
                adjustments['location'] = 'petite_ville'
        else:
            adjustments['location'] = 'normal'
        
        # Type de client
        if any(word in desc_lower for word in ['entreprise', 'société', 'business', 'corporate']):
            adjustments['client_type'] = 'entreprise'
        elif any(word in desc_lower for word in ['association', 'ong', 'bénévole']):
            adjustments['client_type'] = 'association'
        else:
            adjustments['client_type'] = 'particulier'
        
        # Exigences de qualité
        if any(word in desc_lower for word in ['premium', 'haut de gamme', 'luxe', 'excellence']):
            adjustments['quality_requirement'] = 'premium'
        elif any(word in desc_lower for word in ['budget', 'économique', 'pas cher']):
            adjustments['quality_requirement'] = 'budget'
        else:
            adjustments['quality_requirement'] = 'standard'
        
        return adjustments

    def _apply_adjustments(self, base_prices: Dict, adjustments: Dict, brief_quality: float) -> Dict:
        """Applique les facteurs d'ajustement aux prix de base"""
        
        adjustment_factor = 1.0
        
        # Application des facteurs
        for factor_type, factor_value in adjustments.items():
            if factor_type in self.adjustment_factors and factor_value in self.adjustment_factors[factor_type]:
                adjustment_factor *= self.adjustment_factors[factor_type][factor_value]
        
        # Ajustement qualité du brief
        quality_adjustment = 0.9 + (brief_quality * 0.2)  # Entre 0.9 et 1.1
        adjustment_factor *= quality_adjustment
        
        # Application aux prix
        adjusted_prices = {
            'min': int(base_prices['min'] * adjustment_factor * 0.8),
            'med': int(base_prices['med'] * adjustment_factor),
            'max': int(base_prices['max'] * adjustment_factor * 1.2),
            'days': int(base_prices['days'] * (adjustment_factor if adjustments.get('urgency') == 'urgent' else 1.0))
        }
        
        # Ajustement des délais selon l'urgence
        if adjustments.get('urgency') == 'urgent':
            adjusted_prices['days'] = max(1, int(adjusted_prices['days'] * 0.7))
        elif adjustments.get('urgency') == 'flexible':
            adjusted_prices['days'] = int(adjusted_prices['days'] * 1.3)
        
        return adjusted_prices

    def _generate_rationale(self, category: str, complexity: str, adjustments: Dict, brief_quality: float) -> List[str]:
        """Génère la justification des prix suggérés"""
        rationale = []
        
        # Base de calcul
        rationale.append(f"Prix de base pour {category} de complexité {complexity}")
        
        # Ajustements appliqués
        if adjustments.get('urgency') == 'urgent':
            rationale.append("Majoration urgence (+30%) pour délai accéléré")
        elif adjustments.get('urgency') == 'flexible':
            rationale.append("Réduction flexibilité (-10%) pour planning souple")
        
        if adjustments.get('location') == 'paris':
            rationale.append("Majoration localisation Paris (+20%)")
        elif adjustments.get('location') == 'grande_ville':
            rationale.append("Majoration grande ville (+10%)")
        
        if adjustments.get('client_type') == 'entreprise':
            rationale.append("Majoration client entreprise (+10%)")
        elif adjustments.get('client_type') == 'association':
            rationale.append("Réduction client associatif (-15%)")
        
        if adjustments.get('quality_requirement') == 'premium':
            rationale.append("Majoration exigences premium (+40%)")
        elif adjustments.get('quality_requirement') == 'budget':
            rationale.append("Réduction budget contraint (-30%)")
        
        # Qualité du brief
        if brief_quality > 0.8:
            rationale.append("Bonus brief détaillé et clair (+10%)")
        elif brief_quality < 0.6:
            rationale.append("Ajustement brief incomplet (-10%)")
        
        # Conseils
        rationale.append("Fourchette adaptée au marché français actuel")
        
        return rationale

    def _calculate_confidence(self, brief_quality: float, adjustments: Dict) -> float:
        """Calcule le niveau de confiance de l'estimation"""
        base_confidence = 0.7
        
        # Bonus qualité du brief
        confidence_boost = brief_quality * 0.2
        
        # Ajustement selon les informations disponibles
        info_completeness = len([adj for adj in adjustments.values() if adj != 'normal']) / 4
        confidence_boost += info_completeness * 0.1
        
        return min(0.95, base_confidence + confidence_boost)

# Instance principale
price_time_suggester = PriceTimeSuggester()
