
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
import { Brain, TestTube, Zap, Target, TrendingUp, FileText, Settings, Play } from 'lucide-react';

export default function AITest() {
  const [testProfile, setTestProfile] = useState({
    skills: 'React, Node.js, TypeScript',
    rating: '4.2',
    completedProjects: '15',
    responseTime: '2.5',
    successRate: '0.85',
    hourlyRate: '45',
    location: 'Paris'
  });

  const [testMission, setTestMission] = useState({
    title: 'Développement d\'une application e-commerce',
    description: 'Nous recherchons un développeur React expérimenté pour créer une plateforme e-commerce moderne avec paiement intégré.',
    budget: '5000',
    category: 'web-development',
    urgency: 'medium'
  });

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runProfileAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    setTimeout(() => {
      setAnalysisResult({
        overallScore: 78,
        strengths: ['React Expert', 'Bonne Note', 'Réactif'],
        improvements: ['Plus de projets', 'Portfolio', 'Spécialisation'],
        recommendations: [
          'Augmenter le taux horaire à 55€',
          'Créer un portfolio en ligne',
          'Se spécialiser en e-commerce'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
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
            <p className="text-lg text-gray-600">Testez et expérimentez avec nos algorithmes d'intelligence artificielle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900 text-sm">Recommandations</h3>
                  <p className="text-xs text-green-700">Suggestions IA personnalisées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900 text-sm">Standardisation</h3>
                  <p className="text-xs text-blue-700">Optimisation d'annonces</p>
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
                  <p className="text-xs text-purple-700">Évaluation de performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900 text-sm">Environnement Test</h3>
                  <p className="text-xs text-orange-700">Mode bac à sable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Recommandations IA</span>
          </TabsTrigger>
          <TabsTrigger value="mission-optimizer" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Optimiseur d'Annonces</span>
          </TabsTrigger>
          <TabsTrigger value="profile-analysis" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Analyse de Profil</span>
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="mission-optimizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span>Optimiseur d'Annonces IA</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Mode Test
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MissionStandardizer 
                initialText={testMission.description}
                onOptimizedTextGenerated={(optimized) => {
                  console.log('Texte optimisé:', optimized);
                }}
                showApplyButton={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span>Profil à Analyser</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Compétences</Label>
                    <Input
                      id="skills"
                      value={testProfile.skills}
                      onChange={(e) => setTestProfile({...testProfile, skills: e.target.value})}
                      placeholder="React, Node.js..."
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
                </div>

                <Button 
                  onClick={runProfileAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyse en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Analyser le Profil
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résultats de l'Analyse IA</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {analysisResult.overallScore}/100
                      </div>
                      <Progress value={analysisResult.overallScore} className="h-3" />
                      <p className="text-sm text-gray-500 mt-2">Score global du profil</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-purple-700 mb-2">Recommandations IA</h4>
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Forces</h5>
                        {analysisResult.strengths.map((strength: string, index: number) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <h5 className="font-medium text-orange-700 mb-2">À améliorer</h5>
                        {analysisResult.improvements.map((improvement: string, index: number) => (
                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Lancez une analyse pour voir les résultats</p>
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
