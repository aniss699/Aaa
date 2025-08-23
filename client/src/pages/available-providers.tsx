import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  lastSeen?: Date | string; // Added for the change
  memberSince?: Date | string; // Added for the change
}

export default function AvailableProviders() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    maxRate: '',
    availability: 'today'
  });
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    provider: AvailableProvider | null;
    selectedTimeSlot: string;
  }>({
    isOpen: false,
    provider: null,
    selectedTimeSlot: ''
  });
  const [bookingForm, setBookingForm] = useState({
    date: '',
    timeSlot: '',
    duration: '1',
    description: '',
    budget: ''
  });

  const { data: availableProviders = [] } = useQuery<AvailableProvider[]>({
    queryKey: ['/api/providers/available'],
  });

  // Données de démonstration
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const mockProviders: AvailableProvider[] = [
    {
      id: "1",
      name: "Alexandre Martin",
      category: "development", // Changed from expertise to category for consistency
      rating: 4.8,
      hourlyRate: 45,
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      responseTime: "< 1h",
      completedProjects: 156, // Changed from completedJobs to completedProjects
      availability: [ // Changed from string to array of objects
        {
          date: today.toISOString().split('T')[0],
          timeSlots: ['09:00-12:00', '14:00-17:00']
        },
        {
          date: tomorrow.toISOString().split('T')[0],
          timeSlots: ['10:00-16:00']
        }
      ],
      lastSeen: new Date("2024-01-15T10:30:00Z"),
      memberSince: new Date("2023-01-15T00:00:00Z"), // Added for consistency
      // description: "Développeur fullstack avec 8 ans d'expérience en React et Node.js. Spécialisé dans les applications web modernes et les API RESTful.",
      // portfolio: [
      //   { title: "E-commerce Platform", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop" },
      //   { title: "Dashboard Analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" }
      // ]
    },
    {
      id: "2", 
      name: "Sophie Dubois",
      category: "design", // Changed from expertise to category for consistency
      rating: 4.9,
      hourlyRate: 55,
      location: "Lyon, France",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      responseTime: "< 30min",
      completedProjects: 203, // Changed from completedJobs to completedProjects
      availability: [ // Changed from string to array of objects
        {
          date: today.toISOString().split('T')[0],
          timeSlots: ['08:00-12:00', '13:00-18:00']
        }
      ],
      lastSeen: new Date("2024-01-16T14:20:00Z"),
      memberSince: new Date("2022-05-20T00:00:00Z"), // Added for consistency
      // description: "Designer UX/UI passionnée par la création d'expériences utilisateur exceptionnelles. 6 ans d'expérience dans le design d'interfaces.",
      // portfolio: [
      //   { title: "Mobile Banking App", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop" },
      //   { title: "SaaS Dashboard", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop" }
      // ]
    },
    {
      id: "3",
      name: "Thomas Leclerc", 
      category: "marketing", // Changed from expertise to category for consistency
      rating: 4.7,
      hourlyRate: 38,
      location: "Bordeaux, France",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      skills: ["SEO", "Google Ads", "Social Media", "Analytics"],
      responseTime: "< 2h",
      completedProjects: 128, // Changed from completedJobs to completedProjects
      availability: [ // Changed from string to array of objects
        {
          date: today.toISOString().split('T')[0],
          timeSlots: ['09:00-13:00']
        },
        {
          date: tomorrow.toISOString().split('T')[0],
          timeSlots: ['14:00-18:00']
        }
      ],
      lastSeen: new Date("2024-01-14T09:15:00Z"),
      memberSince: new Date("2023-11-01T00:00:00Z"), // Added for consistency
      // description: "Expert en marketing digital avec une approche data-driven. Spécialisé dans l'acquisition de trafic et l'optimisation des conversions.",
      // portfolio: [
      //   { title: "SEO Campaign +150%", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop" },
      //   { title: "Social Media Growth", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop" }
      // ]
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
    if (!date || isNaN(date.getTime())) return [];
    const dateStr = date.toISOString().split('T')[0];
    return provider.availability.find(avail => avail.date === dateStr)?.timeSlots || [];
  };

  const selectedDateStr = selectedDate && !isNaN(selectedDate.getTime()) 
    ? selectedDate.toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];
  const providersAvailableOnDate = filteredProviders.filter(provider => 
    provider.availability.some(avail => avail.date === selectedDateStr)
  );

  const handleBookingOpen = (provider: AvailableProvider, timeSlot?: string) => {
    const bookingDate = selectedDate && !isNaN(selectedDate.getTime()) 
      ? selectedDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];

    setBookingModal({
      isOpen: true,
      provider,
      selectedTimeSlot: timeSlot || ''
    });
    setBookingForm({
      date: bookingDate,
      timeSlot: timeSlot || '',
      duration: '1',
      description: '',
      budget: ''
    });
  };

  const handleBookingSubmit = () => {
    // Logique de réservation à implémenter
    console.log('Réservation:', {
      provider: bookingModal.provider?.id,
      ...bookingForm
    });
    setBookingModal({ isOpen: false, provider: null, selectedTimeSlot: '' });
    // Afficher un message de succès
  };

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
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-3xl shadow-xl border border-blue-100/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Filtrer les prestataires</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Catégorie
                </label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({...prev, category: value}))}>
                  <SelectTrigger className="bg-white/80 border-gray-200 hover:border-blue-400 transition-colors">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Localisation
                </label>
                <Input
                  placeholder="Ville, région..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                  className="bg-white/80 border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Tarif max/h
                </label>
                <Input
                  type="number"
                  placeholder="€"
                  value={filters.maxRate}
                  onChange={(e) => setFilters(prev => ({...prev, maxRate: e.target.value}))}
                  className="bg-white/80 border-gray-200 hover:border-purple-400 focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Disponibilité
                </label>
                <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({...prev, availability: value}))}>
                  <SelectTrigger className="bg-white/80 border-gray-200 hover:border-orange-400 transition-colors">
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
                className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-md mt-4"
                onClick={() => setFilters({category: 'all', location: '', maxRate: '', availability: 'today'})}
              >
                🔄 Réinitialiser les filtres
              </Button>
            </div>
          </div>

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

                          {/* Changes applied here */}
                          <span className="text-sm text-gray-500">
                            Dernier vu: {provider.lastSeen instanceof Date ? provider.lastSeen.toLocaleDateString('fr-FR') : 'Récemment'}
                          </span>
                          <br />
                          <span className="text-sm text-gray-500">
                            Membre depuis {provider.memberSince instanceof Date ? provider.memberSince.getFullYear() : '2024'}
                          </span>

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

                        <div className="flex space-x-2 flex-wrap">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/messages?provider=${provider.id}`}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => window.open(`tel:+33${Math.floor(Math.random() * 1000000000)}`, '_self')}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Contacter
                          </Button>
                          <Dialog open={bookingModal.isOpen && bookingModal.provider?.id === provider.id} onOpenChange={(open) => !open && setBookingModal({ isOpen: false, provider: null, selectedTimeSlot: '' })}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                onClick={() => handleBookingOpen(provider)}
                              >
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                Réserver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Réserver un créneau</DialogTitle>
                                <DialogDescription>
                                  Réservez un créneau avec {provider.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={bookingForm.date}
                                    onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                                    min={new Date().toISOString().split('T')[0]}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="timeSlot">Créneaux disponibles</Label>
                                  <Select value={bookingForm.timeSlot} onValueChange={(value) => setBookingForm(prev => ({ ...prev, timeSlot: value }))}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner un créneau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bookingForm.date && getAvailabilityForDate(provider, new Date(bookingForm.date)).map((slot) => (
                                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="duration">Durée (heures)</Label>
                                  <Select value={bookingForm.duration} onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: value }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1 heure</SelectItem>
                                      <SelectItem value="2">2 heures</SelectItem>
                                      <SelectItem value="4">4 heures</SelectItem>
                                      <SelectItem value="8">Journée complète</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="budget">Budget estimé</Label>
                                  <Input
                                    id="budget"
                                    type="number"
                                    placeholder={`${provider.hourlyRate * parseInt(bookingForm.duration)}€`}
                                    value={bookingForm.budget}
                                    onChange={(e) => setBookingForm(prev => ({ ...prev, budget: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="description">Description du projet</Label>
                                  <Textarea
                                    id="description"
                                    placeholder="Décrivez brièvement votre projet..."
                                    value={bookingForm.description}
                                    onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" className="flex-1" onClick={() => setBookingModal({ isOpen: false, provider: null, selectedTimeSlot: '' })}>
                                    Annuler
                                  </Button>
                                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={handleBookingSubmit}>
                                    Confirmer la réservation
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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