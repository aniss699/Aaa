import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Euro, Clock, Users, TrendingUp } from 'lucide-react';
import type { MissionWithBids } from '@shared/schema';
import { categories } from '@/lib/categories';

interface MissionCardProps {
  mission: MissionWithBids;
  onClick?: () => void;
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  const category = categories.find(c => c.id === mission.category);
  const averageBid = mission.bids.length > 0
    ? mission.bids.reduce((sum, bid) => sum + parseFloat(bid.price), 0) / mission.bids.length
    : 0;

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">
            {mission.title}
          </h3>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="secondary" className="shrink-0">
              {category?.name || mission.category}
            </Badge>
            {mission.bids.length > 0 && (
              <Badge variant="outline" className="text-xs">
                🔥 {mission.bids.length} candidat{mission.bids.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <p className="text-gray-600 line-clamp-3 mb-4">
          {mission.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Euro className="w-4 h-4 text-green-600" />
            <span className="font-medium">Budget: {mission.budget || '0'}€</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="truncate">{mission.location || 'Non spécifié'}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4 text-purple-600" />
            <span>{mission.bids.length} offre{mission.bids.length !== 1 ? 's' : ''}</span>
          </div>

          {averageBid > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Moy: {Math.round(averageBid)}€</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-gray-50/50">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(mission.createdAt!), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>

          <div className="text-sm font-medium text-primary">
            Par {mission.clientName}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}