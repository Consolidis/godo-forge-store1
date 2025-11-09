"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Shop } from '@/types';

import { getShopByHost } from '@/api/shop';



interface ShopContextType {



  shop: Shop | null;



  loading: boolean;



  error: string | null;



}







const ShopContext = createContext<ShopContextType | undefined>(undefined);







export const ShopProvider = ({ children }: { children: ReactNode }) => {



  const [shop, setShop] = useState<Shop | null>(null);



  const [loading, setLoading] = useState(true);



  const [error, setError] = useState<string | null>(null);







  useEffect(() => {



    const fetchShop = async () => {



      try {



        const shopData = await getShopByHost();



        setShop(shopData);



      } catch (err: any) {



        console.error("Failed to fetch shop data:", err);



        setError(err.message || 'Failed to load shop data.');



      } finally {



        setLoading(false);



      }



    };







    fetchShop();



  }, []);







  return (



    <ShopContext.Provider value={{ shop, loading, error }}>



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
