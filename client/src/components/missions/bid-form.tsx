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
    <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Faire une offre</h4>

      {/* Guidelines for standardized proposals */}
      <div className="bg-white/60 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-200">
        <h5 className="font-medium text-gray-900 mb-2 flex items-center text-sm sm:text-base">
          ✨ Conseils pour une offre optimale
        </h5>
        <div className="text-xs sm:text-sm text-gray-700 space-y-1">
          <p>• <strong>Approche :</strong> Décrivez votre méthodologie de travail</p>
          <p>• <strong>Expérience :</strong> Mentionnez vos projets similaires</p>
          <p>• <strong>Livrables :</strong> Listez ce qui sera fourni</p>
          <p>• <strong>Garanties :</strong> Précisez vos engagements qualité</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2">
              Votre prix (€)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Ex: 2500"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="timeline" className="text-sm font-medium text-gray-700 mb-2">
              Délai de livraison
            </Label>
            <Input
              id="timeline"
              type="text"
              placeholder="Ex: 4 semaines"
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="proposal" className="text-sm font-medium text-gray-700 mb-2">
            Votre proposition détaillée
          </Label>
          <Textarea
            id="proposal"
            placeholder="Exemple : 
📋 Approche : Analyse du besoin puis développement en sprints
💼 Expérience : 5+ projets similaires (e-commerce, fintech)
📦 Livrables : Code source, documentation, formation
🔒 Garanties : 3 mois de maintenance incluse"
            value={formData.proposal}
            onChange={(e) => handleInputChange('proposal', e.target.value)}
            className="h-32 resize-none"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold"
          disabled={submitBid.isPending}
        >
          {submitBid.isPending ? 'Envoi en cours...' : 'Envoyer mon offre'}
        </Button>
      </form>
    </div>
  );
}