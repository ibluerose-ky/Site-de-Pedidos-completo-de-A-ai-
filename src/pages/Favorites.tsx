import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const Favorites: React.FC = () => {
  const { favorites, setActiveTab } = useApp();

  const favoriteProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="px-4 max-w-4xl mx-auto py-4 pb-24">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Outfit',sans-serif] flex items-center gap-2">
          Meus Favoritos <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Seus açaís prediletos salvos para pedir com facilidade
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-zinc-100 shadow-sm my-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-bold text-zinc-900 text-sm">Você ainda não favoritou nenhum açaí</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Toque no ícone de coração nos cards de produtos para salvá-los aqui!
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="py-2.5 px-5 bg-amber-400 text-purple-950 text-xs font-black rounded-xl hover:bg-amber-300 transition-all shadow-sm"
          >
            Explorar Cardápio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
