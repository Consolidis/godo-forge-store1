"use client";

import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Bienvenue, {user?.firstName || user?.email} !
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">Ceci est votre tableau de bord client.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Utilisez le menu à gauche pour naviguer dans votre espace personnel.
        </Typography>
      </Paper>
    </Box>
  );
}
