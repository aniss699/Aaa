import { categories, connectionCategories, type Category } from '@/lib/categories';
import * as LucideIcons from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
  serviceType?: 'reverse-bidding' | 'direct-connection';
}

export function CategorySelector({ selectedCategory, onCategorySelect, serviceType = 'reverse-bidding' }: CategorySelectorProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('')
    ];
    return IconComponent || LucideIcons.Briefcase;
  };

  const categoriesToShow = serviceType === 'direct-connection' ? connectionCategories : categories;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categoriesToShow.map((category: Category) => {
        const IconComponent = getIcon(category.icon);
        const isSelected = selectedCategory === category.id;
        
        return (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
              isSelected 
                ? 'border-primary bg-blue-50' 
                : 'border-gray-200 hover:border-primary'
            }`}
          >
            <IconComponent className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
            <span className="block text-sm font-medium">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
}
