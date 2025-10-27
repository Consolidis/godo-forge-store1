"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuth } from "../providers/AuthProvider";
import HorizontalProductGrid from '../components/HorizontalProductGrid';
import { Button, Box, Typography } from '@mui/material';
import Link from 'next/link';

interface ShopInfo {
  name: string;
  themeCustomization: {
    logo: string;
    description: string;
  };
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string; // Assuming an imageUrl is available
  price: number; // Assuming a price is available
}

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shop information
        const shopResponse = await api.get('/public/api/v1/shop');
        setShopInfo(shopResponse.data);

        // Fetch products
        const productsResponse = await api.get('/public/api/v1/products');
        setProducts(productsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <br/><br /><br />
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              Style={{color:'white'}}
              className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text "
            >
              {shopInfo?.name || 'Waltechvv'}
            </motion.h1>
            
            {shopInfo?.themeCustomization?.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
                dangerouslySetInnerHTML={{ __html: shopInfo.themeCustomization.description }}
              />
            )}

            <br /><br /><br /><br />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', alignItems: 'center' }}> */}
            {/* <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              Discover the Collection
            </Typography> */}
            {/* <Typography variant="h6" sx={{ color: 'grey.400', mb: 4 }}>
              Explore our exclusive collection of smartwatches that combine cutting-edge technology with refined design.
            </Typography> */}

           
          {/* </Box> */}

        {/* Must-Haves Section */}
        {/* <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom color="white">
            Must-Haves
          </Typography>
        </Box> */}

        {/* Call to Action Section */}
        {/* <Box sx={{ py: 8, bgcolor: 'grey.900', textAlign: 'center' }}> */}
          {/* <Typography variant="h5" component="h3" sx={{ color: 'white', mb: 3 }}>
            Ready to redefine your time?
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400', mb: 4 }}>
            Join the Watchtech revolution. Explore our smartwatches and find the one that suits you.
          </Typography>
          <Button component={Link} href="/shop" variant="contained" sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
            Explore Now
          </Button> */}
        {/* </Box> */}

        <br /><br />
                {!isAuthenticated && (
                  <Button
                    component={Link}
                    href="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderRadius: '9999px',
                      px: 4,
                      py: 1.5,
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: 'grey.400', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    Créer un Compte
                  </Button>
                )}

                <br /><br />
              
            </motion.div>
          </motion.div>
        </div>

        <br />

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-gray-600 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <HorizontalProductGrid
          title="Les Incontournables"
          titleColor="white"
          products={products}
        />
      )}

      {/* Welcome Section for Authenticated Users */}
      {isAuthenticated && user && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 max-w-7xl mx-auto px-6 lg:px-8 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            Bienvenue, {user?.email?.split('@')[0] || 'Utilisateur'}!
          </h3>
          <p className="text-gray-400 mb-6">
            Profitez d'une expérience personnalisée et d'offres exclusives.
          </p>
        </motion.section>
      )}

      <br /><br /><br />

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Redéfinissez votre Style
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
            {shopInfo.themeCustomization.description}
          </p>

          <br /><br />
          <Button
            component={Link}
            href="/shop"
            variant="contained"
            size="large"
            sx={{
              borderRadius: '9999px',
              px: 5,
              py: 2,
              bgcolor: 'white',
              color: 'black',
              '&:hover': { bgcolor: 'grey.200' }
            }}
          >
            Explorer Maintenant
          </Button>
        </div>
        
        <br /><br /><br />
      </motion.section>
      
    </div>
  );
}
