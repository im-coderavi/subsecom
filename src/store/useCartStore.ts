import { create } from 'zustand';
import { Product, Bundle } from '../types';

export interface CartItem {
  id: string; // can be product id or bundle id
  name: string;
  price: number;
  originalPrice: number;
  logo: string;
  isBundle: boolean;
  quantity: number;
  bundleType?: 'creator' | 'pro' | 'ultimate';
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number; // percentage (e.g. 10 for 10%)
  addItem: (product: Product) => void;
  addBundleItem: (bundle: Bundle) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    discount: number;
    total: number;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  promoCode: null,
  promoDiscount: 0,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id && !item.isBundle);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id && !item.isBundle
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.monthlyPrice,
            originalPrice: product.originalPrice,
            logo: product.logo,
            isBundle: false,
            quantity: 1,
          },
        ],
      };
    });
  },

  addBundleItem: (bundle) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === bundle.id && item.isBundle);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === bundle.id && item.isBundle
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: bundle.id,
            name: bundle.name,
            price: bundle.price,
            originalPrice: bundle.price * (1 + bundle.savingPercent / 100),
            logo: 'Sparkles', // Bundle logo placeholder
            isBundle: true,
            quantity: 1,
            bundleType: bundle.colorTheme,
          },
        ],
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },

  applyPromo: (code) => {
    const uppercaseCode = code.toUpperCase();
    if (uppercaseCode === 'AINEST10' || uppercaseCode === 'PROMO10') {
      set({ promoCode: uppercaseCode, promoDiscount: 10 });
      return true;
    } else if (uppercaseCode === 'LAUNCH20' || uppercaseCode === 'SUMMER20') {
      set({ promoCode: uppercaseCode, promoDiscount: 20 });
      return true;
    }
    return false;
  },

  removePromo: () => {
    set({ promoCode: null, promoDiscount: 0 });
  },

  clearCart: () => {
    set({ items: [], promoCode: null, promoDiscount: 0 });
  },

  getTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal * (get().promoDiscount / 100);
    const total = subtotal - discount;
    return { subtotal, discount, total };
  },
}));
