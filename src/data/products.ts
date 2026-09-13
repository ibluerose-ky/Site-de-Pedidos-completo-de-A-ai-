import { Category, Product, Topping } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'acais', name: 'Açaís', iconName: 'CupSoda' },
  { id: 'tigelas', name: 'Tigelas', iconName: 'Utensils' },
  { id: 'smoothies', name: 'Smoothies', iconName: 'Coffee' },
  { id: 'combos', name: 'Combos', iconName: 'Package' },
  { id: 'promocoes', name: 'Promoções', iconName: 'Percent', badge: 'Ofertas' },
  { id: 'complementos', name: 'Complementos', iconName: 'Sparkles' },
];

export const TOPPINGS: Topping[] = [
  // Frutas Frescas
  { id: 'morango', name: 'Morango Fresco', price: 2.50, category: 'frutas' },
  { id: 'banana', name: 'Banana Fatiada', price: 1.50, category: 'frutas' },
  { id: 'kiwi', name: 'Kiwi em Pedaços', price: 2.50, category: 'frutas' },
  { id: 'manga', name: 'Manga Doce', price: 2.00, category: 'frutas' },
  { id: 'uva', name: 'Uva Verde sem Semente', price: 2.50, category: 'frutas' },
  
  // Cremes & Caldas
  { id: 'leite_condensado', name: 'Leite Condensado', price: 1.50, category: 'cremes' },
  { id: 'nutella', name: 'Nutella Pura Original', price: 3.50, category: 'cremes' },
  { id: 'creme_ninho', name: 'Creme Trufado de Ninho', price: 3.00, category: 'cremes' },
  { id: 'mel', name: 'Mel Puro Silvestre', price: 2.00, category: 'cremes' },
  { id: 'calda_chocolate', name: 'Calda Cremosa de Chocolate', price: 2.00, category: 'cremes' },
  { id: 'pasta_amendoim', name: 'Pasta de Amendoim Integral', price: 2.50, category: 'cremes' },

  // Crocantes & Secos
  { id: 'granola', name: 'Granola Crocante Especial', price: 1.50, category: 'crocantes' },
  { id: 'leite_po', name: 'Leite em Pó (Ninho)', price: 2.00, category: 'crocantes' },
  { id: 'pacoca', name: 'Paçoca de Rolha Moída', price: 1.50, category: 'crocantes' },
  { id: 'coco', name: 'Coco Ralado Flocado', price: 1.50, category: 'crocantes' },
  { id: 'confetes', name: 'M&Ms / Confetes Coloridos', price: 2.00, category: 'crocantes' },
  { id: 'castanhas', name: 'Castanha de Caju Triturada', price: 3.00, category: 'crocantes' },
  { id: 'amendoim', name: 'Xerém de Amendoim Crocante', price: 1.50, category: 'crocantes' },
  { id: 'gotas_chocolate', name: 'Gotas de Chocolate Meio Amargo', price: 2.00, category: 'crocantes' },
  { id: 'chocoball', name: 'Chocoball Crocante', price: 1.50, category: 'crocantes' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'acai-morango',
    name: 'Açaí com Morango',
    description: 'Açaí super cremoso servido com morangos frescos fatiados, rodelas de banana e granola crocante artesanal.',
    defaultSize: '300ml',
    basePrice: 18.90,
    categoryId: 'acais',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 142,
    isPopular: true,
    sizes: [
      { id: '300ml', name: '300ml', price: 18.90 },
      { id: '500ml', name: '500ml', price: 24.90, isPopular: true },
      { id: '700ml', name: '700ml', price: 31.90 },
      { id: '1000ml', name: '1 Litro', price: 42.90 },
    ]
  },
  {
    id: 'acai-tradicional',
    name: 'Açaí Tradicional',
    description: 'Açaí puro do Pará, textura aveludada, sem xarope em excesso. Monte do seu jeito com complementos favoritos.',
    defaultSize: '300ml',
    basePrice: 16.90,
    categoryId: 'acais',
    imageUrl: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 98,
    isPopular: true,
    sizes: [
      { id: '300ml', name: '300ml', price: 16.90 },
      { id: '500ml', name: '500ml', price: 22.90, isPopular: true },
      { id: '700ml', name: '700ml', price: 29.90 },
      { id: '1000ml', name: '1 Litro', price: 39.90 },
    ]
  },
  {
    id: 'tigela-tropical-supreme',
    name: 'Tigela Tropical Supreme',
    description: 'Na tigela gelada: Açaí premium com mix de kiwi, morango, banana, uva verde, chia e mel silvestre.',
    defaultSize: '500ml',
    basePrice: 27.90,
    categoryId: 'tigelas',
    imageUrl: 'https://images.unsplash.com/photo-1596483736504-f5d6067b5791?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewCount: 76,
    isPopular: true,
    sizes: [
      { id: '500ml', name: '500ml', price: 27.90, isPopular: true },
      { id: '700ml', name: '700ml', price: 34.90 },
      { id: '1000ml', name: '1 Litro', price: 46.90 },
    ]
  },
  {
    id: 'tigela-ninho-nutella',
    name: 'Tigela Ninho & Nutella',
    description: 'A queridinha dos chocólatras: camadas generosas de Nutella original, leite Ninho em pó, morangos e açaí.',
    defaultSize: '500ml',
    basePrice: 29.90,
    categoryId: 'tigelas',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 164,
    isPopular: true,
    sizes: [
      { id: '300ml', name: '300ml', price: 22.90 },
      { id: '500ml', name: '500ml', price: 29.90, isPopular: true },
      { id: '700ml', name: '700ml', price: 37.90 },
      { id: '1000ml', name: '1 Litro', price: 49.90 },
    ]
  },
  {
    id: 'smoothie-acai-banana',
    name: 'Smoothie Açaí Energy',
    description: 'Bebida super refrescante batida com açaí especial, banana prata gelada, água de coco e toque de mel.',
    defaultSize: '500ml',
    basePrice: 19.90,
    categoryId: 'smoothies',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 43,
    sizes: [
      { id: '400ml', name: '400ml', price: 16.90 },
      { id: '500ml', name: '500ml', price: 19.90, isPopular: true },
      { id: '700ml', name: '700ml', price: 24.90 },
    ]
  },
  {
    id: 'smoothie-berry-detox',
    name: 'Smoothie Purple Berry',
    description: 'Blend antioxidante de açaí puro batido com frutas vermelhas (mirtilo e morango) e hortelã fresca.',
    defaultSize: '500ml',
    basePrice: 21.90,
    categoryId: 'smoothies',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 31,
    sizes: [
      { id: '400ml', name: '400ml', price: 18.90 },
      { id: '500ml', name: '500ml', price: 21.90, isPopular: true },
    ]
  },
  {
    id: 'combo-casal',
    name: '🔥 Combo Casal Apaixonado',
    description: '2 Açaís de 500ml completos com direito a 3 complementos em cada copo + 1 água mineral gelada.',
    defaultSize: 'Combo (2x 500ml)',
    basePrice: 39.90,
    categoryId: 'combos',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewCount: 88,
    isPopular: true,
    isPromo: true,
    sizes: [
      { id: 'combo-padrao', name: '2x 500ml', price: 39.90, isPopular: true },
      { id: 'combo-mega', name: '2x 700ml', price: 52.90 },
    ]
  },
  {
    id: 'combo-familia-gigante',
    name: 'Combo Família 1 Litro + 4 Copinhos',
    description: '1 Pote térmico de 1 Litro de açaí puro + 4 copos de 250ml + 4 potinhos de complementos à sua escolha!',
    defaultSize: '1 Litro + Acomp.',
    basePrice: 59.90,
    categoryId: 'combos',
    imageUrl: 'https://images.unsplash.com/photo-1588708453479-7f5511b01267?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 52,
    sizes: [
      { id: 'combo-1l', name: '1 Pote de 1L + 4 Acomp.', price: 59.90 },
      { id: 'combo-2l', name: '2 Potes de 1L + 6 Acomp.', price: 99.90 },
    ]
  },
  {
    id: 'promo-quinta-acai',
    name: 'Promo Açaí 700ml Turbinado',
    description: 'Copo de 700ml com preço promocional de 500ml! Acompanha banana, granola crocante e leite condensado.',
    defaultSize: '700ml',
    basePrice: 24.90,
    categoryId: 'promocoes',
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 115,
    isPromo: true,
    sizes: [
      { id: '700ml-promo', name: '700ml Especial', price: 24.90, isPopular: true },
    ]
  },
  {
    id: 'pote-extra-nutella',
    name: 'Pote Extra de Nutella 100g',
    description: 'Potinho selado com Nutella 100% original para você despejar no seu açaí.',
    defaultSize: '100g',
    basePrice: 8.50,
    categoryId: 'complementos',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { id: '100g', name: 'Pote 100g', price: 8.50 },
      { id: '200g', name: 'Pote 200g', price: 15.00 },
    ]
  },
  {
    id: 'pote-extra-ninho',
    name: 'Pote Extra Leite Ninho Flocado',
    description: 'Porção reforçada de leite em pó Ninho legítimo para cobrir seu açaí.',
    defaultSize: '80g',
    basePrice: 5.00,
    categoryId: 'complementos',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    sizes: [
      { id: '80g', name: 'Pote 80g', price: 5.00 },
    ]
  }
];
