/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react';
import { useShopStore } from '@/store/shopStore';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Alert, Modal, ThemeProvider, createTheme } from '@mui/material';
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
}

const modalTheme = createTheme({
    palette: {
        background: {
            paper: '#1f2937', // Corresponds to premium-gray-800
        },
        text: {
            primary: '#ffffff',
        },
    },
});

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, totalItems, totalPrice } = useCartStore();
    const { shop } = useShopStore();
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
    const [mobileMoneyModalOpen, setMobileMoneyModalOpen] = useState(false);
    const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
    const [ussdCode, setUssdCode] = useState('');
    const [mobileMoneyLoading, setMobileMoneyLoading] = useState(false);
    const [mobileMoneyError, setMobileMoneyError] = useState('');
    const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

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
            const customerJwtToken = localStorage.getItem('jwt_token');
            console.log('CheckoutPage: guestToken:', guestToken);
            console.log('CheckoutPage: customerJwtToken:', customerJwtToken);

            const headers: Record<string, string> = {};
            if (guestToken) {
                headers['X-Guest-Cart-Token'] = guestToken;
            }
            // Add X-Shop-Domain header
            headers['X-Shop-Domain'] = window.location.hostname;

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
                if (paymentData.cardLink) {
                    setPaymentLinks(paymentData);
                    setCurrentOrderId(paymentData.orderId); // Store the orderId
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

    const handleOpenMobileMoneyModal = () => {
        setMobileMoneyModalOpen(true);
    };

    const handleCloseMobileMoneyModal = () => {
        setMobileMoneyModalOpen(false);
        setUssdCode('');
        setMobileMoneyError('');
        setMobileMoneyPhone('');
    };

    const handlePayWithMobileMoney = async () => {
        if (!validatePhoneNumber(mobileMoneyPhone)) {
            setMobileMoneyError('Please enter a valid 9-digit phone number starting with 6.');
            return;
        }

        if (!currentOrderId) {
            setMobileMoneyError('Order ID not available. Please try again.');
            return;
        }

        setMobileMoneyLoading(true);
        setMobileMoneyError('');

        try {
            const response = await api.post('https://www.dklo.co/api/tara/cmmobile', {
                apiKey: shop?.taraMoneyApiKey,
                businessId: shop?.taraMoneyBusinessId,
                productId: currentOrderId, // Use the actual order ID
                productName: `Order ${currentOrderId}`,
                productPrice: finalTotalXAF,
                phoneNumber: mobileMoneyPhone,
                webHookUrl: `${window.location.origin}/api/webhooks/taramoney`
            });

            if (response.data.status === 'SUCCESS') {
                setUssdCode(response.data.ussdCode);
            } else {
                setMobileMoneyError(response.data.message || 'Failed to initiate payment.');
            }
        } catch (err) {
            setMobileMoneyError('An error occurred while initiating payment.');
            console.error(err);
        }

        setMobileMoneyLoading(false);
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^6\d{8}$/;
        return phoneRegex.test(phone);
    };




    const shippingCost = SHIPPING_COSTS[shippingMethod as keyof typeof SHIPPING_COSTS];
    const finalTotal = totalPrice + shippingCost;
    const finalTotalXAF = convertUSDtoXAF(finalTotal);
    const shippingCostXAF = convertUSDtoXAF(shippingCost);
    const totalPriceXAF = convertUSDtoXAF(totalPrice);
    return (
        <Container sx={{ mt: { xs: 4, md: 12 }, mb: 8 }}>
            <>
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
                            <>
                            <Button variant="contained" color="primary" fullWidth disabled={loading} onClick={handleCheckout} sx={{ mt: 2, py: 1.5, borderRadius: '8px', bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'grey.200' } }}>
                                {loading ? <CircularProgress size={24} /> : 'Confirm and Pay'}
                            </Button>
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img src="/badge.jpg" alt="Trust Badge" style={{ maxWidth: '100%', height: 'auto' }} />
                            </Box>
                            </>
                        ) : (
                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography align="center" sx={{ mb: 1 }}>Choose your payment method:</Typography>
                                <Button variant="contained" color="secondary" fullWidth onClick={handleOpenMobileMoneyModal} sx={{ py: 1.5, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <img src="/mobile-money.jpg" alt="Mobile Money" style={{ height: '24px' }} />
                                    <span>Pay with Mobile Money</span>
                                </Button>
                                <Button variant="contained" color="primary" fullWidth href={paymentLinks.cardLink} target="_blank" sx={{ py: 1.5, borderRadius: '8px' }}>
                                    <img src="/card.png" alt="Mobile Money" style={{ height: '24px' }} />
                                    <span>Pay by Card</span>
                                </Button>
                                 <img src="/badge.jpg" alt="Trust Badge" style={{ maxWidth: '100%', height: 'auto' }} />
                            </Box>
                            
                        )}
                        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
                    </Paper>
                </Grid>
            </Grid>
            </>
            <Modal
                open={mobileMoneyModalOpen}
                onClose={handleCloseMobileMoneyModal}
                aria-labelledby="mobile-money-modal-title"
                aria-describedby="mobile-money-modal-description"
            >
                <ThemeProvider theme={modalTheme}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', color: 'text.primary', border: '2px solid #000', boxShadow: 24, p: 4, borderRadius: '12px' }}>
                        <Typography id="mobile-money-modal-title" variant="h6" component="h2">
                            Pay with Mobile Money
                        </Typography>
                        <img src="/mobile-money.jpg" alt="Mobile Money Operators" style={{ width: '100%', marginTop: '16px', borderRadius: '8px' }} />
                        {!ussdCode ? (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    variant="outlined"
                                    value={mobileMoneyPhone}
                                    onChange={(e) => setMobileMoneyPhone(e.target.value)}
                                    sx={textFieldStyles}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={handlePayWithMobileMoney}
                                    disabled={mobileMoneyLoading}
                                >
                                    {mobileMoneyLoading ? <CircularProgress size={24} /> : 'Get Payment Code'}
                                </Button>
                                {mobileMoneyError && <Typography color="error" sx={{ mt: 2 }}>{mobileMoneyError}</Typography>}
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2 }}>
                                <Typography>Dial the code below to complete your payment:</Typography>
                                <Typography variant="h4" component="p" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {ussdCode}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </ThemeProvider>
            </Modal>
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
