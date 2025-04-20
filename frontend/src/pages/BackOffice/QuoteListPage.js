import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Chip, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Typography, TextField, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COMMERCIAL_API_URL = process.env.REACT_APP_COMMERCIAL_API_URL || 'http://localhost:3001/api';

const QuoteListPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);
  
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${COMMERCIAL_API_URL}/quotes`);
      setQuotes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      setError('Impossible de charger les devis. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchQuotes();
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
  
  const handleViewQuote = (quote) => {
    setSelectedQuote(quote);
    setOpenQuoteDialog(true);
  };
  
  const handleCloseQuoteDialog = () => {
    setOpenQuoteDialog(false);
  };
  
  const handleDownloadPDF = (quoteId) => {
    window.open(`${COMMERCIAL_API_URL}/quotes/${quoteId}/pdf`, '_blank');
  };
  
  const handleSendEmail = async (quoteId) => {
    try {
      const response = await axios.post(`${COMMERCIAL_API_URL}/quotes/${quoteId}/send`);
      alert('Email envoyé avec succès!');
      fetchQuotes(); // Rafraîchir la liste pour mettre à jour le statut
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    }
  };
  
  const createSupplierOrder = async (quoteIds) => {
    try {
      const response = await axios.post(`${COMMERCIAL_API_URL}/supplier-orders`, {
        quoteIds: Array.isArray(quoteIds) ? quoteIds : [quoteIds],
        notes: 'Commande créée depuis le backoffice'
      });
      alert('Commande fournisseur créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création de la commande fournisseur:', error);
      alert('Erreur lors de la création de la commande fournisseur. Veuillez réessayer.');
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'draft':
        return <Chip label="Brouillon" size="small" color="default" />;
      case 'sent':
        return <Chip label="Envoyé" size="small" color="info" />;
      case 'accepted':
        return <Chip label="Accepté" size="small" color="success" />;
      case 'cancelled':
        return <Chip label="Annulé" size="small" color="error" />;
      default:
        return <Chip label="Inconnu" size="small" />;
    }
  };
  
  const getPaymentStatusChip = (paymentStatus, type) => {
    if (!paymentStatus) return <Chip label="En attente" size="small" variant="outlined" />;
    
    const status = paymentStatus[type];
    
    switch (status) {
      case 'paid':
        return <Chip label="Payé" size="small" color="success" variant="outlined" />;
      case 'pending':
        return <Chip label="En attente" size="small" color="warning" variant="outlined" />;
      case 'failed':
        return <Chip label="Échoué" size="small" color="error" variant="outlined" />;
      default:
        return <Chip label="Inconnu" size="small" variant="outlined" />;
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
  
  // Filtrer les devis
  const filteredQuotes = quotes.filter(quote => {
    let matchesStatus = true;
    let matchesSearch = true;
    
    if (statusFilter) {
      matchesStatus = quote.status === statusFilter;
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matchesSearch = (
        (quote.quoteNumber && quote.quoteNumber.toLowerCase().includes(search)) ||
        (quote.customerInfo?.name && quote.customerInfo.name.toLowerCase().includes(search)) ||
        (quote.customerInfo?.email && quote.customerInfo.email.toLowerCase().includes(search)) ||
        (quote.customerInfo?.phone && quote.customerInfo.phone.includes(search))
      );
    }
    
    return matchesStatus && matchesSearch;
  });
  
  // Paginer les résultats
  const paginatedQuotes = filteredQuotes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Devis
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
              placeholder="N° devis, client, email..."
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
              <MenuItem value="draft">Brouillon</MenuItem>
              <MenuItem value="sent">Envoyé</MenuItem>
              <MenuItem value="accepted">Accepté</MenuItem>
              <MenuItem value="cancelled">Annulé</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button 
              variant="contained" 
              startIcon={<ShoppingCartIcon />}
              onClick={() => {
                const selectedQuoteIds = filteredQuotes
                  .filter(quote => quote.paymentStatus?.deposit === 'paid' && quote.status === 'accepted')
                  .map(quote => quote._id);
                
                if (selectedQuoteIds.length === 0) {
                  alert('Aucun devis éligible pour créer une commande fournisseur.');
                } else {
                  createSupplierOrder(selectedQuoteIds);
                }
              }}
            >
              Créer Commande Fournisseur
            </Button>
          </Grid>
        </Grid>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N° Devis</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date Création</TableCell>
                <TableCell>Date Installation</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Acompte (40%)</TableCell>
                <TableCell>Installation (30%)</TableCell>
                <TableCell>Final (30%)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">Chargement...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ color: 'error.main' }}>{error}</TableCell>
                </TableRow>
              ) : paginatedQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">Aucun devis trouvé</TableCell>
                </TableRow>
              ) : (
                paginatedQuotes.map((quote) => (
                  <TableRow key={quote._id} hover>
                    <TableCell>{quote.quoteNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{quote.customerInfo?.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{quote.customerInfo?.email}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(quote.createdAt)}</TableCell>
                    <TableCell>{formatDate(quote.installationDate)}</TableCell>
                    <TableCell>{formatCurrency(quote.totalPrice)}</TableCell>
                    <TableCell>{getStatusChip(quote.status)}</TableCell>
                    <TableCell>{getPaymentStatusChip(quote.paymentStatus, 'deposit')}</TableCell>
                    <TableCell>{getPaymentStatusChip(quote.paymentStatus, 'installationPayment')}</TableCell>
                    <TableCell>{getPaymentStatusChip(quote.paymentStatus, 'finalPayment')}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => handleViewQuote(quote)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Télécharger PDF">
                          <IconButton size="small" onClick={() => handleDownloadPDF(quote._id)}>
                            <GetAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Envoyer par email">
                          <IconButton 
                            size="small" 
                            onClick={() => handleSendEmail(quote._id)}
                            disabled={quote.status === 'sent' || quote.status === 'accepted'}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Créer commande fournisseur">
                          <IconButton 
                            size="small" 
                            onClick={() => createSupplierOrder(quote._id)}
                            disabled={quote.paymentStatus?.deposit !== 'paid'}
                          >
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
          count={filteredQuotes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Dialogue de détails du devis */}
      <Dialog open={openQuoteDialog} onClose={handleCloseQuoteDialog} maxWidth="md" fullWidth>
        {selectedQuote && (
          <>
            <DialogTitle>
              Détails du Devis #{selectedQuote.quoteNumber}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Informations Client</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1"><strong>Nom:</strong> {selectedQuote.customerInfo?.name}</Typography>
                    <Typography variant="body1"><strong>Email:</strong> {selectedQuote.customerInfo?.email}</Typography>
                    <Typography variant="body1"><strong>Téléphone:</strong> {selectedQuote.customerInfo?.phone}</Typography>
                    <Typography variant="body1"><strong>Adresse:</strong> {selectedQuote.customerInfo?.address}, {selectedQuote.customerInfo?.postalCode} {selectedQuote.customerInfo?.city}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Configuration Produit</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1"><strong>Modèle:</strong> {selectedQuote.productConfiguration?.productName}</Typography>
                    <Typography variant="body1"><strong>Type:</strong> {selectedQuote.productConfiguration?.productType}</Typography>
                    
                    {selectedQuote.productConfiguration?.options && selectedQuote.productConfiguration.options.length > 0 && (
                      <>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Options:</strong></Typography>
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {selectedQuote.productConfiguration.options.map((option, index) => (
                            <li key={index}>
                              <Typography variant="body2">
                                {option.optionName} - {formatCurrency(option.price || 0)}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Détails Financiers</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Prix Total:</strong> {formatCurrency(selectedQuote.totalPrice)}</Typography>
                        <Typography variant="body1"><strong>Date d'installation:</strong> {formatDate(selectedQuote.installationDate)}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>Statut du Devis:</strong> {getStatusChip(selectedQuote.status)}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Créé le:</strong> {formatDate(selectedQuote.createdAt)}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" sx={{ mt: 2 }}>Échéancier de Paiement</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1">Acompte (40%)</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">{formatCurrency(selectedQuote.deposit)}</Typography>
                            {getPaymentStatusChip(selectedQuote.paymentStatus, 'deposit')}
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1">Jour d'installation (30%)</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">{formatCurrency(selectedQuote.installationPayment)}</Typography>
                            {getPaymentStatusChip(selectedQuote.paymentStatus, 'installationPayment')}
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1">Paiement Final (30%)</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">{formatCurrency(selectedQuote.finalPayment)}</Typography>
                            {getPaymentStatusChip(selectedQuote.paymentStatus, 'finalPayment')}
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseQuoteDialog}>Fermer</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleDownloadPDF(selectedQuote._id)}
                startIcon={<GetAppIcon />}
              >
                Télécharger PDF
              </Button>
              {selectedQuote.status === 'draft' && (
                <Button 
                  variant="contained" 
                  color="info" 
                  onClick={() => {
                    handleSendEmail(selectedQuote._id);
                    handleCloseQuoteDialog();
                  }}
                  startIcon={<EmailIcon />}
                >
                  Envoyer par Email
                </Button>
              )}
              {selectedQuote.paymentStatus?.deposit === 'paid' && (
                <Button 
                  variant="contained" 
                  color="success" 
                  onClick={() => {
                    createSupplierOrder(selectedQuote._id);
                    handleCloseQuoteDialog();
                  }}
                  startIcon={<ShoppingCartIcon />}
                >
                  Créer Commande
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default QuoteListPage;