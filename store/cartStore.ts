import { create } from 'zustand';
import api from '@/lib/api';
import { Cart, CartItem, ProductVariant } from '@/types'; // Assuming these types are defined in '@/types'

interface CartState {

  cart: Cart | null;

  loading: boolean;

  error: string | null;

  fetchCart: (host: string) => Promise<void>;

  addItem: (host: string, productVariantId: string, quantity: number) => Promise<void>;

  updateItemQuantity: (host: string, itemId: string, quantity: number) => Promise<void>;

  removeItem: (host: string, itemId: string) => Promise<void>;

  clearCart: (host: string) => Promise<void>;

  mergeCart: (host: string, guestToken: string) => Promise<void>;

  setCart: (cart: Cart | null) => void; // New method

  getTotalItems: () => number;

  getTotalPrice: () => number;

}



export const useCartStore = create<CartState>((set, get) => ({

  cart: null,

  loading: false,

  error: null,



  fetchCart: async (host: string) => {

    set({ loading: true, error: null });

    try {

      const guestToken = localStorage.getItem('guest_cart_token'); // Get guest token from localStorage

      const headers: Record<string, string> = { 'X-Shop-Domain': host };

      if (guestToken) {

        headers['X-Guest-Cart-Token'] = guestToken; // Send guest token to API

      }

      const response = await api.get('/public/api/v1/cart', { headers });

      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      console.log('Cart after fetch:', data); // Debug log

      set({ cart: data, loading: false });

      if (data.guestToken) {

        localStorage.setItem('guest_cart_token', data.guestToken);

      } else {

        localStorage.removeItem('guest_cart_token'); // Clear if no guest token returned

      }

    } catch (error: any) {

      set({ error: error.response?.data?.message || 'Failed to fetch cart', loading: false });

    }

  },



  addItem: async (host: string, productVariantId: string, quantity: number) => {

    set({ loading: true, error: null });

    try {

      const guestToken = localStorage.getItem('guest_cart_token'); // Get guest token from localStorage

      const headers: Record<string, string> = { 'X-Shop-Domain': host };

      if (guestToken) {

        headers['X-Guest-Cart-Token'] = guestToken; // Send guest token to API

      }

      const response = await api.post('/public/api/v1/cart/items', { productVariantId, quantity }, { headers });

      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      console.log('Cart after add:', data); // Debug log

      set({ cart: data, loading: false });

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

      set({ cart: data, loading: false });

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

      set({ cart: data, loading: false });

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

      set({ cart: data, loading: false });

      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }

    } catch (error: any) {

      set({ error: error.response?.data?.message || 'Failed to clear cart', loading: false });

    }

  },



  mergeCart: async (host: string, guestToken: string) => {

    set({ loading: true, error: null });

    try {

      const headers: Record<string, string> = { 'X-Shop-Domain': host };

      // No need to send X-Guest-Cart-Token here, as it's part of the request body

      const response = await api.post('/public/api/v1/cart/merge', { guestToken }, { headers });

      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      set({ cart: data, loading: false });

      if (data.guestToken) { localStorage.setItem('guest_cart_token', data.guestToken); } else { localStorage.removeItem('guest_cart_token'); }

    } catch (error: any) {

      set({ error: error.response?.data?.message || 'Failed to merge cart', loading: false });

    }

  },



  setCart: (cart: Cart | null) => { // New method implementation

    set({ cart });

  },



  getTotalItems: () => {

    const cart = get().cart;

    return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  },



  getTotalPrice: () => {

    const cart = get().cart;

    // Assuming ProductVariant has a 'sellingPrice' or 'price'

    return cart ? cart.items.reduce((total, item) => {

      const price = item.productVariant.sellingPrice || item.productVariant.price;

      return total + (price * item.quantity);

    }, 0) : 0;

  },

}));