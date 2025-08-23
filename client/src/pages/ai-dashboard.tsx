import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Target,
  Activity,
  BarChart3,
  Zap,
  Users,
  Euro,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Settings,
  Sparkles
} from 'lucide-react';

// Import des composants IA
import AdvancedScoringEngine from '@/components/ai/advanced-scoring-engine';
import AntiDumpingDetector from '@/components/ai/anti-dumping-detector';
import IntelligentBiddingGuide from '@/components/ai/intelligent-bidding-guide';
import { RecommendationEngine } from '@/components/ai/recommendation-engine';
import { AIDashboardOverview } from '@/components/ai/ai-dashboard-overview';

export default function AIDashboard() {
  const [aiMetrics, setAiMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Données simulées pour la démonstration
  const [mockData] = useState({
    bids: [
      {
        id: '1',
        providerId: 'provider-1',
        providerName: 'Tech Solutions',
        price: 2800,
        timeline: 14,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        provider: {
          id: 'provider-1',
          name: 'Tech Solutions',
          rating: 4.8,
          completedProjects: 45,
          successRate: 0.92,
          responseTime: 2,
          skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
          location: 'Paris'
        },
        mission: {
          budget: 3500,
          complexity: 'medium' as const,
          urgency: 'medium' as const,
          requiredSkills: ['React', 'Node.js', 'API'],
          category: 'développement-web'
        }
      },
      {
        id: '2',
        providerId: 'provider-2',
        providerName: 'Digital Experts',
        price: 1800,
        timeline: 10,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        provider: {
          id: 'provider-2',
          name: 'Digital Experts',
          rating: 4.2,
          completedProjects: 12,
          successRate: 0.78,
          responseTime: 8,
          skills: ['React', 'Vue.js', 'CSS'],
          location: 'Lyon'
        },
        mission: {
          budget: 3500,
          complexity: 'medium' as const,
          urgency: 'medium' as const,
          requiredSkills: ['React', 'Node.js', 'API'],
          category: 'développement-web'
        }
      }
    ],
    mission: {
      id: 'mission-1',
      title: 'Développement d\'une application e-commerce',
      budget: 3500,
      category: 'développement-web',
      complexity: 'medium' as const,
      urgency: 'medium' as const,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      requiredSkills: ['React', 'Node.js', 'API', 'PostgreSQL']
    },
    providerProfile: {
      id: 'current-provider',
      rating: 4.5,
      completedProjects: 25,
      successRate: 0.88,
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      hourlyRate: 65
    },
    marketPrice: 3000
  });

  useEffect(() => {
    // Simulation du chargement des métriques IA
    const loadAIMetrics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAiMetrics({
        totalAnalyses: 1247,
        successfulPredictions: 89.6,
        detectedAbuseAttempts: 23,
        averageScoreAccuracy: 94.2,
        activeModels: 6,
        processingSpeed: 0.3, // secondes
        lastModelUpdate: '2024-01-15T10:30:00Z',
        systemHealth: 98.7
      });

      setIsLoading(false);
    };

    loadAIMetrics();
  }, [selectedTimeRange]);

  const MetricCard = ({ title, value, unit, icon: Icon, trend, trendValue, color = 'blue' }: any) => {
    const colorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    
    const iconColorClasses = {
      blue: 'text-blue-500',
      green: 'text-green-500',
      red: 'text-red-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500'
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
                {value}{unit}
              </p>
              {trend && (
                <div className={`flex items-center mt-1 text-sm ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                  {trendValue}
                </div>
              )}
            </div>
            <Icon className={`w-8 h-8 ${iconColorClasses[color as keyof typeof iconColorClasses] || iconColorClasses.blue}`} />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Brain className="w-10 h-10 mr-3 text-blue-600 animate-pulse" />
              Tableau de Bord IA
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-blue-600" />
            Tableau de Bord IA
          </h1>
          <p className="text-xl text-gray-600">
            Monitoring et contrôle de tous les systèmes d'intelligence artificielle
          </p>

          <div className="flex justify-center space-x-2 mt-4">
            {['24h', '7d', '30d'].map(range => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Component */}
        <div className="mb-8">
          <AIDashboardOverview />
        </div>

        {/* Métriques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Analyses Totales"
            value={aiMetrics.totalAnalyses}
            unit=""
            icon={Activity}
            trend="up"
            trendValue="+12.5%"
            color="blue"
          />
          <MetricCard
            title="Précision Prédictions"
            value={aiMetrics.successfulPredictions}
            unit="%"
            icon={Target}
            trend="up"
            trendValue="+2.1%"
            color="green"
          />
          <MetricCard
            title="Abus Détectés"
            value={aiMetrics.detectedAbuseAttempts}
            unit=""
            icon={Shield}
            trend="down"
            trendValue="-8.3%"
            color="red"
          />
          <MetricCard
            title="Santé Système"
            value={aiMetrics.systemHealth}
            unit="%"
            icon={CheckCircle}
            trend="up"
            trendValue="+0.5%"
            color="green"
          />
        </div>

        {/* Statut des modèles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 w-5 mr-2" />
              Statut des Modèles IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Scoring Multi-Objectif</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <Progress value={94} className="h-2" />
                <div className="text-xs text-gray-500">Précision: 94%</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Anti-Dumping</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <Progress value={98} className="h-2" />
                <div className="text-xs text-gray-500">Détection: 98%</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Guidage Enchères</span>
                  <Badge className="bg-green-100 text-green-800">Actif</Badge>
                </div>
                <Progress value={91} className="h-2" />
                <div className="text-xs text-gray-500">Succès: 91%</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{aiMetrics.activeModels}</div>
                <div className="text-sm text-gray-600">Modèles actifs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{aiMetrics.processingSpeed}s</div>
                <div className="text-sm text-gray-600">Temps moyen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(aiMetrics.lastModelUpdate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Dernière MAJ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Disponibilité</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composants IA en temps réel */}
        <Tabs defaultValue="scoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scoring">Scoring Avancé</TabsTrigger>
            <TabsTrigger value="anti-dumping">Anti-Dumping</TabsTrigger>
            <TabsTrigger value="bidding">Guidage Enchères</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          </TabsList>

          <TabsContent value="scoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Moteur de Scoring Multi-Objectif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedScoringEngine
                  bidData={{
                    price: mockData.bids[0].price,
                    timeline: mockData.bids[0].timeline,
                    provider: mockData.bids[0].provider,
                    mission: mockData.bids[0].mission
                  }}
                  onScoreCalculated={(score, details) => {
                    console.log('Score calculé:', score, details);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anti-dumping">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Système Anti-Dumping & Détection de Collusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AntiDumpingDetector
                  missionId={mockData.mission.id}
                  bids={mockData.bids}
                  marketPrice={mockData.marketPrice}
                  onSuspiciousActivityDetected={(detection) => {
                    console.log('Activité suspecte détectée:', detection);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bidding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Guidage d'Enchères Intelligent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IntelligentBiddingGuide
                  mission={mockData.mission}
                  providerProfile={mockData.providerProfile}
                  existingBids={mockData.bids}
                  onBidRecommendation={(recommendation) => {
                    console.log('Recommandation d\'enchère:', recommendation);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Moteur de Recommandations Avancées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecommendationEngine
                  userId="current-user"
                  context="dashboard"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alertes et notifications IA */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alertes IA en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                  <span className="text-sm font-medium">Pic d'activité détecté</span>
                </div>
                <Badge variant="outline" className="text-yellow-700">Nouveau</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">Nouvelle tendance marché identifiée</span>
                </div>
                <Badge variant="outline" className="text-blue-700">Info</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Modèle de scoring mis à jour avec succès</span>
                </div>
                <Badge variant="outline" className="text-green-700">Succès</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}