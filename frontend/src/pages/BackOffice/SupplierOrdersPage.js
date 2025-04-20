import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Chip, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Typography, TextField, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COMMERCIAL_API_URL = process.env.REACT_APP_COMMERCIAL_API_URL || 'http://localhost:3001/api';

const SupplierOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [trackingDialog, setTrackingDialog] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDeliveryDate: ''
  });
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${COMMERCIAL_API_URL}/supplier-orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };
  
  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
  };
  
  const handleSendEmail = async (orderId) => {
    try {
      const response = await axios.post(`${COMMERCIAL_API_URL}/supplier-orders/${orderId}/send`);
      alert('Email envoyé avec succès!');
      fetchOrders(); // Rafraîchir la liste pour mettre à jour le statut
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    }
  };
  
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`${COMMERCIAL_API_URL}/supplier-orders/${orderId}/status`, {
        status
      });
      alert('Statut mis à jour avec succès!');
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };
  
  const handleOpenTrackingDialog = (order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      trackingNumber: order.trackingInfo?.trackingNumber || '',
      carrier: order.trackingInfo?.carrier || '',
      estimatedDeliveryDate: order.trackingInfo?.estimatedDeliveryDate ? 
        format(new Date(order.trackingInfo.estimatedDeliveryDate), 'yyyy-MM-dd') : ''
    });
    setTrackingDialog(true);
  };
  
  const handleCloseTrackingDialog = () => {
    setTrackingDialog(false);
  };
  
  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await axios.patch(`${COMMERCIAL_API_URL}/supplier-orders/${selectedOrder._id}/status`, {
        status: 'shipped',
        trackingInfo: {
          ...trackingInfo,
          estimatedDeliveryDate: trackingInfo.estimatedDeliveryDate ? 
            new Date(trackingInfo.estimatedDeliveryDate) : undefined
        }
      });
      
      alert('Informations de livraison mises à jour!');
      setTrackingDialog(false);
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations de livraison:', error);
      alert('Erreur lors de la mise à jour. Veuillez réessayer.');
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="En attente" size="small" color="default" />;
      case 'submitted':
        return <Chip label="Envoyée" size="small" color="info" />;
      case 'confirmed':
        return <Chip label="Confirmée" size="small" color="primary" />;
      case 'shipped':
        return <Chip label="Expédiée" size="small" color="warning" />;
      case 'delivered':
        return <Chip label="Livrée" size="small" color="success" />;
      case 'cancelled':
        return <Chip label="Annulée" size="small" color="error" />;
      default:
        return <Chip label="Inconnu" size="small" />;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    let matchesStatus = true;
    let matchesSearch = true;
    
    if (statusFilter) {
      matchesStatus = order.status === statusFilter;
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matchesSearch = (
        (order.orderNumber && order.orderNumber.toLowerCase().includes(search)) ||
        (order.trackingInfo?.trackingNumber && order.trackingInfo.trackingNumber.toLowerCase().includes(search)) ||
        (order.trackingInfo?.carrier && order.trackingInfo.carrier.toLowerCase().includes(search))
      );
    }
    
    return matchesStatus && matchesSearch;
  });
  
  // Paginer les résultats
  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Commandes Fournisseurs
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Rechercher"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
              placeholder="N° commande, suivi..."
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Statut"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              variant="outlined"
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="submitted">Envoyée</MenuItem>
              <MenuItem value="confirmed">Confirmée</MenuItem>
              <MenuItem value="shipped">Expédiée</MenuItem>
              <MenuItem value="delivered">Livrée</MenuItem>
              <MenuItem value="cancelled">Annulée</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N° Commande</TableCell>
                <TableCell>Date Création</TableCell>
                <TableCell>Nombre de Devis</TableCell>
                <TableCell>Montant Total</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Suivi</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Chargement...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                </TableRow>
              ) : paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Aucune commande trouvée</TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.quotes ? order.quotes.length : 0}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell>
                      {order.trackingInfo?.trackingNumber ? (
                        <Typography variant="body2">
                          {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => handleViewOrder(order)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {order.status === 'pending' && (
                          <Tooltip title="Envoyer au fournisseur">
                            <IconButton size="small" onClick={() => handleSendEmail(order._id)}>
                              <EmailIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {order.status === 'submitted' && (
                          <Tooltip title="Marquer comme confirmée">
                            <IconButton 
                              size="small" 
                              onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                              color="primary"
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {(order.status === 'confirmed' || order.status === 'shipped') && (
                          <Tooltip title="Informations de livraison">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenTrackingDialog(order)}
                              color="warning"
                            >
                              <LocalShippingIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        {order.status === 'shipped' && (
                          <Tooltip title="Marquer comme livrée">
                            <IconButton 
                              size="small" 
                              onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              color="success"
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Dialogue des détails de la commande */}
      <Dialog open={openOrderDialog} onClose={handleCloseOrderDialog} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              Détails de la Commande #{selectedOrder.orderNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Informations Générales</Typography>
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <Typography variant="body1"><strong>Date de création:</strong> {formatDate(selectedOrder.createdAt)}</Typography>
                    <Typography variant="body1"><strong>Statut:</strong> {getStatusChip(selectedOrder.status)}</Typography>
                    <Typography variant="body1"><strong>Montant total:</strong> {formatCurrency(selectedOrder.totalAmount)}</Typography>
                    <Typography variant="body1"><strong>Nombre de devis liés:</strong> {selectedOrder.quotes ? selectedOrder.quotes.length : 0}</Typography>
                  </Box>
                  
                  {selectedOrder.trackingInfo && selectedOrder.trackingInfo.trackingNumber && (
                    <>
                      <Typography variant="h6" gutterBottom>Informations de Livraison</Typography>
                      <Box sx={{ pl: 2, mb: 3 }}>
                        <Typography variant="body1"><strong>Transporteur:</strong> {selectedOrder.trackingInfo.carrier}</Typography>
                        <Typography variant="body1"><strong>Numéro de suivi:</strong> {selectedOrder.trackingInfo.trackingNumber}</Typography>
                        {selectedOrder.trackingInfo.estimatedDeliveryDate && (
                          <Typography variant="body1"><strong>Livraison estimée:</strong> {formatDate(selectedOrder.trackingInfo.estimatedDeliveryDate)}</Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Fournisseur</Typography>
                  <Box sx={{ pl: 2, mb: 3 }}>
                    <Typography variant="body1"><strong>Nom:</strong> {selectedOrder.supplierInfo?.name || 'Airton'}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {selectedOrder.supplierInfo?.email || 'service-client@airton.shop'}</Typography>
                    {selectedOrder.supplierInfo?.phone && (
                      <Typography variant="body1"><strong>Téléphone:</strong> {selectedOrder.supplierInfo.phone}</Typography>
                    )}
                    {selectedOrder.supplierInfo?.contactPerson && (
                      <Typography variant="body1"><strong>Contact:</strong> {selectedOrder.supplierInfo.contactPerson}</Typography>
                    )}
                  </Box>
                  
                  {selectedOrder.notes && (
                    <>
                      <Typography variant="h6" gutterBottom>Notes</Typography>
                      <Box sx={{ pl: 2, mb: 3 }}>
                        <Typography variant="body1">{selectedOrder.notes}</Typography>
                      </Box>
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Produits Commandés</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Produit</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="center">Quantité</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.products && selectedOrder.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>{product.productType}</TableCell>
                            <TableCell align="center">{product.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {selectedOrder.products && selectedOrder.products[0].options && selectedOrder.products[0].options.length > 0 && (
                    <>
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Options Commandées</Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Option</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell align="center">Quantité</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedOrder.products[0].options.map((option, index) => (
                              <TableRow key={index}>
                                <TableCell>{option.optionName}</TableCell>
                                <TableCell>{option.optionType}</TableCell>
                                <TableCell align="center">{option.quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseOrderDialog}>Fermer</Button>
              
              {selectedOrder.status === 'pending' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    handleSendEmail(selectedOrder._id);
                    handleCloseOrderDialog();
                  }}
                  startIcon={<EmailIcon />}
                >
                  Envoyer au Fournisseur
                </Button>
              )}
              
              {selectedOrder.status === 'submitted' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    handleUpdateStatus(selectedOrder._id, 'confirmed');
                    handleCloseOrderDialog();
                  }}
                >
                  Marquer comme Confirmée
                </Button>
              )}
              
              {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'shipped') && (
                <Button 
                  variant="contained" 
                  color="warning" 
                  onClick={() => {
                    handleOpenTrackingDialog(selectedOrder);
                    handleCloseOrderDialog();
                  }}
                  startIcon={<LocalShippingIcon />}
                >
                  Informations de Livraison
                </Button>
              )}
              
              {selectedOrder.status === 'shipped' && (
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => {
                    handleUpdateStatus(selectedOrder._id, 'delivered');
                    handleCloseOrderDialog();
                  }}
                >
                  Marquer comme Livrée
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Dialogue d'informations de livraison */}
      <Dialog open={trackingDialog} onClose={handleCloseTrackingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Informations de Livraison
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transporteur"
                value={trackingInfo.carrier}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de suivi"
                value={trackingInfo.trackingNumber}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de livraison estimée"
                type="date"
                value={trackingInfo.estimatedDeliveryDate}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDeliveryDate: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTrackingDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveTracking}
            disabled={!trackingInfo.carrier || !trackingInfo.trackingNumber}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SupplierOrdersPage;