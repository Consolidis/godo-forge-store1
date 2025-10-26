"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import AccountCircleIcon
import { usePathname, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore'; // Import useWishlistStore

const Header: React.FC = () => {
  const { isAuthenticated, logout, isInitialized } = useAuth(); // Get isInitialized
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false); // State to track if component has mounted on client
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const router = useRouter();
  const isShopPage = pathname.startsWith('/shop/');

  const { fetchCart, totalItems: cartCount } = useCartStore();
  const { fetchWishlist, totalItems: wishlistCount } = useWishlistStore();

  useEffect(() => {
    setMounted(true); // Set mounted to true after initial client-side render

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted && isInitialized) { // Only fetch cart on client after component has mounted and auth is initialized
      const host = window.location.hostname;
      fetchCart(host);
      fetchWishlist(host); // Fetch wishlist as well
    }
  }, [fetchCart, fetchWishlist, mounted, isInitialized]); // Dependency array includes fetchCart, fetchWishlist, mounted, and isInitialized

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '80px',
            gap: 2,
          }}
        >
          {/* Left Section - Auth Links */}
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, justifyContent: 'flex-start', alignItems: 'center' }}>
            {isInitialized && isAuthenticated ? (
              <IconButton
                component={Link}
                href="/customer"
                sx={{
                  color: '#9ca3af',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'transparent',
                  },
                }}
                aria-label="Mon Compte"
              >
                <AccountCircleIcon />
              </IconButton>
            ) : (
              <>
                {pathname !== '/' && (
                  <IconButton onClick={() => router.back()} sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="Retour">
                    <ArrowBackIcon />
                  </IconButton>
                )}
                {isMobile ? (
                  <IconButton component={Link} href="/login" sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="Se connecter">
                    <LoginIcon />
                  </IconButton>
                ) : (
                  <IconButton component={Link} href="/login" sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="Se connecter">
                    <LoginIcon />
                  </IconButton>
                )}
              </>
            )}
          </Box>

          {/* Center Section - Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', position: isMobile ? 'absolute' : 'static', left: '50%', transform: isMobile ? 'translateX(-50%)' : 'none' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h5"
                sx={{
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Waltech
              </Typography>
            </Link>
          </Box>

          {/* Right Section - Icons */}
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, justifyContent: 'flex-end', alignItems: 'center' }}>
            <IconButton
              component={Link}
              href="/wishlist"
              sx={{
                color: '#9ca3af',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
              }}
              aria-label="Liste de souhaits"
            >
              <Badge
                badgeContent={mounted && isInitialized ? wishlistCount : 0} // Apply badge to wishlist
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 600,
                  },
                }}
              >
                <FavoriteIcon />
              </Badge>
            </IconButton>

            <IconButton
              component={Link}
              href="/cart"
              sx={{
                color: '#9ca3af',
                '&:hover': {
                  color: '#fff',
                  backgroundColor: 'transparent',
                },
              }}
              aria-label="Panier"
            >
              <Badge
                badgeContent={mounted && isInitialized ? cartCount : 0} // Only show cartCount if mounted and auth is initialized
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 600,
                  },
                }}
              >
                <ShoppingBagIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;