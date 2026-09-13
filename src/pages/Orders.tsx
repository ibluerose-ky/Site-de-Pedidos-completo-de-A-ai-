import React from 'react';
import { ShoppingBag, Clock, ArrowRight, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { openWhatsAppOrder } from '../utils/whatsapp';
import { OrderStatus } from '../types';

export const Orders: React.FC = () => {
  const { orders, setActiveTab } = useApp();

  const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
    pending: { label: 'Aguardando confirmação', color: 'bg-amber-50 text-amber-900 border-amber-200', dot: 'bg-amber-400' },
    preparing: { label: 'Em preparação na cozinha', color: 'bg-blue-50 text-blue-900 border-blue-200', dot: 'bg-blue-500' },
    on_the_way: { label: 'Saiu para entrega', color: 'bg-purple-50 text-purple-900 border-purple-200', dot: 'bg-purple-600' },
    delivered: { label: 'Pedido Entregue', color: 'bg-emerald-50 text-emerald-900 border-emerald-200', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-900 border-red-200', dot: 'bg-red-500' },
  };

  return (
    <div className="px-4 max-w-4xl mx-auto py-4 pb-24">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Outfit',sans-serif]">
          Meus Pedidos
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Acompanhe seus pedidos em tempo real e reenvie para o WhatsApp se necessário
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-zinc-100 shadow-sm my-6">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#370544] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-bold text-zinc-900 text-sm">Você ainda não realizou pedidos</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-4">Escolha seu açaí favorito e faça seu primeiro pedido!</p>
          <button
            onClick={() => setActiveTab('menu')}
            className="py-2.5 px-5 bg-amber-400 text-purple-950 text-xs font-black rounded-xl hover:bg-amber-300 transition-all shadow-sm"
          >
            Fazer Meu Pedido
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const dateStr = new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                {/* Header: Order Number & Date */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#370544] font-['Outfit',sans-serif]">
                        Pedido #{order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dateStr}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {order.deliveryType === 'delivery' ? '🛵 Entrega em domicílio' : '🏪 Retirada no balcão'}
                    </span>
                  </div>

                  <span className="text-base font-black text-zinc-900 font-['Outfit',sans-serif]">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${status.color}`}>
                    <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                    <span>{status.label}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-zinc-50 rounded-xl p-2.5 text-xs text-zinc-700 space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span>{item.quantity}x {item.name} ({item.size.name})</span>
                      <span className="font-bold text-zinc-900">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                  {order.deliveryType === 'delivery' && (
                    <div className="flex justify-between text-zinc-500 text-[11px] pt-1 border-t border-zinc-200">
                      <span>Taxa de entrega</span>
                      <span>{formatCurrency(order.deliveryFee)}</span>
                    </div>
                  )}
                </div>

                {/* Actions: Re-send WhatsApp button */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Pagamento: <strong className="text-zinc-700 uppercase">{order.paymentMethod}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => openWhatsAppOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Abrir no WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
