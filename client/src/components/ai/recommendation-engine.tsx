
import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Star, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AIRecommendation {
  id: string;
  type: 'provider' | 'mission' | 'skill' | 'price';
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  actionable: boolean;
  potentialImpact: 'low' | 'medium' | 'high';
}

interface RecommendationEngineProps {
  userId: string;
  context: 'dashboard' | 'mission' | 'profile';
}

export function RecommendationEngine({ userId, context }: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    
    // Simuler une analyse IA
    setTimeout(() => {
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'price',
          title: 'Optimisation tarifaire suggérée',
          description: 'Augmentez vos tarifs de 15% pour le développement web',
          confidence: 87,
          reasoning: [
            'Vos compétences sont très demandées',
            'Le marché accepte des tarifs plus élevés',
            'Votre taux de réussite est de 95%'
          ],
          actionable: true,
          potentialImpact: 'high'
        },
        {
          id: '2',
          type: 'skill',
          title: 'Nouvelle compétence recommandée',
          description: 'Apprenez React Native pour +40% d\'opportunités',
          confidence: 92,
          reasoning: [
            'Forte demande dans votre région',
            'Synergie avec vos compétences actuelles',
            'ROI estimé à 6 mois'
          ],
          actionable: true,
          potentialImpact: 'high'
        },
        {
          id: '3',
          type: 'mission',
          title: 'Mission parfaite détectée',
          description: 'E-commerce moderne - 100% de match avec votre profil',
          confidence: 95,
          reasoning: [
            'Technologies que vous maîtrisez',
            'Budget dans votre fourchette',
            'Client avec excellent feedback'
          ],
          actionable: true,
          potentialImpact: 'medium'
        }
      ];

      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    generateRecommendations();
  }, [userId, context]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return TrendingUp;
      case 'medium': return Target;
      case 'low': return Star;
      default: return Zap;
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse text-blue-500" />
            IA en cours d'analyse...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Recommandations IA</h3>
        <Badge variant="secondary">Beta</Badge>
      </div>

      {recommendations.map((rec) => {
        const ImpactIcon = getImpactIcon(rec.potentialImpact);
        
        return (
          <Card key={rec.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <ImpactIcon className={`h-4 w-4 ${getImpactColor(rec.potentialImpact)}`} />
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Confiance:</span>
                  <Badge variant={rec.confidence > 90 ? "default" : "secondary"}>
                    {rec.confidence}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700">{rec.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Niveau de confiance</span>
                  <span>{rec.confidence}%</span>
                </div>
                <Progress value={rec.confidence} className="h-2" />
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-sm">Analyse:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {rec.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {rec.actionable && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm">Appliquer</Button>
                  <Button variant="outline" size="sm">En savoir plus</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
