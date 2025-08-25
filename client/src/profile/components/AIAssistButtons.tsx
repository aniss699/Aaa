
import React, { useState } from 'react';
import { Brain, Wand2, Sparkles, Loader2, Target, Zap, TrendingUp, Star, Plus, RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiEnhanceText, aiSuggestHeadline, aiImproveBio, aiGenerateKeywordsSkills } from '../../../ai/profileAssist';
import { useToast } from '@/hooks/use-toast';

interface AIAssistButtonsProps {
  type: 'text' | 'headline' | 'bio' | 'keywords' | 'complete-profile' | 'optimize-rates' | 'improve-visibility';
  currentValue: string;
  role?: 'client' | 'provider';
  onSuggestion: (suggestion: string | { keywords: string[]; skills: string[] } | any) => void;
  disabled?: boolean;
  additionalData?: any;
}

export function AIAssistButtons({
  type,
  currentValue,
  role = 'provider',
  onSuggestion,
  disabled = false,
  additionalData
}: AIAssistButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSuggestion = async (actionType?: string) => {
    const action = actionType || type;
    setActiveAction(action);
    
    if (!currentValue.trim() && !['headline', 'complete-profile', 'optimize-rates', 'improve-visibility'].includes(action)) {
      toast({
        title: 'Texte requis',
        description: 'Veuillez d\'abord saisir du texte pour que l\'IA puisse l\'améliorer.',
        variant: 'destructive'
      });
      setActiveAction(null);
      return;
    }

    setLoading(true);
    try {
      let result: any;
      
      switch (action) {
        case 'text':
          result = await aiEnhanceText(currentValue);
          break;
        case 'headline':
          result = await aiSuggestHeadline(currentValue, role);
          break;
        case 'bio':
          result = await aiImproveBio(currentValue, role);
          break;
        case 'keywords':
          result = await aiGenerateKeywordsSkills({ 
            bio: currentValue, 
            headline: additionalData?.headline || '' 
          });
          break;
        case 'complete-profile':
          result = await generateProfileCompletionSuggestions();
          break;
        case 'optimize-rates':
          result = await generateRateOptimization();
          break;
        case 'improve-visibility':
          result = await generateVisibilityTips();
          break;
        case 'enhance-description':
          result = await enhanceWithKeywords(currentValue);
          break;
        case 'add-call-to-action':
          result = await addCallToAction(currentValue, role);
          break;
        case 'improve-structure':
          result = await improveTextStructure(currentValue);
          break;
        default:
          result = currentValue;
      }
      
      if (typeof result === 'string') {
        setSuggestion(result);
      } else {
        onSuggestion(result);
        const message = result.keywords ? 
          `${result.keywords.length} mots-clés et ${result.skills?.length || 0} compétences suggérés.` :
          'Suggestions générées avec succès.';
        toast({
          title: 'Suggestions générées',
          description: message,
        });
        setActiveAction(null);
        return;
      }
      
      setShowPreview(true);
    } catch (error) {
      console.error('Erreur IA:', error);
      toast({
        title: 'Erreur IA',
        description: 'Une erreur est survenue. Suggestions basiques générées.',
        variant: 'destructive'
      });
      
      // Fallback simple
      setSuggestion(currentValue + ' [Version améliorée non disponible]');
      setShowPreview(true);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  // Fonctions d'assistance IA supplémentaires
  const generateProfileCompletionSuggestions = async () => {
    return {
      sections: [
        'Ajouter 3-5 mots-clés spécifiques à votre domaine',
        'Compléter la section expérience avec des années',
        'Ajouter au moins 2 projets au portfolio',
        'Préciser vos tarifs et disponibilités'
      ],
      priority: 'high'
    };
  };

  const generateRateOptimization = async () => {
    return {
      suggestions: [
        `Tarif recommandé: 45-65€/h pour votre profil ${role}`,
        'Ajustement saisonnier: +15% en période haute',
        'Tarif premium pour projets urgents: +25%'
      ],
      reasoning: 'Basé sur votre expérience et le marché local'
    };
  };

  const generateVisibilityTips = async () => {
    return {
      tips: [
        'Répondre aux appels d\'offres dans les 2h augmente vos chances de 40%',
        'Compléter votre profil à 90%+ améliore votre classement',
        'Ajouter des témoignages clients booste votre crédibilité'
      ]
    };
  };

  const enhanceWithKeywords = async (text: string) => {
    const keywords = role === 'provider' ? 
      ['professionnel', 'expérimenté', 'qualité', 'délais', 'satisfaction'] :
      ['projet', 'partenariat', 'collaboration', 'long terme', 'qualité'];
    
    return text + ` ${keywords.slice(0, 2).join(', ')} - Contact pour plus d'informations.`;
  };

  const addCallToAction = async (text: string, userRole: string) => {
    const cta = userRole === 'provider' ? 
      'Contactez-moi pour discuter de votre projet !' :
      'N\'hésitez pas à nous contacter pour échanger sur vos services.';
    
    return text + ` ${cta}`;
  };

  const improveTextStructure = async (text: string) => {
    const lines = text.split('. ');
    return lines.map((line, index) => 
      index === 0 ? `✓ ${line}` : 
      index < lines.length - 1 ? `• ${line}` : line
    ).join('. ');
  };

  const applySuggestion = () => {
    if (suggestion) {
      onSuggestion(suggestion);
      setSuggestion(null);
      setShowPreview(false);
      toast({
        title: 'Suggestion appliquée',
        description: 'Votre texte a été mis à jour avec la suggestion IA.',
      });
    }
  };

  const getButtonConfigs = () => {
    const configs = [
      {
        action: 'text',
        label: 'Améliorer le style',
        icon: Wand2,
        description: 'Optimise le style et la clarté',
        color: 'blue'
      },
      {
        action: 'enhance-description',
        label: 'Enrichir avec mots-clés',
        icon: Plus,
        description: 'Ajoute des mots-clés pertinents',
        color: 'green'
      },
      {
        action: 'add-call-to-action',
        label: 'Ajouter un appel à l\'action',
        icon: Target,
        description: 'Incite à la prise de contact',
        color: 'orange'
      },
      {
        action: 'improve-structure',
        label: 'Structurer le texte',
        icon: RefreshCw,
        description: 'Améliore la lisibilité',
        color: 'purple'
      }
    ];

    // Configs spécifiques selon le type
    if (type === 'headline') {
      return [{
        action: 'headline',
        label: 'Générer un titre IA',
        icon: Sparkles,
        description: 'Crée un titre accrocheur et professionnel',
        color: 'blue'
      }];
    }

    if (type === 'bio') {
      return [
        {
          action: 'bio',
          label: 'Enrichir la description',
          icon: Brain,
          description: 'Améliore et complète votre présentation',
          color: 'blue'
        },
        ...configs.slice(0, 3)
      ];
    }

    if (type === 'keywords') {
      return [{
        action: 'keywords',
        label: 'Suggérer mots-clés IA',
        icon: Lightbulb,
        description: 'Extrait des mots-clés depuis votre contenu',
        color: 'yellow'
      }];
    }

    return configs;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700',
      green: 'border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700',
      orange: 'border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-orange-700',
      purple: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-purple-700',
      yellow: 'border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50 text-yellow-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const buttonConfigs = getButtonConfigs();

  return (
    <div className="space-y-4">
      {/* Boutons de suggestions multiples */}
      <div className="grid grid-cols-1 gap-3">
        {buttonConfigs.map((config) => {
          const Icon = config.icon;
          const isLoading = loading && activeAction === config.action;
          
          return (
            <Button
              key={config.action}
              onClick={() => generateSuggestion(config.action)}
              disabled={disabled || loading}
              variant="outline"
              size="sm"
              className={`w-full ${getColorClasses(config.color)} transition-all duration-200`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Icon className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Génération...' : config.label}
            </Button>
          );
        })}
      </div>

      {/* Descriptions des actions */}
      <div className="text-xs text-gray-500 space-y-1">
        {buttonConfigs.map((config) => (
          <div key={`desc-${config.action}`} className="flex items-center gap-2">
            <config.icon className="h-3 w-3" />
            <span>{config.description}</span>
          </div>
        ))}
      </div>

      {/* Aperçu de la suggestion */}
      {showPreview && suggestion && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Suggestion IA
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={applySuggestion}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-8"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Appliquer
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    setSuggestion(null);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8"
                >
                  Ignorer
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {suggestion}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <Brain className="h-3 w-3" />
              <span>Cette suggestion est générée par IA et peut être personnalisée selon vos besoins.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides pour optimisation globale */}
      {type === 'complete-profile' && (
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Actions rapides IA</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => generateSuggestion('optimize-rates')}
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 text-green-700 justify-start"
                disabled={loading}
              >
                <Star className="h-3 w-3 mr-2" />
                Optimiser mes tarifs
              </Button>
              <Button
                onClick={() => generateSuggestion('improve-visibility')}
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 text-green-700 justify-start"
                disabled={loading}
              >
                <Zap className="h-3 w-3 mr-2" />
                Améliorer ma visibilité
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
