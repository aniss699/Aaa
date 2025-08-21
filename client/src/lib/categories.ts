export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  popularityScore?: number;
}

export const categories: Category[] = [
  {
    id: 'development',
    name: 'Développement',
    icon: 'laptop-code',
    color: 'text-blue-500',
    description: 'Applications web, mobile, logiciels',
    popularityScore: 9
  },
  {
    id: 'design',
    name: 'Design',
    icon: 'palette',
    color: 'text-purple-500',
    description: 'Graphisme, UX/UI, identité visuelle',
    popularityScore: 8
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'megaphone',
    color: 'text-orange-500',
    description: 'Communication, publicité, réseaux sociaux',
    popularityScore: 7
  },
  {
    id: 'construction',
    name: 'Travaux',
    icon: 'hammer',
    color: 'text-green-500',
    description: 'Rénovation, construction, aménagement',
    popularityScore: 8
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'truck',
    color: 'text-indigo-500',
    description: 'Déménagement, livraison, logistique',
    popularityScore: 6
  },
  {
    id: 'photography',
    name: 'Photographie',
    icon: 'camera',
    color: 'text-pink-500',
    description: 'Événements, produits, portraits',
    popularityScore: 7
  },
  {
    id: 'translation',
    name: 'Traduction',
    icon: 'globe',
    color: 'text-cyan-500',
    description: 'Documents, sites web, interprétation',
    popularityScore: 6
  },
  {
    id: 'accounting',
    name: 'Comptabilité',
    icon: 'calculator',
    color: 'text-emerald-500',
    description: 'Gestion, fiscalité, audit',
    popularityScore: 7
  },
  {
    id: 'legal',
    name: 'Juridique',
    icon: 'scale',
    color: 'text-slate-600',
    description: 'Conseils juridiques, contrats, litiges',
    popularityScore: 5
  },
  {
    id: 'cleaning',
    name: 'Nettoyage',
    icon: 'spray-can',
    color: 'text-teal-500',
    description: 'Ménage, nettoyage industriel',
    popularityScore: 8
  },
  {
    id: 'other',
    name: 'Autre',
    icon: 'more-horizontal',
    color: 'text-gray-400',
    description: 'Autres services',
    popularityScore: 3
  }
];

export const connectionCategories: Category[] = [
  {
    id: 'executive',
    name: 'Dirigeants',
    icon: 'briefcase',
    color: 'text-blue-600',
    description: 'CEOs, directeurs, entrepreneurs',
    popularityScore: 9
  },
  {
    id: 'celebrity',
    name: 'Célébrités',
    icon: 'star',
    color: 'text-yellow-500',
    description: 'Personnalités publiques, artistes',
    popularityScore: 10
  },
  {
    id: 'trainer',
    name: 'Formateurs',
    icon: 'graduation-cap',
    color: 'text-green-600',
    description: 'Experts en formation, coaches',
    popularityScore: 8
  },
  {
    id: 'consultant',
    name: 'Consultants',
    icon: 'users',
    color: 'text-purple-600',
    description: 'Experts en stratégie, conseil',
    popularityScore: 7
  },
  {
    id: 'expert',
    name: 'Experts',
    icon: 'award',
    color: 'text-orange-600',
    description: 'Spécialistes techniques',
    popularityScore: 8
  },
  {
    id: 'influencer',
    name: 'Influenceurs',
    icon: 'heart',
    color: 'text-pink-500',
    description: 'Créateurs de contenu, ambassadeurs',
    popularityScore: 9
  },
  {
    id: 'investor',
    name: 'Investisseurs',
    icon: 'trending-up',
    color: 'text-emerald-600',
    description: 'Business angels, VCs',
    popularityScore: 8
  },
  {
    id: 'mentor',
    name: 'Mentors',
    icon: 'user-check',
    color: 'text-indigo-600',
    description: 'Accompagnement personnalisé',
    popularityScore: 7
  }
];

export const urgencyLevels = [
  { id: 'low', name: 'Pas urgent', color: 'text-green-500', days: '7+' },
  { id: 'medium', name: 'Modéré', color: 'text-yellow-500', days: '3-7' },
  { id: 'high', name: 'Urgent', color: 'text-orange-500', days: '1-3' },
  { id: 'critical', name: 'Très urgent', color: 'text-red-500', days: '<24h' }
];

export const budgetRanges = [
  { id: 'micro', name: 'Micro (< 100€)', min: 0, max: 100, color: 'text-gray-500' },
  { id: 'small', name: 'Petit (100-500€)', min: 100, max: 500, color: 'text-blue-500' },
  { id: 'medium', name: 'Moyen (500-2000€)', min: 500, max: 2000, color: 'text-green-500' },
  { id: 'large', name: 'Important (2000-5000€)', min: 2000, max: 5000, color: 'text-orange-500' },
  { id: 'premium', name: 'Premium (5000€+)', min: 5000, max: Infinity, color: 'text-purple-500' }
];

export function getCategoryById(id: string): Category | undefined {
  return [...categories, ...connectionCategories].find(cat => cat.id === id);
}

export function getCategoriesByPopularity(): Category[] {
  return [...categories].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
}

export function getBudgetRangeById(budgetAmount: number) {
  return budgetRanges.find(range => budgetAmount >= range.min && budgetAmount <= range.max);
}

export function formatBudget(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0€';

  if (num >= 1000000) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      notation: 'compact'
    }).format(num);
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) return 'À l\'instant';
  if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)}h`;
  if (diffInHours < 168) return `Il y a ${Math.floor(diffInHours / 24)} jour${Math.floor(diffInHours / 24) > 1 ? 's' : ''}`;
  return formatDate(dateObj);
}

export function getUrgencyByDays(days: number) {
  if (days < 1) return urgencyLevels.find(u => u.id === 'critical');
  if (days <= 3) return urgencyLevels.find(u => u.id === 'high');
  if (days <= 7) return urgencyLevels.find(u => u.id === 'medium');
  return urgencyLevels.find(u => u.id === 'low');
}

export function calculateSuccessScore(provider: any): number {
  const completionRate = (provider.completedProjects || 0) / Math.max(provider.totalProjects || 1, 1);
  const avgRating = provider.rating || 0;
  const responseTime = Math.max(0, 10 - (provider.avgResponseTime || 24)) / 10;

  return Math.round((completionRate * 0.4 + (avgRating / 5) * 0.4 + responseTime * 0.2) * 100);
}