import { create } from 'zustand';
import api from '@/lib/api';
import { Wishlist, WishlistItem, Product } from '@/types'; // Assuming these types are defined in '@/types'

interface WishlistState {
  wishlist: Wishlist | null;
  loading: boolean;
  error: string | null;
  fetchWishlist: (host: string) => Promise<void>;
  addItem: (host: string, productId: string) => Promise<void>;
  removeItem: (host: string, itemId: string) => Promise<void>;
  // moveToCart: (host: string, itemId: string) => Promise<void>; // Will implement later if needed
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  loading: false,
  error: null,

  fetchWishlist: async (host: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/public/api/v1/wishlist', { headers: { 'X-Shop-Domain': host } });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', loading: false });
    }
  },

  addItem: async (host: string, productId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/public/api/v1/wishlist/items', { productId }, { headers: { 'X-Shop-Domain': host } });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add item to wishlist', loading: false });
    }
  },

  removeItem: async (host: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/public/api/v1/wishlist/items/${itemId}`, { headers: { 'X-Shop-Domain': host } });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      set({ wishlist: data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to remove item from wishlist', loading: false });
    }
  },

  getTotalItems: () => {
    const wishlist = get().wishlist;
    return wishlist ? wishlist.items.length : 0;
  },
}));
