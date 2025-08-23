
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecommendationEngine } from '@/components/ai/recommendation-engine';
import { MissionStandardizer } from '@/components/ai/mission-standardizer';
import { Brain, TestTube, Zap, Target, TrendingUp, FileText, Settings, Play, Star, Clock, Euro, Users, Lightbulb, AlertTriangle, CheckCircle, BarChart3, Gauge, Sparkles } from 'lucide-react';

export default function AITest() {
  const [testProfile, setTestProfile] = useState({
    skills: 'React, Node.js, TypeScript, Python, MongoDB',
    rating: '4.2',
    completedProjects: '15',
    responseTime: '2.5',
    successRate: '0.85',
    hourlyRate: '45',
    location: 'Paris',
    specialties: 'Full-Stack Development, E-commerce, Mobile Apps'
  });

  const [testMission, setTestMission] = useState({
    title: 'Développement d\'une application e-commerce moderne',
    description: 'Nous recherchons un développeur React expérimenté pour créer une plateforme e-commerce moderne avec paiement intégré, gestion des stocks, interface administrateur et version mobile responsive.',
    budget: '5000',
    category: 'web-development',
    urgency: 'medium',
    duration: '12 semaines',
    complexity: 'high'
  });

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [marketAnalysis, setMarketAnalysis] = useState<any>(null);

  const runProfileAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const analysis = {
        overallScore: Math.floor(Math.random() * 30) + 70,
        profileCompleteness: Math.floor(Math.random() * 20) + 80,
        competitiveness: Math.floor(Math.random() * 25) + 60,
        marketAlignment: Math.floor(Math.random() * 30) + 65,
        strengths: ['React Expert', 'Bonne Note', 'Réactif', 'Portfolio Diversifié'],
        improvements: ['Plus de projets', 'Certifications', 'Spécialisation Niche', 'Témoignages clients'],
        recommendations: [
          `Augmenter le taux horaire à ${parseInt(testProfile.hourlyRate) + 10}€/h`,
          'Créer un portfolio en ligne avec 3-5 projets phares',
          'Se spécialiser en e-commerce ou fintech',
          'Obtenir une certification AWS ou Google Cloud',
          'Améliorer le temps de réponse à moins de 2h'
        ],
        detailedMetrics: {
          skillsRelevance: Math.floor(Math.random() * 20) + 75,
          pricingStrategy: Math.floor(Math.random() * 25) + 60,
          responseMetrics: Math.floor(Math.random() * 30) + 70,
          clientSatisfaction: Math.floor(Math.random() * 15) + 80
        },
        trendingSkills: ['Next.js', 'GraphQL', 'Tailwind CSS', 'TypeScript', 'Prisma'],
        marketDemand: {
          currentDemand: 'Élevée',
          projectedGrowth: '+15%',
          averageRate: '52€/h',
          competitionLevel: 'Moyenne'
        }
      };
      setAnalysisResult(analysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const runMissionOptimization = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const optimization = {
        originalScore: 65,
        optimizedScore: 87,
        improvements: [
          'Titre plus accrocheur avec mots-clés populaires',
          'Description structurée avec bullet points',
          'Budget ajusté selon le marché (+20%)',
          'Ajout de critères de sélection spécifiques',
          'Timeline plus réaliste'
        ],
        optimizedContent: {
          title: '🚀 Développement E-commerce Premium | React + Node.js | Paiement Sécurisé',
          description: `**Projet E-commerce de Nouvelle Génération**

📋 **Objectifs :**
• Plateforme e-commerce moderne et responsive
• Interface administrateur complète
• Système de paiement sécurisé (Stripe/PayPal)
• Gestion avancée des stocks et commandes

🛠️ **Technologies souhaitées :**
• Frontend: React.js, TypeScript, Tailwind CSS
• Backend: Node.js, Express, MongoDB/PostgreSQL
• Paiement: Stripe API, PayPal integration
• Déploiement: AWS/Vercel

⭐ **Profil recherché :**
• 3+ années d'expérience en développement full-stack
• Portfolio avec projets e-commerce similaires
• Maîtrise des APIs de paiement
• Disponibilité 20h/semaine minimum

📈 **Livrables attendus :**
• Code source documenté + tests
• Interface admin intuitive
• Version mobile optimisée
• Formation utilisateur incluse`,
          budget: 6000,
          timeline: '14 semaines'
        },
        keywordAnalysis: {
          trending: ['React', 'E-commerce', 'Full-stack', 'TypeScript'],
          missing: ['SEO', 'Performance', 'Sécurité', 'Analytics'],
          suggestions: ['Ajouter "Performance optimisée"', 'Mentionner "SEO-friendly"']
        }
      };
      setOptimizationResult(optimization);
      setIsAnalyzing(false);
    }, 2500);
  };

  const runMarketAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const market = {
        categoryTrends: {
          webDevelopment: { demand: 92, growth: '+18%', avgBudget: '4500€' },
          mobileDevelopment: { demand: 87, growth: '+25%', avgBudget: '6200€' },
          ecommerce: { demand: 95, growth: '+22%', avgBudget: '5800€' },
          aiIntegration: { demand: 89, growth: '+45%', avgBudget: '7200€' }
        },
        competitorAnalysis: {
          averageRating: 4.3,
          averageCompletedProjects: 28,
          averageResponseTime: '3.2h',
          averageHourlyRate: '48€'
        },
        recommendations: [
          'Le secteur e-commerce est en forte croissance (+22%)',
          'Votre profil est compétitif sur le marché parisien',
          'Considérer une spécialisation en IA pour +45% de croissance',
          'Budget moyen du secteur: 5800€ (vs votre estimation: 5000€)'
        ],
        opportunityScore: 84,
        riskFactors: [
          'Concurrence élevée en développement web classique',
          'Évolution rapide des technologies',
          'Pression sur les prix dans certains segments'
        ]
      };
      setMarketAnalysis(market);
      setIsAnalyzing(false);
    }, 2800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratoire de Test IA</h1>
            <p className="text-lg text-gray-600">Testez et expérimentez avec nos algorithmes d'intelligence artificielle avancés</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900 text-sm">IA Recommandations</h3>
                  <p className="text-xs text-green-700">Suggestions personnalisées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Optimisation</h3>
                  <p className="text-xs text-blue-700">Amélioration d'annonces</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900 text-sm">Analyse Profil</h3>
                  <p className="text-xs text-purple-700">Évaluation 360°</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900 text-sm">Marché IA</h3>
                  <p className="text-xs text-orange-700">Tendances & opportunités</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="profile-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile-analysis" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Analyse Profil</span>
            <span className="sm:hidden">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="mission-optimizer" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Optimiseur Mission</span>
            <span className="sm:hidden">Mission</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Recommandations</span>
            <span className="sm:hidden">Reco</span>
          </TabsTrigger>
          <TabsTrigger value="market-analysis" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Marché</span>
            <span className="sm:hidden">Market</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span>Configuration du Profil Test</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Compétences</Label>
                    <Textarea
                      id="skills"
                      value={testProfile.skills}
                      onChange={(e) => setTestProfile({...testProfile, skills: e.target.value})}
                      placeholder="React, Node.js..."
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Spécialités</Label>
                    <Textarea
                      id="specialties"
                      value={testProfile.specialties}
                      onChange={(e) => setTestProfile({...testProfile, specialties: e.target.value})}
                      placeholder="E-commerce, Mobile..."
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Note moyenne</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      max="5"
                      value={testProfile.rating}
                      onChange={(e) => setTestProfile({...testProfile, rating: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projects">Projets terminés</Label>
                    <Input
                      id="projects"
                      type="number"
                      value={testProfile.completedProjects}
                      onChange={(e) => setTestProfile({...testProfile, completedProjects: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Taux horaire (€)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={testProfile.hourlyRate}
                      onChange={(e) => setTestProfile({...testProfile, hourlyRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={testProfile.location}
                      onChange={(e) => setTestProfile({...testProfile, location: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={runProfileAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyse IA en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Lancer l'Analyse IA Complète
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résultats de l'Analyse IA Avancée</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {analysisResult.overallScore}/100
                      </div>
                      <Progress value={analysisResult.overallScore} className="h-3 mb-4" />
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        <Gauge className="w-4 h-4 mr-1" />
                        Score global du profil
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Complétude</span>
                          <span className="text-sm font-medium">{analysisResult.profileCompleteness}%</span>
                        </div>
                        <Progress value={analysisResult.profileCompleteness} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Compétitivité</span>
                          <span className="text-sm font-medium">{analysisResult.competitiveness}%</span>
                        </div>
                        <Progress value={analysisResult.competitiveness} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Recommandations IA Prioritaires
                      </h4>
                      {analysisResult.recommendations.slice(0, 3).map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Demande Marché
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Demande actuelle:</span>
                          <Badge variant="secondary" className="ml-2">{analysisResult.marketDemand.currentDemand}</Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Croissance:</span>
                          <Badge variant="secondary" className="ml-2 text-green-700">{analysisResult.marketDemand.projectedGrowth}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Analyse IA Ready</p>
                    <p className="text-sm">Lancez une analyse pour découvrir les insights sur votre profil</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mission-optimizer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>Mission à Optimiser</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission-title">Titre de la mission</Label>
                    <Input
                      id="mission-title"
                      value={testMission.title}
                      onChange={(e) => setTestMission({...testMission, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mission-desc">Description</Label>
                    <Textarea
                      id="mission-desc"
                      value={testMission.description}
                      onChange={(e) => setTestMission({...testMission, description: e.target.value})}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (€)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={testMission.budget}
                        onChange={(e) => setTestMission({...testMission, budget: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée</Label>
                      <Input
                        id="duration"
                        value={testMission.duration}
                        onChange={(e) => setTestMission({...testMission, duration: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={runMissionOptimization} 
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Optimisation IA...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Optimiser avec l'IA
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résultats d'Optimisation IA</CardTitle>
              </CardHeader>
              <CardContent>
                {optimizationResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="text-sm text-gray-600">Score d'attractivité</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-500">{optimizationResult.originalScore}%</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-lg font-bold text-green-600">{optimizationResult.optimizedScore}%</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        +{optimizationResult.optimizedScore - optimizationResult.originalScore}%
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Améliorations Suggérées
                      </h4>
                      {optimizationResult.improvements.map((improvement: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Titre Optimisé:</h5>
                      <p className="text-sm font-medium">{optimizationResult.optimizedContent.title}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Optimiseur IA Ready</p>
                    <p className="text-sm">Optimisez votre annonce pour maximiser les candidatures</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-green-600" />
                <span>Moteur de Recommandations IA</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Mode Test
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationEngine 
                userProfile={{
                  id: 'test-user',
                  type: 'provider',
                  skills: testProfile.skills.split(', '),
                  rating: parseFloat(testProfile.rating),
                  completedProjects: parseInt(testProfile.completedProjects),
                  location: testProfile.location,
                  hourlyRate: parseInt(testProfile.hourlyRate)
                }}
                onRecommendationAction={(recommendation) => {
                  console.log('Action recommandation:', recommendation);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  <span>Analyse de Marché IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runMarketAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 mb-4"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyse marché...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analyser le Marché
                    </div>
                  )}
                </Button>

                {marketAnalysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(marketAnalysis.categoryTrends).map(([category, data]: [string, any]) => (
                        <div key={category} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Demande:</span>
                              <span className="font-medium">{data.demand}%</span>
                            </div>
                            <Progress value={data.demand} className="h-1" />
                            <div className="text-xs text-gray-600">
                              <span>{data.growth} | {data.avgBudget}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights & Opportunités</CardTitle>
              </CardHeader>
              <CardContent>
                {marketAnalysis ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {marketAnalysis.opportunityScore}/100
                      </div>
                      <Progress value={marketAnalysis.opportunityScore} className="h-3 mb-2" />
                      <Badge variant="secondary">Score d'Opportunité</Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Recommandations Marché
                      </h4>
                      {marketAnalysis.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Facteurs de Risque
                      </h4>
                      {marketAnalysis.riskFactors.map((risk: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Analyse de Marché IA</p>
                    <p className="text-sm">Découvrez les tendances et opportunités de votre secteur</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
