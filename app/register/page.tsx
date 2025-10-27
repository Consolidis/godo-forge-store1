"use client";

import React, { useState } from 'react';
import api from '../../lib/api';
import { Box, Button, Container, TextField, Typography, Link as MuiLink, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore'; // Import useCartStore
import { useWishlistStore } from '@/store/wishlistStore'; // Import useWishlistStore

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const headers: Record<string, string> = {};
      const guestCartToken = localStorage.getItem('guest_cart_token');
      const guestWishlistToken = localStorage.getItem('guest_wishlist_token');

      if (guestCartToken) {
        headers['X-Guest-Cart-Token'] = guestCartToken;
      }
      if (guestWishlistToken) {
        headers['X-Guest-Wishlist-Token'] = guestWishlistToken;
      }

      const response = await api.post('/public/customer/register', {
        email,
        password,
        firstName,
        lastName,
      }, { headers });

      console.log('Registration API response:', response.data); // Debug log

      const { token, cart = null, wishlist = null } = response.data; // Extract cart and wishlist from response
      if (token) {
        console.log('Token received, proceeding with login logic.'); // Debug log
        localStorage.setItem('jwt_token', token);
        localStorage.removeItem('guest_cart_token');
        localStorage.removeItem('guest_wishlist_token');

        // Update Zustand stores directly
        if (cart) {
          useCartStore.getState().setCart(cart);
          if (cart.guestToken) { // Update guest cart token in localStorage if returned
            localStorage.setItem('guest_cart_token', cart.guestToken);
          } else {
            localStorage.removeItem('guest_cart_token');
          }
        }
        if (wishlist) {
          useWishlistStore.getState().setWishlist(wishlist);
          if (wishlist.guestToken) { // Update guest wishlist token in localStorage if returned
            localStorage.setItem('guest_wishlist_token', wishlist.guestToken);
          } else {
            localStorage.removeItem('guest_wishlist_token');
          }
        }

        setSuccess('Registration successful! You are now logged in.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        console.log('No token received, assuming email confirmation needed.'); // Debug log
        setSuccess('Registration successful! Please check your email to confirm your account.');
      }

      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    } catch (err: any) {
      console.error('Registration API error:', err.response?.data || err); // Debug log
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess(null); // Ensure success message is cleared on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 'calc(100vh - 128px)',
      bgcolor: 'black',
      py: 4,
    }}>

      <br/><br /><br />
      <Box
        sx={{
          p: { xs: 3, sm: 5 },
          pt: 4, // Add top padding to push content down
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
          bgcolor: 'grey.900',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        
        <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'white', fontWeight: 'bold' }}>
          Create your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first-name"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.700' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { color: 'grey.400' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="last-name"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.700' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { color: 'grey.400' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.700' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { color: 'grey.400' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'grey.700' },
                '&:hover fieldset': { borderColor: 'grey.500' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { color: 'grey.400' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
            }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              {success}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              bgcolor: 'primary.main',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Signing Up...' : "Sign Up"}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
            <MuiLink component={Link} href="/login" variant="body2" sx={{ color: 'primary.light', textDecoration: 'none' }}>
              Already have an account? Log In
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}