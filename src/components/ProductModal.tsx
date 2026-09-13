import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Check, Star, Sparkles, MessageSquare } from 'lucide-react';
import { Product, SizeOption, CartItemTopping } from '../types';
import { TOPPINGS } from '../data/products';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useApp();

  // State
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<CartItemTopping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [observation, setObservation] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'todos' | 'frutas' | 'cremes' | 'crocantes'>('todos');

  // Initialize or reset when product changes
  useEffect(() => {
    if (product) {
      // Pick popular size or first
      const popular = product.sizes.find(s => s.isPopular) || product.sizes[0];
      setSelectedSize(popular);
      setSelectedToppings([]);
      setQuantity(1);
      setObservation('');
      setActiveCategoryFilter('todos');
    }
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product || !selectedSize) return null;

  // Toggle topping
  const handleToggleTopping = (topping: typeof TOPPINGS[0]) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      } else {
        return [...prev, { id: topping.id, name: topping.name, price: topping.price, quantity: 1 }];
      }
    });
  };

  const isToppingSelected = (id: string) => {
    return selectedToppings.some(t => t.id === id);
  };

  // Unit price = size price + sum of toppings
  const unitPrice = useMemo(() => {
    const base = selectedSize.price;
    const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price * (t.quantity || 1), 0);
    return base + toppingsTotal;
  }, [selectedSize, selectedToppings]);

  const totalPrice = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      size: selectedSize,
      toppings: selectedToppings,
      observation: observation.trim() || undefined,
      quantity,
      unitPrice,
    });
    onClose();
  };

  const filteredToppings = TOPPINGS.filter(t => {
    if (activeCategoryFilter === 'todos') return true;
    return t.category === activeCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-t-[32px] sm:rounded-[28px] overflow-hidden flex flex-col shadow-2xl animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Header */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white active:scale-95 shadow-md flex items-center justify-center text-zinc-700 transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-4">
          {/* Hero Product Image */}
          <div className="relative w-full h-52 sm:h-60 bg-purple-100 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400 text-purple-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Personalizável
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] leading-tight">
                {product.name}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 border-b border-zinc-100">
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Step 1: Escolha o Tamanho */}
          <div className="p-4 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Passo 1</span>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 font-['Outfit',sans-serif]">
                  Escolha o Tamanho
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full">
                Obrigatório (1)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {product.sizes.map((size) => {
                const isSelected = selectedSize.id === size.id;
                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/30'
                        : 'border-zinc-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-zinc-900">{size.name}</span>
                        {size.isPopular && (
                          <span className="text-[9px] font-bold bg-amber-400 text-purple-950 px-1.5 py-0.2 rounded-full">
                            Top
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-purple-900 mt-0.5 block">
                        {formatCurrency(size.price)}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-zinc-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Complementos e Adicionais */}
          <div className="p-4 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Passo 2</span>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 font-['Outfit',sans-serif]">
                  Adicione Complementos
                </h3>
              </div>
              <span className="text-[11px] font-medium text-zinc-500">
                {selectedToppings.length} selecionado{selectedToppings.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Filter pills for complements */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar text-xs">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'frutas', label: '🍓 Frutas' },
                { id: 'cremes', label: '🍫 Cremes & Caldas' },
                { id: 'crocantes', label: '🥜 Crocantes' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveCategoryFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                    activeCategoryFilter === pill.id
                      ? 'bg-[#3b0764] text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Toppings Grid/List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredToppings.map((topping) => {
                const selected = isToppingSelected(topping.id);
                return (
                  <div
                    key={topping.id}
                    onClick={() => handleToggleTopping(topping)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selected
                        ? 'border-purple-600 bg-purple-50/50'
                        : 'border-zinc-200 hover:border-purple-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        selected ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-zinc-800">
                        {topping.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-md">
                      +{formatCurrency(topping.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Observações do Item */}
          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-4 h-4 text-purple-800" />
              <label htmlFor="input-item-obs" className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
                Alguma observação para este item?
              </label>
            </div>
            <textarea
              id="input-item-obs"
              rows={2}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Leite condensado bem no fundo, sem granola..."
              className="w-full p-2.5 text-xs text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity and Big Add Button */}
        <div className="p-4 border-t border-zinc-100 bg-white shadow-lg flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-zinc-100 rounded-2xl p-1 shrink-0 border border-zinc-200">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-white disabled:opacity-40 flex items-center justify-center text-zinc-700 active:scale-95 shadow-sm font-bold"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-zinc-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-zinc-700 active:scale-95 shadow-sm font-bold"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            id="btn-add-to-cart-modal"
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-purple-950 font-black text-sm sm:text-base flex items-center justify-between shadow-md shadow-amber-400/20 transition-all font-['Outfit',sans-serif]"
          >
            <span>ADICIONAR AO CARRINHO</span>
            <span className="bg-purple-950 text-amber-300 text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
