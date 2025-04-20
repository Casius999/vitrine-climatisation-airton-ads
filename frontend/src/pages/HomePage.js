import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConfiguratorModule from '../components/ConfiguratorModule/ConfiguratorModule';
import ReviewsModule from '../components/ReviewsModule/ReviewsModule';
import BookingPaymentModule from '../components/BookingPaymentModule/BookingPaymentModule';
import NotificationModule from '../components/NotificationModule/NotificationModule';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeSection, setActiveSection] = useState('hero');
  const [productConfig, setProductConfig] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const configuratorRef = useRef(null);
  const reviewsRef = useRef(null);
  const bookingRef = useRef(null);
  
  // Observer pour détecter la section active lors du scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  // Gérer la configuration du produit
  const handleConfigure = (config) => {
    setProductConfig(config);
  };
  
  // Afficher la section de réservation après configuration
  const handleConfigureSubmit = (config) => {
    setProductConfig(config);
    setShowBookingSection(true);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Gérer la complétion de la réservation
  const handleBookingComplete = (details) => {
    setBookingDetails(details);
    setShowConfirmation(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fonction pour scroller vers une section
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      
      {showConfirmation && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <NotificationModule 
            bookingDetails={bookingDetails} 
            showConfirmation={showConfirmation} 
          />
        </Container>
      )}
      
      <section id="hero">
        <Box
          sx={{
            bgcolor: 'primary.dark',
            color: 'white',
            pt: 8,
            pb: 10,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
                  Installation climatisation
                  <Box component="span" sx={{ color: 'secondary.main' }}> en 20 minutes</Box>
                </Typography>
                
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                  Climatiseur Airton avec technologie ReadyClim
                  pré-chargée en gaz - installation sans frigoriste
                </Typography>
                
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    onClick={() => scrollToSection(configuratorRef)}
                  >
                    Configurer mon climatiseur
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    onClick={() => scrollToSection(reviewsRef)}
                  >
                    Voir les avis clients
                  </Button>
                </Box>
                
                <Box display="flex" gap={2} mt={4}>
                  <Chip 
                    icon={<WorkspacePremiumIcon />} 
                    label="Garantie 3 ans" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} 
                  />
                  <Chip 
                    icon={<AccessTimeIcon />} 
                    label="Installation 20 min" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} 
                  />
                  <Chip 
                    icon={<VerifiedIcon />} 
                    label="111 avis ★★★★★" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} 
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src="/airton-installation-climatisation.jpg" 
                  alt="Installation rapide climatiseur Airton"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                    height: { xs: 250, md: 350 },
                    objectFit: 'cover',
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>
      
      <section id="advantages">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Pourquoi choisir cette solution ?
          </Typography>
          
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Une installation ultra-rapide avec une technologie révolutionnaire
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" component="h3">
                      Installation rapide
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Grâce à la technologie ReadyClim, l'installation ne prend que 20 minutes, sans aucune intervention d'un frigoriste.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Les liaisons pré-chargées en gaz R32 permettent un montage simple et rapide.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <EngineeringIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" component="h3">
                      Sans frigoriste
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Pas besoin d'intervention d'un frigoriste certifié. La technologie ReadyClim garantit une installation simple et efficace.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    L'unité intérieure se connecte à l'unité extérieure via la liaison pré-chargée.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ThumbUpIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" component="h3">
                      Qualité garantie
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    Les climatiseurs Airton sont garantis 3 ans par le fabricant. Un service après-vente réactif et efficace.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Airton est une marque française reconnue avec plus de 20 ans d'expérience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>
      
      <section id="technology">
        <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src="/readyclim-technology.jpg" 
                  alt="Technologie ReadyClim"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 2,
                    height: { xs: 250, md: 400 },
                    objectFit: 'cover',
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h3" component="h2" gutterBottom>
                  La technologie ReadyClim
                </Typography>
                
                <Typography variant="body1" paragraph>
                  La technologie ReadyClim révolutionne l'installation de climatiseurs avec des liaisons frigorifiques pré-chargées en gaz R32.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Installation en 20 minutes seulement" 
                      secondary="La connexion entre unités intérieure et extérieure se fait en quelques instants." 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Pas besoin de manipulation de gaz" 
                      secondary="Le gaz R32 est déjà chargé dans la liaison, aucune manipulation n'est nécessaire." 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Raccords rapides sécurisés" 
                      secondary="Les raccords spéciaux garantissent l'étanchéité parfaite du système." 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Efficacité énergétique optimale" 
                      secondary="Les climatiseurs Airton avec ReadyClim sont classés A++ pour une consommation maîtrisée." 
                    />
                  </ListItem>
                </List>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  onClick={() => scrollToSection(configuratorRef)}
                  sx={{ mt: 2 }}
                >
                  Configurer mon installation
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>
      
      <section id="configurator" ref={configuratorRef}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Configurez votre climatiseur Airton
          </Typography>
          
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Choisissez le modèle et les options adaptés à vos besoins
          </Typography>
          
          <ConfiguratorModule 
            onConfigure={handleConfigure} 
            onSubmit={handleConfigureSubmit}
          />
        </Container>
      </section>
      
      <section id="reviews" ref={reviewsRef}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Avis clients vérifiés
          </Typography>
          
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Plus de 110 clients satisfaits sur Allovoisin
          </Typography>
          
          <ReviewsModule />
        </Container>
      </section>
      
      <section id="coverage">
        <Box sx={{ bgcolor: 'primary.light', color: 'white', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" component="h2" gutterBottom>
                  Zone d'intervention
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Nous intervenons dans un rayon de 30 km autour d'Eysines (33320), comprenant Bordeaux et toute la CUB.
                </Typography>
                
                <Paper sx={{ p: 2, mb: 3, color: 'text.primary' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Communes desservies :
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {[
                      'Bordeaux', 'Mérignac', 'Pessac', 'Talence', 'Bègles',
                      'Villenave-d\'Ornon', 'Gradignan', 'Le Bouscat', 'Cenon',
                      'Lormont', 'Bruges', 'Blanquefort', 'Le Taillan-Médoc'
                    ].map((city, index) => (
                      <Grid item key={index} xs={6} sm={4}>
                        <Box display="flex" alignItems="center">
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body2">{city}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
                
                <Box display="flex" alignItems="center">
                  <MonetizationOnIcon sx={{ mr: 1.5, color: 'secondary.main' }} />
                  <Typography variant="body1" fontWeight={500}>
                    Pas de frais de déplacement dans cette zone
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box 
                  component="img" 
                  src="/zone-intervention-map.jpg" 
                  alt="Carte zone d'intervention"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>
      
      {showBookingSection && (
        <section id="booking" ref={bookingRef}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
              Réservez votre installation
            </Typography>
            
            <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
              Choisissez une date et réglez votre acompte de 40%
            </Typography>
            
            <BookingPaymentModule 
              productConfig={productConfig}
              onBookingComplete={handleBookingComplete}
            />
          </Container>
        </section>
      )}
      
      <Footer />
    </>
  );
};

export default HomePage;