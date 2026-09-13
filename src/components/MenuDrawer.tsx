import React from 'react';
import { 
  X, 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  Heart, 
  User, 
  Phone, 
  Instagram, 
  MapPin, 
  Clock, 
  Percent, 
  Store,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STORE_CONFIG } from '../config/store';

export const MenuDrawer: React.FC = () => {
  const { 
    isMenuDrawerOpen, 
    setIsMenuDrawerOpen, 
    setActiveTab, 
    setIsAdminOpen,
    setSelectedCategoryId 
  } = useApp();

  if (!isMenuDrawerOpen) return null;

  const navigateTo = (tab: string, categoryId?: any) => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
    setActiveTab(tab);
    setIsMenuDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-xs h-full flex flex-col shadow-2xl animate-slide-right relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header of Drawer */}
        <div className="bg-gradient-to-b from-[#340444] to-[#280332] text-white p-5 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-[#2a0236] border border-amber-400 p-1 flex items-center justify-center shadow-md">
              <span className="text-xs font-black text-amber-300 font-['Outfit',sans-serif]">
                AÇAÍ
              </span>
            </div>
            <button
              onClick={() => setIsMenuDrawerOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg font-black font-['Outfit',sans-serif]">
            {STORE_CONFIG.name}
          </h2>
          <p className="text-xs text-purple-200 mt-0.5">
            {STORE_CONFIG.tagline}
          </p>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-purple-800" />
              <span>Início</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => navigateTo('menu')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-4 h-4 text-purple-800" />
              <span>Cardápio Completo</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => navigateTo('menu', 'combos')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Ofertas & Combos</span>
            </div>
            <span className="bg-amber-400 text-purple-950 text-[10px] font-black px-1.5 py-0.5 rounded-md">
              PROMO
            </span>
          </button>

          <button
            onClick={() => navigateTo('orders')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-purple-800" />
              <span>Meus Pedidos</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => navigateTo('favorites')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Favoritos</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => navigateTo('profile')}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 text-zinc-800 transition-colors text-xs font-bold"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-purple-800" />
              <span>Meu Perfil & Endereço</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <div className="pt-2 border-t border-zinc-100 my-2">
            <button
              onClick={() => {
                setIsMenuDrawerOpen(false);
                setIsAdminOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#370544] transition-colors text-xs font-black"
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 text-amber-500" />
                <span>Painel do Lojista (Admin)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-800" />
            </button>
          </div>
        </div>

        {/* Store Info Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-xs text-zinc-600 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-purple-800 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-tight">{STORE_CONFIG.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-800 shrink-0" />
            <span className="text-[11px]">{STORE_CONFIG.openingHours}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop closer */}
      <div className="flex-1" onClick={() => setIsMenuDrawerOpen(false)} />
    </div>
  );
};
