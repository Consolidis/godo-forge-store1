"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import ShopStatusPage from "../components/ShopStatusPage";
import { useShopStore } from "../store/shopStore";
import { ReactNode } from "react";

export default function ShopProvider({ children }: { children: ReactNode }) {
  const { shop, loading, error } = useShopStore();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading shop...</Typography>
      </Box>
    );
  }

  if (error) {
    return <ShopStatusPage message="Error loading shop" reason={error} />;
  }

  if (shop) {
    if (!shop.is_active) {
      return <ShopStatusPage message="Shop is currently inactive" reason="Please contact the shop owner." />;
    }
    if (!shop.template || !shop.templateAppliedAt) {
      return <ShopStatusPage message="Shop is not configured" reason="A template has not been applied to this shop yet." />;
    }
  }

  return <>{children}</>;
}
