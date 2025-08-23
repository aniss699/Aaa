
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, TrendingUp, Brain, Zap, Target } from 'lucide-react';
import { aiService, AIAnalysisResult, PriceRecommendation, MatchingResult } from '@/services/aiService';

export default function AITest() {
  const [bidAnalysis, setBidAnalysis] = useState<AIAnalysisResult | null>(null);
  const [priceRecommendation, setPriceRecommendation] = useState<PriceRecommendation | null>(null);
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [abuseDetection, setAbuseDetection] = useState<any>(null);
  const [missionOptimization, setMissionOptimization] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Test data
  const [testBid, setTestBid] = useState({
    price: 1500,
    timeline: 14,
    provider: {
      name: 'Jean Dupont',
      rating: 4.8,
      completedProjects: 25,
      specialties: ['React', 'Node.js', 'TypeScript']
    },
    mission: {
      title: 'Développement d\'une application e-commerce',
      category: 'développement-web',
      complexity: 7,
      estimatedHours: 40,
      isUrgent: false
    }
  });

  const [missionText, setMissionText] = useState(
    "Je cherche un développeur pour créer un site web. Il faut que ce soit bien fait et pas cher. Contactez-moi pour plus d'infos."
  );

  const runBidAnalysis = async () => {
    setLoading(true);
    try {
      const result = await aiService.analyzeBid(testBid);
      setBidAnalysis(result);
    } catch (error) {
      console.error('Erreur analyse offre:', error);
    }
    setLoading(false);
  };

  const runPriceRecommendation = async () => {
    setLoading(true);
    try {
      const result = await aiService.recommendPrice(testBid.mission);
      setPriceRecommendation(result);
    } catch (error) {
      console.error('Erreur recommandation prix:', error);
    }
    setLoading(false);
  };

  const runMatchingAnalysis = async () => {
    setLoading(true);
    try {
      const result = await aiService.matchMissionToProvider(testBid.mission, testBid.provider);
      setMatchingResult(result);
    } catch (error) {
      console.error('Erreur matching:', error);
    }
    setLoading(false);
  };

  const runAbuseDetection = async () => {
    setLoading(true);
    try {
      const result = await aiService.detectAbusePattern(testBid);
      setAbuseDetection(result);
    } catch (error) {
      console.error('Erreur détection abus:', error);
    }
    setLoading(false);
  };

  const runMissionOptimization = async () => {
    setLoading(true);
    try {
      const result = await aiService.optimizeMissionDescription(missionText);
      setMissionOptimization(result);
    } catch (error) {
      console.error('Erreur optimisation:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-blue-600" />
            Test du Moteur IA
          </h1>
          <p className="text-xl text-gray-600">
            Interface de test pour toutes les fonctionnalités d'intelligence artificielle
          </p>
        </div>

        <Tabs defaultValue="bid-analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bid-analysis">Analyse Offres</TabsTrigger>
            <TabsTrigger value="price-recommendation">Prix IA</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="abuse-detection">Anti-Abus</TabsTrigger>
            <TabsTrigger value="optimization">Optimisation</TabsTrigger>
          </TabsList>

          {/* Analyse des offres */}
          <TabsContent value="bid-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-600" />
                  Analyse Intelligente des Offres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix proposé (€)</label>
                    <Input
                      type="number"
                      value={testBid.price}
                      onChange={(e) => setTestBid({ ...testBid, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Délai (jours)</label>
                    <Input
                      type="number"
                      value={testBid.timeline}
                      onChange={(e) => setTestBid({ ...testBid, timeline: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <Button onClick={runBidAnalysis} disabled={loading} className="w-full">
                  {loading ? 'Analyse en cours...' : 'Analyser l\'offre'}
                </Button>

                {bidAnalysis && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Score global</span>
                      <Badge variant={bidAnalysis.score > 75 ? 'default' : bidAnalysis.score > 50 ? 'secondary' : 'destructive'}>
                        {bidAnalysis.score}/100
                      </Badge>
                    </div>
                    
                    <Progress value={bidAnalysis.score} className="w-full" />
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recommandations :</h4>
                      <ul className="space-y-1">
                        {bidAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Insights :</h4>
                      <ul className="space-y-1">
                        {bidAnalysis.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start">
                            <Zap className="w-4 h-4 mr-2 text-blue-500 mt-0.5" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Confiance : </span>
                      <Badge variant="outline" className="ml-2">
                        {bidAnalysis.confidence}%
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommandation de prix */}
          <TabsContent value="price-recommendation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                  Recommandation de Prix IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runPriceRecommendation} disabled={loading} className="w-full">
                  {loading ? 'Calcul en cours...' : 'Calculer le prix optimal'}
                </Button>

                {priceRecommendation && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {priceRecommendation.suggestedPrice}€
                      </div>
                      <div className="text-sm text-gray-600">Prix suggéré</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-green-600">
                          {priceRecommendation.priceRange.min}€
                        </div>
                        <div className="text-xs text-gray-600">Minimum</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-red-600">
                          {priceRecommendation.priceRange.max}€
                        </div>
                        <div className="text-xs text-gray-600">Maximum</div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Analyse :</h4>
                      <p className="text-sm">{priceRecommendation.reasoning}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Marché :</h4>
                      <p className="text-sm">{priceRecommendation.marketAnalysis}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matching */}
          <TabsContent value="matching">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-purple-600" />
                  Matching Mission/Prestataire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runMatchingAnalysis} disabled={loading} className="w-full">
                  {loading ? 'Analyse en cours...' : 'Analyser la compatibilité'}
                </Button>

                {matchingResult && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {matchingResult.score}/100
                        </div>
                        <div className="text-sm text-gray-600">Score global</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {matchingResult.compatibility}%
                        </div>
                        <div className="text-sm text-gray-600">Compatibilité</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Points forts :</h4>
                        <ul className="space-y-1">
                          {matchingResult.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-amber-600 mb-2">Points d'attention :</h4>
                        <ul className="space-y-1">
                          {matchingResult.concerns.map((concern, idx) => (
                            <li key={idx} className="flex items-start">
                              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500 mt-0.5" />
                              <span className="text-sm">{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Détection d'abus */}
          <TabsContent value="abuse-detection">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                  Détection d'Abus et Anti-Dumping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runAbuseDetection} disabled={loading} className="w-full">
                  {loading ? 'Analyse en cours...' : 'Détecter les abus'}
                </Button>

                {abuseDetection && (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-lg ${
                      abuseDetection.isAbusive 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center">
                        {abuseDetection.isAbusive ? (
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        )}
                        <span className="font-semibold">
                          {abuseDetection.isAbusive ? 'Comportement suspect détecté' : 'Aucun abus détecté'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Niveau de risque :</span>
                      <Badge variant={
                        abuseDetection.riskLevel === 'high' ? 'destructive' :
                        abuseDetection.riskLevel === 'medium' ? 'secondary' : 'default'
                      }>
                        {abuseDetection.riskLevel === 'high' ? 'Élevé' :
                         abuseDetection.riskLevel === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                    </div>

                    {abuseDetection.reasons.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Raisons :</h4>
                        <ul className="space-y-1">
                          {abuseDetection.reasons.map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                              <span className="text-sm">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimisation */}
          <TabsContent value="optimization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                  Optimisation d'Annonces
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Description de mission à optimiser :</label>
                  <Textarea
                    value={missionText}
                    onChange={(e) => setMissionText(e.target.value)}
                    rows={4}
                    placeholder="Décrivez votre mission..."
                  />
                </div>

                <Button onClick={runMissionOptimization} disabled={loading} className="w-full">
                  {loading ? 'Optimisation en cours...' : 'Optimiser la description'}
                </Button>

                {missionOptimization && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Score SEO :</span>
                      <Badge variant={missionOptimization.seoScore > 75 ? 'default' : 'secondary'}>
                        {missionOptimization.seoScore}/100
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Texte optimisé :</h4>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm">{missionOptimization.optimizedText}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Améliorations suggérées :</h4>
                      <ul className="space-y-1">
                        {missionOptimization.improvements.map((improvement: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <Zap className="w-4 h-4 mr-2 text-yellow-500 mt-0.5" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
