
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Clock, 
  Star, 
  MapPin, 
  Euro, 
  Calendar as CalendarIcon,
  Filter,
  Search,
  MessageCircle,
  Phone
} from 'lucide-react';
import { categories } from '@/lib/categories';

interface AvailableProvider {
  id: string;
  name: string;
  avatar?: string;
  category: string;
  location: string;
  rating: number;
  hourlyRate: number;
  availability: {
    date: string;
    timeSlots: string[];
  }[];
  skills: string[];
  responseTime: string;
  completedProjects: number;
}

export default function AvailableProviders() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    maxRate: '',
    availability: 'today'
  });

  const { data: availableProviders = [] } = useQuery<AvailableProvider[]>({
    queryKey: ['/api/providers/available'],
  });

  // Données de démonstration
  const mockProviders: AvailableProvider[] = [
    {
      id: '1',
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      category: 'design',
      location: 'Paris',
      rating: 4.9,
      hourlyRate: 65,
      skills: ['UI/UX Design', 'Figma', 'Adobe Creative'],
      responseTime: '< 1h',
      completedProjects: 127,
      availability: [
        {
          date: new Date().toISOString().split('T')[0],
          timeSlots: ['09:00-12:00', '14:00-17:00']
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          timeSlots: ['10:00-16:00']
        }
      ]
    },
    {
      id: '2',
      name: 'Thomas Dubois',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      category: 'development',
      location: 'Lyon',
      rating: 4.8,
      hourlyRate: 80,
      skills: ['React', 'Node.js', 'TypeScript'],
      responseTime: '< 30min',
      completedProjects: 89,
      availability: [
        {
          date: new Date().toISOString().split('T')[0],
          timeSlots: ['08:00-12:00', '13:00-18:00']
        }
      ]
    },
    {
      id: '3',
      name: 'Marie Leroy',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      category: 'marketing',
      location: 'Marseille',
      rating: 4.7,
      hourlyRate: 55,
      skills: ['SEO', 'Google Ads', 'Analytics'],
      responseTime: '< 2h',
      completedProjects: 156,
      availability: [
        {
          date: new Date().toISOString().split('T')[0],
          timeSlots: ['09:00-13:00']
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          timeSlots: ['14:00-18:00']
        }
      ]
    }
  ];

  const filteredProviders = mockProviders.filter(provider => {
    if (filters.category !== 'all' && provider.category !== filters.category) return false;
    if (filters.location && !provider.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.maxRate && provider.hourlyRate > parseInt(filters.maxRate)) return false;
    
    if (filters.availability === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return provider.availability.some(avail => avail.date === today);
    }
    
    return true;
  });

  const getAvailabilityForDate = (provider: AvailableProvider, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return provider.availability.find(avail => avail.date === dateStr)?.timeSlots || [];
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const providersAvailableOnDate = filteredProviders.filter(provider => 
    provider.availability.some(avail => avail.date === selectedDateStr)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Prestataires Disponibles
        </h1>
        <p className="text-lg text-gray-600">
          Trouvez des professionnels disponibles immédiatement avec leurs créneaux et tarifs
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filtres et Calendrier */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Localisation</label>
                <Input
                  placeholder="Ville..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tarif max/h</label>
                <Input
                  type="number"
                  placeholder="€"
                  value={filters.maxRate}
                  onChange={(e) => setFilters(prev => ({...prev, maxRate: e.target.value}))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Disponibilité</label>
                <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({...prev, availability: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="all">Toutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({category: 'all', location: '', maxRate: '', availability: 'today'})}
              >
                Réinitialiser
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2" />
                Sélectionner une date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border"
              />
              <div className="mt-4 text-sm text-gray-600">
                {providersAvailableOnDate.length} prestataire(s) disponible(s) le {selectedDate.toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des prestataires */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {filteredProviders.length} prestataires trouvés
            </h2>
            <div className="text-sm text-gray-500">
              Triés par disponibilité et note
            </div>
          </div>

          <div className="space-y-6">
            {filteredProviders.map((provider) => {
              const todaySlots = getAvailabilityForDate(provider, new Date());
              const selectedDateSlots = getAvailabilityForDate(provider, selectedDate);
              
              return (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                      <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={provider.avatar} alt={provider.name} />
                          <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold">{provider.name}</h3>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{provider.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {provider.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Répond en {provider.responseTime}
                            </div>
                            <div>
                              {provider.completedProjects} projets
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {provider.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {provider.hourlyRate}€/h
                          </div>
                        </div>
                      </div>

                      <div className="lg:text-right space-y-3">
                        {/* Disponibilités aujourd'hui */}
                        {todaySlots.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-green-600 mb-1">
                              ✅ Disponible aujourd'hui
                            </div>
                            <div className="text-xs text-gray-600">
                              {todaySlots.join(', ')}
                            </div>
                          </div>
                        )}

                        {/* Disponibilités date sélectionnée */}
                        {selectedDateSlots.length > 0 && selectedDate.toDateString() !== new Date().toDateString() && (
                          <div>
                            <div className="text-sm font-medium text-blue-600 mb-1">
                              📅 Disponible le {selectedDate.toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-xs text-gray-600">
                              {selectedDateSlots.join(', ')}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Phone className="w-4 h-4 mr-1" />
                            Contacter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun prestataire disponible
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
