
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Euro,
  Calendar,
  Star,
  Activity,
  Lightbulb
} from 'lucide-react';

export function IntelligentDashboard() {
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    try {
      const response = await fetch('/api/ai/dashboard-insights');
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      // Fallback data
      setInsights({
        performance_score: 78,
        recommendations: [
          {
            type: 'revenue',
            title: 'Optimisez vos tarifs',
            description: 'Vous pourriez augmenter vos revenus de 15% en ajustant vos prix',
            impact: 'high',
            action: 'Voir l\'analyse'
          }
        ],
        market_trends: [
          {
            category: 'Développement web',
            trend: 'up',
            change: '+25%',
            description: 'Forte demande cette semaine'
          }
        ],
        next_actions: [
          {
            title: 'Postuler à 3 missions recommandées',
            priority: 'high',
            estimated_impact: 'Revenue potentiel: +800€'
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score de Performance IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Score de Performance IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{insights.performance_score}/100</span>
            <Badge variant="outline" className="text-green-600">
              +5 cette semaine
            </Badge>
          </div>
          <Progress value={insights.performance_score} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Basé sur vos candidatures, taux de conversion, et feedback clients
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommendations" className="space-y-4">
          {insights.recommendations?.map((rec: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                      Impact {rec.impact}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          {insights.market_trends?.map((trend: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{trend.category}</h4>
                    <p className="text-sm text-muted-foreground">{trend.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.change}
                    </div>
                    <TrendingUp className={`h-4 w-4 ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="actions" className="space-y-4">
          {insights.next_actions?.map((action: any, idx: number) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.estimated_impact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={action.priority === 'high' ? 'default' : 'secondary'}>
                      {action.priority}
                    </Badge>
                    <Button size="sm">
                      Commencer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
