
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

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulation de l'analyse IA
    setTimeout(() => {
      const result = {
        matchScore: 87,
        winProbability: 73,
        recommendedPrice: 4200,
        confidence: 91,
        factors: {
          skillsMatch: 95,
          experienceMatch: 80,
          priceCompetitiveness: 85,
          locationMatch: 100
        },
        recommendations: [
          "Mettez en avant votre expertise React dans votre proposition",
          "Votre prix est compétitif, vous pouvez l'augmenter de 5%",
          "Ajoutez des exemples de projets e-commerce similaires",
          "Proposez un délai de livraison serré pour vous démarquer"
        ],
        strengths: [
          "Compétences parfaitement alignées",
          "Excellent taux de succès",
          "Localisation favorable",
          "Prix attractif"
        ],
        improvements: [
          "Temps de réponse à améliorer",
          "Portfolio à enrichir",
          "Certifications à ajouter"
        ]
      };
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateOptimizedDescription = () => {
    const optimized = `
**Projet : ${testMission.title}**

**Contexte :**
${testMission.description}

**Livrables attendus :**
• Interface utilisateur moderne et responsive
• Système de paiement sécurisé (Stripe/PayPal)
• Panel d'administration complet
• Gestion des stocks et commandes
• Tests unitaires et documentation

**Compétences requises :**
• React.js / TypeScript
• Node.js / Express
• Base de données (MongoDB/PostgreSQL)
• Intégration API de paiement
• Déploiement cloud

**Budget et délais :**
• Budget : ${testMission.budget}€
• Délai : 8-10 semaines
• Paiement en 3 tranches

**Critères de sélection :**
• Portfolio de projets similaires
• Méthode de travail agile
• Disponibilité et réactivité
• Références clients vérifiées
    `.trim();

    return optimized;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratoire IA</h1>
            <p className="text-lg text-gray-600">Testez et optimisez vos algorithmes d'intelligence artificielle</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="recommendation-test" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendation-test">Test Recommandations</TabsTrigger>
          <TabsTrigger value="mission-optimizer">Optimiseur d'Annonces</TabsTrigger>
          <TabsTrigger value="live-engine">Moteur en Direct</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendation-test" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration du test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration du Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profil Prestataire</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Compétences"
                      value={testProfile.skills}
                      onChange={(e) => setTestProfile({...testProfile, skills: e.target.value})}
                    />
                    <Input
                      placeholder="Note (/5)"
                      value={testProfile.rating}
                      onChange={(e) => setTestProfile({...testProfile, rating: e.target.value})}
                    />
                    <Input
                      placeholder="Projets terminés"
                      value={testProfile.completedProjects}
                      onChange={(e) => setTestProfile({...testProfile, completedProjects: e.target.value})}
                    />
                    <Input
                      placeholder="Taux horaire"
                      value={testProfile.hourlyRate}
                      onChange={(e) => setTestProfile({...testProfile, hourlyRate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mission Test</Label>
                  <Input
                    placeholder="Titre de la mission"
                    value={testMission.title}
                    onChange={(e) => setTestMission({...testMission, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Description"
                    value={testMission.description}
                    onChange={(e) => setTestMission({...testMission, description: e.target.value})}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Budget"
                      value={testMission.budget}
                      onChange={(e) => setTestMission({...testMission, budget: e.target.value})}
                    />
                    <Select value={testMission.urgency} onValueChange={(value) => setTestMission({...testMission, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Urgence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={runAnalysis} className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyse en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Lancer l'Analyse IA
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Résultats de l'analyse */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Résultats de l'Analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisResult ? (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Lancez une analyse pour voir les résultats</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analysisResult.matchScore}%</div>
                        <div className="text-sm text-blue-700">Score de Match</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analysisResult.winProbability}%</div>
                        <div className="text-sm text-green-700">Prob. de Gagner</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confiance de l'IA</span>
                        <span>{analysisResult.confidence}%</span>
                      </div>
                      <Progress value={analysisResult.confidence} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Recommandations
                      </h4>
                      {analysisResult.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-2"></div>
                          <span>{rec}</span>
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
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mission-optimizer" className="space-y-6">
          <MissionStandardizer />
        </TabsContent>

        <TabsContent value="live-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Moteur de Recommandation en Direct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationEngine userId="test-user" context="dashboard" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
