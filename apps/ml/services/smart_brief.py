
"""
Smart Brief - Structuration IA automatique des besoins clients
"""

import re
import spacy
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

@dataclass
class BriefAnalysis:
    structure_score: int  # 0-100
    completeness_score: int  # 0-100
    clarity_score: int  # 0-100
    technical_keywords: List[str]
    missing_elements: List[str]
    suggestions: List[str]
    structured_brief: Dict[str, any]
    complexity_level: str

class SmartBriefProcessor:
    def __init__(self):
        # Chargement du modèle français (fallback simple si spacy indisponible)
        self.nlp = None
        try:
            self.nlp = spacy.load("fr_core_news_sm")
        except:
            print("SpaCy FR model not available, using basic processing")
        
        # Mots-clés techniques par domaine
        self.tech_keywords = {
            'web_dev': ['react', 'vue', 'angular', 'node', 'php', 'laravel', 'symfony', 'api', 'rest', 'graphql'],
            'mobile': ['react native', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'xamarin'],
            'design': ['figma', 'photoshop', 'illustrator', 'ux', 'ui', 'wireframe', 'mockup', 'branding'],
            'marketing': ['seo', 'google ads', 'facebook ads', 'content', 'copywriting', 'social media'],
            'data': ['python', 'r', 'tableau', 'power bi', 'sql', 'machine learning', 'ai', 'analytics']
        }
        
        # Éléments essentiels d'un brief
        self.essential_elements = [
            'objectif', 'fonctionnalités', 'cible', 'contraintes', 
            'délai', 'budget', 'livrables', 'critères'
        ]

    def analyze_brief(self, brief_text: str) -> BriefAnalysis:
        """Analyse complète d'un brief client"""
        
        # Nettoyage du texte
        cleaned_text = self._clean_text(brief_text)
        
        # Analyse de structure
        structure_score = self._analyze_structure(cleaned_text)
        
        # Analyse de complétude
        completeness_score, missing_elements = self._analyze_completeness(cleaned_text)
        
        # Analyse de clarté
        clarity_score = self._analyze_clarity(cleaned_text)
        
        # Extraction mots-clés techniques
        technical_keywords = self._extract_technical_keywords(cleaned_text)
        
        # Génération de suggestions
        suggestions = self._generate_suggestions(
            structure_score, completeness_score, clarity_score, missing_elements
        )
        
        # Structuration automatique
        structured_brief = self._structure_brief(cleaned_text, technical_keywords)
        
        # Estimation complexité
        complexity_level = self._estimate_complexity(technical_keywords, structured_brief)
        
        return BriefAnalysis(
            structure_score=structure_score,
            completeness_score=completeness_score,
            clarity_score=clarity_score,
            technical_keywords=technical_keywords,
            missing_elements=missing_elements,
            suggestions=suggestions,
            structured_brief=structured_brief,
            complexity_level=complexity_level
        )

    def _clean_text(self, text: str) -> str:
        """Nettoie et normalise le texte"""
        # Suppression caractères spéciaux, normalisation espaces
        text = re.sub(r'[^\w\s\-\.\,\:]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.lower().strip()

    def _analyze_structure(self, text: str) -> int:
        """Analyse la structure du brief (paragraphes, sections, listes)"""
        score = 50  # Score de base
        
        # Présence de sections/paragraphes
        paragraphs = len([p for p in text.split('\n') if p.strip()])
        if paragraphs > 1:
            score += 20
        
        # Présence de listes/énumérations
        if '•' in text or '-' in text or re.search(r'\d+\.', text):
            score += 15
        
        # Longueur appropriée
        word_count = len(text.split())
        if 50 <= word_count <= 300:
            score += 15
        elif word_count > 300:
            score += 10
        
        return min(100, score)

    def _analyze_completeness(self, text: str) -> Tuple[int, List[str]]:
        """Analyse la complétude du brief"""
        present_elements = []
        missing_elements = []
        
        # Détection des éléments présents
        element_patterns = {
            'objectif': ['objectif', 'but', 'goal', 'vise', 'souhaite'],
            'fonctionnalités': ['fonctionnalit', 'feature', 'fonction', 'option'],
            'cible': ['cible', 'utilisateur', 'client', 'audience'],
            'contraintes': ['contrainte', 'limite', 'restriction', 'condition'],
            'délai': ['délai', 'deadline', 'livraison', 'date', 'urgent'],
            'budget': ['budget', 'prix', 'coût', 'tarif', 'euro', '€'],
            'livrables': ['livrable', 'rendu', 'deliverable', 'attendu'],
            'critères': ['critère', 'exigence', 'requirement', 'attente']
        }
        
        for element, patterns in element_patterns.items():
            if any(pattern in text for pattern in patterns):
                present_elements.append(element)
            else:
                missing_elements.append(element)
        
        completeness_score = (len(present_elements) / len(self.essential_elements)) * 100
        
        return int(completeness_score), missing_elements

    def _analyze_clarity(self, text: str) -> int:
        """Analyse la clarté du brief"""
        score = 50
        
        # Longueur des phrases
        sentences = text.split('.')
        avg_sentence_length = np.mean([len(s.split()) for s in sentences if s.strip()])
        
        if 10 <= avg_sentence_length <= 20:
            score += 20
        elif avg_sentence_length > 30:
            score -= 10
        
        # Mots techniques vs mots vagues
        vague_words = ['chose', 'truc', 'machin', 'quelque chose', 'bien', 'beau']
        vague_count = sum(text.count(word) for word in vague_words)
        
        if vague_count == 0:
            score += 20
        elif vague_count <= 2:
            score += 10
        else:
            score -= 15
        
        # Présence de chiffres/mesures (précision)
        if re.search(r'\d+', text):
            score += 10
        
        return min(100, max(0, score))

    def _extract_technical_keywords(self, text: str) -> List[str]:
        """Extrait les mots-clés techniques du brief"""
        found_keywords = []
        
        for domain, keywords in self.tech_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    found_keywords.append(keyword)
        
        return list(set(found_keywords))

    def _structure_brief(self, text: str, keywords: List[str]) -> Dict[str, any]:
        """Structure automatiquement le brief en sections"""
        
        # Extraction basique des sections
        structured = {
            'titre_suggere': self._suggest_title(text, keywords),
            'contexte': self._extract_context(text),
            'objectifs': self._extract_objectives(text),
            'fonctionnalites': self._extract_features(text),
            'contraintes_techniques': keywords,
            'budget_estime': self._extract_budget(text),
            'delai_estime': self._extract_deadline(text),
            'livrables': self._extract_deliverables(text)
        }
        
        return structured

    def _suggest_title(self, text: str, keywords: List[str]) -> str:
        """Suggère un titre pour le projet"""
        # Logique simple de génération de titre
        first_sentence = text.split('.')[0]
        
        if keywords:
            main_tech = keywords[0]
            return f"Développement {main_tech.title()} - {first_sentence[:30]}..."
        
        return f"Projet - {first_sentence[:40]}..."

    def _extract_context(self, text: str) -> str:
        """Extrait le contexte du projet"""
        # Recherche de patterns contextuels
        context_indicators = ['contexte', 'entreprise', 'société', 'projet', 'besoin']
        sentences = text.split('.')
        
        context_sentences = []
        for sentence in sentences:
            if any(indicator in sentence for indicator in context_indicators):
                context_sentences.append(sentence.strip())
        
        return '. '.join(context_sentences[:2]) if context_sentences else text[:100] + "..."

    def _extract_objectives(self, text: str) -> List[str]:
        """Extrait les objectifs du projet"""
        objective_patterns = ['objectif', 'but', 'vise', 'souhaite', 'permet']
        
        objectives = []
        sentences = text.split('.')
        
        for sentence in sentences:
            if any(pattern in sentence for pattern in objective_patterns):
                objectives.append(sentence.strip())
        
        return objectives[:3]  # Max 3 objectifs

    def _extract_features(self, text: str) -> List[str]:
        """Extrait les fonctionnalités demandées"""
        # Recherche de listes et énumérations
        features = []
        
        # Listes à puces
        bullet_points = re.findall(r'[•\-\*]\s*([^•\-\*\n]+)', text)
        features.extend([f.strip() for f in bullet_points])
        
        # Listes numérotées
        numbered_items = re.findall(r'\d+[\.\)]\s*([^\d\n]+)', text)
        features.extend([f.strip() for f in numbered_items])
        
        return features[:5]  # Max 5 fonctionnalités

    def _extract_budget(self, text: str) -> Optional[str]:
        """Extrait le budget mentionné"""
        budget_pattern = r'(\d+(?:\s*\d+)*)\s*(?:euros?|€|EUR)'
        match = re.search(budget_pattern, text, re.IGNORECASE)
        
        if match:
            return f"{match.group(1)}€"
        
        return None

    def _extract_deadline(self, text: str) -> Optional[str]:
        """Extrait la deadline mentionnée"""
        deadline_patterns = [
            r'(\d+)\s*(?:jours?|days?)',
            r'(\d+)\s*(?:semaines?|weeks?)',
            r'(\d+)\s*(?:mois|months?)'
        ]
        
        for pattern in deadline_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(0)
        
        return None

    def _extract_deliverables(self, text: str) -> List[str]:
        """Extrait les livrables attendus"""
        deliverable_keywords = ['livrable', 'rendu', 'fichier', 'document', 'code', 'design']
        
        deliverables = []
        sentences = text.split('.')
        
        for sentence in sentences:
            if any(keyword in sentence for keyword in deliverable_keywords):
                deliverables.append(sentence.strip())
        
        return deliverables[:3]

    def _estimate_complexity(self, keywords: List[str], structured: Dict) -> str:
        """Estime la complexité du projet"""
        complexity_score = 0
        
        # Complexité basée sur les mots-clés techniques
        complexity_score += len(keywords) * 10
        
        # Complexité basée sur les fonctionnalités
        complexity_score += len(structured.get('fonctionnalites', [])) * 15
        
        # Complexité basée sur les objectifs
        complexity_score += len(structured.get('objectifs', [])) * 10
        
        if complexity_score <= 30:
            return 'low'
        elif complexity_score <= 70:
            return 'medium'
        else:
            return 'high'

    def _generate_suggestions(self, structure: int, completeness: int, clarity: int, missing: List[str]) -> List[str]:
        """Génère des suggestions d'amélioration"""
        suggestions = []
        
        if structure < 70:
            suggestions.append("Structurez votre brief en sections claires (contexte, objectifs, fonctionnalités)")
        
        if completeness < 70:
            if 'budget' in missing:
                suggestions.append("Précisez votre budget pour recevoir des offres adaptées")
            if 'délai' in missing:
                suggestions.append("Indiquez vos contraintes de délai")
            if 'fonctionnalités' in missing:
                suggestions.append("Détaillez les fonctionnalités attendues")
        
        if clarity < 70:
            suggestions.append("Utilisez des termes précis et évitez les formulations vagues")
        
        return suggestions

# Service principal
smart_brief_processor = SmartBriefProcessor()
