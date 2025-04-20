import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent, Divider,
  CircularProgress, Button, List, ListItem, ListItemText, Chip, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

const COMMERCIAL_API_URL = process.env.REACT_APP_COMMERCIAL_API_URL || 'http://localhost:3001/api';

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Récupérer les données du tableau de bord
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Récupérer les résumés des statistiques
      const summaryResponse = await axios.get(`${COMMERCIAL_API_URL}/dashboard/summary`);
      
      // Récupérer les 5 derniers devis
      const recentQuotesResponse = await axios.get(`${COMMERCIAL_API_URL}/quotes?limit=5`);
      
      // Récupérer les 5 dernières commandes fournisseurs
      const recentOrdersResponse = await axios.get(`${COMMERCIAL_API_URL}/supplier-orders?limit=5`);
      
      setDashboardData(summaryResponse.data);
      setRecentQuotes(recentQuotesResponse.data.slice(0, 5));
      setRecentOrders(recentOrdersResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
      setError('Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Formatter les données pour les graphiques
  const prepareQuoteStatusData = () => {
    if (!dashboardData || !dashboardData.quotes) return [];
    
    return dashboardData.quotes.map(stat => ({
      name: formatStatus(stat._id),
      value: stat.count,
      amount: stat.totalAmount
    }));
  };

  const prepareOrderStatusData = () => {
    if (!dashboardData || !dashboardData.orders) return [];
    
    return dashboardData.orders.map(stat => ({
      name: formatOrderStatus(stat._id),
      value: stat.count,
      amount: stat.totalAmount
    }));
  };

  const preparePaymentData = () => {
    if (!dashboardData || !dashboardData.payments) return [];
    
    const { depositPaid, installationPaid, finalPaid, totalDeposit, totalInstallationPayment, totalFinalPayment } = dashboardData.payments;
    
    return [
      { name: 'Acompte (40%)', paid: depositPaid, total: totalDeposit },
      { name: 'Installation (30%)', paid: installationPaid, total: totalInstallationPayment },
      { name: 'Final (30%)', paid: finalPaid, total: totalFinalPayment }
    ];
  };

  // Formatage des statuts
  const formatStatus = (status) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyé';
      case 'accepted': return 'Accepté';
      case 'cancelled': return 'Annulé';
      default: return status || 'Inconnu';
    }
  };

  const formatOrderStatus = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'submitted': return 'Envoyée';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status || 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
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

  const getOrderStatusChip = (status) => {
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

  // Couleurs pour les graphiques
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  // Calcul des totaux
  const calculateTotals = () => {
    if (!dashboardData) return { quotes: 0, totalAmount: 0, paidAmount: 0, orderCount: 0 };
    
    const quoteCount = dashboardData.quotes.reduce((sum, stat) => sum + stat.count, 0);
    const totalAmount = dashboardData.quotes.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0);
    
    const { depositPaid, installationPaid, finalPaid } = dashboardData.payments || { depositPaid: 0, installationPaid: 0, finalPaid: 0 };
    const paidAmount = depositPaid + installationPaid + finalPaid;
    
    const orderCount = dashboardData.orders.reduce((sum, stat) => sum + stat.count, 0);
    
    return { quoteCount, totalAmount, paidAmount, orderCount };
  };

  const { quoteCount, totalAmount, paidAmount, orderCount } = calculateTotals();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête du tableau de bord */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Tableau de Bord Commercial
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Suivi des devis, paiements et commandes fournisseurs
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'primary.light' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Devis
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2, color: 'white' }}>
                  {quoteCount}
                </Typography>
              </Box>
              <ReceiptIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'success.light' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Montant Total
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 2, color: 'white' }}>
                  {formatCurrency(totalAmount)}
                </Typography>
              </Box>
              <PaymentIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'warning.light' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Montant Payé
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 2, color: 'white' }}>
                  {formatCurrency(paidAmount)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, bgcolor: 'secondary.light' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ color: 'white' }}>
                  Commandes
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2, color: 'white' }}>
                  {orderCount}
                </Typography>
              </Box>
              <ShoppingCartIcon sx={{ fontSize: 40, color: 'white', opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Graphiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statut des Devis
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareQuoteStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {prepareQuoteStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  value,
                  name,
                  `Montant: ${formatCurrency(props.payload.amount)}`
                ]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statut des Commandes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={prepareOrderStatusData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => [
                  value,
                  name,
                  `Montant: ${formatCurrency(props.payload.amount)}`
                ]} />
                <Legend />
                <Bar dataKey="value" name="Nombre" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Suivi des Paiements
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={preparePaymentData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="paid" name="Payé" fill={theme.palette.success.main} />
                <Bar dataKey="total" name="Total" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Activités récentes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Derniers Devis
            </Typography>
            <List>
              {recentQuotes.length > 0 ? recentQuotes.map((quote) => (
                <ListItem key={quote._id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {quote.quoteNumber}
                        </Typography>
                        {getStatusChip(quote.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {quote.customerInfo?.name} - {formatCurrency(quote.totalPrice)}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Créé le {formatDate(quote.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary="Aucun devis récent" />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                href="/admin/quotes"
              >
                Voir tous les devis
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dernières Commandes
            </Typography>
            <List>
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <ListItem key={order._id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {order.orderNumber}
                        </Typography>
                        {getOrderStatusChip(order.status)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {order.products ? `${order.products.length} produit(s)` : '0 produit'} - {formatCurrency(order.totalAmount)}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Créé le {formatDate(order.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText primary="Aucune commande récente" />
                </ListItem>
              )}
            </List>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                href="/admin/supplier-orders"
              >
                Voir toutes les commandes
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;