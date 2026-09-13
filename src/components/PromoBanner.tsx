import React from 'react';
import { Percent, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromoBanner: React.FC = () => {
  const { setSelectedCategoryId, setActiveTab } = useApp();

  const handleBannerClick = () => {
    setSelectedCategoryId('combos');
    setActiveTab('menu');
  };

  return (
    <div className="px-4 max-w-4xl mx-auto my-3">
      <div
        id="banner-special-offers"
        onClick={handleBannerClick}
        className="bg-amber-400 hover:bg-amber-300 active:scale-[0.99] transition-all cursor-pointer rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-sm border border-amber-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
            <Percent className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-purple-950 uppercase tracking-wide font-['Outfit',sans-serif]">
                Ofertas especiais
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 bg-purple-950 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> Até 25% OFF
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-purple-950/80 font-medium">
              Descontos e combos exclusivos só no app!
            </p>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-purple-950/10 flex items-center justify-center text-purple-950">
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
