import React, { useState } from 'react';
import { 
  X, 
  Store, 
  TrendingUp, 
  Clock, 
  Package, 
  CheckCircle2, 
  Truck, 
  DollarSign, 
  Eye, 
  RefreshCw,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../utils/formatters';
import { OrderStatus } from '../types';

export const AdminModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, orders, updateOrderStatus, showToast } = useApp();
  const [adminTab, setAdminTab] = useState<'orders' | 'products' | 'metrics'>('orders');

  if (!isAdminOpen) return null;

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const statusMap: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: '🟡 Novo Pedido', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    preparing: { label: '🔵 Em Preparação', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    on_the_way: { label: '🛵 Saiu para Entrega', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    delivered: { label: '🟢 Entregue / Finalizado', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    cancelled: { label: '🔴 Cancelado', color: 'bg-red-100 text-red-900 border-red-300' },
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Status do pedido atualizado para ${statusMap[newStatus].label}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl max-h-[92vh] rounded-[28px] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2a0236] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black font-['Outfit',sans-serif]">Painel do Lojista</h2>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Modo Gestor
                </span>
              </div>
              <p className="text-[11px] text-purple-200">Gerenciamento de pedidos e cardápio</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setAdminTab('orders')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              adminTab === 'orders'
                ? 'border-purple-800 text-purple-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('metrics')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              adminTab === 'metrics'
                ? 'border-purple-800 text-purple-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Faturamento & Métricas</span>
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              adminTab === 'products'
                ? 'border-purple-800 text-purple-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Cardápio ({PRODUCTS.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: ORDERS */}
          {adminTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 text-xs">
                  Nenhum pedido recebido ainda.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-all space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-purple-950">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs font-semibold text-zinc-700">
                          • {ord.customer.name}
                        </span>
                      </div>

                      <span className="text-sm font-black text-purple-900">
                        {formatCurrency(ord.total)}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-700 space-y-1">
                      <div className="font-semibold text-zinc-900">
                        {ord.items.map(it => `${it.quantity}x ${it.name} (${it.size.name})`).join(', ')}
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {ord.deliveryType === 'delivery' 
                          ? `🛵 Entrega: ${ord.customer.street}, ${ord.customer.number} (${ord.customer.neighborhood})` 
                          : '🏪 Retirada no Balcão'
                        }
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Pagamento: <strong className="text-zinc-800 uppercase">{ord.paymentMethod}</strong>
                        {ord.changeFor && ` (Troco p/ ${ord.changeFor})`}
                      </p>
                    </div>

                    {/* Status change selector */}
                    <div className="pt-2 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusMap[ord.status].color}`}>
                        {statusMap[ord.status].label}
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Mudar status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className="text-xs bg-white border border-zinc-300 rounded-lg px-2 py-1 font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-purple-700"
                        >
                          <option value="pending">Novo</option>
                          <option value="preparing">Preparação</option>
                          <option value="on_the_way">Saiu p/ Entrega</option>
                          <option value="delivered">Finalizado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: METRICS */}
          {adminTab === 'metrics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-900 block">Faturamento</span>
                  <span className="text-lg font-black text-purple-950 font-['Outfit',sans-serif]">
                    {formatCurrency(totalRevenue)}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-900 block">Novos Pedidos</span>
                  <span className="text-lg font-black text-amber-950 font-['Outfit',sans-serif]">
                    {pendingOrders.length}
                  </span>
                </div>

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-900 block">Em Preparo</span>
                  <span className="text-lg font-black text-blue-950 font-['Outfit',sans-serif]">
                    {preparingOrders.length}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-900 block">Finalizados</span>
                  <span className="text-lg font-black text-emerald-950 font-['Outfit',sans-serif]">
                    {deliveredOrders.length}
                  </span>
                </div>
              </div>

              {/* Mais vendidos */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wide mb-3">
                  Produtos Mais Vendidos
                </h3>
                <div className="space-y-2">
                  {PRODUCTS.slice(0, 4).map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-zinc-200 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-950 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-zinc-900">{p.name}</span>
                      </div>
                      <span className="font-bold text-zinc-600">{formatCurrency(p.basePrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {adminTab === 'products' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-600">Catálogo Ativo</span>
                <span className="text-[11px] text-zinc-400">Total: {PRODUCTS.length} itens</span>
              </div>

              {PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-2.5 rounded-xl border border-zinc-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-purple-50"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-900">{prod.name}</h4>
                      <span className="text-[11px] text-zinc-400">{prod.defaultSize} • {formatCurrency(prod.basePrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Ativo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
          <span>Pronto para integração com Firebase / Banco SQL</span>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-2 rounded-xl bg-purple-950 text-white font-bold hover:bg-purple-900 transition-colors"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
