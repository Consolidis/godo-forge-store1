import { create } from 'zustand';
import api from '@/lib/api';
import { Shop } from '@/types';

interface ShopState {
  shop: Shop | null;
  loading: boolean;
  error: string | null;
  fetchShop: (host: string) => Promise<void>;
}

export const useShopStore = create<ShopState>((set) => ({
  shop: null,
  loading: false,
  error: null,

  fetchShop: async (host: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/public/api/v1/shop', { headers: { 'X-Shop-Domain': host } });
      set({ shop: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch shop info', loading: false });
    }
  },
}));
