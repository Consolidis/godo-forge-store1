/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const SHIPPING_COSTS = {
    standard: 5,
    express: 30,
};

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

            if (response.status === 201) {
                const order = response.data;
                router.push(`/order/success/${order.id}`);
            } else {
                setError('La création de la commande a échoué. Veuillez réessayer.');
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error(err);
        }
        setLoading(false);
    };

    const shippingCost = SHIPPING_COSTS[shippingMethod as keyof typeof SHIPPING_COSTS];
    const finalTotal = totalPrice + shippingCost;

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Finaliser ma commande
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Adresse de livraison
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="firstName" label="Prénom" fullWidth autoComplete="given-name" value={shippingAddress.firstName} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="lastName" label="Nom" fullWidth autoComplete="family-name" value={shippingAddress.lastName} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required name="street" label="Adresse" fullWidth autoComplete="shipping address-line1" value={shippingAddress.street} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="city" label="Ville" fullWidth autoComplete="shipping address-level2" value={shippingAddress.city} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="postalCode" label="Code Postal" fullWidth autoComplete="shipping postal-code" value={shippingAddress.postalCode} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="country" label="Pays" fullWidth autoComplete="shipping country" value={shippingAddress.country} onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="phone" label="Téléphone" fullWidth autoComplete="tel" value={shippingAddress.phone} onChange={handleInputChange} />
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper sx={{ p: 3 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Méthode d'expédition</FormLabel>
                            <RadioGroup
                                aria-label="shipping method"
                                name="shippingMethod"
                                value={shippingMethod}
                                onChange={handleShippingChange}
                            >
                                <FormControlLabel value="standard" control={<Radio />} label={`Standard - 5.00 $`} />
                                <FormControlLabel value="express" control={<Radio />} label={`Express - 30.00 $`} />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, position: 'relative', top: '100px' }}>
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
                            Résumé de la commande
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography>Total Articles: {totalItems}</Typography>
                            <Typography>Sous-total: {totalPrice.toFixed(2)} $</Typography>
                            <Typography>Livraison: {shippingCost.toFixed(2)} $</Typography>
                            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>Total: {finalTotal.toFixed(2)} $</Typography>
                        </Box>
                        {cart?.items?.map(item => (
                            <Box key={item.id} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                                <img src={item.productVariant.image} alt={item.productVariant.product.title} width="60" height="60" style={{ marginRight: '16px' }} />
                                <Box>
                                    <Typography>{item.productVariant.product.title}</Typography>
                                    <Typography color="text.secondary" variant="body2">Quantité: {item.quantity}</Typography>
                                </Box>
                            </Box>
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            onClick={handleCheckout}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Valider et Payer'}
                        </Button>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;
