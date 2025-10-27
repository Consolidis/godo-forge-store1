"use client";

import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome, {user?.firstName || user?.email} !
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">This is your customer dashboard.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Use the menu on the left to navigate your personal area.
        </Typography>
      </Paper>
    </Box>
  );
}
