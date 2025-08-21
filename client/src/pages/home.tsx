import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { MissionWithBids } from '@shared/schema';
import { MissionCard } from '@/components/missions/mission-card';
import { MissionDetailModal } from '@/components/missions/mission-detail-modal';
import { CategorySelector } from '@/components/missions/category-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    budget: '',
  });
  const [selectedService, setSelectedService] = useState<'reverse-bidding' | 'direct-connection' | null>('reverse-bidding');

  const { data: missions = [] } = useQuery<MissionWithBids[]>({
    queryKey: ['/api/missions'],
  });

  const createMissionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/missions', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      toast({
        title: 'Mission créée !',
        description: 'Votre mission a été publiée avec succès',
      });
      setFormData({ description: '', location: '', budget: '' });
      setSelectedCategory('');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });

  const handleCreateMission = () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour créer une mission',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Description requise',
        description: 'Veuillez décrire votre besoin',
        variant: 'destructive',
      });
      return;
    }

    const title = formData.description.length > 50 
      ? formData.description.substring(0, 47) + '...' 
      : formData.description;

    createMissionMutation.mutate({
      title,
      description: formData.description,
      category: selectedCategory || 'other',
      budget: formData.budget || '0',
      location: formData.location || 'Non spécifié',
      clientId: user.id,
      clientName: user.name,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const recentMissions = missions.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Trouvez le{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            meilleur prix
          </span>
          <br />
          pour vos projets
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Décrivez votre besoin, recevez des offres de professionnels qualifiés,
          choisissez la meilleure proposition. Simple, rapide, efficace.
        </p>

        {/* Two Main Services */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
          <div 
            className={`rounded-2xl p-8 border ${selectedService === 'reverse-bidding' ? 'border-blue-500 shadow-lg' : 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'} cursor-pointer`}
            onClick={() => {
              setSelectedService('reverse-bidding');
              setSelectedCategory('');
            }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedService === 'reverse-bidding' ? 'bg-blue-500' : 'bg-blue-500'}`}>
              <span className="text-white text-2xl">💰</span>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${selectedService === 'reverse-bidding' ? 'text-blue-700' : 'text-gray-900'}`}>Appels d'offres inverses</h3>
            <p className="text-gray-700 leading-relaxed">
              Publiez votre projet et laissez les professionnels venir à vous avec leurs meilleures offres. 
              Comparez les prix, les délais et choisissez en toute transparence.
            </p>
          </div>
          <div 
            className={`rounded-2xl p-8 border ${selectedService === 'direct-connection' ? 'border-green-500 shadow-lg' : 'border-green-200 bg-gradient-to-br from-green-50 to-green-100'} cursor-pointer`}
            onClick={() => {
              setSelectedService('direct-connection');
              setSelectedCategory('');
            }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedService === 'direct-connection' ? 'bg-green-500' : 'bg-green-500'}`}>
              <span className="text-white text-2xl">🤝</span>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${selectedService === 'direct-connection' ? 'text-green-700' : 'text-gray-900'}`}>Mise en relation directe</h3>
            <p className="text-gray-700 leading-relaxed">
              Trouvez rapidement le bon professionnel pour votre besoin spécifique. 
              Contact direct, échange personnalisé et collaboration simplifiée.
            </p>
          </div>
        </div>
      </div>

      {/* Need Input Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Quel est votre besoin ?
        </h2>

        {/* Categories */}
        <div className="mb-8">
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            serviceType={selectedService}
          />
        </div>

        {/* Need Description */}
        <div className="space-y-4">
          <Textarea
            placeholder="Décrivez votre besoin en détail... (ex: Je recherche un développeur pour créer une application mobile de e-commerce)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="h-32 resize-none"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Localisation (optionnel)"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Budget estimé (€)"
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="flex-1"
            />
          </div>

          <Button
            onClick={handleCreateMission}
            disabled={createMissionMutation.isPending}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
          >
            {createMissionMutation.isPending ? 'Publication...' : 
             selectedService === 'direct-connection' ? 'Demander une mise en relation' : 'Publier mon appel d\'offres'}
          </Button>
        </div>
      </div>

      {/* Demo Missions */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Missions en cours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => setSelectedMissionId(mission.id)}
            />
          ))}
        </div>
        {missions.length > 6 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setLocation('/marketplace')}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold"
            >
              Voir toutes les missions
            </Button>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Comment ça marche ?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Décrivez votre projet</h3>
            <p className="text-gray-600">
              Expliquez en détail votre besoin, votre budget et vos contraintes. Plus c'est précis, mieux c'est !
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Recevez des offres</h3>
            <p className="text-gray-600">
              Les professionnels qualifiés vous envoient leurs propositions avec leurs tarifs et délais.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Choisissez le meilleur</h3>
            <p className="text-gray-600">
              Comparez les offres, consultez les profils et sélectionnez le professionnel qui vous convient.
            </p>
          </div>
        </div>
      </div>

      {/* Notre concept */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Notre concept
        </h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            AppelsPro révolutionne la mise en relation professionnelle en inversant le processus traditionnel. 
            Fini les recherches interminables et les devis sur-évalués !
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Pour les clients</h3>
              <p className="text-gray-600">
                Décrivez votre projet en quelques minutes et laissez les professionnels venir à vous. 
                Recevez plusieurs offres compétitives et choisissez celle qui vous convient le mieux.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Pour les prestataires</h3>
              <p className="text-gray-600">
                Accédez à de nouvelles opportunités business sans prospection. Concentrez-vous sur votre métier 
                et proposez vos services aux clients qui en ont vraiment besoin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Nos chiffres clés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{missions.length}+</div>
            <div className="text-gray-700 font-medium">Missions publiées</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {missions.reduce((acc, mission) => acc + mission.bids.length, 0)}+
            </div>
            <div className="text-gray-700 font-medium">Offres reçues</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-gray-700 font-medium">Délai moyen de réponse</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Questions fréquentes
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💰 Est-ce que le service est gratuit ?
            </h3>
            <p className="text-gray-600">
              Oui ! Publier un projet et recevoir des offres est entièrement gratuit pour les clients. 
              Les prestataires peuvent également consulter les projets gratuitement.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⏱️ Combien de temps pour recevoir des offres ?
            </h3>
            <p className="text-gray-600">
              En moyenne, vous recevrez vos premières offres dans les 24h. 
              Plus votre description est précise, plus les réponses seront rapides et pertinentes.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ✅ Comment vérifier la qualité des prestataires ?
            </h3>
            <p className="text-gray-600">
              Chaque prestataire dispose d'un profil avec ses réalisations passées, ses évaluations clients 
              et ses domaines d'expertise. Vous pouvez consulter ces informations avant de faire votre choix.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 Puis-je modifier mon projet après publication ?
            </h3>
            <p className="text-gray-600">
              Oui, vous pouvez modifier la description de votre projet à tout moment depuis votre tableau de bord. 
              Les prestataires seront notifiés des modifications importantes.
            </p>
          </div>
        </div>
      </div>

      <MissionDetailModal
        missionId={selectedMissionId}
        isOpen={!!selectedMissionId}
        onClose={() => setSelectedMissionId(null)}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-xl font-bold">AppelsPro</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La plateforme qui révolutionne la mise en relation professionnelle.
                Trouvez le meilleur prix pour vos projets ou développez votre activité.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:contact@appelspro.fr" className="text-gray-400 hover:text-white transition-colors">
                  📧 contact@appelspro.fr
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Tableau de bord</Link></li>
                <li><Link href="/missions" className="text-gray-400 hover:text-white transition-colors">Mes missions</Link></li>
              </ul>
            </div>

            {/* Informations légales */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
              <ul className="space-y-2">
                <li><Link href="/cgv" className="text-gray-400 hover:text-white transition-colors">CGV</Link></li>
                <li><Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/legal" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AppelsPro. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}