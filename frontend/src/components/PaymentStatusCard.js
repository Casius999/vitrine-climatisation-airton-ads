import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Chip
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_API_URL || 'http://localhost:3002/api';

const PaymentStatusCard = ({ quoteId, paymentType, status, amount, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  
  // Formater le montant en devise
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  // Obtenir le titre selon le type de paiement
  const getPaymentTitle = () => {
    switch (paymentType) {
      case 'deposit':
        return 'Acompte (40%)';
      case 'installationPayment':
        return 'Paiement à l\'installation (30%)';
      case 'finalPayment':
        return 'Paiement final (30%)';
      default:
        return 'Paiement';
    }
  };
  
  // Générer un lien de paiement
  const generatePaymentLink = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (paymentType === 'installationPayment') {
        response = await axios.post(`${PAYMENT_API_URL}/payment/create-installation-payment-link`, {
          quoteId
        });
      } else if (paymentType === 'finalPayment') {
        response = await axios.post(`${PAYMENT_API_URL}/payment/create-final-payment-link`, {
          quoteId
        });
      } else {
        throw new Error('Type de paiement non supporté pour la génération de lien');
      }
      
      setPaymentUrl(response.data.url);
      setOpenPaymentDialog(true);
    } catch (error) {
      console.error('Erreur lors de la génération du lien de paiement:', error);
      setError('Erreur lors de la génération du lien de paiement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  // Marquer un paiement comme effectué manuellement
  const markAsPaid = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir marquer ce paiement comme effectué ?`)) {
      setLoading(true);
      setError(null);
      
      try {
        await axios.patch(`${PAYMENT_API_URL}/mark-payment-manually`, {
          quoteId,
          paymentType,
          status: 'paid'
        });
        
        if (onStatusUpdate) {
          onStatusUpdate(paymentType, 'paid');
        }
      } catch (error) {
        console.error('Erreur lors du marquage du paiement:', error);
        setError('Erreur lors du marquage du paiement. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleCloseDialog = () => {
    setOpenPaymentDialog(false);
  };
  
  // Rendre le composant
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {getPaymentTitle()}
          </Typography>
          {status === 'paid' ? (
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Payé" 
              color="success" 
              variant="outlined" 
            />
          ) : (
            <Chip 
              label="En attente" 
              color="warning" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Typography variant="h5" sx={{ mb: 2 }}>
          {formatCurrency(amount)}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {status !== 'paid' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(paymentType === 'installationPayment' || paymentType === 'finalPayment') && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PaymentIcon />}
                onClick={generatePaymentLink}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Générer lien de paiement'}
              </Button>
            )}
            
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={markAsPaid}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Marquer comme payé'}
            </Button>
          </Box>
        )}
      </CardContent>
      
      {/* Dialogue pour le lien de paiement */}
      <Dialog open={openPaymentDialog} onClose={handleCloseDialog}>
        <DialogTitle>Lien de paiement généré</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Un lien de paiement a été généré avec succès. Vous pouvez l'envoyer au client ou le copier pour une utilisation ultérieure.
          </Typography>
          
          <Box 
            component="pre"
            sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1,
              overflowX: 'auto',
              fontSize: '0.875rem'
            }}
          >
            {paymentUrl}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              navigator.clipboard.writeText(paymentUrl);
              alert('Lien copié dans le presse-papier');
            }}
          >
            Copier le lien
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PaymentStatusCard;