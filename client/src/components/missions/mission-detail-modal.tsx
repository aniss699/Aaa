import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { MissionWithBids, Bid } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { formatBudget, formatDate, getCategoryById } from '@/lib/categories';
import { BidForm } from './bid-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { MapPin, Calendar, Users, Star, Euro } from 'lucide-react';
import { ProviderProfileModal } from './provider-profile-modal';
import { BidResponseModal } from './bid-response-modal';

interface MissionDetailModalProps {
  missionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MissionDetailModal({ missionId, isOpen, onClose }: MissionDetailModalProps) {
  const { user } = useAuth();
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [selectedBidderName, setSelectedBidderName] = useState<string>('');

  const { data: mission, isLoading } = useQuery<MissionWithBids>({
    queryKey: ['/api/missions', missionId],
    enabled: !!missionId && isOpen,
  });

  if (!mission || isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Chargement...</DialogTitle>
          </DialogHeader>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Chargement des détails de la mission...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const category = getCategoryById(mission.category);

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('')
    ];
    return IconComponent || LucideIcons.Briefcase;
  };

  const IconComponent = category ? getIcon(category.icon) : LucideIcons.Briefcase;

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(numRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const sortedBids = [...mission.bids].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">
            {mission.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mission Info */}
          <div className="border-b pb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <IconComponent className={`w-8 h-8 ${category?.color || 'text-gray-500'}`} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{mission.title}</h3>
                <p className="text-gray-500">
                  Par {mission.clientName} • {formatDate(mission.createdAt!)}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{mission.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Euro className="w-4 h-4 mr-2" />
                Budget: {formatBudget(mission.budget || '0')}
              </span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {mission.location || 'Non spécifié'}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {mission.bids.length} offre(s) reçue(s)
              </span>
            </div>
          </div>

          {/* Bidding Section */}
          {user && user.type === 'provider' && (
            <BidForm missionId={mission.id} onSuccess={() => {}} />
          )}

          {/* Existing Bids */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Offres reçues ({mission.bids.length})
            </h4>
            <div className="space-y-4">
              {sortedBids.map((bid: Bid) => (
                <div key={bid.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 
                          className="font-semibold text-gray-900 cursor-pointer hover:text-primary"
                          onClick={() => {
                            setSelectedProviderId(bid.providerId);
                            setSelectedProviderName(bid.providerName);
                          }}
                        >
                          {bid.providerName}
                        </h5>
                        {/* Future IA optimization badge */}
                        {(bid as any).isAiOptimized && (
                          <span className="px-2 py-1 text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full border border-purple-200">
                            ✨ Offre optimisée
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {renderStars(bid.rating || '5.0')}
                        </div>
                        <span className="text-sm text-gray-600">
                          {parseFloat(bid.rating || '5.0').toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatBudget(bid.price)}
                      </div>
                      <div className="text-sm text-gray-500">{bid.timeline}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-line">{bid.proposal}</p>
                  </div>
                  {user && mission.clientName === user.name && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          setSelectedBidId(bid.id);
                          setSelectedBidderName(bid.providerName);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
                      >
                        <span>💬</span>
                        Répondre
                      </Button>
                      <Button 
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-2"
                      >
                        <span>✅</span>
                        Accepter directement
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {mission.bids.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune offre reçue pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <ProviderProfileModal
        providerId={selectedProviderId}
        providerName={selectedProviderName}
        isOpen={!!selectedProviderId}
        onClose={() => {
          setSelectedProviderId(null);
          setSelectedProviderName('');
        }}
      />

      <BidResponseModal
        bidId={selectedBidId}
        bidderName={selectedBidderName}
        isOpen={!!selectedBidId}
        onClose={() => {
          setSelectedBidId(null);
          setSelectedBidderName('');
        }}
      />
    </Dialog>
  );
}