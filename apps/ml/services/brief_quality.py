
import re
from typing import Dict, List, Tuple
from dataclasses import dataclass

@dataclass
class QualityMetrics:
    brief_quality_score: float
    richness_score: float
    missing_info: List[Dict[str, str]]
    improvement_suggestions: List[str]

class BriefQualityAnalyzer:
    """Analyseur de qualité des briefs et détection d'informations manquantes"""
    
    def __init__(self):
        # Critères essentiels pour un brief de qualité
        self.essential_criteria = {
            'budget_range': {
                'patterns': [
                    r'budget.*?(\d+.*?\d+)\s*€',
                    r'(\d+)\s*à\s*(\d+)\s*€',
                    r'environ\s*(\d+)\s*€',
                    r'maximum\s*(\d+)\s*€'
                ],
                'weight': 0.25,
                'description': 'Budget ou fourchette budgétaire'
            },
            'timeline': {
                'patterns': [
                    r'délai.*?(\d+)\s*(?:jours?|semaines?|mois)',
                    r'(?:dans|sous)\s*(\d+)\s*(?:jours?|semaines?|mois)',
                    r'livraison.*?(\d+)',
                    r'échéance.*?(\d+)'
                ],
                'weight': 0.20,
                'description': 'Délai ou échéance'
            },
            'objectives': {
                'patterns': [
                    r'objectif',
                    r'but\s+(?:de|du)',
                    r'finalité',
                    r'résultat\s+attendu',
                    r'attente'
                ],
                'weight': 0.15,
                'description': 'Objectifs clairs du projet'
            },
            'scope': {
                'patterns': [
                    r'périmètre',
                    r'inclut',
                    r'comprend',
                    r'fonctionnalités?',
                    r'caractéristiques?'
                ],
                'weight': 0.15,
                'description': 'Périmètre du projet'
            },
            'target_audience': {
                'patterns': [
                    r'public\s+cible',
                    r'utilisateurs?',
                    r'clients?',
                    r'cible',
                    r'audience'
                ],
                'weight': 0.10,
                'description': 'Public cible ou utilisateurs'
            },
            'technical_constraints': {
                'patterns': [
                    r'contraintes?\s+techniques?',
                    r'technologie',
                    r'plateforme',
                    r'compatibilité',
                    r'navigateurs?'
                ],
                'weight': 0.10,
                'description': 'Contraintes techniques'
            },
            'contact_info': {
                'patterns': [
                    r'contact',
                    r'joindre',
                    r'disponible',
                    r'réunion',
                    r'échange'
                ],
                'weight': 0.05,
                'description': 'Informations de contact et disponibilité'
            }
        }
        
        # Indicateurs de richesse du brief
        self.richness_indicators = {
            'examples': ['exemple', 'par exemple', 'comme', 'tel que'],
            'references': ['inspiration', 'référence', 'similaire à', 'dans le style de'],
            'details': ['précision', 'détail', 'spécification', 'particulier'],
            'context': ['contexte', 'situation', 'environnement', 'cadre']
        }

    def analyze_quality(self, title: str, description: str, category: str = None) -> QualityMetrics:
        """Analyse complète de la qualité du brief"""
        full_text = f"{title} {description}".lower()
        
        # 1. Score de qualité basé sur les critères essentiels
        quality_score = self._calculate_quality_score(full_text)
        
        # 2. Score de richesse basé sur les indicateurs
        richness_score = self._calculate_richness_score(full_text)
        
        # 3. Détection des informations manquantes
        missing_info = self._detect_missing_info(full_text, title, description)
        
        # 4. Suggestions d'amélioration
        suggestions = self._generate_suggestions(quality_score, richness_score, missing_info)
        
        return QualityMetrics(
            brief_quality_score=quality_score,
            richness_score=richness_score,
            missing_info=missing_info,
            improvement_suggestions=suggestions
        )

    def _calculate_quality_score(self, text: str) -> float:
        """Calcul du score de qualité basé sur les critères essentiels"""
        total_score = 0.0
        
        for criterion, config in self.essential_criteria.items():
            criterion_found = False
            
            for pattern in config['patterns']:
                if re.search(pattern, text, re.IGNORECASE):
                    criterion_found = True
                    break
            
            if criterion_found:
                total_score += config['weight']
        
        # Bonus pour longueur du texte (plus de détails = mieux)
        length_bonus = min(0.15, len(text.split()) / 1000)  # Bonus jusqu'à 15% pour 1000 mots
        
        # Bonus pour structure (présence de listes, sections)
        structure_bonus = self._calculate_structure_bonus(text)
        
        final_score = min(1.0, total_score + length_bonus + structure_bonus)
        return round(final_score * 100, 1)  # Score sur 100

    def _calculate_richness_score(self, text: str) -> float:
        """Calcul du score de richesse (détails, exemples, contexte)"""
        richness_score = 0.0
        
        for indicator_type, keywords in self.richness_indicators.items():
            found_keywords = sum(1 for kw in keywords if kw in text)
            if found_keywords > 0:
                richness_score += 0.25  # 25% par type d'indicateur
        
        # Bonus pour diversité du vocabulaire
        words = text.split()
        if len(words) > 10:
            unique_ratio = len(set(words)) / len(words)
            richness_score += unique_ratio * 0.3
        
        # Bonus pour présence de questions (engagement)
        question_count = text.count('?')
        if question_count > 0:
            richness_score += min(0.1, question_count * 0.02)
        
        return round(min(100.0, richness_score * 100), 1)

    def _calculate_structure_bonus(self, text: str) -> float:
        """Bonus pour structure du texte"""
        bonus = 0.0
        
        # Présence de listes (-, *, 1., etc.)
        if re.search(r'[-*•]\s+', text) or re.search(r'\d+\.\s+', text):
            bonus += 0.05
        
        # Présence de sections (titres, sous-titres)
        if re.search(r'\n[A-Z][^.]*:\s*\n', text):
            bonus += 0.05
        
        # Utilisation de formatage (majuscules pour emphase)
        if re.search(r'\b[A-Z]{2,}\b', text):
            bonus += 0.02
        
        return bonus

    def _detect_missing_info(self, text: str, title: str, description: str) -> List[Dict[str, str]]:
        """Détection des informations manquantes importantes"""
        missing = []
        
        for criterion, config in self.essential_criteria.items():
            criterion_found = any(re.search(pattern, text, re.IGNORECASE) 
                                for pattern in config['patterns'])
            
            if not criterion_found:
                missing.append({
                    'type': criterion,
                    'description': config['description'],
                    'priority': 'high' if config['weight'] >= 0.15 else 'medium',
                    'suggestion': self._get_suggestion_for_criterion(criterion)
                })
        
        # Vérifications spécifiques supplémentaires
        additional_checks = self._additional_missing_checks(text, title, description)
        missing.extend(additional_checks)
        
        return missing

    def _get_suggestion_for_criterion(self, criterion: str) -> str:
        """Suggestions spécifiques par critère manquant"""
        suggestions = {
            'budget_range': "Précisez votre budget ou une fourchette budgétaire (ex: entre 2000€ et 5000€)",
            'timeline': "Indiquez vos contraintes de délai (ex: livraison souhaitée dans 3 semaines)",
            'objectives': "Décrivez clairement les objectifs et résultats attendus du projet",
            'scope': "Détaillez le périmètre : qu'est-ce qui est inclus/exclu du projet ?",
            'target_audience': "Précisez votre public cible ou les utilisateurs finaux",
            'technical_constraints': "Mentionnez vos contraintes techniques (technologies, plateformes, etc.)",
            'contact_info': "Indiquez vos disponibilités pour échanger sur le projet"
        }
        return suggestions.get(criterion, "Ajoutez plus de détails sur cet aspect")

    def _additional_missing_checks(self, text: str, title: str, description: str) -> List[Dict[str, str]]:
        """Vérifications supplémentaires d'informations manquantes"""
        additional_missing = []
        
        # Vérification longueur description
        if len(description.split()) < 20:
            additional_missing.append({
                'type': 'description_too_short',
                'description': 'Description trop courte',
                'priority': 'high',
                'suggestion': 'Développez votre description avec plus de détails (minimum 20 mots recommandés)'
            })
        
        # Vérification présence d'exemples
        if not any(word in text for word in ['exemple', 'comme', 'tel que', 'similaire']):
            additional_missing.append({
                'type': 'no_examples',
                'description': 'Aucun exemple ou référence',
                'priority': 'medium',
                'suggestion': 'Ajoutez des exemples ou références pour clarifier vos attentes'
            })
        
        # Vérification géolocalisation si pertinent
        geo_keywords = ['site', 'bureau', 'local', 'présentiel', 'déplacement']
        if any(word in text for word in geo_keywords) and not any(word in text for word in ['ville', 'région', 'département', 'adresse']):
            additional_missing.append({
                'type': 'location_missing',
                'description': 'Localisation géographique',
                'priority': 'medium',
                'suggestion': 'Précisez la localisation si une présence physique est requise'
            })
        
        return additional_missing

    def _generate_suggestions(self, quality_score: float, richness_score: float, missing_info: List[Dict]) -> List[str]:
        """Génération de suggestions d'amélioration globales"""
        suggestions = []
        
        # Suggestions basées sur le score de qualité
        if quality_score < 50:
            suggestions.append("Votre brief manque d'informations essentielles. Consultez la liste des éléments manquants.")
        elif quality_score < 70:
            suggestions.append("Votre brief est correct mais pourrait être enrichi pour attirer plus de candidats qualifiés.")
        elif quality_score >= 80:
            suggestions.append("Excellent brief ! Vous devriez recevoir des propositions de qualité.")
        
        # Suggestions basées sur le score de richesse
        if richness_score < 40:
            suggestions.append("Ajoutez plus de détails, d'exemples ou de contexte pour enrichir votre projet.")
        
        # Suggestions basées sur les éléments manquants prioritaires
        high_priority_missing = [item for item in missing_info if item.get('priority') == 'high']
        if len(high_priority_missing) >= 3:
            suggestions.append("Plusieurs informations importantes manquent. Commencez par préciser le budget et les délais.")
        
        return suggestions
