/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, totalItems, totalPrice } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/public/api/v1/checkout', {
                shipping_address: shippingAddress,
            });

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

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Finaliser ma commande
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Adresse de livraison
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="firstName" label="Prénom" fullWidth autoComplete="given-name" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="lastName" label="Nom" fullWidth autoComplete="family-name" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required name="street" label="Adresse" fullWidth autoComplete="shipping address-line1" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="city" label="Ville" fullWidth autoComplete="shipping address-level2" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="postalCode" label="Code Postal" fullWidth autoComplete="shipping postal-code" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="country" label="Pays" fullWidth autoComplete="shipping country" onChange={handleInputChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required name="phone" label="Téléphone" fullWidth autoComplete="tel" onChange={handleInputChange} />
                            </Grid>
                        </Grid>
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
                            <Typography variant="h6">Total: {(totalPrice || 0).toFixed(2)} $</Typography>
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
