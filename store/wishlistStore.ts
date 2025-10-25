import { create } from 'zustand';
import api from '@/lib/api';
import { Wishlist, WishlistItem, Product } from '@/types';

interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
  fetchWishlist: (host: string) => Promise<void>;
  addItem: (host: string, productId: string) => Promise<void>;
  removeItem: (host: string, itemId: string) => Promise<void>;
  moveToCart: (host: string, itemId: string) => Promise<void>; // New function
  getTotalItems: () => number;
}

const GUEST_WISHLIST_TOKEN_KEY = 'guest_wishlist_token';

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  loading: false,
  error: null,

  fetchWishlist: async (host: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem(GUEST_WISHLIST_TOKEN_KEY);
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Wishlist-Token'] = guestToken;
      }

      const response = await api.get('/public/api/v1/wishlist', { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (data.guestToken && data.guestToken !== guestToken) {
        localStorage.setItem(GUEST_WISHLIST_TOKEN_KEY, data.guestToken);
      }
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', loading: false });
    }
  },

  addItem: async (host: string, productId: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem(GUEST_WISHLIST_TOKEN_KEY);
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Wishlist-Token'] = guestToken;
      }

      const response = await api.post('/public/api/v1/wishlist/items', { productId }, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (data.guestToken && data.guestToken !== guestToken) {
        localStorage.setItem(GUEST_WISHLIST_TOKEN_KEY, data.guestToken);
      }
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add item to wishlist', loading: false });
    }
  },

  removeItem: async (host: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem(GUEST_WISHLIST_TOKEN_KEY);
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Wishlist-Token'] = guestToken;
      }

      const response = await api.delete(`/public/api/v1/wishlist/items/${itemId}`, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (data.guestToken && data.guestToken !== guestToken) {
        localStorage.setItem(GUEST_WISHLIST_TOKEN_KEY, data.guestToken);
      }
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove item from wishlist', loading: false });
    }
  },

  moveToCart: async (host: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      const guestToken = localStorage.getItem(GUEST_WISHLIST_TOKEN_KEY);
      const headers: Record<string, string> = { 'X-Shop-Domain': host };
      if (guestToken) {
        headers['X-Guest-Wishlist-Token'] = guestToken;
      }

      const response = await api.post(`/public/api/v1/wishlist/items/${itemId}/moveToCart`, {}, { headers });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

      if (data.guestToken && data.guestToken !== guestToken) {
        localStorage.setItem(GUEST_WISHLIST_TOKEN_KEY, data.guestToken);
      }
      set({ wishlist: data.wishlist, loading: false }); // Assuming backend returns updated wishlist
      // Optionally, you might want to trigger a cart fetch here if the cart store is separate
      useCartStore.getState().setCart(data.cart); // Update cart state
      if (data.cartGuestToken) {
        localStorage.setItem('guest_cart_token', data.cartGuestToken);
      } else {
        localStorage.removeItem('guest_cart_token');
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to move item to cart', loading: false });
    }
  },

  getTotalItems: () => {
    const wishlist = get().wishlist;
    return wishlist ? wishlist.items.length : 0;
  },
}));
