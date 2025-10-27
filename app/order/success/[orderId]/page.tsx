"[use client]";

"use client";

import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useParams } from 'next/navigation';

const OrderSuccessPage = () => {
    const params = useParams();
    const orderId = params.orderId;

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
                </Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Thank you for your order!
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Your order has been placed successfully.
                            </Typography>
                            <Typography color="text.secondary">
                                Your order number is: <strong>{orderId}</strong>
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 2 }}>
                                You will receive a confirmation email shortly.
                            </Typography>            </Paper>
        </Container>
    );
};

export default OrderSuccessPage;
