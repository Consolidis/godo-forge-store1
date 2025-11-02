"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { convertUSDtoXAF } from '../../../lib/currency';

import { Container, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProductActionBar from '../../../components/ProductActionBar';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSnackbar } from 'notistack';

interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string; // Assuming a more detailed description
  imageUrl: string;
  price: number;
  variants: ProductVariant[]; // Assuming product has variants
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  image?: string;
  // Add other variant properties like color, size, etc.
}

export default function ProductDetailPage({ params, searchParams }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined }; }) {
  const { slug } = params;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const { addItem: addWishlistItem } = useWishlistStore();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const response = await api.get(`/public/api/v1/products/${slug}`);
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToWishlist = async () => {
    if (!product || !product.id) {
      enqueueSnackbar('Product not found.', { variant: 'warning' });
      return;
    }
    const host = window.location.hostname; // Get host from client-side
    await addWishlistItem(host, product.id); // Use product ID
    enqueueSnackbar('Item added to wishlist!', { variant: 'success' });
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

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'black' }}>
        <Typography color="white">Produit introuvable.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'black', color: 'white', pb: '120px', pt: '100px' }}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: 4 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h3" component="h1" fontWeight="bold">
              {product.title}
            </Typography>
            <IconButton
              sx={{ color: 'white' }}
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>

          <Box 
            component="img"
            src={selectedVariant?.image || product.imageUrl}
            alt={product.title}
            sx={{ 
              width: '100%', 
              maxWidth: '500px', 
              height: 'auto', 
              borderRadius: '1rem', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
            }}
          />

          <Typography variant="h5" fontWeight="bold" color="primary.light">
            {selectedVariant?.sellingPrice ? `${new Intl.NumberFormat('fr-FR').format(convertUSDtoXAF(selectedVariant.sellingPrice))} FCFA` : ''}
          </Typography>

          <Typography 
            variant="body1" 
            color="grey.300"
            sx={{ 
              maxWidth: '70ch', 
              lineHeight: 1.8, 
              '& img': { 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '0.75rem', 
                my: 2 
              } 
            }}
            dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
          />
        </Box>
      </Container>

      {product.variants && product.variants.length > 0 && (
        <ProductActionBar 
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
        />
      )}
    </Box>
  );
}