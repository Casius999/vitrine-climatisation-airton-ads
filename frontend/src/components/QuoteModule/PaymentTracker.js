import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Composant de suivi des paiements en 3 tranches
 * Permet de visualiser l'état des paiements et de procéder aux paiements suivants
 */
const PaymentTracker = ({ orderId, onPaymentComplete }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      // Simulation de l'appel API
      // En production, remplacer par un vrai appel API
      setTimeout(() => {
        const mockOrder = {
          id: orderId || 'ORD-123456',
          quoteId: 'QTE-765432',
          customerId: 'CUST-987654',
          date: new Date().toISOString(),
          total: 1558.8,
          status: 'in_progress',
          paymentSchedule: [
            {
              id: 'PAY-001',
              name: 'Acompte initial',
              amount: 623.52, // 40%
              dueDate: new Date().toISOString(),
              status: 'paid',
              paymentDate: new Date().toISOString(),
              paymentMethod: 'card',
              transactionId: 'TXN-123456'
            },
            {
              id: 'PAY-002',
              name: 'Paiement jour du rendez-vous',
              amount: 467.64, // 30%
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending',
              paymentDate: null,
              paymentMethod: null,
              transactionId: null
            },
            {
              id: 'PAY-003',
              name: 'Paiement post-installation',
              amount: 467.64, // 30%
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'not_due',
              paymentDate: null,
              paymentMethod: null,
              transactionId: null
            }
          ],
          installationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          customer: {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '0612345678'
          },
          configuration: {
            modelType: 'Mono-split Airton ReadyClim',
            capacity: '2.6kW',
            length: '6m'
          }
        };
        
        setOrderData(mockOrder);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erreur lors du chargement des données de commande.');
      setLoading(false);
    }
  };

  const handleOpenPaymentDialog = (paymentIndex) => {
    setCurrentPaymentIndex(paymentIndex);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProcessPayment = async () => {
    try {
      setLoading(true);
      
      // Simulation du traitement de paiement
      setTimeout(() => {
        // Mise à jour de l'état du paiement
        const updatedPaymentSchedule = [...orderData.paymentSchedule];
        updatedPaymentSchedule[currentPaymentIndex] = {
          ...updatedPaymentSchedule[currentPaymentIndex],
          status: 'paid',
          paymentDate: new Date().toISOString(),
          paymentMethod: 'card',
          transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000)
        };
        
        // Mise à jour du statut global si tous les paiements sont effectués
        let newStatus = 'in_progress';
        if (updatedPaymentSchedule.every(payment => payment.status === 'paid')) {
          newStatus = 'completed';
        }
        
        setOrderData({
          ...orderData,
          status: newStatus,
          paymentSchedule: updatedPaymentSchedule
        });
        
        setLoading(false);
        setOpenDialog(false);
        
        // Notifier le composant parent si tous les paiements sont effectués
        if (newStatus === 'completed' && onPaymentComplete) {
          onPaymentComplete();
        }
      }, 1500);
    } catch (err) {
      setError('Erreur lors du traitement du paiement.');
      setLoading(false);
    }
  };

  const getPaymentStatusIcon = (status) => {
    const statusMap = {
      paid: <CheckCircleIcon color="success" />,
      pending: <ScheduleIcon color="warning" />,
      not_due: <ScheduleIcon color="disabled" />,
      failed: <ErrorIcon color="error" />
    };
    return statusMap[status] || <ScheduleIcon />;
  };

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      paid: 'Payé',
      pending: 'En attente',
      not_due: 'À venir',
      failed: 'Échec'
    };
    return statusMap[status] || 'Inconnu';
  };

  const getPaymentStatusColor = (status) => {
    const statusMap = {
      paid: 'success',
      pending: 'warning',
      not_due: 'default',
      failed: 'error'
    };
    return statusMap[status] || 'default';
  };

  const getActiveStep = () => {
    if (!orderData) return 0;
    
    for (let i = 0; i < orderData.paymentSchedule.length; i++) {
      if (orderData.paymentSchedule[i].status !== 'paid') {
        return i;
      }
    }
    
    return orderData.paymentSchedule.length;
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

  if (!orderId && !orderData) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Aucune commande sélectionnée
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Suivi des paiements
      </Typography>
      
      {orderData && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Commande #{orderData.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {format(new Date(orderData.date), 'PPP', { locale: fr })}
              </Typography>
            </Box>
            <Chip 
              label={orderData.status === 'completed' ? 'Complété' : 'En cours'} 
              color={orderData.status === 'completed' ? 'success' : 'primary'}
            />
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Échéancier de paiement
            </Typography>
            
            <Stepper activeStep={getActiveStep()} orientation="vertical">
              {orderData.paymentSchedule.map((payment, index) => (
                <Step key={payment.id}>
                  <StepLabel 
                    StepIconComponent={() => getPaymentStatusIcon(payment.status)}
                  >
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography variant="subtitle1">
                        {payment.name}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {payment.amount.toFixed(2)} €
                      </Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Date d'échéance: {format(new Date(payment.dueDate), 'PPP', { locale: fr })}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <Typography variant="body2" mr={1}>
                          Statut:
                        </Typography>
                        <Chip 
                          size="small"
                          label={getPaymentStatusLabel(payment.status)} 
                          color={getPaymentStatusColor(payment.status)}
                          variant="outlined"
                        />
                      </Box>
                      
                      {payment.status === 'paid' && (
                        <Box mt={1}>
                          <Typography variant="body2" color="text.secondary">
                            Payé le: {format(new Date(payment.paymentDate), 'PPP', { locale: fr })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Méthode: {payment.paymentMethod === 'card' ? 'Carte bancaire' : payment.paymentMethod}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Transaction: {payment.transactionId}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {(payment.status === 'pending') && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenPaymentDialog(index)}
                        startIcon={<PaymentIcon />}
                      >
                        Effectuer le paiement
                      </Button>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            
            {getActiveStep() === orderData.paymentSchedule.length && (
              <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                <Typography variant="subtitle1" color="success.contrastText">
                  Tous les paiements ont été effectués. Merci !
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Détails de l'installation
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date prévue: {format(new Date(orderData.installationDate), 'PPP', { locale: fr })}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Modèle: {orderData.configuration.modelType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Capacité: {orderData.configuration.capacity}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Longueur de liaison: {orderData.configuration.length}
            </Typography>
          </Box>
          
          {/* Dialog de paiement */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              Procéder au paiement
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vous êtes sur le point d'effectuer le paiement suivant :
              </DialogContentText>
              
              {currentPaymentIndex !== null && orderData && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {orderData.paymentSchedule[currentPaymentIndex].name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {orderData.paymentSchedule[currentPaymentIndex].amount.toFixed(2)} €
                  </Typography>
                </Box>
              )}
              
              <DialogContentText mt={2}>
                En cliquant sur "Payer maintenant", vous serez redirigé vers notre prestataire de paiement sécurisé.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Annuler</Button>
              <Button 
                onClick={handleProcessPayment} 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? 'Traitement...' : 'Payer maintenant'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default PaymentTracker;
