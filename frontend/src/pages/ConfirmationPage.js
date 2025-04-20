import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import { useBooking } from '../contexts/BookingContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetConfig } = useConfig();
  const { bookingReference, resetBooking } = useBooking();
  
  const [showContact, setShowContact] = useState(true);
  
  // Extraction du référence de réservation depuis l'URL si présent
  const queryParams = new URLSearchParams(location.search);
  const refFromUrl = queryParams.get('ref');
  
  // Utiliser la référence depuis l'URL ou depuis le contexte
  const reference = refFromUrl || bookingReference;
  
  // Rediriger si aucune référence n'est disponible
  useEffect(() => {
    if (!reference) {
      navigate('/configurateur');
    }
  }, [reference, navigate]);
  
  // Réinitialiser la configuration et la réservation après affichage
  useEffect(() => {
    // Attendre un peu avant de réinitialiser pour permettre à l'utilisateur de voir la confirmation
    const timer = setTimeout(() => {
      resetConfig();
      resetBooking();
    }, 60000); // 1 minute
    
    return () => clearTimeout(timer);
  }, [resetConfig, resetBooking]);
  
  if (!reference) {
    return null; // La redirection se fera via l'effet ci-dessus
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 4 
        }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" align="center" gutterBottom>
            Réservation confirmée !
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary">
            Référence de réservation: {reference}
          </Typography>
        </Box>
        
        <Alert severity="success" sx={{ mb: 4 }}>
          Un email de confirmation a été envoyé à l'adresse que vous avez indiquée.
        </Alert>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Prochaines étapes</Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Confirmation téléphonique" 
                secondary="Notre technicien vous contactera la veille de l'intervention pour confirmer l'heure exacte." 
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="2. Préparation du site" 
                secondary="Assurez-vous que l'accès aux emplacements d'installation est dégagé." 
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemText 
                primary="3. Jour de l'installation" 
                secondary="L'installation prendra environ 20 minutes. Le solde sera à régler directement au technicien." 
              />
            </ListItem>
          </List>
        </Paper>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Détails du rendez-vous</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Un technicien certifié viendra à votre domicile pour installer votre climatiseur selon le créneau réservé.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Durée estimée de l'installation: 20 minutes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Coordonnées du technicien</Typography>
                </Box>
                
                {showContact ? (
                  <Box>
                    <Typography variant="body1" paragraph>
                      <strong>Florian C. (Compain)</strong><br />
                      Plombier Chauffagiste<br />
                      Le Haillan (Bechade)
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <PhoneIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">06XX XX XX XX</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <EmailIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2">contact@exemple.com</Typography>
                    </Box>
                    <Box mt={2}>
                      <Chip label="4,9/5 - 111 avis" color="primary" size="small" />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" paragraph>
                      Les coordonnées du technicien sont disponibles dans l'email de confirmation.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => setShowContact(true)}
                    >
                      Afficher les coordonnées
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ConfirmationPage;
