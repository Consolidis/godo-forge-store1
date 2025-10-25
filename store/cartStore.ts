import { create } from 'zustand';
import api from '@/lib/api';
import { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
  fetchCart: (host: string) => Promise<void>;
  addItem: (host: string, productVariantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (host: string, itemId: string, quantity: number) => Promise<void>;
  removeItem: (host: string, itemId: string) => Promise<void>;
  clearCart: (host: string) => Promise<void>;
  mergeCart: (host: string, guestToken: string) => Promise<void>;
  setCart: (cart: Cart | null) => void;
}

const updateTotals = (cart: Cart | null) => {
  if (!cart || !cart.items) {
    return { totalItems: 0, totalPrice: 0 };
  }

  const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.items.reduce((total, item) => {
    const price = item.productVariant.sellingPrice ?? item.productVariant.price;
    return total + (price * item.quantity);
  }, 0);

  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,

  fetchCart: async (host: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem('guest_cart_token');
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Cart-Token'] = guestToken;
      }
      const response = await api.get('/public/api/v1/cart', { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) {
        localStorage.setItem('guest_cart_token', data.guestToken);
      } else {
        localStorage.removeItem('guest_cart_token');
      }
    } catch (error: any) {
      console.error('Full error fetching cart:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });
    }
  },

  addItem: async (host: string, productVariantId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem('guest_cart_token');
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Cart-Token'] = guestToken;
      }
      const response = await api.post('/public/api/v1/cart/items', { productVariantId, quantity }, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) {
        localStorage.setItem('guest_cart_token', data.guestToken);
      } else {
        localStorage.removeItem('guest_cart_token');
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add item to cart', loading: false });
    }
  },

  updateItemQuantity: async (host: string, itemId: string, quantity: number) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem('guest_cart_token');
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) { headers['X-Guest-Cart-Token'] = guestToken; }
      const response = await api.patch(`/public/api/v1/cart/items/${itemId}`, { quantity }, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update item quantity', loading: false });
    }
  },

  removeItem: async (host: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem('guest_cart_token');
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) { headers['X-Guest-Cart-Token'] = guestToken; }
      const response = await api.delete(`/public/api/v1/cart/items/${itemId}`, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove item from cart', loading: false });
    }
  },

  clearCart: async (host: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem('guest_cart_token');
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) { headers['X-Guest-Cart-Token'] = guestToken; }
      const response = await api.post('/public/api/v1/cart/clear', {}, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to clear cart', loading: false });
    }
  },

  mergeCart: async (host: string, guestToken: string) => {
    set({ loading: true, error: null });
    try {
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      const response = await api.post('/public/api/v1/cart/merge', { guestToken }, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const { totalItems, totalPrice } = updateTotals(data);
      set({ cart: data, totalItems, totalPrice, loading: false });
      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to merge cart', loading: false });
    }
  },

  setCart: (cart: Cart | null) => {
    const { totalItems, totalPrice } = updateTotals(cart);
    set({ cart, totalItems, totalPrice });
  },
}));