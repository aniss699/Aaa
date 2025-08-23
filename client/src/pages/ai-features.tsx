import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Zap, TrendingUp, Settings } from 'lucide-react';
import SmartBidAnalyzer from '@/components/ai/smart-bid-analyzer';
import MissionMatchingEngine from '@/components/ai/mission-matching-engine';
// Importation du nouveau composant RevenuePredictor
import RevenuePredictor from '@/components/ai/revenue-predictor';

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

  // Données de test pour le prédicteur de revenus
  const testRevenueData = {
    currentRevenue: 150000,
    projectedRevenue: 200000,
    growthRate: "15%",
    factors: [
      { name: "Acquisition Client", value: 0.6 },
      { name: "Rétention Client", value: 0.3 },
      { name: "Expansion du Marché", value: 0.1 }
    ]
  };

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bid-analyzer" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Analyseur d'Offres</span>
          </TabsTrigger>
          <TabsTrigger value="matching-engine" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Moteur de Matching</span>
          </TabsTrigger>
          {/* Ajout du trigger pour le prédicteur de revenus */}
          <TabsTrigger value="revenue-predictor" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Prédicteur de Revenus</span>
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

        {/* Ajout du TabsContent pour le prédicteur de revenus */}
        <TabsContent value="revenue-predictor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Revenue Predictor - Test Mode</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Settings className="w-3 h-3 mr-1" />
                  Test Environment
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Données de Revenus Test</h4>
                  <p className="text-sm text-gray-600 mb-1"><strong>Revenu Actuel:</strong> {testRevenueData.currentRevenue}€</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Revenu Projeté:</strong> {testRevenueData.projectedRevenue}€</p>
                  <p className="text-sm text-gray-600"><strong>Taux de Croissance:</strong> {testRevenueData.growthRate}</p>
                </Card>

                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold mb-2">Facteurs de Croissance</h4>
                  {testRevenueData.factors.map((factor, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded">
                      <p className="text-sm font-medium">{factor.name}</p>
                      <p className="text-xs text-gray-600">Poids: {factor.value * 100}%</p>
                    </div>
                  ))}
                </Card>
              </div>

              <RevenuePredictor
                currentRevenue={testRevenueData.currentRevenue}
                projectedRevenue={testRevenueData.projectedRevenue}
                growthRate={testRevenueData.growthRate}
                factors={testRevenueData.factors}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}