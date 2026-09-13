import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Heart, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';

export const BottomNavigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    itemCount, 
    total, 
    setIsCartOpen 
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'menu', label: 'Cardápio', icon: LayoutGrid },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: false },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <>
      {/* Floating Cart Snack Bar on Mobile when items in cart */}
      {itemCount > 0 && activeTab !== 'cart' && (
        <div className="fixed bottom-18 left-0 right-0 z-30 px-4 max-w-lg mx-auto pointer-events-none animate-slide-up">
          <button
            id="floating-cart-pill"
            onClick={() => setIsCartOpen(true)}
            className="w-full pointer-events-auto bg-[#370544] text-white p-3.5 rounded-2xl shadow-xl shadow-purple-950/30 flex items-center justify-between border border-amber-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-purple-950 font-bold text-xs flex items-center justify-center">
                {itemCount}
              </div>
              <div className="text-left">
                <span className="text-[11px] text-purple-200 uppercase font-semibold block leading-tight">
                  Ver carrinho
                </span>
                <span className="text-sm font-black font-['Outfit',sans-serif] text-amber-300">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <span>Avançar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav 
        id="bottom-navigation-bar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200/80 shadow-lg pb-safe"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
                  isActive ? 'text-[#370544]' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <div className="relative">
                  <Icon 
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                    }`} 
                  />
                  {item.id === 'orders' && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
                  )}
                </div>
                <span 
                  className={`text-[10px] mt-1 font-semibold tracking-tight transition-all ${
                    isActive ? 'font-bold text-[#370544]' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
