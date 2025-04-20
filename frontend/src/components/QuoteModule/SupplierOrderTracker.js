import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress, 
  Alert,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Composant de suivi des commandes fournisseurs
 * Permet de gérer et suivre les commandes de matériel auprès d'Airton
 */
const SupplierOrderTracker = ({ customerId }) => {
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    fetchSupplierOrders();
  }, [customerId]);

  const fetchSupplierOrders = async () => {
    try {
      setLoading(true);
      // Simulation de l'appel API
      // En production, remplacer par un vrai appel API
      setTimeout(() => {
        const mockOrders = [
          {
            id: 'SUP-001',
            orderNumber: 'AIRTON-2025-1234',
            customerId: customerId || 'CUST-987654',
            clientOrderId: 'ORD-123456',
            date: '2025-04-18T10:30:00Z',
            status: 'ordered', // [ordered, confirmed, shipped, delivered]
            supplierName: 'Airton France',
            trackingNumber: 'TRACK-ABC123',
            expectedDeliveryDate: '2025-04-22T14:00:00Z',
            items: [
              {
                id: 'ITEM-001',
                description: 'Climatiseur Airton ReadyClim - Mono-split 2.6kW',
                quantity: 1,
                reference: 'AIRTON-MS-26'
              },
              {
                id: 'ITEM-002',
                description: 'Liaison frigorifique pré-chargée en gaz R32 - 6m',
                quantity: 1,
                reference: 'READYCLIM-6M'
              }
            ],
            history: [
              {
                date: '2025-04-18T10:30:00Z',
                status: 'ordered',
                comment: 'Commande passée au fournisseur'
              }
            ],
            notes: 'Livraison à notre entrepôt'
          },
          {
            id: 'SUP-002',
            orderNumber: 'AIRTON-2025-1235',
            customerId: 'CUST-654321',
            clientOrderId: 'ORD-567890',
            date: '2025-04-15T14:45:00Z',
            status: 'delivered',
            supplierName: 'Airton France',
            trackingNumber: 'TRACK-DEF456',
            expectedDeliveryDate: '2025-04-19T09:00:00Z',
            actualDeliveryDate: '2025-04-19T10:23:00Z',
            items: [
              {
                id: 'ITEM-003',
                description: 'Climatiseur Airton ReadyClim - Bi-split 3.5kW',
                quantity: 1,
                reference: 'AIRTON-BS-35'
              },
              {
                id: 'ITEM-004',
                description: 'Liaison frigorifique pré-chargée en gaz R32 - 8m',
                quantity: 2,
                reference: 'READYCLIM-8M'
              }
            ],
            history: [
              {
                date: '2025-04-15T14:45:00Z',
                status: 'ordered',
                comment: 'Commande passée au fournisseur'
              },
              {
                date: '2025-04-16T09:12:00Z',
                status: 'confirmed',
                comment: 'Commande confirmée par Airton'
              },
              {
                date: '2025-04-17T16:30:00Z',
                status: 'shipped',
                comment: 'Commande expédiée'
              },
              {
                date: '2025-04-19T10:23:00Z',
                status: 'delivered',
                comment: 'Commande livrée à notre entrepôt'
              }
            ],
            notes: 'RAS - Livraison conforme'
          }
        ];
        
        setSupplierOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erreur lors du chargement des commandes fournisseurs.');
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      ordered: 'Commandé',
      confirmed: 'Confirmé',
      shipped: 'Expédié',
      delivered: 'Livré'
    };
    return statusMap[status] || 'Inconnu';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      ordered: 'info',
      confirmed: 'primary',
      shipped: 'warning',
      delivered: 'success'
    };
    return statusMap[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      ordered: <AssignmentIcon />,
      confirmed: <CheckIcon />,
      shipped: <ShippingIcon />,
      delivered: <InventoryIcon />
    };
    return statusMap[status] || <ScheduleIcon />;
  };

  const getActiveStep = (order) => {
    const steps = ['ordered', 'confirmed', 'shipped', 'delivered'];
    return steps.indexOf(order.status);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
  };

  const handleUpdateOrder = () => {
    try {
      setLoading(true);
      
      // Simulation de la mise à jour
      setTimeout(() => {
        const now = new Date().toISOString();
        const updatedOrders = supplierOrders.map(order => {
          if (order.id === editingOrder.id) {
            // Mettre à jour le statut et l'historique
            const updatedHistory = [
              ...order.history,
              {
                date: now,
                status: newStatus,
                comment: `Statut mis à jour: ${getStatusLabel(newStatus)}`
              }
            ];
            
            // Mise à jour des infos de livraison si livré
            let updatedOrder = {
              ...order,
              status: newStatus,
              trackingNumber: trackingNumber,
              history: updatedHistory
            };
            
            if (newStatus === 'delivered' && !order.actualDeliveryDate) {
              updatedOrder.actualDeliveryDate = now;
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        setSupplierOrders(updatedOrders);
        setLoading(false);
        setOpenDialog(false);
        setEditingOrder(null);
      }, 1000);
    } catch (err) {
      setError('Erreur lors de la mise à jour de la commande fournisseur.');
      setLoading(false);
    }
  };

  const handleCreateNewOrder = () => {
    // Fonction à implémenter pour créer une nouvelle commande fournisseur
    alert('Création d\'une nouvelle commande - Fonctionnalité à implémenter');
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
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Suivi des commandes fournisseurs
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateNewOrder}
        >
          Nouvelle commande
        </Button>
      </Box>
      
      {supplierOrders.length === 0 ? (
        <Alert severity="info">
          Aucune commande fournisseur trouvée.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {supplierOrders.map((order) => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      {order.orderNumber}
                    </Typography>
                    <Chip 
                      label={getStatusLabel(order.status)} 
                      color={getStatusColor(order.status)}
                      icon={getStatusIcon(order.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date: {format(parseISO(order.date), 'PPP', { locale: fr })}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fournisseur: {order.supplierName}
                  </Typography>
                  
                  {order.trackingNumber && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      N° Suivi: {order.trackingNumber}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Livraison prévue: {format(parseISO(order.expectedDeliveryDate), 'PPP', { locale: fr })}
                  </Typography>
                  
                  {order.actualDeliveryDate && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Livré le: {format(parseISO(order.actualDeliveryDate), 'PPP', { locale: fr })}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Articles
                  </Typography>
                  
                  {order.items.map((item) => (
                    <Box key={item.id} mb={1}>
                      <Typography variant="body2">
                        {item.quantity}x {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Réf: {item.reference}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Historique
                  </Typography>
                  
                  <Stepper activeStep={getActiveStep(order)} alternativeLabel>
                    <Step>
                      <StepLabel>Commandé</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Confirmé</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Expédié</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Livré</StepLabel>
                    </Step>
                  </Stepper>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleEditOrder(order)}
                  >
                    Mettre à jour
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Dialog de mise à jour */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Mettre à jour la commande
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Mettre à jour le statut et les informations de suivi de la commande {editingOrder?.orderNumber}.
          </DialogContentText>
          
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Statut</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                label="Statut"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="ordered">Commandé</MenuItem>
                <MenuItem value="confirmed">Confirmé</MenuItem>
                <MenuItem value="shipped">Expédié</MenuItem>
                <MenuItem value="delivered">Livré</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              label="Numéro de suivi"
              fullWidth
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleUpdateOrder} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SupplierOrderTracker;
