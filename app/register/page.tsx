"use client";

"use client";

import React, { useState } from 'react';
import api from '../../lib/api';
import { Box, Button, Container, TextField, Typography, Link as MuiLink, CircularProgress } from '@mui/material'; // Import MUI components
import Link from 'next/link'; // Import Next.js Link

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

      const { token } = response.data;
      if (token) {
        localStorage.setItem('jwt_token', token);
        localStorage.removeItem('guest_cart_token');
        localStorage.removeItem('guest_wishlist_token');
        setSuccess('Registration successful! You are now logged in.');
        window.location.href = '/';
      } else {
        setSuccess('Registration successful! Please check your email to confirm your account.');
      }

      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      bgcolor: 'black',
      py: 4,
    }}>
      <Box
        sx={{
          p: { xs: 3, sm: 5 },
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
          Créez votre compte
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="first-name"
            label="Prénom"
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
            label="Nom"
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
            label="Adresse e-mail"
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
            label="Mot de passe"
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
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
            <MuiLink component={Link} href="/login" variant="body2" sx={{ color: 'primary.light', textDecoration: 'none' }}>
              Déjà un compte ? Se connecter
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
