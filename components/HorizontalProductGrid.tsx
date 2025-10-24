"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

import { Box, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

import { Product } from '@/types';

interface HorizontalProductGridProps {
  title?: string;
  products: Product[];
}

const HorizontalProductGrid: React.FC<HorizontalProductGridProps> = ({
  title = "Notre Sélection",
  products,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl lg:text-5xl font-bold text-black mb-12 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        {/* Horizontal Scroll Container */}
        <Box className="relative group">
          {/* Left Arrow - Desktop only */}
          {showLeftArrow && (
            <Box sx={{ 
              position: 'absolute', 
              left: 0, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 10,
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              '.group:hover &' : {
                opacity: 1
              }
            }}>
              <IconButton
                onClick={() => scroll('left')}
                aria-label="Défiler vers la gauche"
                sx={{
                  bgcolor: 'white',
                  border: '2px solid #e5e7eb',
                  boxShadow: 3,
                  ml: 2,
                  display: { xs: 'none', lg: 'flex' },
                  '&:hover': {
                    bgcolor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                <ArrowBackIosNew />
              </IconButton>
            </Box>
          )}

          {/* Products Grid */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-none w-[280px] sm:w-[320px] lg:w-[340px] snap-start"
              >
                <ProductCard
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  price={product.variants?.[0]?.sellingPrice || product.variants?.[0]?.price || 0}
                  image={product.variants?.[0]?.image || product.imageUrl || ''}
                  variants={product.variants}
                />
              </motion.div>
            ))}
          </div>

          {/* Right Arrow - Desktop only */}
          {showRightArrow && (
            <Box sx={{ 
              position: 'absolute', 
              right: 0, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              zIndex: 10,
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              '.group:hover &' : {
                opacity: 1
              }
            }}>
              <IconButton
                onClick={() => scroll('right')}
                aria-label="Défiler vers la droite"
                sx={{
                  bgcolor: 'white',
                  border: '2px solid #e5e7eb',
                  boxShadow: 3,
                  mr: 2,
                  display: { xs: 'none', lg: 'flex' },
                  '&:hover': {
                    bgcolor: 'black',
                    color: 'white',
                    borderColor: 'black'
                  }
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Scroll Indicator - Mobile */}
        <div className="lg:hidden mt-4 text-center">
          <p className="text-sm text-gray-500">
            Faites glisser pour voir plus →
          </p>
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HorizontalProductGrid;
