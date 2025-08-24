
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Flame, Snowflake, Zap, DollarSign, Clock } from 'lucide-react';

interface MarketHeatProps {
  category: string;
  region?: string;
  onHeatChange?: (heatData: any) => void;
}

export default function MarketHeatIndicator({ category, region, onHeatChange }: MarketHeatProps) {
  const [heatData, setHeatData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadMarketData();
    
    // Actualisation toutes les 5 minutes
    const interval = setInterval(loadMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [category, region]);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API (à remplacer par votre service)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = {
        heat_score: Math.floor(Math.random() * 100),
        tension: ['low', 'medium', 'high', 'extreme'][Math.floor(Math.random() * 4)],
        price_impact: 0.8 + (Math.random() * 0.6), // 0.8 à 1.4
        opportunity_level: Math.floor(Math.random() * 100),
        trend_indicator: ['falling', 'stable', 'rising', 'surging'][Math.floor(Math.random() * 4)],
        recommendations: [
          "Marché favorable : augmentez vos tarifs de 10-15%",
          "Concentrez-vous sur vos projets de prédilection",
          "Répondez rapidement pour maximiser vos chances"
        ],
        insights: [
          `Forte demande en ${category}`,
          "Réactivité maximale : réponses en 1.2h en moyenne",
          "85% de projets menés à terme"
        ]
      };
      
      setHeatData(mockData);
      onHeatChange?.(mockData);
    } catch (error) {
      console.error('Erreur chargement market heat:', error);
    }
    setIsLoading(false);
  };

  const getTensionColor = (tension: string) => {
    switch (tension) {
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'extreme': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTensionIcon = (tension: string) => {
    switch (tension) {
      case 'low': return <Snowflake className="w-4 h-4" />;
      case 'medium': return <Minus className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      case 'extreme': return <Flame className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'falling': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'rising': 
      case 'surging': return <TrendingUp className="w-4 h-4 text-green-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Analyse du marché en cours...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!heatData) return null;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              {getTensionIcon(heatData.tension)}
            </div>
            <span>Market Heat - {category}</span>
            {region && <span className="text-sm text-gray-500">({region})</span>}
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon(heatData.trend_indicator)}
            <Badge variant="outline" className={getTensionColor(heatData.tension)}>
              {heatData.tension.toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score principal */}
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {heatData.heat_score}
            <span className="text-lg text-gray-500">/100</span>
          </div>
          <Progress value={heatData.heat_score} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">Tension du marché</p>
        </div>

        {/* Métriques clés */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <div className="text-xl font-semibold text-green-600">
              ×{heatData.price_impact.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">Impact Prix</p>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <div className="text-xl font-semibold text-blue-600">
              {heatData.opportunity_level}%
            </div>
            <p className="text-xs text-gray-600">Opportunités</p>
          </div>
        </div>

        {/* Insights principaux */}
        <div className="space-y-2">
          {heatData.insights.slice(0, 2).map((insight: string, index: number) => (
            <div key={index} className="flex items-start space-x-2 p-2 bg-white/50 rounded text-sm">
              <Zap className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1"
          >
            {showDetails ? 'Masquer détails' : 'Voir détails'}
          </Button>
          <Button 
            size="sm"
            onClick={loadMarketData}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Clock className="w-4 h-4 mr-1" />
            Actualiser
          </Button>
        </div>

        {/* Détails étendus */}
        {showDetails && (
          <div className="mt-4 p-4 bg-white rounded-lg border space-y-3">
            <h4 className="font-semibold text-gray-800">Recommandations</h4>
            <div className="space-y-2">
              {heatData.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                Données actualisées il y a {Math.floor(Math.random() * 15 + 1)} minutes
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
