import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import AcquisitionMarketingModule from '../components/AcquisitionMarketingModule';
import ConfiguratorModule from '../components/ConfiguratorModule';
import ReviewsModule from '../components/ReviewsModule';
import BookingPaymentModule from '../components/BookingPaymentModule';

/**
 * Page d'accueil principale de la vitrine
 * Intègre tous les modules principaux dans un flux optimisé pour la conversion
 */
const HomePage = () => {
  return (
    <Box>
      {/* Hero section avec proposition de valeur principale */}
      <Box sx={{ bgcolor: '#e1f5fe', py: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                Climatisation Airton installée en 20 minutes
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                La technologie ReadyClim révolutionne l'installation de votre climatiseur : 
                plus rapide, plus simple, plus économique.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                href="#configurator"
                sx={{ mt: 2, px: 4, py: 1.5 }}
              >
                Configurer mon installation
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'transparent' }}>
                <img 
                  src="/assets/images/airton-readyclim.jpg" 
                  alt="Climatisation Airton avec technologie ReadyClim" 
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Section pour le module d'acquisition de clients */}
      <Box sx={{ py: 6 }}>
        <Container>
          <AcquisitionMarketingModule />
        </Container>
      </Box>
      
      {/* Section pour le configurateur de produit */}
      <Box id="configurator" sx={{ py: 6, bgcolor: '#f5f5f5' }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Configurez votre climatisation
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Sélectionnez le modèle et les options adaptées à vos besoins
          </Typography>
          <ConfiguratorModule />
        </Container>
      </Box>
      
      {/* Section pour le module de réservation et paiement */}
      <Box sx={{ py: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Planifiez votre installation
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Choisissez votre créneau et réservez en ligne en quelques clics
          </Typography>
          <BookingPaymentModule />
        </Container>
      </Box>
      
      {/* Section pour le module de témoignages */}
      <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            L'avis de nos clients
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Découvrez l'expérience de plus de 110 clients satisfaits
          </Typography>
          <ReviewsModule />
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
