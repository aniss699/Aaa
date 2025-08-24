
import re
import unicodedata
from typing import Dict, List, Tuple, Optional

class TextNormalizer:
    """Normalisation et extraction d'informations structurées depuis du texte français"""
    
    def __init__(self):
        # Patterns pour unités et quantités
        self.unit_patterns = {
            'surface': r'(\d+(?:[\.,]\d+)?)\s*(?:m²|m2|mètres?\s*carrés?|métres?\s*carrés?)',
            'hours': r'(\d+(?:[\.,]\d+)?)\s*(?:h|heures?|hrs?)',
            'pages': r'(\d+(?:[\.,]\d+)?)\s*(?:pages?|p\.)',
            'distance': r'(\d+(?:[\.,]\d+)?)\s*(?:km|kilomètres?|mètres?|m\b)',
            'duration_days': r'(\d+)\s*(?:jours?|j\b)',
            'duration_weeks': r'(\d+)\s*(?:semaines?|sem\.)',
            'duration_months': r'(\d+)\s*(?:mois\b)',
        }
        
        # Patterns pour contraintes géographiques
        self.geo_patterns = {
            'onsite': r'(?:sur\s*site|présentiel|en\s*personne|dans?\s*(?:nos|mes)\s*locaux)',
            'remote': r'(?:télétravail|remote|à\s*distance|depuis\s*chez)',
            'hybrid': r'(?:hybride|mixte|partiellement?\s*(?:sur\s*site|remote))',
        }
        
        # Patterns pour prix
        self.price_patterns = {
            'hourly': r'(\d+(?:[\.,]\d+)?)\s*€?\s*(?:/h|par\s*heure|€/h|euros?\s*par\s*heure)',
            'daily': r'(\d+(?:[\.,]\d+)?)\s*€?\s*(?:/jour|par\s*jour|€/j|euros?\s*par\s*jour)',
            'fixed': r'(?:forfait|prix\s*fixe|montant\s*global).*?(\d+(?:[\.,]\d+)?)\s*€?',
            'starting': r'(?:à\s*partir\s*de|dès|minimum).*?(\d+(?:[\.,]\d+)?)\s*€?',
        }

    def normalize_text(self, text: str) -> str:
        """Normalisation basique du texte"""
        if not text:
            return ""
        
        # Normalisation Unicode
        text = unicodedata.normalize('NFKD', text)
        
        # Suppression caractères de contrôle
        text = re.sub(r'[\x00-\x1f\x7f-\x9f]', ' ', text)
        
        # Normalisation espaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    def extract_quantities(self, text: str) -> Dict[str, List[float]]:
        """Extraction des quantités et unités"""
        quantities = {}
        text_lower = text.lower()
        
        for unit_type, pattern in self.unit_patterns.items():
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                # Conversion des virgules en points pour les nombres
                values = [float(m.replace(',', '.')) for m in matches]
                quantities[unit_type] = values
        
        return quantities

    def extract_geo_constraints(self, text: str) -> Dict[str, bool]:
        """Extraction des contraintes géographiques"""
        constraints = {
            'onsite_required': False,
            'remote_ok': False,
            'hybrid_ok': False
        }
        
        text_lower = text.lower()
        
        if re.search(self.geo_patterns['onsite'], text_lower):
            constraints['onsite_required'] = True
        if re.search(self.geo_patterns['remote'], text_lower):
            constraints['remote_ok'] = True
        if re.search(self.geo_patterns['hybrid'], text_lower):
            constraints['hybrid_ok'] = True
        
        return constraints

    def extract_price_signals(self, text: str) -> Dict[str, List[float]]:
        """Extraction des signaux de prix"""
        prices = {}
        text_lower = text.lower()
        
        for price_type, pattern in self.price_patterns.items():
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                values = [float(m.replace(',', '.')) for m in matches if m]
                if values:
                    prices[price_type] = values
        
        return prices

    def extract_urgency_signals(self, text: str) -> Dict[str, any]:
        """Extraction des signaux d'urgence"""
        text_lower = text.lower()
        
        urgency_keywords = {
            'high': ['urgent', 'rapidement', 'asap', 'priorité', 'immédiat'],
            'medium': ['sous peu', 'prochainement', 'bientôt'],
            'low': ['pas urgent', 'quand vous pouvez', 'flexible']
        }
        
        urgency_level = 'medium'  # default
        urgency_score = 0.5
        
        for level, keywords in urgency_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    urgency_level = level
                    if level == 'high':
                        urgency_score = 0.9
                    elif level == 'low':
                        urgency_score = 0.1
                    break
        
        return {
            'level': urgency_level,
            'score': urgency_score,
            'detected_keywords': [kw for level_kws in urgency_keywords.values() 
                                 for kw in level_kws if kw in text_lower]
        }

    def extract_quality_requirements(self, text: str) -> Dict[str, any]:
        """Extraction des exigences de qualité"""
        text_lower = text.lower()
        
        quality_keywords = {
            'high': ['excellence', 'parfait', 'irréprochable', 'top qualité', 'premium'],
            'medium': ['bonne qualité', 'professionnel', 'soigné'],
            'low': ['basique', 'simple', 'budget serré']
        }
        
        quality_level = 'medium'  # default
        
        for level, keywords in quality_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    quality_level = level
                    break
        
        return {
            'level': quality_level,
            'detected_keywords': [kw for level_kws in quality_keywords.values() 
                                 for kw in level_kws if kw in text_lower]
        }

    def normalize_complete(self, text: str) -> Dict[str, any]:
        """Normalisation complète avec extraction de toutes les informations"""
        normalized_text = self.normalize_text(text)
        
        return {
            'normalized_text': normalized_text,
            'quantities': self.extract_quantities(text),
            'geo_constraints': self.extract_geo_constraints(text),
            'price_signals': self.extract_price_signals(text),
            'urgency': self.extract_urgency_signals(text),
            'quality_requirements': self.extract_quality_requirements(text)
        }
