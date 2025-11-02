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
        phone: '',
        email: ''
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
        const requiredFields: (keyof typeof shippingAddress)[] = ['firstName', 'lastName', 'street', 'city', 'country', 'phone', 'email'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                setError(`Please fill in all required fields. ${field} is missing.`);
                return;
            }
        }

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
        <Container sx={{ mt: { xs: 4, md: 12 }, mb: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: { xs: 4, md: 6 }, fontWeight: 'bold' }}>
                Finalize Your Order
            </Typography>
            <Alert severity="info" sx={{ mb: 4, borderRadius: '8px' }}>
                Please ensure your contact details, especially email and phone, are accurate as we will use them to contact you regarding your order.
            </Alert>
            <Grid container spacing={{ xs: 4, md: 6 }}>
                {/* Left Column: Shipping Details */}
                <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.900', color: 'white', borderRadius: '12px' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Shipping Address
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="firstName" label="First Name" fullWidth autoComplete="given-name" value={shippingAddress.firstName} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="lastName" label="Last Name" fullWidth autoComplete="family-name" value={shippingAddress.lastName} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required name="street" label="Address" fullWidth autoComplete="shipping address-line1" value={shippingAddress.street} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required name="email" label="Email" type="email" fullWidth autoComplete="email" value={shippingAddress.email} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="city" label="City" fullWidth autoComplete="shipping address-level2" value={shippingAddress.city} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField name="postalCode" label="Postal Code" fullWidth autoComplete="shipping postal-code" value={shippingAddress.postalCode} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="country" label="Country" fullWidth autoComplete="shipping country" value={shippingAddress.country} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="phone" label="Phone" fullWidth autoComplete="tel" value={shippingAddress.phone} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.900', color: 'white', borderRadius: '12px' }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Shipping Method</FormLabel>
                                <RadioGroup
                                    aria-label="shipping method"
                                    name="shippingMethod"
                                    value={shippingMethod}
                                    onChange={handleShippingChange}
                                >
                                    <FormControlLabel value="standard" control={<Radio sx={{ color: 'white' }} />} label={<Typography>Standard - {new Intl.NumberFormat('fr-FR').format(convertUSDtoXAF(SHIPPING_COSTS.standard))} FCFA</Typography>} />
                                    <FormControlLabel value="express" control={<Radio sx={{ color: 'white' }} />} label={<Typography>Express - {new Intl.NumberFormat('fr-FR').format(convertUSDtoXAF(SHIPPING_COSTS.express))} FCFA</Typography>} />
                                </RadioGroup>
                            </FormControl>
                        </Paper>
                    </Box>
                </Grid>

                {/* Right Column: Order Summary */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: { xs: 2, md: 3 }, position: { md: 'sticky' }, top: { md: 100 }, bgcolor: 'grey.900', color: 'white', borderRadius: '12px' }}>
                        {loading && (
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, borderRadius: 'inherit' }}>
                                <CircularProgress />
                            </Box>
                        )}
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Order Summary
                        </Typography>
                        
                        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {cart?.items?.map(item => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <img src={item.productVariant.image} alt={item.productVariant.product.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                                        <Box>
                                            <Typography variant="body1" color="white" sx={{ fontWeight: 'medium' }}>{item.productVariant.product.title}</Typography>
                                            <Typography variant="body2" color="grey.400">Qty: {item.quantity}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" color="white" sx={{ fontWeight: 'medium' }}>{new Intl.NumberFormat('fr-FR').format(convertUSDtoXAF((item.productVariant.sellingPrice ?? item.productVariant.price) * item.quantity))} FCFA</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ mb: 2, mt: 3, borderTop: '1px solid', borderColor: 'grey.700', pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="grey.400">Subtotal:</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{new Intl.NumberFormat('fr-FR').format(totalPriceXAF)} FCFA</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="grey.400">Shipping:</Typography>
                                <Typography sx={{ fontWeight: 'medium' }}>{new Intl.NumberFormat('fr-FR').format(shippingCostXAF)} FCFA</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('fr-FR').format(finalTotalXAF)} FCFA</Typography>
                            </Box>
                        </Box>

                        {!paymentLinks ? (
                            <Button variant="contained" color="primary" fullWidth disabled={loading} onClick={handleCheckout} sx={{ mt: 2, py: 1.5, borderRadius: '8px', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
                                {loading ? <CircularProgress size={24} /> : 'Confirm and Pay'}
                            </Button>
                        ) : (
                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography align="center" sx={{ mb: 1 }}>Choose your payment method:</Typography>
                                <Button variant="contained" color="success" fullWidth href={paymentLinks.whatsappLink} target="_blank" sx={{ py: 1.5, borderRadius: '8px' }}>
                                    Pay with WhatsApp
                                </Button>
                                <Button variant="contained" color="primary" fullWidth href={paymentLinks.cardLink} target="_blank" sx={{ py: 1.5, borderRadius: '8px' }}>
                                    Pay by Card
                                </Button>
                            </Box>
                        )}
                        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        color: 'white',
        borderRadius: '8px',
        '& fieldset': { borderColor: 'grey.700' },
        '&:hover fieldset': { borderColor: 'grey.500' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': { color: 'grey.400' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
};

export default CheckoutPage;
