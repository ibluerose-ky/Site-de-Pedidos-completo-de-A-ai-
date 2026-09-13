import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  CartItem, 
  Product, 
  Order, 
  CustomerData, 
  OrderStatus, 
  CategoryId 
} from '../types';
import { STORE_CONFIG, COUPONS } from '../config/store';

interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation & Tabs
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategoryId: CategoryId | 'all';
  setSelectedCategoryId: (catId: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode: string;
  appliedCoupon: typeof COUPONS[string] | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Delivery Choice
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Modals & Sheets
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isMenuDrawerOpen: boolean;
  setIsMenuDrawerOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Customer Profile
  customer: CustomerData;
  updateCustomer: (data: Partial<CustomerData>) => void;
  saveCustomerPermanently: (data: CustomerData) => void;

  // Orders History
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CART: 'acai_cart_v1',
  CUSTOMER: 'acai_customer_v1',
  FAVORITES: 'acai_favorites_v1',
  ORDERS: 'acai_orders_v1',
  DELIVERY_TYPE: 'acai_delivery_type_v1',
};

const DEFAULT_CUSTOMER: CustomerData = {
  name: '',
  phone: '',
  cep: '78005-000',
  street: 'Rua das Palmeiras',
  number: '123',
  neighborhood: 'Centro',
  city: 'Cuiabá',
  state: 'MT',
  complement: '',
  reference: 'Próximo à praça',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Delivery Choice
  const [deliveryType, setDeliveryTypeState] = useState<'delivery' | 'pickup'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERY_TYPE);
      return saved === 'pickup' ? 'pickup' : 'delivery';
    } catch {
      return 'delivery';
    }
  });

  const setDeliveryType = (type: 'delivery' | 'pickup') => {
    setDeliveryTypeState(type);
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_TYPE, type);
    } catch (e) {
      console.error(e);
    }
  };

  // Cart State with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['acai-morango'];
    } catch {
      return ['acai-morango'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos ❤️', 'info');
      return updated;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Customer Profile
  const [customer, setCustomer] = useState<CustomerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER;
    } catch {
      return DEFAULT_CUSTOMER;
    }
  });

  const updateCustomer = (data: Partial<CustomerData>) => {
    setCustomer(prev => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const saveCustomerPermanently = (data: CustomerData) => {
    setCustomer(data);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(data));
      showToast('Dados salvos com sucesso! ✅', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // Orders History
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'ord_demo_1024',
          orderNumber: '1024',
          createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          customer: DEFAULT_CUSTOMER,
          deliveryType: 'delivery',
          items: [
            {
              cartItemId: 'item_1',
              productId: 'acai-morango',
              name: 'Açaí com Morango',
              imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
              size: { id: '500ml', name: '500ml', price: 24.90 },
              toppings: [
                { id: 'morango', name: 'Morango Fresco', price: 2.50 },
                { id: 'granola', name: 'Granola Crocante Especial', price: 1.50 },
                { id: 'leite_po', name: 'Leite em Pó (Ninho)', price: 2.00 },
              ],
              quantity: 1,
              unitPrice: 30.90,
              totalPrice: 30.90,
            }
          ],
          subtotal: 30.90,
          deliveryFee: 5.00,
          discount: 0,
          total: 35.90,
          paymentMethod: 'pix',
          observation: 'Entregar o mais rápido possível.',
          status: 'preparing',
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order => {
    const nextNumber = (1024 + orders.length + 1).toString();
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber: nextNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
  };

  // Coupons
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[string] | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => {
    const unitPrice = item.unitPrice;
    const totalPrice = unitPrice * item.quantity;
    
    // Check if an exact match exists (same product, size, and toppings)
    setCart(prev => {
      const toppingsKey = (item.toppings || []).map(t => `${t.id}_${t.quantity || 1}`).sort().join('|');
      const obsKey = (item.observation || '').trim();

      const existingIndex = prev.findIndex(p => {
        const pToppingsKey = (p.toppings || []).map(t => `${t.id}_${t.quantity || 1}`).sort().join('|');
        const pObsKey = (p.observation || '').trim();
        return p.productId === item.productId && 
               p.size.id === item.size.id && 
               pToppingsKey === toppingsKey && 
               pObsKey === obsKey;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + item.quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: existing.unitPrice * newQty,
        };
        return updated;
      }

      const newCartItem: CartItem = {
        ...item,
        cartItemId: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        totalPrice,
      };
      return [...prev, newCartItem];
    });

    showToast('✅ Açaí adicionado ao carrinho!', 'success');
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty,
        };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removido do carrinho', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculations
  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup' || cart.length === 0) return 0;
    if (STORE_CONFIG.freeDeliveryThreshold && subtotal >= STORE_CONFIG.freeDeliveryThreshold) {
      return 0;
    }
    return STORE_CONFIG.deliveryFee;
  }, [deliveryType, cart.length, subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minSubtotal) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [cart.length, subtotal, deliveryFee, discount]);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS[cleanCode];

    if (!coupon) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (subtotal < coupon.minSubtotal) {
      return { 
        success: false, 
        message: `Cupom válido somente para pedidos a partir de R$ ${coupon.minSubtotal.toFixed(2)}.` 
      };
    }

    setAppliedCoupon(coupon);
    setCouponCode(cleanCode);
    showToast(`Cupom ${cleanCode} aplicado! 🎉`, 'success');
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Cupom removido', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryType,
        setDeliveryType,
        favorites,
        toggleFavorite,
        isFavorite,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        isMenuDrawerOpen,
        setIsMenuDrawerOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAdminOpen,
        setIsAdminOpen,
        customer,
        updateCustomer,
        saveCustomerPermanently,
        orders,
        createOrder,
        updateOrderStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
