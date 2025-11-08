import { Shop } from '@/types';
import api from '../lib/api';

export const getShopByHost = async (): Promise<Shop> => {
  try {
    // The interceptor in ../lib/api will add the X-Shop-Domain and Authorization headers
    const response = await api.get<Shop>('/public/api/v1/shop');
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch shop data:`, error);
    throw error;
  }
};
