"use client";

import React, { useEffect } from 'react';
import { Box, Container, Typography, List, ListItem, ListItemButton, ListItemText, Divider, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

const customerMenuItems = [
  { text: 'Tableau de bord', href: '/customer' },
  { text: 'Mon Profil', href: '/customer/profile' },
  { text: 'Mes Commandes', href: '/customer/orders' },
  // { text: 'Mes Adresses', href: '/customer/addresses' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 8, minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Customer Area
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '250px' }, flexShrink: 0 }}>
          <List component="nav" aria-label="customer navigation">
            {customerMenuItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <ListItemButton component={Link} href={item.href} selected={pathname === item.href}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <List component="nav" aria-label="customer actions">
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/logout" sx={{ color: 'error.main' }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
}
