import React from 'react';
import { 
  CupSoda, 
  Utensils, 
  Coffee, 
  Package, 
  Percent, 
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { CategoryId } from '../types';

export const CategoryList: React.FC = () => {
  const { selectedCategoryId, setSelectedCategoryId, setActiveTab } = useApp();

  const getCategoryIcon = (iconName: string, isSelected: boolean) => {
    const iconProps = {
      className: `w-6 h-6 transition-transform ${isSelected ? 'text-white scale-110' : 'text-[#3b0764]'}`
    };

    switch (iconName) {
      case 'CupSoda':
        return <CupSoda {...iconProps} />;
      case 'Utensils':
        return <Utensils {...iconProps} />;
      case 'Coffee':
        return <Coffee {...iconProps} />;
      case 'Package':
        return <Package {...iconProps} />;
      case 'Percent':
        return <Percent {...iconProps} />;
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      default:
        return <Flame {...iconProps} />;
    }
  };

  return (
    <div className="py-4">
      {/* Header of categories row with "Ver todos >" */}
      <div className="flex items-center justify-between px-4 max-w-4xl mx-auto mb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900/70">
          Categorias
        </h2>
        <button
          onClick={() => {
            setSelectedCategoryId('all');
            setActiveTab('menu');
          }}
          className="text-xs font-semibold text-[#3b0764] hover:text-purple-700 flex items-center gap-0.5 hover:underline"
        >
          Ver todos <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal scrolling circular list */}
      <div className="flex items-center gap-3.5 overflow-x-auto px-4 max-w-4xl mx-auto no-scrollbar pb-1">
        {/* "Todos" item */}
        <button
          onClick={() => setSelectedCategoryId('all')}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
              selectedCategoryId === 'all'
                ? 'bg-[#3b0764] shadow-purple-900/20 ring-2 ring-amber-400 scale-105'
                : 'bg-white border border-purple-100 hover:border-purple-300'
            }`}
          >
            <Flame className={`w-6 h-6 ${selectedCategoryId === 'all' ? 'text-amber-300' : 'text-[#3b0764]'}`} />
          </div>
          <span
            className={`text-[12px] font-semibold tracking-tight transition-colors ${
              selectedCategoryId === 'all' ? 'text-purple-950 font-bold' : 'text-zinc-600'
            }`}
          >
            Todos
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id as CategoryId)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none relative"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#3b0764] shadow-purple-900/20 ring-2 ring-amber-400 scale-105'
                    : 'bg-white border border-purple-100 hover:border-purple-300'
                }`}
              >
                {getCategoryIcon(cat.iconName, isSelected)}
              </div>
              <span
                className={`text-[12px] font-semibold tracking-tight transition-colors ${
                  isSelected ? 'text-purple-950 font-bold' : 'text-zinc-600'
                }`}
              >
                {cat.name}
              </span>
              {cat.badge && (
                <span className="absolute -top-1 right-0 bg-amber-400 text-purple-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
