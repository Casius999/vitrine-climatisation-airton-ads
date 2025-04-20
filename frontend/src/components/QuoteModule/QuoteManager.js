import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Stepper, 
  Step, 
  StepLabel,
  Alert,
  Snackbar
} from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import QuotePDFDocument from './QuotePDFDocument';

/**
 * Composant de gestion des devis
 * Permet de générer, visualiser et télécharger un devis basé sur la configuration
 * choisie par le client
 */
const QuoteManager = ({ configuration, customer }) => {
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const quoteRef = useRef(null);
  const navigate = useNavigate();

  const steps = ['Génération du devis', 'Validation', 'Paiement acompte'];

  useEffect(() => {
    if (configuration && customer) {
      generateQuote();
    }
  }, [configuration, customer]);

  const generateQuote = async () => {
    try {
      setLoading(true);
      // Simulation de l'appel API pour générer le devis
      // En production, remplacer par un vrai appel API
      setTimeout(() => {
        const quoteNumber = Math.floor(100000 + Math.random() * 900000);
        
        const calculatedQuote = {
          quoteNumber: `ART-${quoteNumber}`,
          date: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          customer: customer,
          configuration: configuration,
          subtotal: configuration.price || 0,
          tax: (configuration.price || 0) * 0.2, // TVA 20%
          total: (configuration.price || 0) * 1.2,
          installmentPayments: {
            firstPayment: (configuration.price || 0) * 1.2 * 0.4, // 40% à la commande
            secondPayment: (configuration.price || 0) * 1.2 * 0.3, // 30% le jour du rendez-vous
            thirdPayment: (configuration.price || 0) * 1.2 * 0.3, // 30% post-installation
          },
          status: 'draft'
        };
        
        setQuoteData(calculatedQuote);
        setLoading(false);
        setActiveStep(1);
      }, 1500);
    } catch (err) {
      setError('Erreur lors de la génération du devis. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleValidateQuote = async () => {
    try {
      setLoading(true);
      // Simulation de l'appel API pour valider le devis
      // En production, remplacer par un vrai appel API
      setTimeout(() => {
        setQuoteData({
          ...quoteData,
          status: 'validated'
        });
        setLoading(false);
        setActiveStep(2);
        setShowSuccess(true);
      }, 1000);
    } catch (err) {
      setError('Erreur lors de la validation du devis. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    // Redirection vers la page de paiement
    navigate('/payment', { state: { quoteData } });
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
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

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }} ref={quoteRef}>
      <Typography variant="h5" component="h2" gutterBottom>
        Devis d'installation
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {quoteData && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Devis N° {quoteData.quoteNumber}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Date :</strong> {new Date(quoteData.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Valable jusqu'au :</strong> {new Date(quoteData.expiryDate).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Client :</strong> {customer?.firstName} {customer?.lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Adresse :</strong> {customer?.address}, {customer?.postalCode} {customer?.city}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Configuration :</strong> {configuration?.modelType} - {configuration?.length}m
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Sous-total :</strong> {quoteData.subtotal.toFixed(2)} €
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>TVA (20%) :</strong> {quoteData.tax.toFixed(2)} €
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              <strong>Total TTC :</strong> {quoteData.total.toFixed(2)} €
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Échéancier de paiement
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Premier paiement (40%) :</strong> {quoteData.installmentPayments.firstPayment.toFixed(2)} €
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Deuxième paiement (30%) :</strong> {quoteData.installmentPayments.secondPayment.toFixed(2)} €
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Troisième paiement (30%) :</strong> {quoteData.installmentPayments.thirdPayment.toFixed(2)} €
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {activeStep === 1 && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleValidateQuote}
              >
                Valider le devis
              </Button>
            )}
            
            {activeStep === 2 && (
              <>
                <PDFDownloadLink 
                  document={<QuotePDFDocument quoteData={quoteData} />} 
                  fileName={`Devis_${quoteData.quoteNumber}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading }) => (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      disabled={loading}
                    >
                      {loading ? 'Génération...' : 'Télécharger le devis (PDF)'}
                    </Button>
                  )}
                </PDFDownloadLink>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleProceedToPayment}
                >
                  Procéder au paiement de l'acompte
                </Button>
              </>
            )}
          </Box>
        </Box>
      )}
      
      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Devis validé avec succès ! Vous pouvez maintenant procéder au paiement de l'acompte.
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default QuoteManager;
