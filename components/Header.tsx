"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Container, useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { usePathname, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0); // TODO: Connect to cart state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const router = useRouter();
  const isShopPage = pathname.startsWith('/shop/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            {isAuthenticated ? (
              <Button
                onClick={logout}
                sx={{
                  color: '#9ca3af',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 300,
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Se déconnecter
              </Button>
            ) : (
              <>
                {isMobile ? (
                  <>
                    {isShopPage ? (
                      <IconButton onClick={() => router.back()} sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="Retour">
                        <ArrowBackIcon />
                      </IconButton>
                    ) : (
                      <IconButton component={Link} href="/register" sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="S'inscrire">
                        <PersonAddIcon />
                      </IconButton>
                    )}
                    <IconButton component={Link} href="/login" sx={{ color: '#9ca3af', '&:hover': { color: '#fff' } }} aria-label="Se connecter">
                      <LoginIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href="/register"
                      sx={{
                        color: '#9ca3af',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 300,
                        '&:hover': {
                          color: '#fff',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      S'inscrire
                    </Button>
                    <Button
                      component={Link}
                      href="/login"
                      sx={{
                        color: '#9ca3af',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 300,
                        '&:hover': {
                          color: '#fff',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      Se connecter
                    </Button>
                  </>
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
                  fontWeight: 700,
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
              <FavoriteIcon />
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
                badgeContent={cartCount}
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
