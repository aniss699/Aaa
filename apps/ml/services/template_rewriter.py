
"""
Template Rewriter - Réécriture structurée des annonces par catégorie
"""

import re
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

@dataclass 
class RewriteResult:
    title_std: str
    summary_std: str
    acceptance_criteria: List[str]
    tasks_std: List[Dict]
    deliverables_std: List[Dict]
    rewrite_version: str

class TemplateRewriter:
    def __init__(self):
        self.rewrite_version = "v2.0"
        
        # Templates par catégorie
        self.category_templates = {
            'web_development': {
                'title_pattern': 'Développement {type} - {scope}',
                'summary_structure': [
                    'Contexte et objectifs du projet',
                    'Technologies et architecture technique',
                    'Fonctionnalités principales requises',
                    'Critères de qualité et performance',
                    'Modalités de collaboration'
                ],
                'acceptance_criteria_base': [
                    'Code source livré et documenté selon standards',
                    'Tests unitaires et d\'intégration réalisés',
                    'Application déployable et fonctionnelle',
                    'Formation et transfert de compétences',
                    'Support technique pendant 30 jours'
                ],
                'tasks_template': [
                    {'name': 'Analyse et conception', 'estimated_hours': 8},
                    {'name': 'Développement frontend', 'estimated_hours': 24},
                    {'name': 'Développement backend', 'estimated_hours': 16},
                    {'name': 'Tests et débogage', 'estimated_hours': 8},
                    {'name': 'Déploiement et formation', 'estimated_hours': 4}
                ],
                'deliverables_template': [
                    {'name': 'Code source complet', 'format': 'Repository Git'},
                    {'name': 'Documentation technique', 'format': 'Markdown/PDF'},
                    {'name': 'Guide utilisateur', 'format': 'PDF'},
                    {'name': 'Application déployée', 'format': 'URL de production'}
                ]
            },
            
            'mobile_development': {
                'title_pattern': 'Application Mobile {platform} - {purpose}',
                'summary_structure': [
                    'Vision et objectifs de l\'application mobile',
                    'Plateformes cibles et technologies',
                    'Fonctionnalités et expérience utilisateur',
                    'Performance et optimisation requises',
                    'Publication et distribution'
                ],
                'acceptance_criteria_base': [
                    'Application native/cross-platform fonctionnelle',
                    'Design responsive adapté à tous écrans',
                    'Performance optimale (< 3s de chargement)',
                    'Publication sur stores réussie',
                    'Tests sur appareils multiples validés'
                ],
                'tasks_template': [
                    {'name': 'Conception UX/UI', 'estimated_hours': 12},
                    {'name': 'Développement natif/hybride', 'estimated_hours': 32},
                    {'name': 'Intégrations API', 'estimated_hours': 8},
                    {'name': 'Tests et optimisations', 'estimated_hours': 8},
                    {'name': 'Publication stores', 'estimated_hours': 4}
                ],
                'deliverables_template': [
                    {'name': 'Application mobile', 'format': 'APK/IPA'},
                    {'name': 'Code source', 'format': 'Repository'},
                    {'name': 'Designs et assets', 'format': 'Figma/ZIP'},
                    {'name': 'Guide de publication', 'format': 'PDF'}
                ]
            },

            'design_graphique': {
                'title_pattern': 'Création Graphique {type} - {style}',
                'summary_structure': [
                    'Brief créatif et positionnement visuel',
                    'Identité de marque et style recherché',
                    'Applications et déclinaisons requises',
                    'Formats et spécifications techniques',
                    'Processus de validation et révisions'
                ],
                'acceptance_criteria_base': [
                    'Créations conformes au brief validé',
                    'Fichiers sources haute résolution fournis',
                    'Déclinaisons formats demandés',
                    'Charte d\'utilisation incluse',
                    'Jusqu\'à 3 révisions comprises'
                ],
                'tasks_template': [
                    {'name': 'Recherche et concepts', 'estimated_hours': 6},
                    {'name': 'Création designs principaux', 'estimated_hours': 12},
                    {'name': 'Déclinaisons et formats', 'estimated_hours': 8},
                    {'name': 'Révisions et finalisation', 'estimated_hours': 4}
                ],
                'deliverables_template': [
                    {'name': 'Créations finales', 'format': 'AI/PSD/PDF'},
                    {'name': 'Fichiers d\'export', 'format': 'PNG/JPG/SVG'},
                    {'name': 'Charte graphique', 'format': 'PDF'},
                    {'name': 'Mockups de présentation', 'format': 'JPG/PDF'}
                ]
            },

            'construction': {
                'title_pattern': 'Travaux {type} - {scope}',
                'summary_structure': [
                    'Nature et étendue des travaux',
                    'Contraintes techniques et réglementaires',
                    'Matériaux et finitions souhaités',
                    'Planning et phasage des interventions',
                    'Garanties et certifications requises'
                ],
                'acceptance_criteria_base': [
                    'Travaux conformes aux normes DTU',
                    'Matériaux de qualité certifiée utilisés',
                    'Chantier propre et sécurisé',
                    'Garantie décennale et parfait achèvement',
                    'Réception travaux avec PV signé'
                ],
                'tasks_template': [
                    {'name': 'Étude et devis détaillé', 'estimated_hours': 4},
                    {'name': 'Préparation et approvisionnement', 'estimated_hours': 8},
                    {'name': 'Réalisation travaux', 'estimated_hours': 40},
                    {'name': 'Finitions et nettoyage', 'estimated_hours': 8}
                ],
                'deliverables_template': [
                    {'name': 'Travaux réalisés', 'format': 'Ouvrage fini'},
                    {'name': 'Certificats conformité', 'format': 'Documents'},
                    {'name': 'Garanties', 'format': 'Attestations'},
                    {'name': 'Notice d\'entretien', 'format': 'PDF'}
                ]
            },

            'services_personne': {
                'title_pattern': 'Service {type} - {frequency}',
                'summary_structure': [
                    'Nature du service à domicile',
                    'Fréquence et horaires d\'intervention',
                    'Spécificités et contraintes du lieu',
                    'Qualifications et équipements requis',
                    'Modalités de suivi et facturation'
                ],
                'acceptance_criteria_base': [
                    'Service réalisé selon planning convenu',
                    'Qualité et soin apportés constants',
                    'Respect des consignes spécifiques',
                    'Ponctualité et discrétion assurées',
                    'Facturation transparente et détaillée'
                ],
                'tasks_template': [
                    {'name': 'Prise de contact et brief', 'estimated_hours': 1},
                    {'name': 'Prestation principale', 'estimated_hours': 3},
                    {'name': 'Suivi et adaptation', 'estimated_hours': 0.5}
                ],
                'deliverables_template': [
                    {'name': 'Service réalisé', 'format': 'Prestation'},
                    {'name': 'Compte-rendu', 'format': 'Note écrite'},
                    {'name': 'Planning suivi', 'format': 'Calendrier'}
                ]
            }
        }

    def rewrite_project(self, title: str, description: str, category: str) -> RewriteResult:
        """Réécrit complètement un projet selon les templates de catégorie"""
        
        # Sélection du template approprié
        template = self._select_template(category, description)
        
        # Réécriture du titre
        title_std = self._rewrite_title(title, description, template)
        
        # Réécriture du résumé structuré
        summary_std = self._rewrite_summary(description, template)
        
        # Génération des critères d'acceptation
        acceptance_criteria = self._generate_acceptance_criteria(description, template)
        
        # Génération des tâches standardisées
        tasks_std = self._generate_tasks(description, template)
        
        # Génération des livrables
        deliverables_std = self._generate_deliverables(description, template)
        
        return RewriteResult(
            title_std=title_std,
            summary_std=summary_std,
            acceptance_criteria=acceptance_criteria,
            tasks_std=tasks_std,
            deliverables_std=deliverables_std,
            rewrite_version=self.rewrite_version
        )

    def _select_template(self, category: str, description: str) -> Dict:
        """Sélectionne le template le plus approprié"""
        # Mapping des catégories
        category_mapping = {
            'developpement': 'web_development',
            'web-development': 'web_development', 
            'mobile': 'mobile_development',
            'design': 'design_graphique',
            'construction': 'construction',
            'travaux': 'construction',
            'plomberie': 'construction',
            'electricite': 'construction',
            'menage': 'services_personne',
            'garde_enfants': 'services_personne',
            'jardinage': 'services_personne'
        }
        
        template_key = category_mapping.get(category, 'web_development')
        return self.category_templates[template_key]

    def _rewrite_title(self, title: str, description: str, template: Dict) -> str:
        """Réécrit le titre selon le pattern du template"""
        pattern = template['title_pattern']
        
        # Extraction intelligente des variables
        if 'web' in description.lower() or 'site' in description.lower():
            type_val = 'Web'
            scope = self._extract_scope(description)
        elif 'mobile' in description.lower() or 'app' in description.lower():
            type_val = 'Mobile'
            scope = self._extract_scope(description)
        elif 'logo' in description.lower() or 'identité' in description.lower():
            type_val = 'Identité Visuelle'
            scope = self._extract_scope(description)
        else:
            type_val = 'Professionnel'
            scope = self._extract_scope(description)

        # Remplacement des variables dans le pattern
        title_std = pattern.replace('{type}', type_val).replace('{scope}', scope)
        title_std = title_std.replace('{platform}', 'Cross-Platform')
        title_std = title_std.replace('{purpose}', scope)
        title_std = title_std.replace('{style}', 'Moderne')
        title_std = title_std.replace('{frequency}', 'Régulier')
        
        return title_std[:100]  # Limitation longueur

    def _extract_scope(self, description: str) -> str:
        """Extrait le scope/portée du projet"""
        desc_lower = description.lower()
        
        if 'e-commerce' in desc_lower or 'boutique' in desc_lower:
            return 'E-commerce'
        elif 'blog' in desc_lower or 'actualité' in desc_lower:
            return 'Blog/Actualités'
        elif 'portfolio' in desc_lower or 'présentation' in desc_lower:
            return 'Portfolio'
        elif 'gestion' in desc_lower or 'admin' in desc_lower:
            return 'Gestion/Admin'
        elif 'rénovation' in desc_lower:
            return 'Rénovation'
        elif 'construction' in desc_lower:
            return 'Construction Neuve'
        else:
            return 'Sur Mesure'

    def _rewrite_summary(self, description: str, template: Dict) -> str:
        """Réécrit le résumé selon la structure du template"""
        structure = template['summary_structure']
        
        # Analyse du contenu original
        content_analysis = self._analyze_content(description)
        
        summary_parts = []
        for section in structure:
            if 'contexte' in section.lower():
                summary_parts.append(f"**{section} :** {content_analysis['context']}")
            elif 'technolog' in section.lower():
                summary_parts.append(f"**{section} :** {content_analysis['technical']}")
            elif 'fonctionnalit' in section.lower():
                summary_parts.append(f"**{section} :** {content_analysis['features']}")
            elif 'qualité' in section.lower():
                summary_parts.append(f"**{section} :** {content_analysis['quality']}")
            elif 'collaboration' in section.lower():
                summary_parts.append(f"**{section} :** {content_analysis['collaboration']}")
            else:
                summary_parts.append(f"**{section} :** À définir selon les besoins spécifiques.")

        return '\n\n'.join(summary_parts)

    def _analyze_content(self, description: str) -> Dict[str, str]:
        """Analyse le contenu pour extraire les éléments clés"""
        desc_lower = description.lower()
        
        # Extraction du contexte
        if 'entreprise' in desc_lower or 'société' in desc_lower:
            context = "Projet d'entreprise nécessitant une approche professionnelle."
        elif 'personnel' in desc_lower or 'particulier' in desc_lower:
            context = "Projet personnel avec besoins spécifiques."
        else:
            context = "Projet nécessitant une expertise technique adaptée."

        # Extraction technique
        tech_keywords = ['react', 'vue', 'angular', 'php', 'python', 'mobile', 'ios', 'android']
        found_tech = [tech for tech in tech_keywords if tech in desc_lower]
        if found_tech:
            technical = f"Technologies souhaitées : {', '.join(found_tech)}. Architecture moderne et maintenable."
        else:
            technical = "Technologies modernes et éprouvées selon les meilleures pratiques."

        # Extraction fonctionnalités
        if 'boutique' in desc_lower or 'vente' in desc_lower:
            features = "Fonctionnalités e-commerce complètes avec gestion des commandes."
        elif 'blog' in desc_lower or 'contenu' in desc_lower:
            features = "Système de gestion de contenu intuitif et flexible."
        else:
            features = "Fonctionnalités personnalisées selon cahier des charges."

        # Qualité
        quality = "Respect des standards de qualité, tests approfondis et documentation complète."
        
        # Collaboration
        collaboration = "Communication régulière, méthodologie agile et livraisons itératives."

        return {
            'context': context,
            'technical': technical, 
            'features': features,
            'quality': quality,
            'collaboration': collaboration
        }

    def _generate_acceptance_criteria(self, description: str, template: Dict) -> List[str]:
        """Génère les critères d'acceptation SMART"""
        base_criteria = template['acceptance_criteria_base'].copy()
        
        # Critères spécifiques selon le contenu
        desc_lower = description.lower()
        
        if 'mobile' in desc_lower:
            base_criteria.append("Compatibilité iOS 13+ et Android 8+ validée")
        
        if 'e-commerce' in desc_lower:
            base_criteria.append("Tunnel de commande fonctionnel et sécurisé")
            
        if 'seo' in desc_lower:
            base_criteria.append("Optimisation SEO on-page réalisée")

        if 'urgent' in desc_lower or 'rapide' in desc_lower:
            base_criteria.append("Délais de livraison accélérés respectés")

        return base_criteria[:6]  # Limite à 6 critères max

    def _generate_tasks(self, description: str, template: Dict) -> List[Dict]:
        """Génère les tâches standardisées avec estimations"""
        tasks = template['tasks_template'].copy()
        
        # Ajustement des estimations selon la complexité
        complexity_factor = self._estimate_complexity_factor(description)
        
        for task in tasks:
            task['estimated_hours'] = int(task['estimated_hours'] * complexity_factor)
            task['priority'] = self._determine_priority(task['name'])
            
        return tasks

    def _generate_deliverables(self, description: str, template: Dict) -> List[Dict]:
        """Génère les livrables standardisés"""
        deliverables = template['deliverables_template'].copy()
        
        # Ajout de livrables spécifiques selon le contenu
        desc_lower = description.lower()
        
        if 'formation' in desc_lower:
            deliverables.append({
                'name': 'Session de formation',
                'format': 'Présentiel/Visio'
            })
            
        if 'maintenance' in desc_lower:
            deliverables.append({
                'name': 'Plan de maintenance',
                'format': 'Document PDF'
            })

        return deliverables

    def _estimate_complexity_factor(self, description: str) -> float:
        """Estime le facteur de complexité du projet"""
        desc_lower = description.lower()
        factor = 1.0
        
        # Facteurs d'augmentation
        if 'complexe' in desc_lower: factor += 0.3
        if 'intégration' in desc_lower: factor += 0.2
        if 'api' in desc_lower: factor += 0.15
        if 'personnalisé' in desc_lower: factor += 0.25
        if 'urgent' in desc_lower: factor += 0.1
        
        # Facteurs de diminution
        if 'simple' in desc_lower: factor -= 0.2
        if 'basique' in desc_lower: factor -= 0.15
        
        return max(0.5, min(2.0, factor))

    def _determine_priority(self, task_name: str) -> str:
        """Détermine la priorité d'une tâche"""
        task_lower = task_name.lower()
        
        if 'conception' in task_lower or 'analyse' in task_lower:
            return 'high'
        elif 'développement' in task_lower or 'création' in task_lower:
            return 'high'
        elif 'test' in task_lower or 'déploiement' in task_lower:
            return 'medium'
        else:
            return 'low'

# Instance principale
template_rewriter = TemplateRewriter()
