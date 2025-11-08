

/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from 'react';
import { useShopStore } from '@/store/shopStore';
import { Container, Grid, Paper, Typography, TextField, Button, CircularProgress, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Alert, Modal, ThemeProvider, createTheme, Select, MenuItem, InputLabel } from '@mui/material';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { convertUSDtoXAF, USD_TO_XAF_RATE } from '@/lib/currency';

// Static list of countries (ISO 3166-1 alpha-2 codes and names)
const countriesList = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'AT', name: 'Austria' },
  { code: 'IE', name: 'Ireland' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'IN', name: 'India' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'EG', name: 'Egypt' },
  // Add more countries as needed
];

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

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  description?: string;
  countries?: string[];
}

const CheckoutPage = () => {
    const router = useRouter();
    const { cart, totalItems, totalPrice } = useCartStore();
    const { shop } = useShopStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
    const [currentOrderNumber, setCurrentOrderNumber] = useState<string | null>(null);
    const [currentPaymentGatewayReference, setCurrentPaymentGatewayReference] = useState<string | null>(null);

    const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingMethod[]>([]);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);
    const [shippingMethodsLoading, setShippingMethodsLoading] = useState(true);
    const [shippingMethodsError, setShippingMethodsError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setShippingAddress(prevState => ({ ...prevState, [name as string]: value }));
    };

    useEffect(() => {
      const fetchShippingMethods = async () => {
        if (!shop?.id) {
          console.log('CheckoutPage: Shop ID is missing.');
          setShippingMethodsError('Shop ID is missing.');
          setShippingMethodsLoading(false);
          return;
        }
        setShippingMethodsLoading(true);
        setShippingMethodsError(null);
        try {
          const headers: Record<string, string> = {
            'X-Shop-Domain': window.location.hostname,
          };
          const countryParam = shippingAddress.country ? `?country=${shippingAddress.country}` : '';
          const apiUrl = `/public/api/v1/shops/${shop.id}/shipping-methods${countryParam}`;
          console.log('CheckoutPage: Fetching shipping methods from:', apiUrl);
          console.log('CheckoutPage: X-Shop-Domain header:', window.location.hostname);
          console.log('CheckoutPage: Current shippingAddress.country:', shippingAddress.country);

          const response = await api.get<ShippingMethod[]>(apiUrl, { headers });
          console.log('CheckoutPage: Shipping methods API response:', response.data);
          setAvailableShippingMethods(response.data);
          if (response.data.length > 0) {
            setSelectedShippingMethodId(response.data[0].id); // Select the first one by default
          } else {
            setSelectedShippingMethodId(null);
          }
        } catch (err: any) {
          console.error('CheckoutPage: Failed to fetch shipping methods:', err.response?.data?.message || err.message);
          // Assuming notifyError exists, otherwise remove or implement it
          // notifyError(err.response?.data?.message || 'Failed to fetch shipping methods.');
        } finally {
          setShippingMethodsLoading(false);
        }
      };

      fetchShippingMethods();
    }, [shop?.id, shippingAddress.country]); // Re-fetch when shopId or country changes

    const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // This function is no longer directly used for shipping method selection
        // as we are using selectedShippingMethodId state directly with RadioGroup
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
                shipping_method_id: selectedShippingMethodId, // Changed to shipping_method_id
            }, { headers });

            if (response.status === 200) {
                const paymentData = response.data;
                // Redirect to success page immediately after order creation
                router.push(`/order/success/${paymentData.orderId}`);
                // Optionally, you can still set payment links if needed for other payment methods
                // setPaymentLinks(paymentData);
                // setCurrentOrderNumber(paymentData.orderNumber);
                // setCurrentPaymentGatewayReference(paymentData.paymentGatewayReference);
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

        if (!currentPaymentGatewayReference) {
            setMobileMoneyError('Payment reference not available. Please try again.');
            return;
        }

        setMobileMoneyLoading(true);
        setMobileMoneyError('');

        try {
            // Step 1: Refresh the payment reference
            const refreshResponse = await api.post('/public/api/v1/refresh-payment-reference', {
                paymentGatewayReference: currentPaymentGatewayReference,
            });

            const newReference = refreshResponse.data.paymentGatewayReference;
            setCurrentPaymentGatewayReference(newReference); // Update state with the new reference

            // Step 2: Initiate payment with the new reference
            const headers: Record<string, string> = {};
            headers['X-Shop-Domain'] = window.location.hostname;

            const paymentResponse = await api.post('/public/api/v1/initiate-mobile-payment', {
                paymentGatewayReference: newReference,
                phoneNumber: mobileMoneyPhone,
            }, { headers });

            if (paymentResponse.data.status === 'SUCCESS') {
                setUssdCode(paymentResponse.data.ussdCode);
            } else {
                setMobileMoneyError(paymentResponse.data.message || 'Failed to initiate payment.');
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




    const selectedMethod = availableShippingMethods.find(method => method.id === selectedShippingMethodId);
    // Convert price to number as it comes from backend as string (DECIMAL type)
    const shippingCost = selectedMethod ? parseFloat(selectedMethod.price as unknown as string) : 0;
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
                                    <FormControl fullWidth required variant="outlined" sx={textFieldStyles}>
                                        <InputLabel id="country-select-label" sx={textFieldStyles}>Country</InputLabel>
                                        <Select
                                            labelId="country-select-label"
                                            id="country-select"
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleInputChange}
                                            label="Country"
                                            sx={textFieldStyles}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: 'grey.800',
                                                        color: 'white',
                                                        '& .MuiMenuItem-root': {
                                                            '&:hover': {
                                                                bgcolor: 'grey.700',
                                                            },
                                                            '&.Mui-selected': {
                                                                bgcolor: 'primary.dark',
                                                                '&:hover': {
                                                                    bgcolor: 'primary.main',
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>Select Country</em>
                                            </MenuItem>
                                            {countriesList.map((country) => (
                                                <MenuItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField required name="phone" label="Phone" fullWidth autoComplete="tel" value={shippingAddress.phone} onChange={handleInputChange} variant="outlined" sx={textFieldStyles} />
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.900', color: 'white', borderRadius: '12px' }}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Shipping Method</FormLabel>
                                {shippingMethodsLoading ? (
                                    <CircularProgress size={24} />
                                ) : shippingMethodsError ? (
                                    <Alert severity="error">{shippingMethodsError}</Alert>
                                ) : availableShippingMethods.length === 0 ? (
                                    <Alert severity="info">No shipping methods available for your country.</Alert>
                                ) : (
                                    <RadioGroup
                                        aria-label="shipping method"
                                        name="shippingMethodId"
                                        value={selectedShippingMethodId}
                                        onChange={(e) => setSelectedShippingMethodId(e.target.value)}
                                    >
                                        {availableShippingMethods.map((method) => (
                                            <FormControlLabel
                                                key={method.id}
                                                value={method.id}
                                                control={<Radio sx={{ color: 'white' }} />}
                                                label={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <Typography>{method.name} {method.description ? `(${method.description})` : ''}</Typography>
                                                        <Typography>{new Intl.NumberFormat('fr-FR').format(convertUSDtoXAF(method.price))} FCFA</Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                )}
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
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    If you do not receive any prompt or pending transaction, ensure that your account balance is sufficient or check your internet connection.
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
