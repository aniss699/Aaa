import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Brain, Wand2, CheckCircle, AlertCircle, Loader2, Euro, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { paths } from '../routes/paths';
import { BriefEnhancer } from "@/components/ai/brief-enhancer";

interface MissionFormData {
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline_ts?: string;
  geo_required: boolean;
  onsite_radius_km?: number;
}

interface AISuggestion {
  title: string;
  summary: string;
  acceptance_criteria: string[];
  category_std: string;
  sub_category_std: string;
  skills_std: string[];
  tags_std: string[];
  brief_quality_score: number;
  richness_score: number;
  missing_info: Array<{ id: string; q: string }>;
  price_suggested_min: number;
  price_suggested_med: number;
  price_suggested_max: number;
  delay_suggested_days: number;
  loc_base: number;
  loc_uplift_reco: {
    new_budget: number;
    new_delay: number;
    delta_loc: number;
  };
  reasons: string[];
}

const CATEGORIES = [
  'développement',
  'design',
  'marketing',
  'conseil',
  'travaux',
  'services'
];

export default function CreateMission() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    category: '',
    budget_min: 1000,
    budget_max: 5000,
    geo_required: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [missingInfoAnswers, setMissingInfoAnswers] = useState<Record<string, string>>({});
  const [applySettings, setApplySettings] = useState({
    text: false,
    budget: '',
    delay: false
  });
  const [appliedPatches, setAppliedPatches] = useState({}); // State to track applied patches

  // Pré-remplissage depuis les paramètres URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const description = params.get('description');
    const budget = params.get('budget');

    if (title || description || budget) {
      setFormData(prev => ({
        ...prev,
        ...(title && { title }),
        ...(description && { description }),
        ...(budget && { budget_max: parseInt(budget) || prev.budget_max })
      }));
    }
  }, []);

  const handleInputChange = (field: keyof MissionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }

    if (formData.budget_min < 1000) {
      newErrors.budget_min = 'Le budget minimum doit être d\'au moins 1000€';
    }

    if (formData.budget_max < formData.budget_min) {
      newErrors.budget_max = 'Le budget maximum doit être supérieur au minimum';
    }

    if (formData.geo_required && (!formData.onsite_radius_km || formData.onsite_radius_km < 0)) {
      newErrors.onsite_radius_km = 'Veuillez spécifier le rayon d\'intervention';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAISuggestion = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir au moins le titre et la description pour obtenir des suggestions IA",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingAI(true);
    try {
      const response = await fetch('/api/ai/missions/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des suggestions');
      }

      const data = await response.json();
      setAiSuggestion(data.suggestion);

      toast({
        title: "Suggestions IA générées",
        description: "L'IA a analysé votre mission et propose des améliorations",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les suggestions IA",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiSuggestion) return;

    const updates: Partial<MissionFormData> = {};
    const currentAppliedPatches: Record<string, any> = {};

    if (applySettings.text) {
      updates.title = aiSuggestion.title;
      updates.description = aiSuggestion.summary;
      currentAppliedPatches['title'] = aiSuggestion.title;
      currentAppliedPatches['description'] = aiSuggestion.summary;
    }

    if (applySettings.budget && applySettings.budget !== '') {
      const budgetMap = {
        'min': aiSuggestion.price_suggested_min,
        'med': aiSuggestion.price_suggested_med,
        'max': aiSuggestion.price_suggested_max
      };
      const suggestedBudget = budgetMap[applySettings.budget as keyof typeof budgetMap];
      if (suggestedBudget) {
        updates.budget_min = Math.round(suggestedBudget * 0.8);
        updates.budget_max = suggestedBudget;
        currentAppliedPatches['budget_min'] = updates.budget_min;
        currentAppliedPatches['budget_max'] = updates.budget_max;
      }
    }

    if (applySettings.delay && aiSuggestion.delay_suggested_days) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + aiSuggestion.delay_suggested_days);
      updates.deadline_ts = deadline.toISOString().split('T')[0];
      currentAppliedPatches['deadline_ts'] = updates.deadline_ts;
    }

    setFormData(prev => ({ ...prev, ...updates }));
    setAppliedPatches(prev => ({ ...prev, ...currentAppliedPatches }));

    toast({
      title: "Suggestions appliquées",
      description: "Les suggestions IA ont été appliquées au formulaire",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Erreurs de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const idempotencyKey = `mission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const submissionData = {
        ...formData,
        missing_info_answers: missingInfoAnswers,
        applied_ai_suggestion: aiSuggestion ? {
          applied_settings: applySettings,
          suggestion: aiSuggestion,
          applied_patches: appliedPatches
        } : null
      };

      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          setErrors({ [data.field]: data.message });
          toast({
            title: "Erreur de validation",
            description: data.message,
            variant: "destructive"
          });
          return;
        }
        throw new Error(data.message || 'Erreur lors de la création');
      }

      toast({
        title: "Mission créée avec succès",
        description: `Mission "${formData.title}" créée et publiée`,
      });

      // Rediriger vers la liste des missions ou le détail si ID disponible
      if (data.id) {
        setLocation(paths.missionDetail(data.id));
      } else {
        setLocation(paths.missions);
      }

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la mission",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Créer une nouvelle mission</h1>
          <p className="text-gray-600 mt-2">Décrivez votre projet et obtenez des suggestions d'amélioration avec l'IA</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire principal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de la mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre de la mission *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Développement d'un site e-commerce"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez votre projet en détail..."
                      rows={6}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget_min">Budget minimum (€) *</Label>
                      <Input
                        id="budget_min"
                        type="number"
                        value={formData.budget_min}
                        onChange={(e) => handleInputChange('budget_min', parseInt(e.target.value) || 0)}
                        min="1000"
                        step="100"
                        className={errors.budget_min ? 'border-red-500' : ''}
                      />
                      {errors.budget_min && <p className="text-red-500 text-sm mt-1">{errors.budget_min}</p>}
                    </div>

                    <div>
                      <Label htmlFor="budget_max">Budget maximum (€) *</Label>
                      <Input
                        id="budget_max"
                        type="number"
                        value={formData.budget_max}
                        onChange={(e) => handleInputChange('budget_max', parseInt(e.target.value) || 0)}
                        min="1000"
                        step="100"
                        className={errors.budget_max ? 'border-red-500' : ''}
                      />
                      {errors.budget_max && <p className="text-red-500 text-sm mt-1">{errors.budget_max}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deadline">Échéance souhaitée</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline_ts || ''}
                      onChange={(e) => handleInputChange('deadline_ts', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="geo_required"
                      checked={formData.geo_required}
                      onCheckedChange={(checked) => handleInputChange('geo_required', checked)}
                    />
                    <Label htmlFor="geo_required">Intervention sur site requise</Label>
                  </div>

                  {formData.geo_required && (
                    <div>
                      <Label htmlFor="radius">Rayon d'intervention (km)</Label>
                      <Input
                        id="radius"
                        type="number"
                        value={formData.onsite_radius_km || ''}
                        onChange={(e) => handleInputChange('onsite_radius_km', parseInt(e.target.value) || 0)}
                        min="0"
                        placeholder="50"
                        className={errors.onsite_radius_km ? 'border-red-500' : ''}
                      />
                      {errors.onsite_radius_km && <p className="text-red-500 text-sm mt-1">{errors.onsite_radius_km}</p>}
                    </div>
                  )}

                  <Separator />

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAISuggestion}
                      disabled={isLoadingAI || !formData.title || !formData.description}
                      className="flex-1"
                    >
                      {isLoadingAI ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="mr-2 h-4 w-4" />
                      )}
                      Améliorer avec l'IA
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Créer la mission
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Panneau IA */}
          <div className="space-y-6">
            {aiSuggestion ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-blue-500" />
                    Suggestions IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scores de qualité */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getQualityColor(aiSuggestion.brief_quality_score)}`}>
                        {Math.round(aiSuggestion.brief_quality_score * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Qualité du brief</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-2xl font-bold ${getQualityColor(aiSuggestion.richness_score)}`}>
                        {Math.round(aiSuggestion.richness_score * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Richesse du contenu</div>
                    </div>
                  </div>

                  {/* Titre et résumé améliorés */}
                  <div>
                    <Label>Titre amélioré</Label>
                    <div className="p-3 bg-blue-50 rounded border">
                      {aiSuggestion.title}
                    </div>
                  </div>

                  <div>
                    <Label>Résumé structuré</Label>
                    <div className="p-3 bg-blue-50 rounded border text-sm">
                      {aiSuggestion.summary}
                    </div>
                  </div>

                  {/* Suggestions de prix */}
                  <div>
                    <Label>Suggestions de prix</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-700">{aiSuggestion.price_suggested_min}€</div>
                        <div className="text-xs text-green-600">Minimum</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">{aiSuggestion.price_suggested_med}€</div>
                        <div className="text-xs text-blue-600">Médian</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-700">{aiSuggestion.price_suggested_max}€</div>
                        <div className="text-xs text-orange-600">Maximum</div>
                      </div>
                    </div>
                  </div>

                  {/* Délai suggéré */}
                  <div>
                    <Label>Délai suggéré</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{aiSuggestion.delay_suggested_days} jours</span>
                    </div>
                  </div>

                  {/* Compétences identifiées */}
                  {aiSuggestion.skills_std.length > 0 && (
                    <div>
                      <Label>Compétences identifiées</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {aiSuggestion.skills_std.slice(0, 6).map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions manquantes */}
                  {aiSuggestion.missing_info.length > 0 && (
                    <div>
                      <Label>Questions pour améliorer le brief</Label>
                      <div className="space-y-2 mt-2">
                        {aiSuggestion.missing_info.slice(0, 3).map(info => (
                          <div key={info.id}>
                            <p className="text-sm text-gray-700">{info.q}</p>
                            <Input
                              placeholder="Votre réponse..."
                              value={missingInfoAnswers[info.id] || ''}
                              onChange={(e) => setMissingInfoAnswers(prev => ({
                                ...prev,
                                [info.id]: e.target.value
                              }))}
                              className="mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options d'application */}
                  <Separator />
                  <div>
                    <Label>Appliquer les suggestions</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="apply-text"
                          checked={applySettings.text}
                          onCheckedChange={(checked) => setApplySettings(prev => ({ ...prev, text: !!checked }))}
                        />
                        <Label htmlFor="apply-text" className="text-sm">Titre et résumé</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="apply-delay"
                          checked={applySettings.delay}
                          onCheckedChange={(checked) => setApplySettings(prev => ({ ...prev, delay: !!checked }))}
                        />
                        <Label htmlFor="apply-delay" className="text-sm">Délai suggéré</Label>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Budget suggéré</Label>
                        <Select
                          value={applySettings.budget}
                          onValueChange={(value) => setApplySettings(prev => ({ ...prev, budget: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Choisir un budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="min">Minimum ({aiSuggestion.price_suggested_min}€)</SelectItem>
                            <SelectItem value="med">Médian ({aiSuggestion.price_suggested_med}€)</SelectItem>
                            <SelectItem value="max">Maximum ({aiSuggestion.price_suggested_max}€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={applyAISuggestions}
                      className="w-full mt-4"
                      disabled={!applySettings.text && !applySettings.delay && !applySettings.budget}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Appliquer les suggestions
                    </Button>
                  </div>

                  {/* Raisons des suggestions */}
                  {aiSuggestion.reasons.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="text-sm">
                          <strong>Recommandations :</strong>
                          <ul className="list-disc list-inside mt-1">
                            {aiSuggestion.reasons.slice(0, 3).map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Description du projet
                  </CardTitle>
                  <CardDescription>
                    Décrivez précisément votre besoin pour attirer les bons prestataires
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    IA d'amélioration de mission
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Remplissez le titre et la description pour obtenir des suggestions d'amélioration personnalisées
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Réécriture et structuration automatique</li>
                    <li>• Suggestions de prix basées sur le marché</li>
                    <li>• Questions pour compléter le brief</li>
                    <li>• Estimation de délais réalistes</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analyse IA - Lazy loaded */}
          {(formData.title && formData.description && formData.description.length > 20) && (
            <React.Suspense fallback={<div>Chargement...</div>}>
              <BriefEnhancer 
                briefData={{
                  title: formData.title,
                  description: formData.description,
                  category: formData.category
                }}
                onEnhancementComplete={(enhancements) => {
                  console.log('Enhancements received:', enhancements);
                  // Optionnel : stocker pour usage ultérieur
                }}
              />
            </React.Suspense>
          )}

          {/* Détails du projet */}
        </div>
      </div>
    </div>
  );
}