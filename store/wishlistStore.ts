import { create } from 'zustand';
import api from '@/lib/api';
import { Wishlist } from '@/types';
import { useCartStore } from './cartStore';

interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  fetchWishlist: (host: string) => Promise<void>;
  addItem: (host: string, productId: string) => Promise<void>;
  removeItem: (host: string, itemId: string) => Promise<void>;
  moveToCart: (host: string, itemId: string) => Promise<void>;
  setWishlist: (wishlist: Wishlist | null) => void;
}

const GUEST_WISHLIST_TOKEN_KEY = 'guest_wishlist_token';

const updateTotals = (wishlist: Wishlist | null) => {
  if (!wishlist || !wishlist.wishlistItems) {
    return { totalItems: 0 };
  }
  return { totalItems: wishlist.wishlistItems.length };
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  loading: false,
  error: null,
  totalItems: 0,

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
      const { totalItems } = updateTotals(data);
      set({ wishlist: data, totalItems, loading: false });
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
      const { totalItems } = updateTotals(data);
      set({ wishlist: data, totalItems, loading: false });
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
      const { totalItems } = updateTotals(data);
      set({ wishlist: data, totalItems, loading: false });
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
      const { totalItems } = updateTotals(data.wishlist);
      set({ wishlist: data.wishlist, totalItems, loading: false });
      useCartStore.getState().setCart(data.cart);
      if (data.cartGuestToken) {
        localStorage.setItem('guest_cart_token', data.cartGuestToken);
      } else {
        localStorage.removeItem('guest_cart_token');
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to move item to cart', loading: false });
    }
  },

  setWishlist: (wishlist: Wishlist | null) => {
    const { totalItems } = updateTotals(wishlist);
    set({ wishlist, totalItems });
  },
}));