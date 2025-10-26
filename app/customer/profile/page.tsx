"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, TextField, Button, CircularProgress, Alert } from '@mui/material';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useSnackbar } from 'notistack';

export default function CustomerProfilePage() {
  const { user, setUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.patch('/api/v1/customer/profile', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        // Email update is not allowed via PATCH for now
      });

      if (response.status === 200) {
        setSuccess('Profil mis à jour avec succès !');
        setUser(response.data); // Update user context
        enqueueSnackbar('Profil mis à jour !', { variant: 'success' });
      } else {
        setError(response.data.message || 'Erreur lors de la mise à jour du profil.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur inattendue est survenue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Mon Profil
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            disabled // Email update not allowed via this form
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
