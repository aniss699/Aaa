
import json
import re
from typing import Dict, List, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class Taxonomizer:
    """Classification automatique en catégories et extraction de compétences"""
    
    def __init__(self, taxonomy_file: str = '/infra/data/taxonomy_skills_fr.csv'):
        self.taxonomy_df = None
        self.category_vectorizer = None
        self.skills_vectorizer = None
        self.load_taxonomy(taxonomy_file)
        
    def load_taxonomy(self, file_path: str):
        """Chargement de la taxonomie depuis CSV"""
        try:
            self.taxonomy_df = pd.read_csv(file_path)
            # Structure attendue: category, sub_category, skills, keywords
            self._prepare_vectorizers()
        except FileNotFoundError:
            # Fallback avec taxonomie basique
            self._create_fallback_taxonomy()
    
    def _create_fallback_taxonomy(self):
        """Taxonomie de base si le fichier n'existe pas"""
        fallback_data = [
            {
                'category': 'web-development',
                'sub_category': 'frontend',
                'skills': ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
                'keywords': ['site web', 'application web', 'frontend', 'interface', 'UI/UX']
            },
            {
                'category': 'web-development', 
                'sub_category': 'backend',
                'skills': ['Node.js', 'Python', 'PHP', 'Java', 'API', 'Base de données'],
                'keywords': ['backend', 'serveur', 'API', 'base de données', 'architecture']
            },
            {
                'category': 'design',
                'sub_category': 'graphic-design',
                'skills': ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign'],
                'keywords': ['design graphique', 'logo', 'identité visuelle', 'charte graphique']
            },
            {
                'category': 'marketing',
                'sub_category': 'digital-marketing',
                'skills': ['SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Analytics'],
                'keywords': ['marketing digital', 'référencement', 'publicité', 'réseaux sociaux']
            }
        ]
        
        self.taxonomy_df = pd.DataFrame(fallback_data)
        self._prepare_vectorizers()
    
    def _prepare_vectorizers(self):
        """Préparation des vectoriseurs TF-IDF"""
        # Vectoriseur pour les catégories
        category_texts = []
        for _, row in self.taxonomy_df.iterrows():
            text = f"{row['category']} {row['sub_category']} {' '.join(row['keywords'])}"
            category_texts.append(text)
        
        self.category_vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words=None,  # Pas de stop words pour préserver les termes techniques
            ngram_range=(1, 2),
            max_features=1000
        )
        self.category_vectors = self.category_vectorizer.fit_transform(category_texts)
        
        # Vectoriseur pour les compétences
        skills_texts = []
        for _, row in self.taxonomy_df.iterrows():
            skills_text = ' '.join(row['skills']) if isinstance(row['skills'], list) else row['skills']
            skills_texts.append(skills_text)
        
        self.skills_vectorizer = TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            max_features=500
        )
        self.skills_vectors = self.skills_vectorizer.fit_transform(skills_texts)

    def classify_category(self, text: str, top_k: int = 3) -> List[Dict[str, any]]:
        """Classification en catégorie/sous-catégorie"""
        if not text or self.category_vectorizer is None:
            return []
        
        # Vectorisation du texte d'entrée
        text_vector = self.category_vectorizer.transform([text])
        
        # Calcul de similarité
        similarities = cosine_similarity(text_vector, self.category_vectors).flatten()
        
        # Top-K résultats
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Seuil minimum
                row = self.taxonomy_df.iloc[idx]
                results.append({
                    'category': row['category'],
                    'sub_category': row['sub_category'],
                    'confidence': float(similarities[idx]),
                    'matched_keywords': self._extract_matched_keywords(text, row['keywords'])
                })
        
        return results

    def extract_skills(self, text: str, top_k: int = 10) -> List[Dict[str, any]]:
        """Extraction des compétences mentionnées"""
        if not text or self.skills_vectorizer is None:
            return []
        
        # Vectorisation du texte
        text_vector = self.skills_vectorizer.transform([text])
        
        # Similarité avec chaque ensemble de compétences
        similarities = cosine_similarity(text_vector, self.skills_vectors).flatten()
        
        # Extraction des compétences les plus pertinentes
        extracted_skills = []
        text_lower = text.lower()
        
        for idx, similarity in enumerate(similarities):
            if similarity > 0.2:  # Seuil pour compétences
                row = self.taxonomy_df.iloc[idx]
                skills_list = row['skills'] if isinstance(row['skills'], list) else row['skills'].split(',')
                
                for skill in skills_list:
                    skill = skill.strip()
                    # Vérification si la compétence est mentionnée dans le texte
                    if skill.lower() in text_lower or any(word in text_lower for word in skill.lower().split()):
                        extracted_skills.append({
                            'skill': skill,
                            'confidence': float(similarity),
                            'category': row['category']
                        })
        
        # Déduplication et tri
        unique_skills = {}
        for skill_data in extracted_skills:
            skill_name = skill_data['skill']
            if skill_name not in unique_skills or skill_data['confidence'] > unique_skills[skill_name]['confidence']:
                unique_skills[skill_name] = skill_data
        
        return sorted(unique_skills.values(), key=lambda x: x['confidence'], reverse=True)[:top_k]

    def _extract_matched_keywords(self, text: str, keywords: List[str]) -> List[str]:
        """Extraction des mots-clés qui matchent dans le texte"""
        text_lower = text.lower()
        matched = []
        
        if isinstance(keywords, str):
            keywords = keywords.split(',')
        
        for keyword in keywords:
            keyword = keyword.strip().lower()
            if keyword in text_lower:
                matched.append(keyword)
        
        return matched

    def taxonomize_complete(self, text: str) -> Dict[str, any]:
        """Taxonomisation complète"""
        categories = self.classify_category(text)
        skills = self.extract_skills(text)
        
        # Catégorie principale
        main_category = categories[0] if categories else {
            'category': 'other',
            'sub_category': 'general',
            'confidence': 0.1
        }
        
        return {
            'category_std': main_category['category'],
            'sub_category_std': main_category['sub_category'],
            'category_confidence': main_category['confidence'],
            'alternative_categories': categories[1:3],
            'skills_std': [s['skill'] for s in skills],
            'skills_detail': skills,
            'tags_std': self._generate_tags(text, categories, skills)
        }
    
    def _generate_tags(self, text: str, categories: List[Dict], skills: List[Dict]) -> List[str]:
        """Génération automatique de tags"""
        tags = set()
        
        # Tags depuis catégories
        for cat in categories[:2]:
            tags.add(cat['category'])
            tags.add(cat['sub_category'])
        
        # Tags depuis compétences principales
        for skill in skills[:5]:
            tags.add(skill['skill'].lower().replace(' ', '-'))
        
        # Tags depuis mots-clés détectés
        text_lower = text.lower()
        keyword_tags = {
            'urgence': ['urgent', 'rapidement', 'asap'],
            'remote': ['télétravail', 'distance', 'remote'],
            'qualité': ['qualité', 'premium', 'excellence'],
            'budget-serré': ['budget', 'économique', 'pas cher']
        }
        
        for tag, keywords in keyword_tags.items():
            if any(kw in text_lower for kw in keywords):
                tags.add(tag)
        
        return list(tags)[:15]  # Limite à 15 tags
