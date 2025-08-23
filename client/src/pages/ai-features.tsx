
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, Zap, TrendingUp, Settings, Star, Users, Clock, Euro, Award, CheckCircle, AlertCircle, Lightbulb, BarChart3, Activity, Shield, Sparkles } from 'lucide-react';
import SmartBidAnalyzer from '@/components/ai/smart-bid-analyzer';
import MissionMatchingEngine from '@/components/ai/mission-matching-engine';
import RevenuePredictor from '@/components/ai/revenue-predictor';

export default function AIFeatures() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Données enrichies pour les démonstrations
  const testMission = {
    title: "Développement d'une plateforme SaaS complète",
    description: "Recherche d'un développeur full-stack senior pour créer une plateforme SaaS B2B avec tableau de bord analytique, API REST, système d'authentification, facturation automatique et interface multi-tenant.",
    budget: 12500,
    category: "web-development",
    complexity: "high",
    urgency: "medium",
    skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe'],
    timeline: "16 semaines"
  };

  const testBid = {
    price: 11800,
    timeline: "14 semaines",
    proposal: "Bonjour, Expert en développement SaaS avec 7 ans d'expérience. J'ai déjà livré 12 plateformes similaires incluant multi-tenancy et facturation. Portfolio: [liens]. Disponible immédiatement, 30h/semaine. Méthodologie agile, livrables hebdomadaires, tests automatisés inclus.",
    providerExperience: 7,
    similarProjects: 12,
    proposedTech: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Stripe']
  };

  const testProviderProfile = {
    id: "provider-123",
    rating: 4.8,
    completedProjects: 89,
    skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Stripe API', 'Docker', 'Kubernetes'],
    portfolio: [
      { title: "E-commerce Platform", tech: ['React', 'Node.js'], budget: 8000 },
      { title: "SaaS Analytics Tool", tech: ['Vue.js', 'Python'], budget: 15000 }
    ],
    specialties: ['SaaS Development', 'E-commerce', 'Fintech'],
    responseTime: 1.2,
    successRate: 0.94,
    clientRetention: 0.87
  };

  const testProvider = {
    id: "test-provider",
    name: "Alexandre Martin",
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS', 'Docker'],
    location: 'Paris',
    rating: 4.7,
    completedProjects: 34,
    portfolio: [],
    hourlyRate: 75,
    categories: ['web-development', 'mobile-development', 'saas-development'],
    specialties: ['Full-Stack', 'Architecture', 'DevOps'],
    availability: 'Disponible',
    responseTime: 2.1,
    successRate: 0.91
  };

  const testMissions = [
    {
      id: "mission1",
      title: "Refonte complète d'une application e-commerce",
      description: "Migration d'une plateforme legacy vers une architecture moderne avec React/Node.js, optimisation performance et UX",
      budget: 8500,
      category: "web-development",
      location: "Paris",
      createdAt: new Date(),
      bids: [],
      complexity: "high",
      urgency: "medium",
      skillsRequired: ['React', 'Node.js', 'E-commerce'],
      clientBudgetFlexibility: 0.2
    },
    {
      id: "mission2",
      title: "Application mobile fintech React Native",
      description: "Développement d'une app mobile pour gestion financière personnelle avec intégrations bancaires sécurisées",
      budget: 18000,
      category: "mobile-development", 
      location: "Lyon",
      createdAt: new Date(),
      bids: [],
      complexity: "very-high",
      urgency: "high",
      skillsRequired: ['React Native', 'Fintech', 'Security'],
      clientBudgetFlexibility: 0.15
    },
    {
      id: "mission3",
      title: "Intégration IA dans plateforme existante",
      description: "Ajout de fonctionnalités d'intelligence artificielle pour recommandations personnalisées et analyse prédictive",
      budget: 22000,
      category: "ai-integration",
      location: "Remote",
      createdAt: new Date(),
      bids: [],
      complexity: "very-high",
      urgency: "low",
      skillsRequired: ['Python', 'Machine Learning', 'API Integration'],
      clientBudgetFlexibility: 0.3
    }
  ];

  const testRevenueData = {
    currentRevenue: 180000,
    projectedRevenue: 245000,
    growthRate: "18%",
    factors: [
      { name: "Acquisition Client", value: 0.45 },
      { name: "Rétention Client", value: 0.35 },
      { name: "Expansion Marché", value: 0.20 }
    ],
    historicalData: [
      { month: "Jan", revenue: 140000, growth: 12 },
      { month: "Fév", revenue: 152000, growth: 15 },
      { month: "Mar", revenue: 168000, growth: 18 },
      { month: "Avr", revenue: 180000, growth: 16 }
    ],
    marketTrends: {
      webDev: { demand: 92, avgBudget: 6200 },
      mobile: { demand: 87, avgBudget: 8900 },
      ai: { demand: 95, avgBudget: 12500 }
    }
  };

  const runAdvancedSimulation = (type: string) => {
    setActiveDemo(type);
    
    setTimeout(() => {
      let results;
      
      switch(type) {
        case 'matching':
          results = {
            type: 'matching',
            topMatches: [
              { 
                mission: testMissions[0], 
                score: 94, 
                reasons: ['Compétences parfaitement alignées', 'Budget dans votre fourchette', 'Client local'],
                winProbability: 0.87,
                recommendedBid: 7800
              },
              { 
                mission: testMissions[2], 
                score: 89, 
                reasons: ['Secteur en forte croissance', 'Budget élevé', 'Projet innovant'],
                winProbability: 0.72,
                recommendedBid: 19500
              }
            ],
            insights: [
              'Éviter le projet mobile (concurrence élevée)',
              'Spécialisation IA = opportunité premium',
              'Votre profil parfait pour SaaS/E-commerce'
            ]
          };
          break;
          
        case 'bidding':
          results = {
            type: 'bidding',
            analysis: {
              competitivenessScore: 91,
              winProbability: 0.84,
              priceRecommendation: {
                optimal: 11200,
                range: { min: 10500, max: 12800 },
                reasoning: 'Prix compétitif avec marge confortable'
              },
              strengthsWeaknesses: {
                strengths: ['Portfolio SaaS excellent', 'Expérience pertinente', 'Proposition structurée'],
                weaknesses: ['Timeline serrée', 'Budget légèrement élevé']
              },
              improvements: [
                'Proposer MVP en 10 semaines + itérations',
                'Inclure 2 semaines de support post-livraison',
                'Mettre en avant certifications AWS'
              ]
            }
          };
          break;
          
        case 'revenue':
          results = {
            type: 'revenue',
            prediction: {
              nextQuarter: 225000,
              confidence: 0.89,
              scenarioAnalysis: {
                optimistic: { revenue: 265000, probability: 0.25 },
                realistic: { revenue: 235000, probability: 0.60 },
                pessimistic: { revenue: 205000, probability: 0.15 }
              },
              keyDrivers: [
                'Croissance secteur IA (+45%)',
                'Amélioration profile score (+12%)',
                'Nouveaux clients récurrents (+8%)'
              ],
              recommendations: [
                'Investir dans formation Machine Learning',
                'Augmenter taux horaire à 85€',
                'Cibler projets IA et SaaS premium'
              ]
            }
          };
          break;
      }
      
      setSimulationResults(results);
      setActiveDemo(null);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Algorithmes IA Avancés</h1>
            <p className="text-lg text-gray-600">Explorez nos systèmes d'intelligence artificielle propriétaires en action</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Smart Matching</h3>
                  <p className="text-sm text-purple-700">IA propriétaire de correspondance</p>
                  <Badge variant="secondary" className="mt-1 text-xs">94% précision</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Bid Optimizer</h3>
                  <p className="text-sm text-blue-700">Analyse prédictive avancée</p>
                  <Badge variant="secondary" className="mt-1 text-xs">+23% succès</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Revenue Engine</h3>
                  <p className="text-sm text-green-700">Prédiction et optimisation</p>
                  <Badge variant="secondary" className="mt-1 text-xs">89% précision</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">Market Intel</h3>
                  <p className="text-sm text-orange-700">Analyse temps réel</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Live data</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="bid-analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bid-analyzer" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Bid Analyzer</span>
            <span className="sm:hidden">Bid</span>
          </TabsTrigger>
          <TabsTrigger value="matching-engine" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Smart Matching</span>
            <span className="sm:hidden">Match</span>
          </TabsTrigger>
          <TabsTrigger value="revenue-predictor" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Revenue AI</span>
            <span className="sm:hidden">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="market-intelligence" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Market Intel</span>
            <span className="sm:hidden">Market</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bid-analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>Smart Bid Analyzer - Neural Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Settings className="w-3 h-3 mr-1" />
                    Mode Démo
                  </Badge>
                  <Button 
                    onClick={() => runAdvancedSimulation('bidding')}
                    disabled={activeDemo === 'bidding'}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {activeDemo === 'bidding' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyse...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Simulation IA
                      </div>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Mission SaaS Premium
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Titre:</strong> {testMission.title}</p>
                    <p><strong>Budget:</strong> {testMission.budget.toLocaleString()}€</p>
                    <p><strong>Complexité:</strong> 
                      <Badge variant="secondary" className="ml-2 text-xs">Élevée</Badge>
                    </p>
                    <p><strong>Skills:</strong> {testMission.skillsRequired.join(', ')}</p>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Votre Proposition IA
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Prix:</strong> {testBid.price.toLocaleString()}€</p>
                    <p><strong>Délai:</strong> {testBid.timeline}</p>
                    <p><strong>Expérience:</strong> {testBid.providerExperience} ans</p>
                    <p><strong>Projets similaires:</strong> {testBid.similarProjects}</p>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Profil Expert
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Note:</strong> {testProviderProfile.rating}/5 ⭐</p>
                    <p><strong>Projets:</strong> {testProviderProfile.completedProjects}</p>
                    <p><strong>Taux succès:</strong> {(testProviderProfile.successRate * 100).toFixed(0)}%</p>
                    <p><strong>Réponse:</strong> {testProviderProfile.responseTime}h</p>
                  </div>
                </Card>
              </div>

              {simulationResults?.type === 'bidding' ? (
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center p-4 bg-green-50 border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {simulationResults.analysis.competitivenessScore}%
                      </div>
                      <p className="text-sm text-green-700">Score Compétitivité</p>
                    </Card>
                    <Card className="text-center p-4 bg-blue-50 border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {(simulationResults.analysis.winProbability * 100).toFixed(0)}%
                      </div>
                      <p className="text-sm text-blue-700">Probabilité Victoire</p>
                    </Card>
                    <Card className="text-center p-4 bg-purple-50 border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {simulationResults.analysis.priceRecommendation.optimal.toLocaleString()}€
                      </div>
                      <p className="text-sm text-purple-700">Prix Optimal IA</p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Forces Détectées
                      </h4>
                      {simulationResults.analysis.strengthsWeaknesses.strengths.map((strength: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Améliorations IA
                      </h4>
                      {simulationResults.analysis.improvements.map((improvement: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 mb-2">
                          <Zap className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{improvement}</span>
                        </div>
                      ))}
                    </Card>
                  </div>
                </div>
              ) : (
                <SmartBidAnalyzer
                  missionTitle={testMission.title}
                  missionDescription={testMission.description}
                  missionBudget={testMission.budget}
                  missionCategory={testMission.category}
                  currentBid={testBid}
                  providerProfile={testProviderProfile}
                  competitorBids={[]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span>Neural Matching Engine - Deep Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Settings className="w-3 h-3 mr-1" />
                    Mode Démo
                  </Badge>
                  <Button 
                    onClick={() => runAdvancedSimulation('matching')}
                    disabled={activeDemo === 'matching'}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {activeDemo === 'matching' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        Matching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Run Neural Net
                      </div>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    Profil Prestataire Expert
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {testProvider.name}</p>
                    <p><strong>Compétences:</strong> {testProvider.skills.slice(0, 4).join(', ')}...</p>
                    <p><strong>Spécialités:</strong> {testProvider.specialties.join(', ')}</p>
                    <p><strong>Note:</strong> {testProvider.rating}/5 | <strong>Projets:</strong> {testProvider.completedProjects}</p>
                    <p><strong>Taux:</strong> {testProvider.hourlyRate}€/h | <strong>Succès:</strong> {(testProvider.successRate * 100).toFixed(0)}%</p>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-green-50 to-cyan-50 border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Missions Disponibles ({testMissions.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {testMissions.map((mission, index) => (
                      <div key={mission.id} className="p-2 bg-white rounded border text-xs">
                        <p className="font-medium">{mission.title}</p>
                        <div className="flex justify-between mt-1">
                          <span>{mission.budget.toLocaleString()}€</span>
                          <Badge variant="secondary" className="text-xs">{mission.complexity}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {simulationResults?.type === 'matching' ? (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-purple-600 mb-2">Résultats Neural Matching</h3>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Brain className="w-3 h-3 mr-1" />
                      {simulationResults.topMatches.length} correspondances optimales détectées
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {simulationResults.topMatches.map((match: any, index: number) => (
                      <Card key={index} className="p-4 border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{match.mission.title}</h4>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600">{match.score}%</div>
                            <Badge variant="secondary" className="text-xs">Match Score</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Victoire probable:</span>
                            <span className="font-medium text-green-600">{(match.winProbability * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Prix conseillé:</span>
                            <span className="font-medium">{match.recommendedBid.toLocaleString()}€</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-medium text-sm text-gray-700">Raisons IA:</h5>
                          {match.reasons.map((reason: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs">{reason}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Insights Stratégiques IA
                    </h4>
                    {simulationResults.insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </Card>
                </div>
              ) : (
                <MissionMatchingEngine
                  providerProfile={testProvider}
                  missions={testMissions}
                  onMissionRecommended={(mission) => {
                    console.log('Mission recommandée:', mission);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue-predictor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span>Revenue Prediction Engine - Time Series AI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Settings className="w-3 h-3 mr-1" />
                    Mode Démo
                  </Badge>
                  <Button 
                    onClick={() => runAdvancedSimulation('revenue')}
                    disabled={activeDemo === 'revenue'}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {activeDemo === 'revenue' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        Prédiction...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Simulation Avancée
                      </div>
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Euro className="w-4 h-4 text-green-600" />
                    Données Revenue Actuelles
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Revenu Actuel:</strong> {testRevenueData.currentRevenue.toLocaleString()}€</p>
                    <p><strong>Projection Q4:</strong> {testRevenueData.projectedRevenue.toLocaleString()}€</p>
                    <p><strong>Croissance:</strong> <Badge variant="secondary" className="ml-1">{testRevenueData.growthRate}</Badge></p>
                    <p><strong>Tendance:</strong> <span className="text-green-600 font-medium">↗ Positive</span></p>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    Tendances Marché
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(testRevenueData.marketTrends).map(([key, data]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{key.replace('Dev', ' Dev')}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={data.demand} className="w-16 h-2" />
                          <span className="text-xs font-medium">{data.demand}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {simulationResults?.type === 'revenue' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center p-4 bg-green-50 border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {simulationResults.prediction.nextQuarter.toLocaleString()}€
                      </div>
                      <p className="text-sm text-green-700">Prédiction Q4</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {(simulationResults.prediction.confidence * 100).toFixed(0)}% fiable
                      </Badge>
                    </Card>
                    
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h5 className="font-medium text-blue-700 mb-2 text-center">Scénarios IA</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Optimiste:</span>
                          <span className="font-medium">{simulationResults.prediction.scenarioAnalysis.optimistic.revenue.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Réaliste:</span>
                          <span className="font-medium">{simulationResults.prediction.scenarioAnalysis.realistic.revenue.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pessimiste:</span>
                          <span className="font-medium">{simulationResults.prediction.scenarioAnalysis.pessimistic.revenue.toLocaleString()}€</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <h5 className="font-medium text-purple-700 mb-2 text-center">Moteurs Clés</h5>
                      <div className="space-y-1">
                        {simulationResults.prediction.keyDrivers.slice(0, 2).map((driver: string, index: number) => (
                          <div key={index} className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-purple-600" />
                            <span className="text-xs">{driver}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Recommandations Stratégiques IA
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {simulationResults.prediction.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-white rounded">
                          <Star className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <RevenuePredictor
                  currentRevenue={testRevenueData.currentRevenue}
                  projectedRevenue={testRevenueData.projectedRevenue}
                  growthRate={testRevenueData.growthRate}
                  factors={testRevenueData.factors}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-orange-600" />
                <span>Market Intelligence Dashboard</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <p className="text-sm text-blue-700">Missions Actives</p>
                  <Badge variant="secondary" className="mt-1 text-xs">+12% cette semaine</Badge>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-green-100">
                  <Euro className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">68€</div>
                  <p className="text-sm text-green-700">Taux Moyen/h</p>
                  <Badge variant="secondary" className="mt-1 text-xs">+8% vs mois dernier</Badge>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <p className="text-sm text-purple-700">Taux Succès</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Stable</Badge>
                </Card>

                <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                  <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">2.3h</div>
                  <p className="text-sm text-orange-700">Temps Réponse</p>
                  <Badge variant="secondary" className="mt-1 text-xs">-15% amélioration</Badge>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Secteurs en Croissance
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'IA/Machine Learning', growth: '+45%', color: 'text-green-600' },
                      { name: 'Blockchain/Web3', growth: '+38%', color: 'text-blue-600' },
                      { name: 'E-commerce/SaaS', growth: '+22%', color: 'text-purple-600' },
                      { name: 'Mobile/React Native', growth: '+18%', color: 'text-orange-600' }
                    ].map((sector, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{sector.name}</span>
                        <Badge variant="secondary" className={sector.color}>
                          {sector.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Alertes Marché
                  </h4>
                  <div className="space-y-3">
                    {[
                      { alert: 'Forte demande React seniors Paris', type: 'opportunity', urgency: 'high' },
                      { alert: 'Baisse prix développement WordPress', type: 'warning', urgency: 'medium' },
                      { alert: 'Nouveau client premium IA/SaaS', type: 'opportunity', urgency: 'high' },
                      { alert: 'Concurrence accrue mobile basic', type: 'warning', urgency: 'low' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 border-l-2 border-l-blue-500 bg-blue-50">
                        {item.type === 'opportunity' ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        )}
                        <div>
                          <span className="text-sm">{item.alert}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.urgency}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
