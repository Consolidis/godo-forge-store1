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

export default function HomePageClient() {
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
        <img src={shopInfo?.themeCustomization?.logo} style={{height:'20%', width:'40%'}}/>
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
              <img src={shopInfo?.themeCustomization?.logo} style={{height:'20%', width:'50%'}}/>
            </motion.h1>
            
           
           
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
             

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
                     open my account
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
          title="The Must-Sees"
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
            Welcome, {user?.email?.split('@')[0] || 'Utilisateur'}!
          </h3>
          <p className="text-gray-400 mb-6">
            Enjoy a personalized experience and exclusive offers.
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
            Redefine Your Style
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
            Explore Now
          </Button>
        </div>
        
        <br /><br /><br />
      </motion.section>
      
    </div>
  );
}