"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSnackbar } from 'notistack';
import { useShop } from '@/context/ShopContext';
import { convertPrice, formatPrice } from '@/lib/currency';

export default function CartPage() {
  const { shop, loading: shopLoading } = useShop();
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

  const getFormattedPrice = (priceInUSD: number) => {
    if (shopLoading) return '...';
    const converted = convertPrice(priceInUSD, shop);
    return formatPrice(converted.value, converted.currencyCode);
  };

  if (loading || !mounted || shopLoading) { // Show loading or empty state until mounted and data is fetched
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: { xs: 4, md: 6 } }}>
          Your Cart
        </Typography>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Cart Items Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cart.items.map((item) => (
                <Paper key={item.id} elevation={3} sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', bgcolor: 'grey.900', color: 'white', borderRadius: '12px' }}>
                  <Box sx={{ width: { xs: '100%', sm: 120 }, height: 120, position: 'relative', mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, borderRadius: '8px', overflow: 'hidden' }}>
                    <Image
                      src={item.productVariant.image || '/placeholder.png'}
                      alt={item.productVariant.name || 'Product Image'}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Typography variant="h6" component="div">{item.productVariant.product.title}</Typography>
                    <Typography variant="body2" color="grey.400" sx={{ mb: 1 }}>
                      {item.productVariant.name}
                    </Typography>
                    <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                      {item.productVariant.sellingPrice ? getFormattedPrice(item.productVariant.sellingPrice) : 'Price not available'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, sm: 0 } }}>
                    <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} size="small" sx={{ color: 'white' }}>
                      <Remove />
                    </IconButton>
                    <Typography sx={{ mx: 2, fontWeight: 'bold' }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} size="small" sx={{ color: 'white' }}>
                      <Add />
                    </IconButton>
                    <IconButton onClick={() => handleRemoveItem(item.id)} size="small" sx={{ color: '#f44336', ml: 2 }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              {cart.items.length > 0 && (
                <Button onClick={handleClearCart} variant="outlined" color="error" startIcon={<Delete />} sx={{ mt: 2, alignSelf: 'flex-start' }}>
                  Vider le panier
                </Button>
              )}
            </Box>
          </Grid>

          {/* Order Summary Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'grey.900', color: 'white', borderRadius: '12px', position: { md: 'sticky' }, top: { md: 100 } }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Résumé de la commande</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Typography color="grey.400">Sous-total:</Typography>
                <Typography sx={{ fontWeight: 'medium' }}>{getFormattedPrice(totalPrice)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography color="grey.400">Livraison:</Typography>
                <Typography sx={{ fontWeight: 'medium' }}>Calculé à la caisse</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'grey.700', pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{getFormattedPrice(totalPrice)}</Typography>
              </Box>
              <Button component={Link} href="/checkout" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, borderRadius: '8px', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
                Passer à la caisse
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
}