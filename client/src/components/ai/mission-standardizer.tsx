import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { FileText, Zap, CheckCircle, AlertCircle, Copy, Edit3 } from 'lucide-react';

interface CategoryInsights {
  averageBudget: number;
  typicalDuration: number;
  difficultyLevel: number;
  popularityScore: number;
  availableProviders: number;
  competitionLevel: 'low' | 'medium' | 'high';
  priceRange: { min: number; max: number };
  commonSkills: string[];
  seasonalDemand: number;
  urgencyMultiplier: number;
}

interface StandardizationResult {
  score: number;
  standardizedText: string;
  improvements: string[];
  issues: string[];
  suggestions: string[];
  structure: {
    title: string;
    context: string;
    deliverables: string[];
    skills: string[];
    budget: string;
    timeline: string;
    criteria: string[];
  };
  brief_quality_score: number;
  richness_score: number;
  missing_info: string[];
  price_suggested_min: number | null;
  price_suggested_med: number | null;
  price_suggested_max: number | null;
  delay_suggested_days: number;
  market_insights: {
    category_popularity: number;
    competition_level: 'low' | 'medium' | 'high';
    estimated_providers_interested: number;
    seasonal_demand_factor: number;
    typical_price_range: { min: number; max: number };
    recommended_skills: string[];
    urgency_impact: string;
    best_posting_advice: string;
  };
  loc_uplift_reco: {
    current_loc: number;
    recommended_budget: number | null;
    recommended_delay: number;
    expected_loc_improvement: number;
    provider_attraction_score: number;
    competitive_advantage: 'Élevé' | 'Moyen' | 'Faible';
  };
  detailed_analysis: {
    complexity_breakdown: {
      technical: number;
      time_required: number; // en semaines
      skill_level_needed: 'Expert' | 'Confirmé' | 'Débutant acceptable';
    };
    market_positioning: {
      budget_vs_market: 'Au-dessus du marché' | 'En-dessous du marché' | 'Dans la moyenne';
      timeline_vs_market: 'Délai généreux' | 'Délai serré' | 'Délai standard';
      expected_applications: 'Nombreuses candidatures' | 'Candidatures modérées' | 'Peu de candidatures';
    };
  };
}

interface MissionStandardizerProps {
  onOptimizedTextGenerated?: (optimizedText: string) => void;
  showApplyButton?: boolean;
  initialText?: string;
}

export function MissionStandardizer({
  onOptimizedTextGenerated,
  showApplyButton = false,
  initialText = ''
}: MissionStandardizerProps) {
  const [originalText, setOriginalText] = useState(initialText);
  const [result, setResult] = useState<StandardizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeAndStandardize = () => {
    setIsProcessing(true);

    // Simulation de l'analyse IA
    setTimeout(() => {
      const mockResult: StandardizationResult = {
        score: 85,
        standardizedText: generateStandardizedText(originalText),
        improvements: [
          "Structure professionnelle ajoutée",
          "Livrables clarifiés et détaillés",
          "Compétences techniques spécifiées",
          "Budget et délais précisés",
          "Critères de sélection définis"
        ],
        issues: [
          "Description trop vague dans l'original",
          "Budget non mentionné",
          "Délais absents"
        ],
        suggestions: [
          "Ajouter des exemples visuels",
          "Préciser la méthodologie souhaitée",
          "Inclure les modalités de paiement"
        ],
        structure: {
          title: extractTitle(originalText),
          context: extractContext(originalText),
          deliverables: extractDeliverables(originalText),
          skills: extractSkills(originalText),
          budget: extractBudget(originalText),
          timeline: extractTimeline(originalText),
          criteria: extractCriteria(originalText)
        },
        brief_quality_score: 85,
        richness_score: 40,
        missing_info: ["Type de prestation", "Budget indicatif"],
        price_suggested_min: 1000,
        price_suggested_med: 1800,
        price_suggested_max: 2500,
        delay_suggested_days: 21,
        market_insights: {
          category_popularity: 8,
          competition_level: 'high',
          estimated_providers_interested: 150,
          seasonal_demand_factor: 1.2,
          typical_price_range: { min: 800, max: 15000 },
          recommended_skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PHP'],
          urgency_impact: 'Prix +20%, Délai -20%, Moins de candidats',
          best_posting_advice: 'Soyez très précis dans votre brief et votre budget'
        },
        loc_uplift_reco: {
          current_loc: 0.85,
          recommended_budget: 1800,
          recommended_delay: 21,
          expected_loc_improvement: 0.15,
          provider_attraction_score: 0.176,
          competitive_advantage: 'Élevé'
        },
        detailed_analysis: {
          complexity_breakdown: {
            technical: 7,
            time_required: 3.0, // en semaines
            skill_level_needed: 'Expert'
          },
          market_positioning: {
            budget_vs_market: 'Dans la moyenne',
            timeline_vs_market: 'Délai standard',
            expected_applications: 'Candidatures modérées'
          }
        }
      };

      setResult(mockResult);
      setIsProcessing(false);
    }, 2000);
  };

  const generateStandardizedText = (text: string): string => {
    const title = extractTitle(text) || "Développement de solution digitale";
    const context = extractContext(text) || "Nous recherchons un prestataire qualifié pour développer une solution adaptée à nos besoins.";

    return `
**Projet : ${title}**

**Contexte et objectifs :**
${context}

**Livrables attendus :**
• Solution complète et fonctionnelle
• Code source documenté
• Tests unitaires et d'intégration
• Documentation technique
• Formation utilisateur si nécessaire

**Compétences techniques requises :**
• Maîtrise des technologies web modernes
• Expérience en développement full-stack
• Connaissance des bonnes pratiques de sécurité
• Capacité à travailler en méthodologie agile

**Budget et modalités :**
• Budget indicatif : À définir selon proposition
• Paiement en plusieurs tranches selon avancement
• Facturation possible en régie ou au forfait

**Critères de sélection :**
• Portfolio de projets similaires
• Références clients vérifiables
• Méthode de travail et communication
• Disponibilité et réactivité
• Rapport qualité/prix

**Délais :**
• Délai souhaité : À convenir
• Livraison par phases possible
• Suivi régulier de l'avancement

**Modalités de candidature :**
• Présentation de votre approche
• Exemples de réalisations similaires
• Planning prévisionnel
• Devis détaillé
    `.trim();
  };

  const extractTitle = (text: string): string => {
    // Logic d'extraction du titre basée sur l'IA
    if (text.toLowerCase().includes('site web') || text.toLowerCase().includes('site internet')) {
      return "Développement de site web";
    }
    if (text.toLowerCase().includes('application') || text.toLowerCase().includes('app')) {
      return "Développement d'application";
    }
    if (text.toLowerCase().includes('e-commerce') || text.toLowerCase().includes('boutique')) {
      return "Création de boutique en ligne";
    }
    return "Projet de développement";
  };

  const extractContext = (text: string): string => {
    return text.length > 50 ? text : "Contexte à préciser avec le client.";
  };

  const extractDeliverables = (text: string): string[] => {
    const deliverables = [];
    if (text.toLowerCase().includes('site')) deliverables.push("Site web responsive");
    if (text.toLowerCase().includes('mobile') || text.toLowerCase().includes('app')) deliverables.push("Application mobile");
    if (text.toLowerCase().includes('admin')) deliverables.push("Interface d'administration");
    return deliverables.length > 0 ? deliverables : ["Livrable principal à définir"];
  };

  const extractSkills = (text: string): string[] => {
    const skills = [];
    if (text.toLowerCase().includes('react')) skills.push("React.js");
    if (text.toLowerCase().includes('node')) skills.push("Node.js");
    if (text.toLowerCase().includes('php')) skills.push("PHP");
    if (text.toLowerCase().includes('python')) skills.push("Python");
    return skills.length > 0 ? skills : ["Compétences web générales"];
  };

  const extractBudget = (text: string): string => {
    const budgetMatch = text.match(/(\d+)\s*€/);
    return budgetMatch ? `${budgetMatch[1]}€` : "À définir";
  };

  const extractTimeline = (text: string): string => {
    if (text.toLowerCase().includes('urgent')) return "Urgent - 2 semaines";
    if (text.toLowerCase().includes('rapidement')) return "Rapide - 1 mois";
    return "À convenir";
  };

  const extractCriteria = (text: string): string[] => {
    return ["Expérience prouvée", "Portfolio pertinent", "Disponibilité"];
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.standardizedText);
    }
  };

  const calculateAdvancedMetrics = (originalText: string) => {
    // Dummy functions for demonstration, these would be replaced by actual AI/NLP logic
    const extractCategory = (text: string): string => {
      if (text.toLowerCase().includes('site web') || text.toLowerCase().includes('site internet')) return 'developpement';
      if (text.toLowerCase().includes('app') || text.toLowerCase().includes('application')) return 'developpement';
      if (text.toLowerCase().includes('graphisme') || text.toLowerCase().includes('design')) return 'design';
      if (text.toLowerCase().includes('marketing') || text.toLowerCase().includes('publicité')) return 'marketing';
      if (text.toLowerCase().includes('plomberie') || text.toLowerCase().includes('électricité')) return 'travaux';
      if (text.toLowerCase().includes('ménage') || text.toLowerCase().includes('jardin')) return 'services_personne';
      if (text.toLowerCase().includes('transport') || text.toLowerCase().includes('livraison')) return 'transport';
      return 'developpement'; // Default category
    };

    const estimateComplexity = (text: string): number => {
      let complexity = 5; // Base complexity
      if (text.length > 200) complexity += 2;
      if (text.toLowerCase().includes('intégration') || text.toLowerCase().includes('api')) complexity += 1;
      if (text.toLowerCase().includes('sécurité') || text.toLowerCase().includes('performance')) complexity += 1;
      return Math.min(10, Math.max(1, complexity));
    };

    const detectUrgency = (text: string): 'low' | 'medium' | 'high' => {
      if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('très rapide')) return 'high';
      if (text.toLowerCase().includes('rapide') || text.toLowerCase().includes('délai court')) return 'medium';
      return 'low';
    };

    const extractProjectData = (text: string) => {
      const budgetMatch = text.match(/(\d+)\s*([€$£]?)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;
      return { budget };
    };

    const extractTitle = (text: string): string => {
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.trim().length > 5 && !line.toLowerCase().includes('budget') && !line.toLowerCase().includes('délai')) {
          return line.trim();
        }
      }
      return "Titre du projet";
    };

    const extractContext = (text: string): string => {
      return text;
    };

    const extractDeliverables = (text: string): string[] => {
      return ["Livrable 1", "Livrable 2"];
    };

    const extractSkills = (text: string): string[] => {
      return ["Compétence 1", "Compétence 2"];
    };

    const extractBudget = (text: string): string => {
      const budgetMatch = text.match(/(\d+)\s*€/);
      return budgetMatch ? `${budgetMatch[1]}€` : "À définir";
    };

    const extractTimeline = (text: string): string => {
      if (text.toLowerCase().includes('urgent')) return "Urgent - 2 semaines";
      if (text.toLowerCase().includes('rapidement')) return "Rapide - 1 mois";
      return "À convenir";
    };

    const extractCriteria = (text: string): string[] => {
      return ["Critère 1", "Critère 2"];
    };


    const category_std = extractCategory(originalText);
    const complexityScore = estimateComplexity(originalText);
    const urgency = detectUrgency(originalText);
    const projectData = extractProjectData(originalText);
    const description = originalText;
    const title = extractTitle(originalText);

    const categoryData = getCategoryInsights(category_std);

    // Calcul du score de qualité enrichi
    const qualityFactors = [
      title.length > 10 ? 20 : 10,
      description.length > 100 ? 30 : description.length > 50 ? 20 : 10,
      category_std ? 25 : 0,
      projectData.budget ? 25 : 0
    ];

    const baseQualityScore = qualityFactors.reduce((acc, curr) => acc + curr, 0);

    // Calcul des suggestions de prix intelligentes
    const suggestedBudget = projectData.budget || categoryData.averageBudget;
    const adjustedForComplexity = suggestedBudget * (complexityScore / 5);
    const adjustedForUrgency = adjustedForComplexity * (urgency === 'high' ? categoryData.urgencyMultiplier : 1);
    const adjustedForSeason = adjustedForUrgency * categoryData.seasonalDemand;

    // Estimation du nombre de prestataires intéressés
    const estimatedInterestedProviders = Math.round(
      categoryData.availableProviders *
      (baseQualityScore / 100) *
      (adjustedForSeason > categoryData.averageBudget ? 1.2 : 0.8) *
      (urgency === 'high' ? 0.7 : 1.0) // Moins de prestataires disponibles pour l'urgent
    );

    // Suggestions de délais basées sur la catégorie et complexité
    const baseDuration = categoryData.typicalDuration;
    const complexityAdjustment = (complexityScore - 5) * 2; // +/- 2 jours par point de complexité
    const urgencyAdjustment = urgency === 'high' ? -3 : urgency === 'medium' ? -1 : 0;

    const suggestedDuration = Math.max(1, baseDuration + complexityAdjustment + urgencyAdjustment);

    const missing_info: string[] = [];
    if (!projectData.budget) missing_info.push("Budget");
    if (!title || title === "Titre du projet") missing_info.push("Titre");
    if (!description || description.length < 50) missing_info.push("Description détaillée");
    if (!category_std) missing_info.push("Catégorie");

    return {
      brief_quality_score: Math.round(baseQualityScore),
      richness_score: Math.min(60, description.split(' ').length * 2),
      missing_info,
      price_suggested_min: Math.round(adjustedForSeason * 0.8),
      price_suggested_med: Math.round(adjustedForSeason),
      price_suggested_max: Math.round(adjustedForSeason * 1.3),
      delay_suggested_days: suggestedDuration,
      market_insights: {
        category_popularity: categoryData.popularityScore,
        competition_level: categoryData.competitionLevel,
        estimated_providers_interested: estimatedInterestedProviders,
        seasonal_demand_factor: categoryData.seasonalDemand,
        typical_price_range: categoryData.priceRange,
        recommended_skills: categoryData.commonSkills,
        urgency_impact: urgency === 'high' ? 'Prix +20%, Délai -20%, Moins de candidats' :
                       urgency === 'medium' ? 'Prix +5%, Délai -5%' : 'Conditions normales',
        best_posting_advice: categoryData.competitionLevel === 'high' ?
          'Soyez très précis dans votre brief et votre budget' :
          'Vous pouvez être flexible sur les conditions'
      },
      loc_uplift_reco: {
        current_loc: baseQualityScore / 100,
        recommended_budget: Math.round(adjustedForSeason),
        recommended_delay: suggestedDuration,
        expected_loc_improvement: Math.min(0.3, (100 - baseQualityScore) / 100),
        provider_attraction_score: estimatedInterestedProviders / categoryData.availableProviders,
        competitive_advantage: baseQualityScore > 80 ? 'Élevé' : baseQualityScore > 60 ? 'Moyen' : 'Faible'
      },
      detailed_analysis: {
        complexity_breakdown: {
          technical: complexityScore,
          time_required: Math.round(suggestedDuration / 7 * 10) / 10, // en semaines
          skill_level_needed: complexityScore > 7 ? 'Expert' : complexityScore > 5 ? 'Confirmé' : 'Débutant acceptable'
        },
        market_positioning: {
          budget_vs_market: adjustedForSeason > categoryData.averageBudget * 1.1 ? 'Au-dessus du marché' :
                           adjustedForSeason < categoryData.averageBudget * 0.9 ? 'En-dessous du marché' : 'Dans la moyenne',
          timeline_vs_market: suggestedDuration > categoryData.typicalDuration * 1.1 ? 'Délai généreux' :
                             suggestedDuration < categoryData.typicalDuration * 0.9 ? 'Délai serré' : 'Délai standard',
          expected_applications: estimatedInterestedProviders > 10 ? 'Nombreuses candidatures' :
                                estimatedInterestedProviders > 5 ? 'Candidatures modérées' : 'Peu de candidatures'
        }
      }
    };
  };


  // Dummy function to get category insights, would be replaced by data retrieval
  const getCategoryInsights = (category: string): CategoryInsights => {
    const insights: Record<string, CategoryInsights> = {
      'developpement': {
        averageBudget: 3500,
        typicalDuration: 21,
        difficultyLevel: 7,
        popularityScore: 9,
        availableProviders: 850,
        competitionLevel: 'high',
        priceRange: { min: 800, max: 15000 },
        commonSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'PHP'],
        seasonalDemand: 1.2,
        urgencyMultiplier: 1.3
      },
      'design': {
        averageBudget: 1500,
        typicalDuration: 14,
        difficultyLevel: 5,
        popularityScore: 8,
        availableProviders: 620,
        competitionLevel: 'medium',
        priceRange: { min: 300, max: 5000 },
        commonSkills: ['Figma', 'Photoshop', 'Illustrator', 'UX/UI', 'Branding'],
        seasonalDemand: 0.9,
        urgencyMultiplier: 1.1
      },
      'marketing': {
        averageBudget: 1200,
        typicalDuration: 10,
        difficultyLevel: 4,
        popularityScore: 7,
        availableProviders: 470,
        competitionLevel: 'medium',
        priceRange: { min: 200, max: 4000 },
        commonSkills: ['SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing'],
        seasonalDemand: 1.1,
        urgencyMultiplier: 1.2
      },
      'travaux': {
        averageBudget: 2800,
        typicalDuration: 28,
        difficultyLevel: 6,
        popularityScore: 9,
        availableProviders: 1200,
        competitionLevel: 'high',
        priceRange: { min: 500, max: 20000 },
        commonSkills: ['Plomberie', 'Électricité', 'Peinture', 'Maçonnerie'],
        seasonalDemand: 1.3,
        urgencyMultiplier: 1.4
      },
      'services_personne': {
        averageBudget: 800,
        typicalDuration: 7,
        difficultyLevel: 3,
        popularityScore: 9,
        availableProviders: 950,
        competitionLevel: 'high',
        priceRange: { min: 100, max: 2000 },
        commonSkills: ['Ménage', 'Garde enfants', 'Aide domicile', 'Repassage'],
        seasonalDemand: 1.0,
        urgencyMultiplier: 1.5
      },
      'jardinage': {
        averageBudget: 600,
        typicalDuration: 5,
        difficultyLevel: 4,
        popularityScore: 7,
        availableProviders: 380,
        competitionLevel: 'medium',
        priceRange: { min: 80, max: 1500 },
        commonSkills: ['Élagage', 'Tonte', 'Plantation', 'Paysagisme'],
        seasonalDemand: 1.8,
        urgencyMultiplier: 1.1
      },
      'transport': {
        averageBudget: 400,
        typicalDuration: 3,
        difficultyLevel: 3,
        popularityScore: 7,
        availableProviders: 320,
        competitionLevel: 'medium',
        priceRange: { min: 50, max: 1200 },
        commonSkills: ['Permis B', 'Véhicule utilitaire', 'Manutention'],
        seasonalDemand: 1.1,
        urgencyMultiplier: 1.6
      },
      'beaute_bienetre': {
        averageBudget: 300,
        typicalDuration: 4,
        difficultyLevel: 2,
        popularityScore: 7,
        availableProviders: 280,
        competitionLevel: 'low',
        priceRange: { min: 30, max: 800 },
        commonSkills: ['Coiffure', 'Esthétique', 'Massage', 'Manucure'],
        seasonalDemand: 0.8,
        urgencyMultiplier: 1.0
      },
      'services_pro': {
        averageBudget: 2500,
        typicalDuration: 14,
        difficultyLevel: 8,
        popularityScore: 7,
        availableProviders: 420,
        competitionLevel: 'low',
        priceRange: { min: 500, max: 10000 },
        commonSkills: ['Comptabilité', 'Juridique', 'Conseil', 'Formation'],
        seasonalDemand: 1.0,
        urgencyMultiplier: 1.2
      },
      'evenementiel': {
        averageBudget: 1800,
        typicalDuration: 21,
        difficultyLevel: 6,
        popularityScore: 6,
        availableProviders: 180,
        competitionLevel: 'low',
        priceRange: { min: 300, max: 8000 },
        commonSkills: ['Organisation', 'Traiteur', 'Décoration', 'Animation'],
        seasonalDemand: 1.5,
        urgencyMultiplier: 1.3
      },
      'enseignement': {
        averageBudget: 900,
        typicalDuration: 30,
        difficultyLevel: 5,
        popularityScore: 8,
        availableProviders: 650,
        competitionLevel: 'medium',
        priceRange: { min: 200, max: 3000 },
        commonSkills: ['Pédagogie', 'Français', 'Mathématiques', 'Langues'],
        seasonalDemand: 1.4,
        urgencyMultiplier: 1.1
      },
      'animaux': {
        averageBudget: 250,
        typicalDuration: 5,
        difficultyLevel: 3,
        popularityScore: 6,
        availableProviders: 150,
        competitionLevel: 'low',
        priceRange: { min: 20, max: 600 },
        commonSkills: ['Vétérinaire', 'Garde animaux', 'Toilettage', 'Dressage'],
        seasonalDemand: 1.0,
        urgencyMultiplier: 1.4
      }
    };

    return insights[category] || {
      averageBudget: 1000,
      typicalDuration: 14,
      difficultyLevel: 5,
      popularityScore: 5,
      availableProviders: 200,
      competitionLevel: 'medium',
      priceRange: { min: 100, max: 2000 },
      commonSkills: [],
      seasonalDemand: 1.0,
      urgencyMultiplier: 1.0
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Standardiseur d'Annonces IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Annonce originale du client</Label>
            <Textarea
              placeholder="Collez ici l'annonce brute du client à standardiser..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            onClick={analyzeAndStandardize}
            disabled={!originalText || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Standardisation en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Standardiser avec l'IA
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Annonce Standardisée
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Qualité:</span>
                  <Badge variant={result.score > 80 ? "default" : "secondary"}>
                    {result.score}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div
                  className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: result.standardizedText
                      .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
                      .replace(/• (.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
                      .replace(/\n\n/g, '</p><p class="mb-3">')
                      .replace(/^/, '<p class="mb-3">')
                      .replace(/$/, '</p>')
                      .replace(/<p class="mb-3"><\/p>/g, '')
                      .replace(/<\/li>\n<li/g, '</li><li')
                      .replace(/<li class="ml-4">/g, '<ul class="list-disc ml-4 mb-3"><li>')
                      .replace(/<\/li>(?!\n<li)/g, '</li></ul>')
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Éditer
                </Button>
                {showApplyButton && onOptimizedTextGenerated && (
                  <Button
                    size="sm"
                    onClick={() => onOptimizedTextGenerated(result.standardizedText)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Appliquer à ma mission
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Améliorations Appliquées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  Problèmes Détectés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score de Qualité de l'Annonce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score global</span>
                  <span>{result.score}%</span>
                </div>
                <Progress value={result.score} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Structure: 95%</div>
                  <div className="font-medium">Clarté: 80%</div>
                  <div className="font-medium">Complétude: 85%</div>
                </div>
                <div>
                  <div className="font-medium">Professionnalisme: 90%</div>
                  <div className="font-medium">Détails techniques: 75%</div>
                  <div className="font-medium">Critères sélection: 85%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}