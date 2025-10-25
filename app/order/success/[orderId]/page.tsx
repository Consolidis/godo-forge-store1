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
                    Merci pour votre commande !
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Votre commande a été passée avec succès.
                </Typography>
                <Typography color="text.secondary">
                    Votre numéro de commande est le : <strong>{orderId}</strong>
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Vous recevrez bientôt un e-mail de confirmation.
                </Typography>
            </Paper>
        </Container>
    );
};

export default OrderSuccessPage;
