
import React, { useState } from 'react';
import { Brain, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiEnhanceText, aiSuggestHeadline, aiImproveBio, aiGenerateKeywordsSkills } from '../../../ai/profileAssist';
import { useToast } from '@/hooks/use-toast';

interface AIAssistButtonsProps {
  type: 'text' | 'headline' | 'bio' | 'keywords';
  currentValue: string;
  role?: 'client' | 'provider';
  onSuggestion: (suggestion: string | { keywords: string[]; skills: string[] }) => void;
  disabled?: boolean;
}

export function AIAssistButtons({
  type,
  currentValue,
  role = 'provider',
  onSuggestion,
  disabled = false
}: AIAssistButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const generateSuggestion = async () => {
    if (!currentValue.trim() && type !== 'headline') {
      toast({
        title: 'Texte requis',
        description: 'Veuillez d\'abord saisir du texte pour que l\'IA puisse le améliorer.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let result: string | { keywords: string[]; skills: string[] };
      
      switch (type) {
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
            headline: '' 
          });
          break;
        default:
          result = currentValue;
      }
      
      if (typeof result === 'string') {
        setSuggestion(result);
      } else {
        onSuggestion(result);
        toast({
          title: 'Suggestions générées',
          description: `${result.keywords.length} mots-clés et ${result.skills.length} compétences suggérés.`,
        });
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
    }
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

  const getButtonConfig = () => {
    switch (type) {
      case 'text':
        return {
          label: 'Améliorer avec l\'IA',
          icon: Wand2,
          description: 'Optimise le style et la clarté'
        };
      case 'headline':
        return {
          label: 'Générer un titre',
          icon: Sparkles,
          description: 'Crée un titre accrocheur'
        };
      case 'bio':
        return {
          label: 'Enrichir la description',
          icon: Brain,
          description: 'Améliore et complète votre présentation'
        };
      case 'keywords':
        return {
          label: 'Suggérer des mots-clés',
          icon: Brain,
          description: 'Extrait des mots-clés pertinents'
        };
      default:
        return {
          label: 'Assistant IA',
          icon: Brain,
          description: 'Aide à l\'amélioration'
        };
    }
  };

  const config = getButtonConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      {/* Bouton principal */}
      <Button
        onClick={generateSuggestion}
        disabled={disabled || loading}
        variant="outline"
        size="sm"
        className="w-full border-blue-200 hover:border-blue-300 hover:bg-blue-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Icon className="h-4 w-4 mr-2 text-blue-600" />
        )}
        {loading ? 'Génération...' : config.label}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        {config.description}
      </p>

      {/* Aperçu de la suggestion */}
      {showPreview && suggestion && (
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Suggestion IA
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    onClick={applySuggestion}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Appliquer
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPreview(false);
                      setSuggestion(null);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Ignorer
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {suggestion}
                </p>
              </div>

              <div className="text-xs text-gray-500">
                💡 Cette suggestion est générée par IA et peut être personnalisée selon vos besoins.
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
