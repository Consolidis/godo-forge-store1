"use client";

import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useShop } from '@/context/ShopContext';
import { convertPrice, formatPrice } from '../lib/currency';
import Link from 'next/link';

import { Container, Box, Typography, CircularProgress, IconButton, Button, Rating, Card, CardContent, CardMedia, Grid } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProductActionBar from './ProductActionBar';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSnackbar } from 'notistack';
import type { Review } from '../types'; // Import Review type

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

export default function ProductDetailPageClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const { shop, loading: shopLoading } = useShop();
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

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product?.id) return;
      setReviewsLoading(true);
      try {
        const response = await api.get(`/public/api/v1/products/${product.id}/reviews`);
        setReviews(response.data.reviews || []);
      } catch (err: any) {
        setReviewsError(err.response?.data?.message || 'Failed to fetch reviews.');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product?.id]);

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

  const displayPriceUSD = selectedVariant?.sellingPrice || selectedVariant?.price || 0;
  const convertedPrice = convertPrice(displayPriceUSD, shop);
  const formattedPrice = formatPrice(convertedPrice.value, convertedPrice.currencyCode);

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: selectedVariant?.image || product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: selectedVariant?.sellingPrice || product.price,
      priceCurrency: 'XAF',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <Box sx={{ bgcolor: 'black', color: 'white', pb: '120px', pt: '100px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 4 }}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px' }}> {/* Wrapper for image and icon */}
            <Box
              component="img"
              src={selectedVariant?.image || product.imageUrl}
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
                zIndex: 1,
                display: { xs: 'block', md: 'none' } // Only show on mobile
              }}
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant={{ xs: 'h4', md: 'h3' }} component="h1" fontWeight="bold">
              {product.title}
            </Typography>
            <IconButton
              sx={{ color: 'white', display: { xs: 'none', md: 'block' } }} // Only show on desktop
              onClick={handleAddToWishlist}
              aria-label="Add to wishlist"
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Box>
          <Typography variant="h5" fontWeight="bold" color="primary.light">
            {shopLoading ? '...' : (selectedVariant?.sellingPrice ? formattedPrice : '')}
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

          {/* Product Reviews Section */}
          <Box sx={{ width: '100%', maxWidth: '70ch', mt: 4, textAlign: 'left' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Product Reviews
            </Typography>
            {reviewsLoading ? (
              <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />
            ) : reviewsError ? (
              <Typography color="error">{reviewsError}</Typography>
            ) : reviews.length === 0 ? (
              <Typography variant="body2" color="grey.500">
                No reviews yet. Be the first to review this product!
              </Typography>
            ) : (
              <Box>
                {reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, bgcolor: 'grey.900', color: 'white' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>{review.author}</Typography>
                        <Rating value={review.score} readOnly size="small" sx={{ color: 'primary.light' }} />
                        <Typography variant="caption" color="grey.500" sx={{ ml: 'auto' }}>
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>{review.content}</Typography>
                      {review.images && review.images.length > 0 && (
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {review.images.map((image, index) => (
                            <Grid item key={index} xs={4} sm={3} md={2}>
                              <CardMedia
                                component="img"
                                image={image.url}
                                alt={`Review image ${index + 1}`}
                                sx={{ height: 80, objectFit: 'cover', borderRadius: 1 }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/shop"
            sx={{ mt: 4, py: 1.5, px: 4, borderRadius: '8px', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}
          >
            Explore More
          </Button>
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