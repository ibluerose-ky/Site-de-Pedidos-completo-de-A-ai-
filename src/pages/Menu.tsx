import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { Filter, ArrowUpDown } from 'lucide-react';

export const Menu: React.FC = () => {
  const { selectedCategoryId, setSelectedCategoryId, searchQuery } = useApp();
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  const filtered = PRODUCTS.filter((prod) => {
    const matchCat = selectedCategoryId === 'all' || prod.categoryId === selectedCategoryId;
    const matchSearch = searchQuery.trim() === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
    return 0;
  });

  return (
    <div className="px-4 max-w-4xl mx-auto py-4 pb-24">
      {/* Title & Sorting Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Outfit',sans-serif]">
            Cardápio Completo
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Descubra todos os nossos açaís, tigelas artesanais e delícias
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 shadow-sm text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-purple-900" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-semibold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="default">Destaques</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            selectedCategoryId === 'all'
              ? 'bg-[#370544] text-amber-300 shadow-sm'
              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-purple-200'
          }`}
        >
          Todos os Produtos
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id as CategoryId)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategoryId === cat.id
                ? 'bg-[#370544] text-amber-300 shadow-sm'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-purple-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-zinc-100 shadow-sm my-6">
          <span className="text-3xl mb-2 block">🥣</span>
          <h3 className="font-bold text-zinc-800 text-sm">Nenhum item nesta categoria</h3>
          <p className="text-xs text-zinc-500 mt-1">Experimente trocar a categoria ou buscar outro termo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
