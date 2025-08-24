import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, Calendar, Euro, Tag, FileText, Zap, Brain, Wand2 } from 'lucide-react';
import { MissionStandardizer } from '@/components/ai/mission-standardizer';
import { CategorySelector } from '@/components/missions/category-selector';
import { MarketHeatIndicator } from '@/components/ai/market-heat-indicator';

export default function CreateMission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [showAIStandardizer, setShowAIStandardizer] = useState(false);
  const [aiOptimizedDescription, setAiOptimizedDescription] = useState('');
  const [missionComplexity, setMissionComplexity] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [priceRecommendation, setPriceRecommendation] = useState<any>(null);

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
                </div>
              </CardContent>
            </Card>

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
      </Tabs>
    </div>
  );
}