import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BidFormProps {
  missionId: string;
  onSuccess: () => void;
}

export function BidForm({ missionId, onSuccess }: BidFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    price: '',
    timeline: '',
    proposal: '',
  });

  const submitBid = useMutation({
    mutationFn: async (bidData: any) => {
      const response = await apiRequest('POST', '/api/bids', bidData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions', missionId] });
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      toast({
        title: 'Offre envoyée !',
        description: 'Votre offre a été envoyée avec succès',
      });
      setFormData({ price: '', timeline: '', proposal: '' });
      onSuccess();
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

    if (!formData.price || !formData.timeline || !formData.proposal) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour postuler',
        variant: 'destructive',
      });
      return;
    }

    submitBid.mutate({
      missionId,
      providerId: user.id,
      providerName: user.name,
      price: parseFloat(formData.price),
      timeline: formData.timeline,
      proposal: formData.proposal,
      rating: user.rating || '5.0',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.type !== 'provider') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">💼</span>
        </div>
        <h4 className="text-xl font-bold text-gray-900">Soumettre votre proposition</h4>
      </div>

      {/* Guidelines for standardized proposals */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-blue-200 shadow-sm">
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm mr-2">✨</span>
          Conseils pour une offre gagnante
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">🎯</span>
            <span><strong>Approche :</strong> Décrivez votre méthodologie</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 font-bold">🏆</span>
            <span><strong>Expérience :</strong> Mentionnez vos projets similaires</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-500 font-bold">📦</span>
            <span><strong>Livrables :</strong> Listez ce qui sera fourni</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">🔒</span>
            <span><strong>Garanties :</strong> Précisez vos engagements</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-green-500">💰</span>
              Votre prix (€)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Ex: 2500"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-100 px-4 py-3 text-lg font-semibold"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-blue-500">⏱️</span>
              Délai de livraison
            </Label>
            <Input
              id="timeline"
              type="text"
              placeholder="Ex: 4 semaines"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-100 px-4 py-3"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="proposal" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-purple-500">📝</span>
            Votre proposition détaillée
          </Label>
          <Textarea
            id="proposal"
            placeholder="✨ Rédigez une proposition convaincante :

🎯 Approche : Analyse du besoin puis développement en sprints agiles
💼 Expérience : 5+ projets similaires (e-commerce, fintech, SaaS)
📦 Livrables : Code source, documentation technique, formation utilisateur
🔒 Garanties : 3 mois de maintenance et support inclus
🚀 Bonus : Optimisations SEO et responsive design inclus"
            value={formData.proposal}
            onChange={(e) => handleInputChange('proposal', e.target.value)}
            className="min-h-[160px] rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-100"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          disabled={submitBid.isPending}
        >
          {submitBid.isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Envoi en cours...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>🚀</span>
              Envoyer ma proposition
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}