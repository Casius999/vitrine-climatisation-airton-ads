import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Composant d'affichage détaillé des devis
 * Montre les détails complets d'un devis sélectionné
 */
const QuoteDetails = ({ quoteId }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quoteId) {
      fetchQuoteDetails();
    }
  }, [quoteId]);

  const fetchQuoteDetails = async () => {
    try {
      setLoading(true);
      // Simulation de l'appel API
      // En production, remplacer par un vrai appel API
      setTimeout(() => {
        const mockQuote = {
          id: quoteId,
          quoteNumber: `ART-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            id: '123456',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '0612345678',
            address: '123 Avenue des Climatiseurs',
            postalCode: '33320',
            city: 'Eysines'
          },
          configuration: {
            modelType: 'Mono-split Airton ReadyClim',
            capacity: '2.6kW',
            length: '6m',
            price: 1299
          },
          items: [
            {
              description: 'Climatiseur Airton ReadyClim - Mono-split 2.6kW',
              quantity: 1,
              unitPrice: 899,
              totalPrice: 899
            },
            {
              description: 'Liaison frigorifique pré-chargée en gaz R32 - 6m',
              quantity: 1,
              unitPrice: 150,
              totalPrice: 150
            },
            {
              description: 'Installation standard',
              quantity: 1,
              unitPrice: 250,
              totalPrice: 250
            }
          ],
          subtotal: 1299,
          tax: 259.8,  // TVA 20%
          total: 1558.8,
          installmentPayments: {
            firstPayment: 623.52,  // 40% à la commande
            secondPayment: 467.64,  // 30% le jour du rendez-vous
            thirdPayment: 467.64,  // 30% post-installation
          },
          status: 'validated',
          createdBy: 'System',
          updatedAt: new Date().toISOString()
        };
        
        setQuote(mockQuote);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erreur lors du chargement des détails du devis.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      draft: 'default',
      validated: 'success',
      expired: 'error',
      canceled: 'error',
      paid: 'primary'
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      draft: 'Brouillon',
      validated: 'Validé',
      expired: 'Expiré',
      canceled: 'Annulé',
      paid: 'Payé'
    };
    return statusMap[status] || 'Inconnu';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!quoteId || !quote) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Sélectionnez un devis pour voir ses détails
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          Devis N° {quote.quoteNumber}
        </Typography>
        <Chip 
          label={getStatusLabel(quote.status)} 
          color={getStatusColor(quote.status)}
          variant="outlined"
        />
      </Box>
      
      <Box mb={3}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Créé {formatDistanceToNow(new Date(quote.date), { addSuffix: true, locale: fr })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Valable jusqu'au {new Date(quote.expiryDate).toLocaleDateString()}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Informations client
        </Typography>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={4}>
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Nom
            </Typography>
            <Typography variant="body1" gutterBottom>
              {quote.customer.firstName} {quote.customer.lastName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {quote.customer.email}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Téléphone
            </Typography>
            <Typography variant="body1" gutterBottom>
              {quote.customer.phone}
            </Typography>
          </Box>
          
          <Box flex={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Adresse d'installation
            </Typography>
            <Typography variant="body1" gutterBottom>
              {quote.customer.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {quote.customer.postalCode} {quote.customer.city}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Détails de la commande
        </Typography>
        
        <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantité</TableCell>
                <TableCell align="right">Prix unitaire (€)</TableCell>
                <TableCell align="right">Total (€)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quote.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box display="flex" justifyContent="flex-end">
          <Box width={{ xs: '100%', sm: '300px' }}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Sous-total</Typography>
              <Typography variant="body1">{quote.subtotal.toFixed(2)} €</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">TVA (20%)</Typography>
              <Typography variant="body1">{quote.tax.toFixed(2)} €</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total TTC</Typography>
              <Typography variant="h6">{quote.total.toFixed(2)} €</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box>
        <Typography variant="h6" gutterBottom>
          Échéancier de paiement
        </Typography>
        
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
          <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Premier paiement (40%)
            </Typography>
            <Typography variant="h6" gutterBottom>
              {quote.installmentPayments.firstPayment.toFixed(2)} €
            </Typography>
            <Typography variant="body2" color="text.secondary">
              À la commande
            </Typography>
          </Paper>
          
          <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Deuxième paiement (30%)
            </Typography>
            <Typography variant="h6" gutterBottom>
              {quote.installmentPayments.secondPayment.toFixed(2)} €
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Le jour du rendez-vous
            </Typography>
          </Paper>
          
          <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Troisième paiement (30%)
            </Typography>
            <Typography variant="h6" gutterBottom>
              {quote.installmentPayments.thirdPayment.toFixed(2)} €
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Après l'installation
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuoteDetails;
