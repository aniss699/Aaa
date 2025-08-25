import React, { useState, useEffect, useMemo } from 'react';
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
import { ArrowLeft, MapPin, Calendar, Euro, Tag, FileText, Zap, Brain, Wand2, Briefcase, MessageSquare, CheckCircle, AlertCircle, Sparkles, TrendingUp, Users, Target } from 'lucide-react';
import { MissionStandardizer } from '@/components/ai/mission-standardizer';
import { CategorySelector } from '@/components/missions/category-selector';
import { MarketHeatIndicator } from '@/components/ai/market-heat-indicator';
import { Progress } from '@/components/ui/progress';

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
}

export default function CreateMission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Récupérer les paramètres URL pour pré-remplir le formulaire
  useEffect(() => {
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
      if (description && description.length > 50) {
        setTimeout(() => {
          analyzeDescriptionWithAI(description);
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
  const [aiSuggestionText, setAiSuggestionText] = useState(''); // State for real-time AI suggestions
  const [showInlineAI, setShowInlineAI] = useState(false); // State to toggle inline AI analysis display

  // Get URL parameters for pre-filled data
  const urlParams = new URLSearchParams(window.location.search);
  
  const [formData, setFormData] = useState({
    title: urlParams.get('title') || '',
    description: urlParams.get('description') || '',
    category: urlParams.get('category') || '',
    budget: urlParams.get('budget') || '',
    location: urlParams.get('location') || '',
  });

  const [errors, setErrors] = useState({
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
    setErrors(prev => ({ ...prev, [field]: '' }));

    // Déclencher l'analyse IA automatique pour la description
    if (field === 'description' && value.length > 50) {
      debounceAIAnalysis(value);
    }
  };

  // Debounce pour éviter trop d'appels IA
  const debounceAIAnalysis = useMemo(
    () => debounce((description: string) => {
      if (description.length > 50) {
        analyzeDescriptionWithAI(description);
      }
    }, 2000),
    []
  );

  const analyzeDescriptionWithAI = async (description: string) => {
    try {
      const response = await fetch('/api/ai/quick-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          title: formData.title,
          category: formData.category
        })
      });

      if (response.ok) {
        const aiData = await response.json();
        setAiOptimization(aiData);

        // Suggestion automatique de prix si pas encore défini
        if (!formData.budget && aiData.price_suggested_med) {
          setAiSuggestionText(`💡 Budget suggéré par l'IA: ${aiData.price_suggested_med}€`);
        }
      }
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  const handleAiOptimizedDescription = (description: string) => {
    setAiOptimizedDescription(description);
    setFormData(prev => ({ ...prev, description: description }));
    setShowAIStandardizer(false);
    analyzeDescriptionWithAI(description); // Analyze after applying optimized description
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
      setAiOptimizedDescription(aiOptimization.optimizedDescription); // Update optimized description state
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
    toast({ title: 'Suggestions appliquées', description: 'Les champs ont été mis à jour avec les recommandations de l\'IA.' });
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/missions')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à mes missions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer une nouvelle mission</h1>
            <p className="text-lg text-gray-600">
              Décrivez votre projet pour recevoir des propositions de prestataires qualifiés
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Brain className="w-3 h-3 mr-1" />
            IA Active
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIStandardizer(true)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Optimiser avec l'IA
          </Button>
        </div>
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
                  <Label htmlFor="description" className="text-sm font-medium flex items-center justify-between">
                    Description détaillée *
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInlineAI(!showInlineAI)}
                      className="text-xs"
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      IA
                    </Button>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes techniques..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100"
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}

                  {/* Suggestions IA en temps réel */}
                  {aiSuggestionText && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-blue-800">{aiSuggestionText}</span>
                      </div>
                    </div>
                  )}

                  {/* Analyse IA en temps réel */}
                  {aiOptimization && formData.description.length > 50 && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-800 flex items-center">
                          <Brain className="w-4 h-4 mr-1" />
                          Analyse IA
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Score: {aiOptimization.brief_quality_score || 0}/100
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        {aiOptimization.price_suggested_med && (
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                            <span>Prix suggéré: {aiOptimization.price_suggested_med}€</span>
                          </div>
                        )}
                        {aiOptimization.delay_suggested_days && (
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-blue-600" />
                            <span>Délai: {aiOptimization.delay_suggested_days}j</span>
                          </div>
                        )}
                        {aiOptimization.market_insights?.estimated_providers_interested && (
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1 text-orange-600" />
                            <span>{aiOptimization.market_insights.estimated_providers_interested} prestataires</span>
                          </div>
                        )}
                        {aiOptimization.market_insights?.competition_level && (
                          <div className="flex items-center">
                            <Target className="w-3 h-3 mr-1 text-purple-600" />
                            <span>Concurrence: {aiOptimization.market_insights.competition_level}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applySuggestions()}
                          className="text-xs flex-1"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Appliquer les suggestions
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAIStandardizer(true)}
                          className="text-xs flex-1"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          Optimiser avec l'IA
                        </Button>
                      </div>
                    </div>
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

                  {/* Dynamic Fields */}
                  {aiOptimization.suggestedFields?.length > 0 && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-3">Champs suggérés pour améliorer votre annonce :</h4>
                      <div className="space-y-3">
                        {aiOptimization.suggestedFields.map((field, index) => (
                          <div key={index} className="space-y-2">
                            <Label className="text-sm font-medium text-purple-700">{field.label}</Label>
                            {field.type === 'select' && (
                              <Select>
                                <SelectTrigger className="bg-white border-purple-200">
                                  <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options.map((option, optIndex) => (
                                    <SelectItem key={optIndex} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {field.type === 'multiselect' && (
                              <div className="flex flex-wrap gap-2">
                                {field.options.map((option, optIndex) => (
                                  <Badge
                                    key={optIndex}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-purple-100 border-purple-300"
                                  >
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {field.type === 'text' && (
                              <Input
                                placeholder={field.placeholder}
                                className="bg-white border-purple-200"
                              />
                            )}
                            {field.type === 'number' && (
                              <Input
                                type="number"
                                placeholder={field.placeholder}
                                className="bg-white border-purple-200"
                              />
                            )}
                            {field.type === 'boolean' && (
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded border-purple-300" />
                                <span className="text-sm text-purple-700">Oui</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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
                        onClick={() => handleInputChange('description', aiOptimization.optimizedDescription)}
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
                    <Badge variant="outline" className="text-xs">
                      Score: {aiOptimization.brief_quality_score || 0}/100
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

                  {/* Dynamic Fields */}
                  {aiOptimization.suggestedFields?.length > 0 && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-3">Champs suggérés pour améliorer votre annonce :</h4>
                      <div className="space-y-3">
                        {aiOptimization.suggestedFields.map((field, index) => (
                          <div key={index} className="space-y-2">
                            <Label className="text-sm font-medium text-purple-700">{field.label}</Label>
                            {field.type === 'select' && (
                              <Select>
                                <SelectTrigger className="bg-white border-purple-200">
                                  <SelectValue placeholder={`Sélectionner ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options.map((option, optIndex) => (
                                    <SelectItem key={optIndex} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {field.type === 'multiselect' && (
                              <div className="flex flex-wrap gap-2">
                                {field.options.map((option, optIndex) => (
                                  <Badge
                                    key={optIndex}
                                    variant="outline"
                                    className="cursor-pointer hover:bg-purple-100 border-purple-300"
                                  >
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {field.type === 'text' && (
                              <Input
                                placeholder={field.placeholder}
                                className="bg-white border-purple-200"
                              />
                            )}
                            {field.type === 'number' && (
                              <Input
                                type="number"
                                placeholder={field.placeholder}
                                className="bg-white border-purple-200"
                              />
                            )}
                            {field.type === 'boolean' && (
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded border-purple-300" />
                                <span className="text-sm text-purple-700">Oui</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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
                        onClick={() => handleInputChange('description', aiOptimization.optimizedDescription)}
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