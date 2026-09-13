export type CategoryId = 'acais' | 'tigelas' | 'smoothies' | 'combos' | 'promocoes' | 'complementos';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  badge?: string;
}

export interface SizeOption {
  id: string;
  name: string; // e.g., '300ml', '500ml', '700ml', '1 Litro'
  price: number;
  isPopular?: boolean;
}

export interface ToppingCategory {
  category: 'frutas' | 'cremes' | 'crocantes';
  categoryLabel: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: 'frutas' | 'cremes' | 'crocantes';
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  defaultSize: string;
  basePrice: number;
  categoryId: CategoryId;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isPopular?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  sizes: SizeOption[];
  allowedToppings?: string[]; // IDs or empty if all allowed
  maxFreeToppings?: number;
}

export interface CartItemTopping {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface CartItem {
  cartItemId: string; // unique generated ID
  productId: string;
  name: string;
  imageUrl: string;
  size: SizeOption;
  toppings: CartItemTopping[];
  observation?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryType = 'delivery' | 'pickup';

export type PaymentMethod = 'pix' | 'money' | 'card_delivery' | 'card_machine';

export interface CustomerData {
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  reference?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerData;
  deliveryType: DeliveryType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  needsChange?: boolean;
  changeFor?: string;
  observation?: string;
  status: OrderStatus;
}

export interface StoreConfig {
  name: string;
  tagline: string;
  whatsapp: string;
  displayPhone: string;
  instagram: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  minimumOrder: number;
  city: string;
  state: string;
  address: string;
  openingHours: string;
  pixKey: string;
  pixKeyType: string;
  pixReceiverName: string;
}
