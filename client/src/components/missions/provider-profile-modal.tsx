
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Award, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/categories';

interface ProviderProfileModalProps {
  providerId: string | null;
  providerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderProfile {
  id: string;
  name: string;
  email: string;
  rating: string;
  location: string;
  joinedAt: string;
  description: string;
  skills: string[];
  totalProjects: number;
  evaluations: Array<{
    id: string;
    rating: number;
    comment: string;
    clientName: string;
    createdAt: string;
    photos?: string[];
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    images: string[];
    category: string;
    completedAt: string;
  }>;
}

export function ProviderProfileModal({ providerId, providerName, isOpen, onClose }: ProviderProfileModalProps) {
  const { data: profile, isLoading } = useQuery<ProviderProfile>({
    queryKey: ['/api/providers', providerId, 'profile'],
    enabled: !!providerId && isOpen,
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen || !providerId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Profil de {providerName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : profile ? (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location || 'Localisation non spécifiée'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Membre depuis {formatDate(profile.joinedAt)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{profile.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-2">
                    <div className="flex items-center mr-2">
                      {renderStars(Math.round(parseFloat(profile.rating)))}
                    </div>
                    <span className="text-xl font-bold">{profile.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {profile.totalProjects} projets réalisés
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Réalisations récentes
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.portfolio.slice(0, 4).map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      {project.images.length > 0 && (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{project.category}</Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(project.completedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {profile.portfolio.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucune réalisation disponible pour le moment
                </p>
              )}
            </div>

            {/* Evaluations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Avis clients ({profile.evaluations.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {profile.evaluations.map((evaluation) => (
                  <Card key={evaluation.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center mb-1">
                            {renderStars(evaluation.rating)}
                            <span className="ml-2 font-medium">{evaluation.clientName}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(evaluation.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{evaluation.comment}</p>
                      {evaluation.photos && evaluation.photos.length > 0 && (
                        <div className="flex space-x-2">
                          {evaluation.photos.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {profile.evaluations.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucun avis client pour le moment
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Profil non trouvé</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
