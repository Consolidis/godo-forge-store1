"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSnackbar } from 'notistack';
import { convertUSDtoXAF } from '@/lib/currency';

export default function CartPage() {
  const { cart, loading, error, fetchCart, updateItemQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false); // State to track if component has mounted on client

  useEffect(() => {
    setMounted(true); // Set mounted to true after initial client-side render
  }, []);

  useEffect(() => {
    if (mounted) { // Only fetch cart on client after component has mounted
      const host = window.location.hostname;
      fetchCart(host);
    }
  }, [mounted]); // Dependency array includes fetchCart and mounted

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
    } else {
      const host = window.location.hostname;
      await updateItemQuantity(host, itemId, newQuantity);
      enqueueSnackbar('Cart item quantity updated!', { variant: 'success' });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const host = window.location.hostname;
    await removeItem(host, itemId);
    enqueueSnackbar('Item removed from cart!', { variant: 'info' });
  };

  const handleClearCart = async () => {
    const host = window.location.hostname;
    await clearCart(host);
    enqueueSnackbar('Cart cleared!', { variant: 'info' });
  };

  if (loading || !mounted) { // Show loading or empty state until mounted and data is fetched
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black' }}>
        <Typography color="error">Erreur: {error}</Typography>
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            It seems you haven't added anything to your cart yet.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" color="primary" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
            Start Shopping
          </Button>
        </Container>
      );
    }

    return (
      <Container maxWidth="lg" sx={{ py: 8, bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Your Cart
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {cart.items.map((item) => (
              <Paper key={item.id} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', bgcolor: 'grey.900', color: 'white' }}>
                <Box sx={{ width: 100, height: 100, position: 'relative', mr: 2 }}>
                  <Image
                    src={item.productVariant.image || '/placeholder.png'}
                    alt={item.productVariant.name || item.productVariant.sku || 'Product Image'}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.productVariant.name || item.productVariant.sku}</Typography>
                  <Typography variant="body2" color="grey.400">
                    {item.productVariant.sellingPrice ? `${convertUSDtoXAF(item.productVariant.sellingPrice).toFixed(2)} FCFA` : `${convertUSDtoXAF(item.productVariant.price).toFixed(2)} FCFA`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} size="small" sx={{ color: 'white' }}>
                  <Remove />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} size="small" sx={{ color: 'white' }}>
                  <Add />
                </IconButton>
                <IconButton onClick={() => handleRemoveItem(item.id)} size="small" sx={{ color: 'red' }}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
          <Button onClick={handleClearCart} variant="outlined" color="error" startIcon={<Delete />} sx={{ mt: 2 }}>
            Vider le panier
          </Button>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, bgcolor: 'grey.900', color: 'white' }}>
            <Typography variant="h5" gutterBottom>Résumé de la commande</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Sous-total:</Typography>
              <Typography>{convertUSDtoXAF(totalPrice).toFixed(2)} FCFA</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Livraison:</Typography>
              <Typography>Calculé à la caisse</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid grey.700', pt: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">{convertUSDtoXAF(totalPrice).toFixed(2)} FCFA</Typography>
            </Box>
            <Button component={Link} href="/checkout" variant="contained" fullWidth sx={{ mt: 3, bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
              Passer à la caisse
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
