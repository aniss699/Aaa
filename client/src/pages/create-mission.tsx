import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Euro, Tag, FileText, Zap, Brain, Wand2, Briefcase, MessageSquare } from 'lucide-react';
import { MissionStandardizer } from '@/components/ai/mission-standardizer';
import { CategorySelector } from '@/components/missions/category-selector';
import { MarketHeatIndicator } from '@/components/ai/market-heat-indicator';
import { Progress } from '@/components/ui/progress';

export default function CreateMission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Récupérer les paramètres URL pour pré-remplir le formulaire
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const description = params.get('description');
    const budget = params.get('budget');

    if (title || description || budget) {
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        description: description || prev.description,
        budget: budget || prev.budget
      }));

      // Si on a une description, lancer automatiquement l'analyse IA
      if (description) {
        setTimeout(() => {
          analyzeBriefWithAI();
        }, 500);
      }
    }
  }, []);

  const [showAIStandardizer, setShowAIStandardizer] = useState(false);
  const [aiOptimizedDescription, setAiOptimizedDescription] = useState('');
  const [missionComplexity, setMissionComplexity] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceRecommendation, setPriceRecommendation] = useState<any>(null);
  const [aiOptimization, setAiOptimization] = useState<any>(null); // State to hold AI optimization results

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
  });

  const createMission = useMutation({
    mutationFn: async (missionData: any) => {
      const response = await apiRequest('POST', '/api/missions', missionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      toast({
        title: 'Mission créée !',
        description: 'Votre mission a été publiée avec succès',
      });
      setLocation('/missions');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour créer une mission',
        variant: 'destructive',
      });
      return;
    }

    createMission.mutate({
      ...formData,
      clientId: user.id,
      clientName: user.name,
      budget: parseFloat(formData.budget),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setPriceRecommendation(null); // Clear recommendations when relevant fields change
    setAiOptimization(null); // Clear AI optimization when relevant fields change
  };

  const handleAiOptimizedDescription = (description: string) => {
    setAiOptimizedDescription(description);
    setFormData(prev => ({ ...prev, description: description }));
    setShowAIStandardizer(false);
  };

  const analyzePricing = async () => {
    if (!formData.category || !formData.description) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez remplir la catégorie et la description avant l\'analyse',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setPriceRecommendation(null);
    try {
      const response = await fetch('/api/ai/price-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          description: formData.description,
          location: formData.location,
          complexity: missionComplexity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPriceRecommendation(data);
      } else {
        throw new Error('Erreur lors de l\'analyse de prix');
      }
    } catch (error: any) {
      toast({
        title: 'Erreur d\'analyse',
        description: error.message || 'Impossible d\'analyser le prix',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to trigger AI analysis of the mission brief
  const analyzeBriefWithAI = async () => {
    if (!formData.description) {
      toast({
        title: 'Description manquante',
        description: 'Veuillez fournir une description pour l\'analyse IA',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true); // Reusing isAnalyzing for AI brief analysis as well
    setAiOptimization(null);
    try {
      const response = await fetch('/api/ai/brief-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          category: formData.category, // Include category if available
          title: formData.title, // Include title if available
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiOptimization(data);
      } else {
        throw new Error('Erreur lors de l\'analyse du brief par l\'IA');
      }
    } catch (error: any) {
      toast({
        title: 'Erreur IA',
        description: error.message || 'Impossible d\'analyser le brief',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to apply AI suggestions to the form data
  const applySuggestions = () => {
    if (!aiOptimization) return;

    if (aiOptimization.optimizedDescription) {
      setFormData(prev => ({ ...prev, description: aiOptimization.optimizedDescription }));
    }
    if (aiOptimization.estimatedComplexity) {
      setMissionComplexity(aiOptimization.estimatedComplexity);
    }
    if (aiOptimization.marketInsights?.suggestedBudgetRange) {
      // For simplicity, let's set the budget to the average of the suggested range
      const avgBudget = (aiOptimization.marketInsights.suggestedBudgetRange.min + aiOptimization.marketInsights.suggestedBudgetRange.max) / 2;
      setFormData(prev => ({ ...prev, budget: avgBudget.toString() }));
    }
    // You can add more fields to update based on AI optimization results
  };


  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour créer une mission</p>
          <Button onClick={() => setLocation('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => setLocation('/missions')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes missions
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer une nouvelle mission</h1>
        <p className="text-lg text-gray-600">
          Décrivez votre projet pour recevoir des propositions de prestataires qualifiés
        </p>
      </div>

      {showAIStandardizer && (
        <MissionStandardizer
          initialDescription={formData.description}
          onClose={() => setShowAIStandardizer(false)}
          onOptimize={handleAiOptimizedDescription}
        />
      )}

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Création Manuelle
          </TabsTrigger>
          <TabsTrigger value="ai-assisted" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Assistée par IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Mission Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations de la mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Titre de la mission *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ex: Développement d'une application mobile"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-100 px-4 py-3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      Description détaillée *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAIStandardizer(true)}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Optimiser avec l'IA
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes techniques..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100"
                    required
                  />
                  {aiOptimizedDescription && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      ✨ Optimisé par l'IA
                    </Badge>
                  )}
                  <p className="text-sm text-gray-500">
                    Plus votre description est détaillée, plus vous recevrez des propositions pertinentes.
                  </p>
                  {/* Button to trigger AI analysis of the brief */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={analyzeBriefWithAI}
                    disabled={isAnalyzing}
                    className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Analyse IA...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyser mon brief
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Optimization Results */}
            {aiOptimization && (
              <Card className="mt-4 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-blue-900">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse IA de votre annonce
                    </div>
                    <Badge variant={aiOptimization.qualityScore > 80 ? "default" : "secondary"}>
                      {aiOptimization.qualityScore}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Qualité globale</span>
                      <span>{aiOptimization.qualityScore}%</span>
                    </div>
                    <Progress value={aiOptimization.qualityScore} className="h-2" />
                  </div>

                  {/* Compétences détectées */}
                  {aiOptimization.detectedSkills && aiOptimization.detectedSkills.length > 0 && (
                    <div>
                      <strong className="text-sm text-blue-900">🎯 Compétences détectées:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiOptimization.detectedSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complexité estimée */}
                  {aiOptimization.estimatedComplexity && (
                    <div>
                      <strong className="text-sm text-blue-900">📊 Complexité estimée:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={aiOptimization.estimatedComplexity * 10} className="flex-1 h-2" />
                        <span className="text-sm">{aiOptimization.estimatedComplexity}/10</span>
                      </div>
                    </div>
                  )}

                  {/* Insights marché */}
                  {aiOptimization.marketInsights && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-white/50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-600">Demande</div>
                        <div className="font-medium capitalize">{aiOptimization.marketInsights.demandLevel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Concurrence</div>
                        <div className="font-medium capitalize">{aiOptimization.marketInsights.competitionLevel}</div>
                      </div>
                      {aiOptimization.marketInsights.suggestedBudgetRange && (
                        <div className="col-span-2">
                          <div className="text-xs text-gray-600">Budget suggéré</div>
                          <div className="font-medium">
                            {aiOptimization.marketInsights.suggestedBudgetRange.min}€ - {aiOptimization.marketInsights.suggestedBudgetRange.max}€
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Améliorations suggérées */}
                  {aiOptimization.improvements && aiOptimization.improvements.length > 0 && (
                    <div>
                      <strong className="text-sm text-blue-900">💡 Améliorations suggérées:</strong>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        {aiOptimization.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-blue-800">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applySuggestions}
                      className="bg-white/80"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Appliquer les suggestions
                    </Button>

                    {aiOptimization.optimizedDescription && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({...formData, description: aiOptimization.optimizedDescription})}
                        className="bg-white/80"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Utiliser la version optimisée
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                Catégorie *
              </Label>
              <CategorySelector
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
              />
            </div>

            {/* Budget and Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-green-500" />
                    Budget & Localisation
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={analyzePricing}
                    disabled={isAnalyzing}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        Analyse...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyser Prix IA
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-semibold text-gray-800">
                      Budget (€) *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Ex: 5000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100 px-4 py-3"
                      required
                    />

                    {priceRecommendation && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">💡 Recommandation IA</h5>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Prix suggéré:</strong> {priceRecommendation.suggestedPrice}€
                        </p>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Fourchette:</strong> {priceRecommendation.priceRange?.min}€ - {priceRecommendation.priceRange?.max}€
                        </p>
                        <p className="text-xs text-green-600">
                          {priceRecommendation.reasoning}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Complexité estimée: {missionComplexity}/10
                      </Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={missionComplexity}
                        onChange={(e) => setMissionComplexity(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Simple</span>
                        <span>Complexe</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-800">
                      Localisation
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Ex: Paris, France"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-100 px-4 py-3"
                    />
                  </div>
                </div>

                {/* Market Heat Indicator */}
                {formData.category && (
                  <div className="mt-4">
                    <MarketHeatIndicator category={formData.category} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={createMission.isPending}
              >
                {createMission.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </div>
                ) : (
                  'Publier la mission'
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="ai-assisted">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Création de mission assistée par IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la mission</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Développement d'un site e-commerce"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée (optimisée par IA)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre projet en détail, les technologies souhaitées, les fonctionnalités attendues..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    La description a été générée ou améliorée par notre IA. Vous pouvez la modifier si nécessaire.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Optimization Results */}
            {aiOptimization && (
              <Card className="mt-4 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-blue-900">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse IA de votre annonce
                    </div>
                    <Badge variant={aiOptimization.qualityScore > 80 ? "default" : "secondary"}>
                      {aiOptimization.qualityScore}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Qualité globale</span>
                      <span>{aiOptimization.qualityScore}%</span>
                    </div>
                    <Progress value={aiOptimization.qualityScore} className="h-2" />
                  </div>

                  {/* Compétences détectées */}
                  {aiOptimization.detectedSkills && aiOptimization.detectedSkills.length > 0 && (
                    <div>
                      <strong className="text-sm text-blue-900">🎯 Compétences détectées:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiOptimization.detectedSkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complexité estimée */}
                  {aiOptimization.estimatedComplexity && (
                    <div>
                      <strong className="text-sm text-blue-900">📊 Complexité estimée:</strong>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={aiOptimization.estimatedComplexity * 10} className="flex-1 h-2" />
                        <span className="text-sm">{aiOptimization.estimatedComplexity}/10</span>
                      </div>
                    </div>
                  )}

                  {/* Insights marché */}
                  {aiOptimization.marketInsights && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-white/50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-600">Demande</div>
                        <div className="font-medium capitalize">{aiOptimization.marketInsights.demandLevel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Concurrence</div>
                        <div className="font-medium capitalize">{aiOptimization.marketInsights.competitionLevel}</div>
                      </div>
                      {aiOptimization.marketInsights.suggestedBudgetRange && (
                        <div className="col-span-2">
                          <div className="text-xs text-gray-600">Budget suggéré</div>
                          <div className="font-medium">
                            {aiOptimization.marketInsights.suggestedBudgetRange.min}€ - {aiOptimization.marketInsights.suggestedBudgetRange.max}€
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Améliorations suggérées */}
                  {aiOptimization.improvements && aiOptimization.improvements.length > 0 && (
                    <div>
                      <strong className="text-sm text-blue-900">💡 Améliorations suggérées:</strong>
                      <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        {aiOptimization.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-blue-800">{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applySuggestions}
                      className="bg-white/80"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Appliquer les suggestions
                    </Button>

                    {aiOptimization.optimizedDescription && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({...formData, description: aiOptimization.optimizedDescription})}
                        className="bg-white/80"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Utiliser la version optimisée
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                Catégorie *
              </Label>
              <CategorySelector
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
              />
            </div>

            {/* Budget and Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-green-500" />
                    Budget & Localisation
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={analyzePricing}
                    disabled={isAnalyzing}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        Analyse...
                      </div>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyser Prix IA
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-semibold text-gray-800">
                      Budget (€) *
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Ex: 5000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100 px-4 py-3"
                      required
                    />

                    {priceRecommendation && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">💡 Recommandation IA</h5>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Prix suggéré:</strong> {priceRecommendation.suggestedPrice}€
                        </p>
                        <p className="text-sm text-green-700 mb-2">
                          <strong>Fourchette:</strong> {priceRecommendation.priceRange?.min}€ - {priceRecommendation.priceRange?.max}€
                        </p>
                        <p className="text-xs text-green-600">
                          {priceRecommendation.reasoning}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Complexité estimée: {missionComplexity}/10
                      </Label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={missionComplexity}
                        onChange={(e) => setMissionComplexity(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Simple</span>
                        <span>Complexe</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-800">
                      Localisation
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Ex: Paris, France"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-100 px-4 py-3"
                    />
                  </div>
                </div>

                {/* Market Heat Indicator */}
                {formData.category && (
                  <div className="mt-4">
                    <MarketHeatIndicator
                      category={formData.category}
                      location={formData.location}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={createMission.isPending}
              >
                {createMission.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </div>
                ) : (
                  'Publier la mission'
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}