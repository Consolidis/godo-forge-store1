"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

interface OrderSuccessPageProps {
  params: {
    orderId: string;
  };
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ params }) => {
  const { orderId } = params;
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [orderStatus, setOrderStatus] = useState<'pending' | 'paid' | 'failed' | 'unknown'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await api.get(`/public/api/v1/orders/${orderId}/status`);
        setOrderStatus(response.data.status);
        if (response.data.status === 'paid') {
          clearCart(); // Clear cart on successful payment
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order status.');
        setOrderStatus('unknown');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId, clearCart]);

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'paid':
        return {
          icon: <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />,
          title: 'Payment Successful!',
          message: `Your order #${orderId} has been successfully placed and paid. A confirmation email has been sent to your inbox.`,
          color: 'success.main',
        };
      case 'pending':
        return {
          icon: <CircularProgress size={80} sx={{ color: 'warning.main' }} />,
          title: 'Payment Pending...',
          message: `Your order #${orderId} is awaiting payment confirmation. Please complete the payment using the provided instructions.`,
          color: 'warning.main',
        };
      case 'failed':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: 'Payment Failed!',
          message: `Your payment for order #${orderId} could not be processed. Please try again or contact support.`,
          color: 'error.main',
        };
      case 'unknown':
      default:
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />,
          title: 'Order Status Unknown',
          message: `We could not retrieve the status for order #${orderId}. Please check your email for confirmation or contact support.`,
          color: 'error.main',
        };
    }
  };

  const { icon, title, message, color } = getStatusMessage();

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
      <Box sx={{ p: 4, borderRadius: '12px', bgcolor: 'grey.900', color: 'white', boxShadow: 3 }}>
        {loading ? (
          <CircularProgress sx={{ color: 'white' }} />
        ) : (
          <>
            {icon}
            <Typography variant="h4" component="h1" sx={{ mt: 3, mb: 2, fontWeight: 'bold', color: color }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              {message}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <Button variant="contained" color="primary" onClick={() => router.push('/')} sx={{ mr: 2 }}>
              Continue Shopping
            </Button>
            {orderStatus === 'failed' && (
              <Button variant="outlined" color="error" onClick={() => router.push('/checkout')}>
                Try Payment Again
              </Button>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default OrderSuccessPage;