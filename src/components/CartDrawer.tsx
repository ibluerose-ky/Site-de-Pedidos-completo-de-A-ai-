import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { STORE_CONFIG } from '../config/store';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    deliveryType,
    setDeliveryType,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  const isMinOrderReached = subtotal >= STORE_CONFIG.minimumOrder;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div 
        className="flex-1 hidden sm:block cursor-pointer"
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Drawer content */}
      <div 
        className="bg-[#fcfafc] w-full sm:max-w-md h-full flex flex-col shadow-2xl animate-slide-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#370544] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Outfit',sans-serif]">
                Seu Carrinho
              </h2>
              <span className="text-xs text-purple-200">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'} no pedido
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-purple-200 hover:text-white underline px-1"
                title="Esvaziar carrinho"
              >
                Limpar
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-[#370544] mb-4">
              <ShoppingBag className="w-10 h-10 opacity-70" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif]">
              Seu carrinho está vazio
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xs mt-1 mb-6">
              Que tal saborear um açaí cremoso bem geladinho com seus adicionais preferidos?
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="py-3 px-6 rounded-2xl bg-amber-400 text-purple-950 font-bold text-sm hover:bg-amber-300 transition-all shadow-sm"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <>
            {/* Delivery option inside cart */}
            <div className="p-3 bg-purple-50/80 border-b border-purple-100">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-purple-200">
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    deliveryType === 'delivery'
                      ? 'bg-[#3b0764] text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  🛵 Entrega (+{formatCurrency(STORE_CONFIG.deliveryFee)})
                </button>
                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    deliveryType === 'pickup'
                      ? 'bg-[#3b0764] text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  🏪 Retirada (Grátis)
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white rounded-2xl p-3 border border-zinc-200 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-purple-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="inline-block text-[11px] font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md mt-0.5">
                        Tamanho: {item.size.name}
                      </span>

                      {/* Toppings list */}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-1.5 text-[11px] text-zinc-600 space-y-0.5">
                          <p className="font-semibold text-zinc-700">Complementos:</p>
                          <p className="text-zinc-500 leading-tight">
                            {item.toppings.map(t => t.name).join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Observation */}
                      {item.observation && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded mt-1 italic">
                          Obs: {item.observation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity and subtotal row */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-1">
                    <div className="flex items-center gap-1.5 bg-zinc-100 p-0.5 rounded-xl border border-zinc-200">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-zinc-700 font-bold active:scale-90"
                        aria-label="Diminuir"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-zinc-700 font-bold active:scale-90"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block leading-none">Subtotal</span>
                      <span className="text-sm font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Box */}
            <div className="px-4 py-2 border-t border-zinc-100 bg-white">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Cupom {appliedCoupon.code} aplicado (-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : formatCurrency(appliedCoupon.discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-emerald-900 hover:text-red-600 font-semibold underline ml-2"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="Cupom (ex: VERAOACAI)"
                      className="w-full text-xs font-semibold px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-600 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-purple-950 text-white rounded-xl text-xs font-bold hover:bg-purple-900 transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Order Pricing Summary */}
            <div className="p-4 bg-white border-t border-zinc-200 shadow-md">
              <div className="space-y-1.5 text-xs text-zinc-600 mb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-zinc-900'}`}>
                    {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto cupom</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-100 flex justify-between text-base font-black text-zinc-900 font-['Outfit',sans-serif]">
                  <span>Total</span>
                  <span className="text-[#370544] text-lg font-black">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Minimum order check */}
              {!isMinOrderReached && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Pedido mínimo é de {formatCurrency(STORE_CONFIG.minimumOrder)}. Adicione mais itens.</span>
                </div>
              )}

              {/* Checkout Button */}
              <button
                id="btn-checkout-continue"
                disabled={!isMinOrderReached}
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] text-purple-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition-all font-['Outfit',sans-serif]"
              >
                <span>CONTINUAR PEDIDO</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
