"use client";

import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore'; // To move items to cart
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function WishlistPage() {
  const { wishlist, loading, error, fetchWishlist, removeItem, moveToCart } = useWishlistStore(); // Add moveToCart
  const { addItem: addCartItem } = useCartStore(); // Renamed to avoid conflict
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const host = window.location.hostname;
    fetchWishlist(host);
  }, [fetchWishlist]);

  const handleRemoveItem = async (itemId: string) => {
    const host = window.location.hostname;
    await removeItem(host, itemId);
    enqueueSnackbar('Item removed from wishlist!', { variant: 'info' });
  };

  const handleMoveToCart = async (wishlistItemId: string) => { // Change parameter name to wishlistItemId
    const host = window.location.hostname;
    await moveToCart(host, wishlistItemId); // Call moveToCart from store
    enqueueSnackbar('Item moved to cart!', { variant: 'success' });
    // Optionally, you might want to trigger a cart fetch here if the cart store is separate
    useCartStore.getState().fetchCart(host); // Fetch cart to update badge
    router.push('/cart'); // Redirect to cart page
  };

  if (loading) {
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

  if (!wishlist || !Array.isArray(wishlist.items) || wishlist.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center', bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Votre liste de souhaits est vide
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Il semble que vous n'ayez encore rien ajouté à votre liste de souhaits.
        </Typography>
        <Button component={Link} href="/shop" variant="contained" color="primary" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
          Commencer vos achats
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8, bgcolor: 'black', color: 'white', minHeight: '100vh' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Votre Liste de Souhaits
      </Typography>

      <Grid container spacing={4}>
        {wishlist.items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.900', color: 'white', height: '100%' }}>
              <Box sx={{ width: '100%', height: 200, position: 'relative', mb: 2 }}>
                <Image
                  src={item.product.variants?.[0]?.image || '/placeholder.png'} // Assuming product has variants and an image
                  alt={item.product.title}
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                <Link href={`/shop/${item.product.slug}`} style={{ color: 'white', textDecoration: 'none' }}>
                  {item.product.title}
                </Link>
              </Typography>
              <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCart />}
                  onClick={() => handleMoveToCart(item.id)} // Pass item.id
                  sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}
                >
                  Ajouter au Panier
                </Button>
                <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
