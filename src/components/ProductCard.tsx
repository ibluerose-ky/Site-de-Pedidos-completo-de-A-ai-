import React, { useState } from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductForModal, toggleFavorite, isFavorite } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const favorite = isFavorite(product.id);

  // Fallback açaí image if network fails
  const fallbackImage = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProductForModal(product)}
      className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-zinc-100 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Top badges & Favorite heart */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isPromo && (
          <span className="bg-amber-400 text-purple-950 font-black text-[10px] tracking-tight px-2 py-0.5 rounded-full shadow-sm">
            PROMO 🔥
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
        aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-zinc-400 hover:text-red-500 active:scale-90 transition-transform"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            favorite ? 'fill-red-500 text-red-500' : 'hover:stroke-red-500'
          }`} 
        />
      </button>

      {/* Image container */}
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-purple-50/50 mb-2 relative flex items-center justify-center">
        {!imageLoaded && !imgError && (
          <div className="absolute inset-0 bg-purple-100/60 animate-pulse" />
        )}
        <img
          src={imgError ? fallbackImage : product.imageUrl}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImgError(true);
            setImageLoaded(true);
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating tag if available */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-zinc-700">{product.rating.toFixed(1)}</span>
              {product.reviewCount && (
                <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
              )}
            </div>
          )}

          <h3 className="font-bold text-[13px] sm:text-sm text-zinc-900 leading-snug line-clamp-1 font-['Outfit',sans-serif]">
            {product.name}
          </h3>
          <p className="text-[11px] font-medium text-zinc-400 mt-0.5">
            {product.defaultSize}
          </p>
        </div>

        {/* Price and yellow "+" button */}
        <div className="mt-2 pt-1 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">a partir de</span>
            <span className="text-sm sm:text-base font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          {/* Yellow "+" action button matching screenshot */}
          <button
            id={`btn-add-quick-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            aria-label={`Personalizar e adicionar ${product.name}`}
            className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-purple-950 flex items-center justify-center shadow-sm font-bold transition-all group-hover:rotate-90 duration-200"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
