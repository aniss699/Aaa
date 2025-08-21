import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { MissionWithBids } from '@shared/schema';
import { MissionCard } from '@/components/missions/mission-card';
import { MissionDetailModal } from '@/components/missions/mission-detail-modal';
import { categories } from '@/lib/categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Marketplace() {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    budget: 'all',
    location: '',
    sort: 'newest',
  });

  const { data: missions = [] } = useQuery<MissionWithBids[]>({
    queryKey: ['/api/missions'],
  });

  const filteredAndSortedMissions = missions
    .filter((mission) => {
      if (filters.category && filters.category !== 'all' && mission.category !== filters.category) return false;
      if (filters.location && !mission.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.budget && filters.budget !== 'all') {
        const budget = parseFloat(mission.budget || '0');
        switch (filters.budget) {
          case '0-500':
            return budget >= 0 && budget <= 500;
          case '500-2000':
            return budget > 500 && budget <= 2000;
          case '2000-5000':
            return budget > 2000 && budget <= 5000;
          case '5000+':
            return budget > 5000;
          default:
            return true;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        case 'budget-high':
          return parseFloat(b.budget || '0') - parseFloat(a.budget || '0');
        case 'budget-low':
          return parseFloat(a.budget || '0') - parseFloat(b.budget || '0');
        case 'bids':
          return b.bids.length - a.bids.length;
        default:
          return 0;
      }
    });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
          Marketplace des Projets
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Découvrez et soumissionnez sur les projets disponibles
        </p>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-4">Filtres</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Catégorie</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Budget</Label>
              <Select value={filters.budget} onValueChange={(value) => handleFilterChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les budgets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les budgets</SelectItem>
                  <SelectItem value="0-500">0 - 500€</SelectItem>
                  <SelectItem value="500-2000">500 - 2 000€</SelectItem>
                  <SelectItem value="2000-5000">2 000 - 5 000€</SelectItem>
                  <SelectItem value="5000+">5 000€+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Localisation</Label>
              <Input
                type="text"
                placeholder="Ville, région..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            <Button
              onClick={() => setFilters({ category: 'all', budget: 'all', location: '', sort: 'newest' })}
              variant="outline"
              className="w-full"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:w-3/4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Toutes les missions ({filteredAndSortedMissions.length})
          </h2>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500 whitespace-nowrap">Trier par:</span>
            <Select value={filters.sort} onValueChange={(value) => handleFilterChange('sort', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récent</SelectItem>
                <SelectItem value="budget-high">Budget décroissant</SelectItem>
                <SelectItem value="budget-low">Budget croissant</SelectItem>
                <SelectItem value="bids">Nombre d'offres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => setSelectedMissionId(mission.id)}
            />
          ))}

          {filteredAndSortedMissions.length === 0 && (
            <div className="text-center py-12 sm:col-span-2 lg:col-span-3">
              <div className="text-gray-300 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Aucune mission trouvée</p>
              <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>

      <MissionDetailModal
        missionId={selectedMissionId}
        isOpen={!!selectedMissionId}
        onClose={() => setSelectedMissionId(null)}
      />
    </div>
  );
}