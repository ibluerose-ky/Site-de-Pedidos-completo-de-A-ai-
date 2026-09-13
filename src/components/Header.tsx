import React from 'react';
import { Menu, Bell, ShoppingBag, Search, SlidersHorizontal, MapPin, ChevronRight, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STORE_CONFIG } from '../config/store';

export const Header: React.FC = () => {
  const { 
    itemCount, 
    setIsCartOpen, 
    setIsMenuDrawerOpen, 
    setIsNotificationsOpen, 
    searchQuery, 
    setSearchQuery,
    customer,
    deliveryType,
    setDeliveryType,
    setActiveTab,
    setIsAdminOpen
  } = useApp();

  return (
    <header className="relative bg-gradient-to-b from-[#340444] via-[#3d0552] to-[#2b0239] text-white pt-3 pb-6 px-4 rounded-b-[28px] shadow-lg shadow-purple-950/20">
      {/* Top action bar: Menu, Logo, Bell, Cart */}
      <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto">
        <button
          id="btn-menu-drawer"
          onClick={() => setIsMenuDrawerOpen(true)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-white/90"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center circular logo badge */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center cursor-pointer group select-none"
        >
          <div className="w-16 h-16 rounded-full bg-[#2a0236] border-2 border-amber-400 p-1 flex items-center justify-center shadow-md shadow-black/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Bowl graphic */}
              <div className="relative mb-0.5">
                <div className="w-7 h-3.5 bg-gradient-to-b from-purple-300 to-purple-400 rounded-b-full border-t border-purple-200"></div>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-purple-100 rounded-t-full"></div>
                <div className="absolute -top-2.5 right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-[13px] font-black tracking-tight leading-none text-white font-['Outfit',sans-serif]">
                açaí
              </span>
              <span className="text-[7.5px] font-extrabold tracking-wider uppercase text-amber-300 leading-none mt-0.5">
                NA TIGELA
              </span>
            </div>
          </div>
        </div>

        {/* Right actions: Notifications & Cart */}
        <div className="flex items-center gap-2">
          <button
            id="btn-admin-quick"
            onClick={() => setIsAdminOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-amber-400 text-purple-950 hover:bg-amber-300 transition-colors shadow-sm"
            title="Painel do Lojista"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Painel</span>
          </button>

          <button
            id="btn-notifications"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-white/90"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-purple-950 font-black text-[11px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              2
            </span>
          </button>

          <button
            id="btn-header-cart"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-amber-400 text-purple-950 hover:bg-amber-300 active:scale-95 transition-all shadow-sm"
            aria-label="Carrinho"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-950 text-amber-300 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Greeting text */}
      <div className="max-w-4xl mx-auto mt-4 px-1">
        <p className="text-purple-200/90 text-sm font-medium flex items-center gap-1">
          Olá, tudo bem? <span>👋</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Outfit',sans-serif] mt-0.5">
          O que você deseja hoje?
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-4xl mx-auto mt-3.5">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-products"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-12 py-3 bg-white text-zinc-800 placeholder-zinc-400 rounded-2xl text-sm font-medium shadow-md shadow-black/10 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-zinc-400 hover:text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('menu')}
              className="absolute right-3 p-1.5 text-purple-900/70 hover:text-purple-900 rounded-lg hover:bg-purple-50 transition-colors"
              title="Filtros"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Delivery location pill */}
      <div className="max-w-4xl mx-auto mt-3">
        <button
          id="btn-delivery-address-header"
          onClick={() => setActiveTab('profile')}
          className="w-full bg-white/10 hover:bg-white/15 active:bg-white/20 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-left transition-all border border-white/10"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-purple-950/60 flex items-center justify-center shrink-0 text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-[11px] uppercase tracking-wider text-purple-200 font-semibold block leading-tight">
                {deliveryType === 'delivery' ? 'Entregar em' : 'Retirar na loja'}
              </span>
              <p className="text-xs font-semibold text-white truncate leading-normal">
                {deliveryType === 'delivery' 
                  ? (customer.street ? `${customer.street}, ${customer.number || 'S/N'} - ${customer.neighborhood || customer.city}` : 'Toque para informar endereço')
                  : `${STORE_CONFIG.address}`
                }
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-200/80 shrink-0 ml-1" />
        </button>
      </div>

      {/* Quick delivery toggle switch (Entrega vs Retirada) */}
      <div className="max-w-4xl mx-auto mt-2.5 flex items-center justify-center gap-1.5 p-1 bg-black/20 rounded-xl max-w-xs mx-auto">
        <button
          onClick={() => setDeliveryType('delivery')}
          className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            deliveryType === 'delivery'
              ? 'bg-amber-400 text-purple-950 shadow-sm'
              : 'text-white/80 hover:text-white'
          }`}
        >
          🛵 Entrega
        </button>
        <button
          onClick={() => setDeliveryType('pickup')}
          className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold transition-all ${
            deliveryType === 'pickup'
              ? 'bg-amber-400 text-purple-950 shadow-sm'
              : 'text-white/80 hover:text-white'
          }`}
        >
          🏪 Retirada no local
        </button>
      </div>
    </header>
  );
};
