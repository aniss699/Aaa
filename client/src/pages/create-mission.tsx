
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategorySelector } from '@/components/missions/category-selector';
import { ArrowLeft, MapPin, Euro, FileText, Tag } from 'lucide-react';

export default function CreateMission() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
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

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              Description détaillée *
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes techniques..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[120px] rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100"
              required
            />
          </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Euro className="w-4 h-4 text-green-500" />
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
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
      </div>
    </div>
  );
}
