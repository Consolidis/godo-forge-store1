"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardMedia, Typography, Button, Box, CardActions, IconButton, CircularProgress } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Import filled heart icon
import { useMediaQuery, useTheme } from '@mui/material'; // Import useMediaQuery and useTheme

import { ProductVariant } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSnackbar } from 'notistack';

import { convertUSDtoXAF } from '@/lib/currency';

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  variants?: ProductVariant[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  slug,
  price,
  image,
  variants = [],
}) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const { addItem: addCartItem } = useCartStore();
  const { addItem: addWishlistItem, wishlist } = useWishlistStore(); // Get wishlist state
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const displayVariants = variants.slice(0, 3);
  const currentVariant = variants[selectedVariant] || variants[0];
  // const displayPrice = currentVariant?.sellingPrice || currentVariant?.price || price;
  // const displayImage = currentVariant?.image || 'https://via.placeholder.com/400x400/0a0a0a/FFFFFF?text=Waltech';

  const isInWishlist = wishlist?.items?.some(item => item.product.id === id); // Check if product is in wishlist

   const displayPrice = currentVariant?.sellingPrice || currentVariant?.price || price;
  const displayPriceXAF = convertUSDtoXAF(displayPrice);
  const displayImage = currentVariant?.image || 'https://via.placeholder.com/400x400/0a0a0a/FFFFFF?text=Waltech';


  const handleAddToCart = async () => {
    if (!currentVariant || !currentVariant.id) {
      enqueueSnackbar('Please select a product variant.', { variant: 'warning' });
      return;
    }
    if (currentVariant.sellingPrice === null) { // Explicitly check sellingPrice
      enqueueSnackbar('This product variant is not available for purchase.', { variant: 'warning' });
      return;
    }

    setIsLoading(true); // Set loading to true
    try {
      const host = window.location.hostname; // Get host from client-side
      await addCartItem(host, currentVariant.id, 1); // Add 1 quantity
      enqueueSnackbar('Item added to cart!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add item to cart.', { variant: 'error' });
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const handleAddToWishlist = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsLoading(true); // Set loading to true for wishlist as well
    try {
      const host = window.location.hostname; // Get host from client-side
      await addWishlistItem(host, id); // Use product ID
      enqueueSnackbar('Item added to wishlist!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to add item to wishlist.', { variant: 'error' });
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  const isButtonDisabled = !currentVariant || !currentVariant.id || currentVariant.sellingPrice === null || isLoading; // Update disabled state

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        sx={{ 
          borderRadius: '1rem', 
          overflow: 'hidden', 
          boxShadow: isHovered ? '0px 10px 30px -5px rgba(0,0,0,0.3)' : '0px 5px 15px -5px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease-in-out',
          height: '100%'
        }}
      >
        <Box sx={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <Link href={`/shop/${slug}`} passHref>
              <CardMedia
                component="img"
                image={displayImage}
                alt={title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
          </Link>
          {/* Wishlist Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: isInWishlist ? 'red' : 'white', // Change color based on isInWishlist
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
              opacity: isMobile ? 1 : (isHovered ? 1 : 0), // Always visible on mobile
              transition: 'opacity 0.3s ease-in-out',
              zIndex: 1, // Ensure it's above the overlay
            }}
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
            disabled={isLoading} // Disable wishlist button during loading
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />)}
          </IconButton>
        </Box>

        <CardContent sx={{ pb: 0 }}>
          <Link href={`/shop/${slug}`} passHref>
              <Typography 
                gutterBottom 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'black', 
                  '&:hover': { color: 'grey.700' },
                  lineHeight: 1.2,
                  height: '2.4em', // for 2 lines
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {title}
              </Typography>
          </Link>



          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', my: 2 }}>
            {displayPriceXAF.toFixed(2)} FCFA
          </Typography>

          {displayVariants.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '32px' }}>
              {displayVariants.map((variant, index) => (
                <Box
                  key={variant.id}
                  onClick={() => setSelectedVariant(index)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: variant.color || '#1a1a1a',
                    border: '2px solid',
                    borderColor: selectedVariant === index ? 'primary.main' : 'grey.400',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    transform: selectedVariant === index ? 'scale(1.1)' : 'scale(1)',
                    '&:hover': {
                      borderColor: 'primary.light',
                    }
                  }}
                  title={variant.colorName || `Variante ${index + 1}`}
                  aria-label={variant.colorName || `Variante ${index + 1}`}
                />
              ))}
            </Box>
          )}
        </CardContent>
        
        <CardActions sx={{ p: 2, pt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCart />}
            sx={{ 
              py: 1.5, 
              borderRadius: '0.75rem',
              backgroundColor: 'black',
              '&:hover': {
                backgroundColor: 'grey.800'
              }
            }}
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter au Panier'}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ProductCard;