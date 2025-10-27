"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import api from '@/lib/api';
import { useSnackbar } from 'notistack';
import { Order } from '@/types'; // Assuming Order type is defined

export default function CustomerOrdersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/customer/orders');
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors de la récupération des commandes.');
        enqueueSnackbar('Erreur lors de la récupération des commandes.', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [enqueueSnackbar]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        My Orders
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        {orders.length === 0 ? (
          <Typography>You haven't placed any orders yet.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">{order.total_price.toFixed(2)} $</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
