/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Alert } from '@mui/material';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { convertUSDtoXAF, USD_TO_XAF_RATE } from '@/lib/currency';

const SHIPPING_COSTS = {
    standard: 5,
    express: 30,
};

interface PaymentLinks {
    cardLink: string;
    whatsappLink: string;
}

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, totalItems, totalPrice } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
    });
    const [paymentLinks, setPaymentLinks] = useState<PaymentLinks | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingAddress(prevState => ({ ...prevState, [name]: value }));
    };

    const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingMethod(event.target.value);
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        try {
            const guestToken = localStorage.getItem('guest_cart_token');
            const headers: Record<string, string> = {};
            if (guestToken) {
                headers['X-Guest-Cart-Token'] = guestToken;
            }
            // Add X-Shop-Domain header
            headers['X-Shop-Domain'] = window.location.hostname;

            const customerJwtToken = localStorage.getItem('jwt_token');
            if (customerJwtToken) {
                headers['Authorization'] = `Bearer ${customerJwtToken}`;
                console.log('CheckoutPage: Sending Authorization header:', headers['Authorization']);
            }

            const response = await api.post('/public/api/v1/checkout', {
                shipping_address: shippingAddress,
                shipping_method: shippingMethod,
            }, { headers });

            if (response.status === 200) {
                const paymentData = response.data;
                if (paymentData.cardLink && paymentData.whatsappLink) {
                    setPaymentLinks(paymentData);
                } else {
                    setError('Failed to get payment links. Please try again.');
                }
            } else {
                setError('Order creation failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };




    const shippingCost = SHIPPING_COSTS[shippingMethod as keyof typeof SHIPPING_COSTS];
    const finalTotal = totalPrice + shippingCost;
    const finalTotalXAF = convertUSDtoXAF(finalTotal);
    const shippingCostXAF = convertUSDtoXAF(shippingCost);
    const totalPriceXAF = convertUSDtoXAF(totalPrice);

// ...

                              

// // ...

                       

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Finalize your order
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
                Please ensure your contact details, especially email and phone, are accurate as we will use them to contact you regarding your order.
            </Alert>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.900', color: 'white' }}>
                        <Typography variant="h6" gutterBottom>
                            Shipping Address
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="firstName" label="First Name" fullWidth autoComplete="given-name" value={shippingAddress.firstName} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="lastName" label="Last Name" fullWidth autoComplete="family-name" value={shippingAddress.lastName} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required name="street" label="Address" fullWidth autoComplete="shipping address-line1" value={shippingAddress.street} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="city" label="City" fullWidth autoComplete="shipping address-level2" value={shippingAddress.city} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="postalCode" label="Postal Code" fullWidth autoComplete="shipping postal-code" value={shippingAddress.postalCode} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="country" label="Country" fullWidth autoComplete="shipping country" value={shippingAddress.country} onChange={handleInputChange}
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="phone" label="Phone" fullWidth autoComplete="tel" value={shippingAddress.phone} onChange={handleInputChange}
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
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper sx={{ p: 3, bgcolor: 'grey.900', color: 'white' }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend" sx={{ color: 'white' }}>Shipping Method</FormLabel>
                            <RadioGroup
                                aria-label="shipping method"
                                name="shippingMethod"
                                value={shippingMethod}
                                onChange={handleShippingChange}
                            >
                                  <FormControlLabel value="standard" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>Standard - {convertUSDtoXAF(SHIPPING_COSTS.standard).toFixed(2)} FCFA</Typography>} />
                                <FormControlLabel value="express" control={<Radio sx={{ color: 'white' }} />} label={<Typography sx={{ color: 'white' }}>Express - {convertUSDtoXAF(SHIPPING_COSTS.express).toFixed(2)} FCFA</Typography>} />
                                
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, position: 'relative', bgcolor: 'grey.900', color: 'white' }}>
                        {loading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1,
                                    borderRadius: 'inherit',
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                       
                        {cart?.items?.map(item => (
                            <Box sx={{ mb: 2 }}>
                            <Typography>Total Items: {totalItems}</Typography>
                            <Typography sx={{ color: 'orange' }}>Subtotal: {totalPriceXAF.toFixed(2)} FCFA</Typography>
                            <Typography sx={{ color: 'orange' }}>Shipping: {shippingCostXAF.toFixed(2)} FCFA</Typography>
                            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'orange' }}>Total: {finalTotalXAF.toFixed(2)} FCFA</Typography>
                          </Box>
                        ))}
                        {!paymentLinks ? (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                onClick={handleCheckout}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Confirm and Pay'}
                            </Button>
                        ) : (
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    href={paymentLinks.whatsappLink}
                                    target="_blank"
                                >
                                    Pay with WhatsApp
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    href={paymentLinks.cardLink}
                                    target="_blank"
                                >
                                    Pay by Card
                                </Button>
                            </Box>
                        )}
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;
