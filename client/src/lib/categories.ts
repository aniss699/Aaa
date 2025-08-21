export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: 'development',
    name: 'Développement',
    icon: 'laptop-code',
    color: 'text-blue-500'
  },
  {
    id: 'design',
    name: 'Design',
    icon: 'palette',
    color: 'text-purple-500'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'megaphone',
    color: 'text-orange-500'
  },
  {
    id: 'construction',
    name: 'Travaux',
    icon: 'hammer',
    color: 'text-green-500'
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'truck',
    color: 'text-indigo-500'
  },
  {
    id: 'other',
    name: 'Autre',
    icon: 'more-horizontal',
    color: 'text-gray-400'
  }
];

export const connectionCategories: Category[] = [
  {
    id: 'executive',
    name: 'Dirigeants',
    icon: 'briefcase',
    color: 'text-blue-600'
  },
  {
    id: 'celebrity',
    name: 'Célébrités',
    icon: 'star',
    color: 'text-yellow-500'
  },
  {
    id: 'trainer',
    name: 'Formateurs',
    icon: 'graduation-cap',
    color: 'text-green-600'
  },
  {
    id: 'consultant',
    name: 'Consultants',
    icon: 'users',
    color: 'text-purple-600'
  },
  {
    id: 'expert',
    name: 'Experts',
    icon: 'award',
    color: 'text-orange-600'
  },
  {
    id: 'influencer',
    name: 'Influenceurs',
    icon: 'heart',
    color: 'text-pink-500'
  }
];
  }
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function formatBudget(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
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
