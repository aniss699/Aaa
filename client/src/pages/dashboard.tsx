
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import type { Mission, Bid } from '@shared/schema';
import { formatBudget, formatDate } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Hand, Star, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: userMissions = [] } = useQuery<Mission[]>({
    queryKey: ['/api/users', user?.id, 'missions'],
    enabled: !!user,
  });

  const { data: userBids = [] } = useQuery<Bid[]>({
    queryKey: ['/api/users', user?.id, 'bids'],
    enabled: !!user && user.type === 'provider',
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour accéder à votre tableau de bord</p>
          <Button onClick={() => setLocation('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const totalBids = userMissions.reduce((acc, mission) => acc + (mission.bids?.length || 0), 0);
  const averageBudget = userMissions.length > 0 
    ? userMissions.reduce((acc, mission) => acc + parseInt(mission.budget || '0'), 0) / userMissions.length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bonjour {user.name} 👋
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre activité sur AppelsPro
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions publiées</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMissions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offres reçues</CardTitle>
            <Hand className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBids}</div>
          </CardContent>
        </Card>

        {user.type === 'provider' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userBids.length}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.rating || '5.0'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="missions">Mes missions</TabsTrigger>
          {user.type === 'provider' && (
            <TabsTrigger value="bids">Mes candidatures</TabsTrigger>
          )}
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-6">
          {userMissions.length > 0 ? (
            userMissions.map((mission) => (
              <Card key={mission.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{mission.title}</h3>
                      <p className="text-gray-600 mb-4">{mission.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📍 {mission.location || 'Non spécifié'}</span>
                        <span>📅 {formatDate(mission.createdAt!)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary mb-2">
                        {formatBudget(mission.budget || '0')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {mission.bids?.length || 0} offre(s)
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Voir les offres
                    </Button>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">Aucune mission publiée</p>
              <Button onClick={() => setLocation('/')}>
                Publier ma première mission
              </Button>
            </div>
          )}
        </TabsContent>

        {user.type === 'provider' && (
          <TabsContent value="bids" className="space-y-6">
            {userBids.length > 0 ? (
              userBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Candidature mission
                        </h3>
                        <p className="text-gray-600 mb-4">{bid.proposal}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary mb-2">
                          {formatBudget(bid.price)}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Délai: {bid.timeline}
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          En attente
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Hand className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">Aucune candidature</p>
                <Button onClick={() => setLocation('/marketplace')}>
                  Découvrir les missions
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="evaluations" className="space-y-6">
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Les évaluations apparaîtront ici après vos premières missions
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
