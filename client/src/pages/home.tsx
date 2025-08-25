import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { MissionWithBids } from '@shared/schema';
import { MissionCard } from '@/components/missions/mission-card';
import { MissionDetailModal } from '@/components/missions/mission-detail-modal';
import { CategorySelector } from '@/components/missions/category-selector';
import { QuickMissionCreator } from '@/components/missions/quick-mission-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Star, Users, CheckCircle, Zap, Globe, Shield, TrendingUp, Search, PlusCircle, Brain, Wand2, MessageSquare, Clock } from 'lucide-react';

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
  const [showMissionForm, setShowMissionForm] = useState(false);

  // State for quick mission creation form
  const [quickMission, setQuickMission] = useState({
    title: '',
    description: '',
    budget: ''
  });


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
      setShowMissionForm(false);
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
    setQuickMission(prev => ({ ...prev, [field]: value }));
  };

  const recentMissions = missions.slice(0, 6);

  // Dummy AI analysis function and state for demonstration
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeWithAI = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAiAnalysis("Analyse IA: Le projet semble bien défini. Considérer l'ajout d'un budget détaillé.");
      setIsAnalyzing(false);
    }, 2000);
  };

  // Handler for the quick mission submission
  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour créer une mission',
        variant: 'destructive',
      });
      return;
    }

    if (!quickMission.title || !quickMission.description) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et la description',
        variant: 'destructive',
      });
      return;
    }

    // Rediriger vers la page de création avec les données préremplies
    const params = new URLSearchParams({
      title: quickMission.title,
      description: quickMission.description,
      budget: quickMission.budget
    });
    setLocation(`/create-mission?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSelectedService('reverse-bidding')}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedService === 'reverse-bidding'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                👨‍💼 Je suis client
              </button>
              <button
                onClick={() => setSelectedService('direct-connection')}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedService === 'direct-connection'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                🛠️ Je suis prestataire
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section avec animations */}
        <div className="text-center mb-12 sm:mb-16 relative px-2 sm:px-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
              {selectedService === 'reverse-bidding' ? (
                <>
                  <span className="text-gray-900">Trouvez le </span>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    prestataire idéal
                  </span>
                  <br />
                  <span className="text-gray-900">pour vos projets</span>
                </>
              ) : (
                <>
                  <span className="text-gray-900">Développez </span>
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    votre activité
                  </span>
                  <br />
                  <span className="text-gray-900">en tant que pro</span>
                </>
              )}
            </h1>
            <p className="text-base sm:text-xl text-gray-700 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-delay px-4 sm:px-0">
              {selectedService === 'reverse-bidding' ? (
                <>
                  🚀 AppelsPro révolutionne la mise en relation entre clients et prestataires. 
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>Publiez votre projet et recevez des devis personnalisés en quelques heures.
                </>
              ) : (
                <>
                  💼 Accédez à de nouvelles opportunités business sans prospection.
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>Répondez aux appels d'offres qui correspondent à vos compétences.
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-delay-2 text-sm sm:text-base">
              <div className="flex items-center text-green-600 font-semibold">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                1,247+ projets réalisés
              </div>
              <div className="flex items-center text-blue-600 font-semibold">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                98% de satisfaction client
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                    <Link href="/missions">
                      Découvrir les missions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/create-mission">
                      Poster une mission
                    </Link>
                  </Button>
              </div>
          </div>
        </div>

        {/* Service Types avec design amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0">
          <Card 
            className={`p-4 sm:p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl cursor-pointer ${
              selectedService === 'reverse-bidding' 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 ring-2 ring-blue-400' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100'
            }`}
            onClick={() => setSelectedService('reverse-bidding')}
          >
            <div className="text-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg transform transition-all duration-300 ${
                selectedService === 'reverse-bidding' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 rotate-0' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 rotate-3 hover:rotate-0'
              }`}>
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Appels d'offres</h3>
              <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                🎯 Décrivez votre projet et laissez les prestataires vous proposer leurs services. 
                Comparez les offres et choisissez la meilleure.
              </p>
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl shadow-inner">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" />
                    <span className="hidden sm:inline">Réponse sous 2h</span>
                    <span className="sm:hidden">2h</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
                    <span className="hidden sm:inline">+50 prestataires</span>
                    <span className="sm:hidden">+50 pros</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-4 sm:p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl cursor-pointer ${
              selectedService === 'direct-connection' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 ring-2 ring-green-400' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-100'
            }`}
            onClick={() => setSelectedService('direct-connection')}
          >
            <div className="text-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg transform transition-all duration-300 ${
                selectedService === 'direct-connection' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 rotate-0' 
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 -rotate-3 hover:rotate-0'
              }`}>
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">Mise en relation</h3>
              <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                ⚡ Contactez instantanément des professionnels qualifiés dans votre domaine. 
                Idéal pour les projets urgents.
              </p>
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded-xl shadow-inner">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
                    <span className="hidden sm:inline">Contact immédiat</span>
                    <span className="sm:hidden">Immédiat</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
                    <span className="hidden sm:inline">Pros vérifiés</span>
                    <span className="sm:hidden">Vérifiés</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Description adaptative selon le service sélectionné */}
        {selectedService && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-12 max-w-6xl mx-auto">
            {selectedService === 'reverse-bidding' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Quel est votre besoin ?
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sélectionnez votre domaine et décrivez votre projet
                  </p>
                </div>

                {/* Categories avec logos */}
                <div className="mb-8">
                  <CategorySelector
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    serviceType={selectedService}
                  />
                </div>

                {/* Formulaire de description */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">Description du projet</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={analyzeWithAI}
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
                            Analyser avec l'IA
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Décrivez votre projet en détail..."
                      value={quickMission.description}
                      onChange={(e) => setQuickMission({...quickMission, description: e.target.value})}
                      className="min-h-[100px] text-base border-2 border-gray-200 focus:border-blue-400 rounded-xl"
                    />
                  </div>

                  {/* Composant de création IA intégré */}
                <div className="mt-6">
                  <QuickMissionCreator />
                </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="text"
                      placeholder="Localisation (optionnel)"
                      value={quickMission.title}
                      onChange={(e) => setQuickMission({...quickMission, title: e.target.value})}
                      className="flex-1 text-sm sm:text-base"
                    />
                    <Input
                      type="number"
                      placeholder="Budget estimé (€)"
                      value={quickMission.budget}
                      onChange={(e) => setQuickMission({...quickMission, budget: e.target.value})}
                      className="flex-1 text-sm sm:text-base"
                    />
                  </div>

                  <Button 
                    onClick={handleQuickSubmit}
                    type="button"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Publier ma mission
                    {aiAnalysis && (
                      <Badge className="ml-2 bg-green-500">
                        IA ✓
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {selectedService === 'direct-connection' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Trouvez le bon professionnel
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sélectionnez votre domaine pour découvrir les experts disponibles
                  </p>
                </div>

                {/* Categories avec logos */}
                <div className="mb-8">
                  <CategorySelector
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                    serviceType={selectedService}
                  />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setLocation('/available-providers')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition hover:scale-105 text-sm sm:text-base"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Explorer les profils
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>



      {/* Demo Missions */}
      <div className="mb-12 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Missions en cours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => setSelectedMissionId(mission.id)}
            />
          ))}
        </div>
        {missions.length > 6 && (
          <div className="text-center mt-6 sm:mt-8">
            <Button
              onClick={() => setLocation('/marketplace')}
              className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base"
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