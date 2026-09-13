import React from 'react';
import { X, Bell, Percent, Sparkles, Truck, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, applyCoupon, setIsCartOpen } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#370544] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Outfit',sans-serif]">Notificações & Ofertas</h2>
              <span className="text-[11px] text-purple-200">Novidades imperdíveis da loja</span>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          {/* Promo 1 */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-purple-950">Cupom VERAOACAI</h4>
                <span className="text-[10px] text-zinc-400">Hoje</span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Aproveite R$ 5,00 de desconto em pedidos a partir de R$ 30,00.
              </p>
              <button
                onClick={() => {
                  applyCoupon('VERAOACAI');
                  setIsNotificationsOpen(false);
                  setIsCartOpen(true);
                }}
                className="mt-2 text-xs font-bold text-[#370544] flex items-center gap-1 hover:underline"
              >
                <Tag className="w-3.5 h-3.5" /> Aplicar no Carrinho
              </button>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950">Frete Grátis Especial</h4>
                <span className="text-[10px] text-zinc-400">Ativo</span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Faça seu pedido acima de R$ 70,00 e o frete fica 100% por nossa conta!
              </p>
            </div>
          </div>

          {/* Promo 3 */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Novo Sabor na Casa</h4>
                <span className="text-[10px] text-zinc-400">Novo</span>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5">
                Experimente nosso Creme Trufado de Ninho e a Tigela Ninho & Nutella.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
