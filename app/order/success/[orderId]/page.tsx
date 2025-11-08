"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams(); // Get search params
  const ussdCode = searchParams.get('ussdCode'); // Get ussdCode from query
  const { clearCart } = useCartStore();
  const [orderStatus, setOrderStatus] = useState<'pending' | 'paid' | 'failed' | 'unknown'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchOrderStatus = async () => {
      try {
        const response = await api.get(`/public/api/v1/orders/${orderId}/status`);
        const newStatus = response.data.status;
        setOrderStatus(newStatus);
        setLoading(false); // Set loading to false after first fetch

        if (newStatus === 'paid') {
          clearCart(); // Clear cart on successful payment
          if (intervalId) clearInterval(intervalId); // Stop polling
        } else if (newStatus === 'failed') {
          if (intervalId) clearInterval(intervalId); // Stop polling
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order status.');
        setOrderStatus('unknown');
        setLoading(false); // Set loading to false on error
        if (intervalId) clearInterval(intervalId); // Stop polling on error
      }
    };

    // Initial fetch
    fetchOrderStatus();

    // Poll every 5 seconds if status is pending
    intervalId = setInterval(() => {
      if (orderStatus === 'pending' || orderStatus === 'unknown') { // Continue polling if pending or unknown
        fetchOrderStatus();
      } else {
        clearInterval(intervalId); // Stop polling if status is paid, failed, or known
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, clearCart, orderStatus]); // Add orderStatus to dependency array to re-evaluate polling condition

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

            {orderStatus === 'pending' && ussdCode && (
                <Box sx={{ mt: 3, mb: 4, p: 3, bgcolor: 'grey.800', borderRadius: '8px' }}>
                    <Typography variant="h6" component="p" sx={{ mb: 1 }}>
                        Dial the code below to complete your payment:
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {ussdCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        If you do not receive any prompt or pending transaction, ensure that your account balance is sufficient or check your internet connection.
                    </Typography>
                </Box>
            )}

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