"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shop } from '@/types';
import { getShopByHost } from '@/api/shop'; // We'll need to create this API function

interface ShopContextType {
  shop: Shop | null;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await getShopByHost();
        setShop(shopData);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
        // Handle error appropriately, maybe set an error state
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, []);

  return (
    <ShopContext.Provider value={{ shop, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
