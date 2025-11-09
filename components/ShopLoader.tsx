"use client";

import React, { ReactNode } from 'react';
import { useShop } from '@/context/ShopContext';
import { Box, CircularProgress, Typography, Button, Container } from '@mui/material';

interface ShopLoaderProps {
  children: ReactNode;
}

const ShopLoader: React.FC<ShopLoaderProps> = ({ children }) => {
  const { loading: shopLoading, error: shopError } = useShop();

  const handleReload = () => {
    window.location.reload();
  };

  if (shopLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress /> &nbsp;&nbsp; Loading Shop
      </Box>
    );
  }

  if (shopError) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center', bgcolor: 'black', color: 'white' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error Loading Shop
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {shopError}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Reload
        </Button>
      </Container>
    );
  }

  return <>{children}</>;
};

export default ShopLoader;
