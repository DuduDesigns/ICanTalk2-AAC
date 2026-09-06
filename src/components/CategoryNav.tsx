import React, { useEffect, useRef } from 'react';
import { CategoryId, ContrastMode } from '../types';
import { AAC_CATEGORIES } from '../data/initialTiles';
import { getUIText } from '../data/languages';
import { getCategoryTitle } from '../data/translations';
import { Star, Activity, Utensils, Smile, MapPin, Gamepad2, Users, MessageCircle, AlertTriangle } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  langCode: string;
  contrastMode: ContrastMode;
  onOpenEmergencyModal: () => void;
}

const CATEGORY_ICONS: Record<CategoryId, React.ComponentType<{ className?: string }>> = {
  core: Star,
  actions: Activity,
  food: Utensils,
  feelings: Smile,
  places: MapPin,
  toys: Gamepad2,
  people: Users,
  social: MessageCircle,
  emergency: AlertTriangle,
};

const CATEGORY_BORDER_COLORS: Record<CategoryId, string> = {
  core: 'border-indigo-400 hover:border-indigo-500',
  food: 'border-orange-400 hover:border-orange-500',
  actions: 'border-green-400 hover:border-green-500',
  feelings: 'border-blue-400 hover:border-blue-500',
  places: 'border-amber-400 hover:border-amber-500',
  toys: 'border-purple-400 hover:border-purple-500',
  people: 'border-yellow-400 hover:border-yellow-500',
  social: 'border-pink-400 hover:border-pink-500',
  emergency: 'border-red-700 hover:border-red-800',
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  langCode,
  contrastMode,
  onOpenEmergencyModal,
}) => {
  const isDark = contrastMode === 'high-contrast-dark' || contrastMode === 'yellow-on-black';
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Auto-scroll category bar to center the newly active category tab
  useEffect(() => {
    const activeTabEl = tabRefs.current[activeCategory];
    if (activeTabEl) {
      activeTabEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  return (
    <nav aria-label="AAC Categories" className="w-full px-3 sm:px-4 py-2 overflow-x-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-2.5">
        {AAC_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const IconComp = CATEGORY_ICONS[cat.id] || Star;
          const isEmergency = cat.id === 'emergency';
          const borderColorClass = CATEGORY_BORDER_COLORS[cat.id] || 'border-slate-300';

          if (isEmergency) {
            return (
              <button
                key={cat.id}
                ref={(el) => { tabRefs.current[cat.id] = el; }}
                type="button"
                id="btn-category-emergency"
                onClick={onOpenEmergencyModal}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-red-600 hover:bg-red-700 text-white border-b-4 border-red-800 shadow-md transition-all active:translate-y-0.5 animate-pulse shrink-0 ring-2 ring-red-400/80"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span className="uppercase tracking-wider">{getUIText('emergency', langCode)}</span>
              </button>
            );
          }

          return (
            <button
              key={cat.id}
              ref={(el) => { tabRefs.current[cat.id] = el; }}
              type="button"
              id={`tab-category-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 active:translate-y-0.5 ${
                isActive
                  ? isDark
                    ? 'bg-neutral-800 text-indigo-300 border-2 border-indigo-400 shadow-md'
                    : 'bg-white text-indigo-900 border-2 border-indigo-500 shadow-md'
                  : isDark
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-b-4 border-neutral-700 shadow-xs'
                  : `bg-white hover:bg-slate-50 text-slate-800 border-b-4 ${borderColorClass} shadow-xs`
              }`}
            >
              <span className="text-lg leading-none">{cat.emoji}</span>
              <IconComp className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
              <span className="tracking-tight">{getCategoryTitle(cat.id, langCode)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
