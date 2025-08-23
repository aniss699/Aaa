
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Zap, TrendingUp, Settings } from 'lucide-react';
import SmartBidAnalyzer from '@/components/ai/smart-bid-analyzer';
import MissionMatchingEngine from '@/components/ai/mission-matching-engine';

export default function AIFeatures() {
  // Données de test pour l'analyseur d'offres
  const testMission = {
    title: "Développement d'une application mobile e-commerce",
    description: "Nous recherchons un développeur expérimenté pour créer une application mobile de vente en ligne avec paiement intégré, gestion des stocks et interface administrateur.",
    budget: 8500,
    category: "mobile-development"
  };

  const testBid = {
    price: 7800,
    timeline: "12 semaines",
    proposal: "Bonjour, je peux développer votre application mobile avec React Native. J'ai 5 ans d'expérience et j'ai déjà réalisé plusieurs applications similaires."
  };

  const testProviderProfile = {
    rating: 4.6,
    completedProjects: 32,
    skills: ['React Native', 'Node.js', 'MongoDB', 'Stripe API', 'Firebase'],
    portfolio: []
  };

  // Données de test pour le matching engine
  const testProvider = {
    id: "test-provider",
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'MongoDB'],
    location: 'Paris',
    rating: 4.7,
    completedProjects: 28,
    portfolio: [],
    hourlyRate: 65,
    categories: ['web-development', 'mobile-development']
  };

  const testMissions = [
    {
      id: "mission1",
      title: "Site web e-commerce avec React",
      description: "Développement d'un site e-commerce moderne avec React et Node.js",
      budget: 5500,
      category: "web-development",
      location: "Paris",
      createdAt: new Date(),
      bids: []
    },
    {
      id: "mission2", 
      title: "Application mobile iOS/Android",
      description: "Création d'une app mobile native pour la gestion de tâches",
      budget: 12000,
      category: "mobile-development",
      location: "Lyon",
      createdAt: new Date(),
      bids: []
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fonctionnalités IA</h1>
            <p className="text-lg text-gray-600">Testez nos algorithmes propriétaires d'intelligence artificielle</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Smart Matching</h3>
                  <p className="text-sm text-purple-700">Algorithme de correspondance avancé</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Bid Analysis</h3>
                  <p className="text-sm text-blue-700">Analyse prédictive des offres</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Success Prediction</h3>
                  <p className="text-sm text-green-700">Prédiction de probabilité de succès</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="bid-analyzer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="bid-analyzer" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Analyseur d'Offres</span>
          </TabsTrigger>
          <TabsTrigger value="matching-engine" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Moteur de Matching</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bid-analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <span>Smart Bid Analyzer - Test Mode</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Test Environment
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Mission Test</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Titre:</strong> {testMission.title}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Budget:</strong> {testMission.budget}€</p>
                  <p className="text-sm text-gray-600"><strong>Catégorie:</strong> {testMission.category}</p>
                </Card>
                
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Votre Offre Test</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Prix:</strong> {testBid.price}€</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Délai:</strong> {testBid.timeline}</p>
                  <p className="text-sm text-gray-600"><strong>Proposition:</strong> {testBid.proposal.substring(0, 50)}...</p>
                </Card>
                
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Profil Prestataire</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Note:</strong> {testProviderProfile.rating}/5</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Projets:</strong> {testProviderProfile.completedProjects}</p>
                  <p className="text-sm text-gray-600"><strong>Compétences:</strong> {testProviderProfile.skills.slice(0, 3).join(', ')}</p>
                </Card>
              </div>
              
              <SmartBidAnalyzer
                missionTitle={testMission.title}
                missionDescription={testMission.description}
                missionBudget={testMission.budget}
                missionCategory={testMission.category}
                currentBid={testBid}
                providerProfile={testProviderProfile}
                competitorBids={[]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching-engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Mission Matching Engine - Test Mode</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Test Environment
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Profil Prestataire Test</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Compétences:</strong> {testProvider.skills.join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Localisation:</strong> {testProvider.location}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Note:</strong> {testProvider.rating}/5</p>
                  <p className="text-sm text-gray-600"><strong>Taux horaire:</strong> {testProvider.hourlyRate}€/h</p>
                </Card>
                
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Missions Disponibles</h4>
                  {testMissions.map((mission, index) => (
                    <div key={mission.id} className="mb-2 p-2 bg-white rounded">
                      <p className="text-sm font-medium">{mission.title}</p>
                      <p className="text-xs text-gray-600">{mission.budget}€ - {mission.category}</p>
                    </div>
                  ))}
                </Card>
              </div>
              
              <MissionMatchingEngine
                providerProfile={testProvider}
                missions={testMissions}
                onMissionRecommended={(mission) => {
                  console.log('Mission recommandée:', mission);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartBidAnalyzer } from '@/components/ai/smart-bid-analyzer';
import { MissionMatchingEngine } from '@/components/ai/mission-matching-engine';
import { Brain, Zap, Target, TrendingUp, Star, ChevronRight } from 'lucide-react';

export default function AIFeatures() {
  const [activeFeature, setActiveFeature] = useState<'analyzer' | 'matching' | null>(null);

  const features = [
    {
      id: 'analyzer',
      title: 'Smart Bid Analyzer',
      description: 'Analysez vos offres avec notre IA propriétaire',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      benefits: ['Optimisation automatique des prix', 'Analyse de la concurrence', 'Calcul de probabilité de succès']
    },
    {
      id: 'matching',
      title: 'Mission Matching Engine',
      description: 'Trouvez les missions parfaites pour votre profil',
      icon: Target,
      color: 'from-green-500 to-blue-500',
      benefits: ['Matching intelligent', 'Analyse sémantique', 'Recommandations personnalisées']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-6">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">Powered by AI</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fonctionnalités IA
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez nos algorithmes d'intelligence artificielle propriétaires qui révolutionnent 
          la façon dont vous trouvez et remportez des missions
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                <p className="text-gray-600">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 transition-all`}
                  onClick={() => setActiveFeature(feature.id as 'analyzer' | 'matching')}
                >
                  Tester maintenant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Démonstration des algorithmes */}
      {activeFeature === 'analyzer' && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Bid Analyzer</h2>
            <p className="text-gray-600">Testez notre algorithme d'analyse d'offres avec des données d'exemple</p>
          </div>
          <SmartBidAnalyzer />
        </div>
      )}

      {activeFeature === 'matching' && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission Matching Engine</h2>
            <p className="text-gray-600">Découvrez comment notre IA trouve les missions parfaites pour vous</p>
          </div>
          <MissionMatchingEngine />
        </div>
      )}

      {/* Statistiques */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Performances de nos algorithmes</h2>
          <p className="text-blue-200">Des résultats mesurés et prouvés</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">+47%</div>
            <div className="text-blue-200">Taux de réussite des offres</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">-32%</div>
            <div className="text-blue-200">Temps de recherche</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">+28%</div>
            <div className="text-blue-200">Revenus moyens</div>
          </div>
        </div>
      </div>
    </div>
  );
}
