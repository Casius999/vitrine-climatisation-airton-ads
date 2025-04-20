import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Button,
  CircularProgress, 
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuote } from '../contexts/QuoteContext';

// Composants du module de devis
import QuoteManager from '../components/QuoteModule/QuoteManager';
import QuoteDetails from '../components/QuoteModule/QuoteDetails';
import PaymentTracker from '../components/QuoteModule/PaymentTracker';
import SupplierOrderTracker from '../components/QuoteModule/SupplierOrderTracker';

/**
 * Page de gestion des devis, paiements et commandes fournisseurs
 * Centralise l'accès aux différentes fonctionnalités du module commercial
 */
const QuoteManagementPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { quoteId } = useParams();
  const navigate = useNavigate();
  
  // Contexte de gestion des devis et commandes
  const { 
    currentQuote, 
    setCurrentQuote, 
    fetchQuotes,
    currentOrder,
    setCurrentOrder,
    fetchOrders,
    createOrder,
    orders
  } = useQuote();
  
  // Configuration fictive pour démonstration
  const demoConfiguration = {
    modelType: 'Mono-split',
    capacity: '2.6kW',
    length: '6m',
    price: 1299
  };
  
  // Client fictif pour démonstration
  const demoCustomer = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '0612345678',
    address: '123 Avenue des Climatiseurs',
    postalCode: '33320',
    city: 'Eysines'
  };

  useEffect(() => {
    if (quoteId) {
      loadQuoteDetails(quoteId);
    }
    
    // Chargement initial des données
    fetchQuotes();
    fetchOrders();
  }, [quoteId]);

  const loadQuoteDetails = async (id) => {
    try {
      setLoading(true);
      // En environnement de production, récupérer les détails du devis via l'API
      
      // Pour la démo, on simule un délai
      setTimeout(() => {
        // Rechercher dans les commandes si cette commande correspond au devis
        const relatedOrder = orders.find(order => order.quoteId === id);
        
        if (relatedOrder) {
          setCurrentOrder(relatedOrder);
          // Si une commande est trouvée, afficher l'onglet de suivi de paiement
          setTabValue(1);
        }
        
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Erreur lors du chargement des détails du devis.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCreateOrder = async () => {
    if (!currentQuote) return;
    
    try {
      setLoading(true);
      const newOrder = await createOrder(currentQuote.id);
      setCurrentOrder(newOrder);
      setTabValue(1); // Passage à l'onglet de suivi des paiements
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la création de la commande.');
      setLoading(false);
    }
  };
  
  const handleNewQuote = () => {
    setCurrentQuote(null);
    setCurrentOrder(null);
    setTabValue(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion Commerciale
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Génération de Devis" />
          <Tab label="Suivi des Paiements" />
          <Tab label="Commandes Fournisseurs" />
        </Tabs>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Onglet 1: Génération de Devis */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5">Devis</Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleNewQuote}
                  >
                    Nouveau Devis
                  </Button>
                </Box>
                
                {currentQuote ? (
                  <Box>
                    <QuoteDetails quoteId={currentQuote.id} />
                    
                    {currentQuote.status === 'validated' && !currentOrder && (
                      <Box display="flex" justifyContent="center" mt={3}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="large"
                          onClick={handleCreateOrder}
                        >
                          Créer une commande
                        </Button>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <QuoteManager configuration={demoConfiguration} customer={demoCustomer} />
                )}
              </Grid>
            </Grid>
          )}
          
          {/* Onglet 2: Suivi des Paiements */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>Suivi des Paiements</Typography>
                
                {currentOrder ? (
                  <PaymentTracker orderId={currentOrder.id} />
                ) : (
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" align="center">
                      Aucune commande sélectionnée. Veuillez d'abord valider un devis et créer une commande.
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => setTabValue(0)}
                      >
                        Retour aux devis
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Grid>
            </Grid>
          )}
          
          {/* Onglet 3: Commandes Fournisseurs */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>Commandes Fournisseurs</Typography>
                
                <SupplierOrderTracker 
                  customerId={currentOrder?.customer?.id || demoCustomer.id} 
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default QuoteManagementPage;
