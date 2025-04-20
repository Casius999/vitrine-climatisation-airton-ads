import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', pt: 6, pb: 2, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AcUnitIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Airton Climatisation
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Installation de climatiseurs Airton avec technologie ReadyClim pour une installation rapide et sans intervention sur le circuit de gaz.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton aria-label="facebook" color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="instagram" color="primary" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="whatsapp" color="primary" size="small">
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liens utiles
            </Typography>
            <List dense disablePadding>
              {[
                { text: 'Accueil', path: '/' },
                { text: 'Configurateur', path: '/configurateur' },
                { text: 'Nos avis clients', path: '/#avis' },
                { text: 'Zone d\'intervention', path: '/#zone' },
                { text: 'Notre technologie', path: '/#technologie' }
              ].map((item) => (
                <ListItem key={item.text} disableGutters sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={
                      <Link 
                        component={RouterLink} 
                        to={item.path} 
                        color="inherit"
                        underline="hover"
                      >
                        {item.text}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Services
            </Typography>
            <List dense disablePadding>
              {[
                'Installation de climatiseur',
                'Technologie ReadyClim',
                'Mono-split / Multi-split',
                'Entretien climatisation',
                'Dépannage'              
              ].map((item) => (
                <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">
                Le Haillan (Bechade)<br />Bordeaux et CUB (rayon 30km)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">
                06XX XX XX XX
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">
                contact@exemple.com
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Airton Climatisation. Tous droits réservés.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Mentions légales
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                CGV
              </Typography>
            </Link>
            <Link href="#" color="inherit" underline="hover">
              <Typography variant="body2" color="text.secondary">
                Politique de confidentialité
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
