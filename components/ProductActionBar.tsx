"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip, useTheme, useMediaQuery, IconButton, Snackbar, CircularProgress } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

import { useCartStore } from '@/store/cartStore';
import { useSnackbar } from 'notistack';
import { useShop } from '@/context/ShopContext';
import { convertPrice, formatPrice } from '@/lib/currency';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  image?: string; // Assuming variants have images
}

interface ProductActionBarProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

const ProductActionBar: React.FC<ProductActionBarProps> = ({ variants, selectedVariant, onVariantChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const { shop, loading: shopLoading } = useShop();
  const { addItem } = useCartStore();
  const { enqueueSnackbar } = useSnackbar();

  const handleVariantClick = (variant: ProductVariant) => {
    onVariantChange(variant);
    if (isMobile) {
      const price = variant.sellingPrice;
      if (price && !shopLoading) {
        const converted = convertPrice(price, shop);
        const formatted = formatPrice(converted.value, converted.currencyCode);
        setSnackbarMessage(formatted);
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.id) {
      enqueueSnackbar('Please select a product variant.', { variant: 'warning' });
      return;
    }
    if (selectedVariant.sellingPrice === null) { // Explicitly check sellingPrice
      enqueueSnackbar('This product variant is not available for purchase.', { variant: 'warning' });
      return;
    }

    setIsLoading(true); // Set loading to true
    try {
      const host = window.location.hostname; // Get host from client-side
      await addItem(host, selectedVariant.id, 1); // Add 1 quantity
      enqueueSnackbar('Item added to cart!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add item to cart.', { variant: 'error' });
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const displayPriceUSD = selectedVariant?.sellingPrice;
  const convertedPrice = displayPriceUSD ? convertPrice(displayPriceUSD, shop) : null;
  const formattedPrice = convertedPrice ? formatPrice(convertedPrice.value, convertedPrice.currencyCode) : '';

  const isButtonDisabled = !selectedVariant || !selectedVariant.id || selectedVariant.sellingPrice === null || isLoading; // Update disabled state

  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '80px', px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Typography variant="subtitle1" sx={{ mr: 2, color: 'grey.400', display: { xs: 'none', sm: 'block' } }}>
            Variantes:
          </Typography>
          {variants.map((variant) => (
            <Tooltip title={variant.name} key={variant.id}>
              <Avatar
                src={variant.image || 'https://via.placeholder.com/40'} // Fallback image
                alt={variant.name}
                onClick={() => handleVariantClick(variant)}
                sx={{
                  width: 48,
                  height: 48,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: selectedVariant?.id === variant.id ? 'primary.main' : 'grey.700',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.light',
                    transform: 'scale(1.1)'
                  },
                  transform: selectedVariant?.id === variant.id ? 'scale(1.1)' : 'scale(1)',
                }}
              />
            </Tooltip>
          ))}
        </Box>
        
        {isMobile ? (
          <IconButton
            color="secondary"
            size="large"
            disabled={isButtonDisabled}
            sx={{
              ml: 1.5,
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'grey.200'
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.400'
              }
            }}
            onClick={handleAddToCart}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : <AddShoppingCart />}
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            disabled={isButtonDisabled}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCart />}
            sx={{
              ml: 2,
              minWidth: '220px', // Increased width to accommodate price
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'grey.200'
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.400',
                color: 'grey.700'
              }
            }}
            onClick={handleAddToCart}
          >
            {isLoading ? 'Ajout en cours...' : `Ajouter au Panier ${shopLoading ? '...' : (formattedPrice ? `(${formattedPrice})` : '')}`}
          </Button>
        )}
      </Toolbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} 
        sx={{ bottom: { xs: 90, sm: 90 } }} // Position above the action bar
      />
    </AppBar>
  );
};

export default ProductActionBar;