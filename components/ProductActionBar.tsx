"use client";

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
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
                onClick={() => onVariantChange(variant)}
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
            sx={{
              ml: 1.5,
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'grey.200'
              }
            }}
          >
            <AddShoppingCart />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<AddShoppingCart />}
            sx={{
              ml: 2,
              minWidth: '180px',
              bgcolor: 'white',
              color: 'black',
              '&:hover': {
                bgcolor: 'grey.200'
              }
            }}
          >
            Ajouter au Panier
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ProductActionBar;
