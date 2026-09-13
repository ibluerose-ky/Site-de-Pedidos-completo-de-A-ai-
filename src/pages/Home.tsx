import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { PromoBanner } from '../components/PromoBanner';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';
import { Flame, Sparkles, ChevronRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { searchQuery, selectedCategoryId, setSelectedCategoryId, setActiveTab } = useApp();

  // Filter products by search and category
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  // Featured sections when no active search
  const popularProducts = PRODUCTS.filter(p => p.isPopular);
  const promoProducts = PRODUCTS.filter(p => p.isPromo || p.categoryId === 'combos');
  const tigelas = PRODUCTS.filter(p => p.categoryId === 'tigelas');

  return (
    <div className="pb-24">
      {/* If search or category is active, show filtered results directly */}
      {(searchQuery.trim() !== '' || selectedCategoryId !== 'all') ? (
        <section className="px-4 max-w-4xl mx-auto py-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 font-['Outfit',sans-serif]">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Produtos Selecionados'}
            </h2>
            <span className="text-xs font-semibold text-zinc-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-zinc-100 shadow-sm my-4">
              <span className="text-3xl mb-2 block">🔍</span>
              <h3 className="font-bold text-zinc-800 text-sm">Nenhum produto encontrado</h3>
              <p className="text-xs text-zinc-500 mt-1">Tente pesquisar com outras palavras como "morango", "nutella" ou "tradicional".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Main "Mais pedidos" section matching reference */}
          <section className="px-4 max-w-4xl mx-auto pt-1 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif] tracking-tight">
                  Mais pedidos
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryId('acais');
                  setActiveTab('menu');
                }}
                className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-0.5"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2-column mobile grid matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {popularProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Promotional Yellow Banner matching screenshot */}
          <PromoBanner />

          {/* Combos & Promoções */}
          <section className="px-4 max-w-4xl mx-auto py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-800" />
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif] tracking-tight">
                  Combos & Ofertas da Semana
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryId('combos');
                  setActiveTab('menu');
                }}
                className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-0.5"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Tigelas Especiais */}
          <section className="px-4 max-w-4xl mx-auto py-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif] tracking-tight">
                Tigelas Especiais 🥣
              </h2>
              <button
                onClick={() => {
                  setSelectedCategoryId('tigelas');
                  setActiveTab('menu');
                }}
                className="text-xs font-semibold text-purple-900 hover:text-purple-700 flex items-center gap-0.5"
              >
                Ver todas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {tigelas.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
