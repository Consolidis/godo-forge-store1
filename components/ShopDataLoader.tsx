"use client";

import { useEffect } from "react";
import { useShopStore } from "../store/shopStore";

export default function ShopDataLoader() {
  const { fetchShop } = useShopStore();

  useEffect(() => {
    const host = window.location.hostname;
    fetchShop(host);
  }, [fetchShop]);

  return null; // This component doesn't render anything visible
}
