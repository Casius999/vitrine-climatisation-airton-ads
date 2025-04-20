import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Snackbar,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PlaceIcon from '@mui/icons-material/Place';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';

/**
 * Module de notification
 * Gère l'envoi de notifications par email et l'affichage des confirmations
 */
const NotificationModule = ({ bookingDetails, showConfirmation = false }) => {
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  
  // Simuler l'envoi d'un email lors du chargement initial si des détails de réservation sont fournis
  useEffect(() => {
    if (bookingDetails && showConfirmation && !isEmailSent) {
      sendConfirmationEmail();
    }
  }, [bookingDetails, showConfirmation]);
  
  // Simuler l'envoi d'un email de confirmation
  const sendConfirmationEmail = () => {
    if (!bookingDetails) {
      showSnackbar('Aucune réservation à confirmer.', 'error');
      return;
    }
    
    setLoading(true);
    
    // Simuler un appel à l'API pour envoyer un email
    setTimeout(() => {
      try {
        setIsEmailSent(true);
        showSnackbar('Email de confirmation envoyé avec succès !', 'success');
      } catch (error) {
        showSnackbar('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.', 'error');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };
  
  // Afficher une notification snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Fermer la notification snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  // Ouvrir la prévisualisation de l'email
  const handleOpenEmailPreview = () => {
    setEmailPreviewOpen(true);
  };
  
  // Fermer la prévisualisation de l'email
  const handleCloseEmailPreview = () => {
    setEmailPreviewOpen(false);
  };
  
  // Format de date pour l'affichage
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format d'heure pour l'affichage
  const formatTime = (time) => {
    if (!time) return '';
    const hours = new Date(time).getHours();
    return `${hours}:00`;
  };
  
  // Prévisualisation de l'email de confirmation
  const EmailPreviewDialog = () => {
    if (!bookingDetails) return null;
    
    return (
      <Dialog
        open={emailPreviewOpen}
        onClose={handleCloseEmailPreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1 }} />
            Prévisualisation de l'email de confirmation
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                De: Climatisation Airton &lt;installation@airton-climatisation.fr&gt;
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                À: {bookingDetails.customer?.email || 'client@example.com'}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Objet: 📅 Confirmation de votre installation de climatisation Airton - Réf: {bookingDetails.reference}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Bonjour {bookingDetails.customer?.firstName || 'Prénom'} {bookingDetails.customer?.lastName || 'Nom'},
              </Typography>
              
              <Typography variant="body1" paragraph>
                Nous vous confirmons votre rendez-vous d'installation de climatisation Airton avec technologie ReadyClim.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Votre installation sera réalisée par un technicien certifié Airton, en seulement 20 minutes grâce à la technologie ReadyClim.
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: theme.palette.primary.light, 
              color: theme.palette.primary.contrastText,
              borderRadius: 1,
              mb: 3
            }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Détails de votre rendez-vous :
              </Typography>
              
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ScheduleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Le ${formatDate(bookingDetails.date)} à ${formatTime(bookingDetails.time)}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PlaceIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${bookingDetails.customer?.address || 'Adresse'}, ${bookingDetails.customer?.postalCode || 'Code postal'} ${bookingDetails.customer?.city || 'Ville'}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <BuildIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${bookingDetails.product?.name || 'Climatiseur Airton'} - ${bookingDetails.product?.description || 'Description'}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Technicien: Florian C. (Compain)" 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Récapitulatif du paiement :
              </Typography>
              
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Prix total" 
                    secondary={`${bookingDetails.payment?.total || 0} €`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Acompte réglé" 
                    secondary={`${bookingDetails.payment?.deposit || 0} €`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'success.main' }}
                  />
                </ListItem>
                
                <ListItem disableGutters>
                  <ListItemText 
                    primary="Solde à régler à l'installation" 
                    secondary={`${bookingDetails.payment?.remaining || 0} €`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body1" paragraph>
              Si vous avez des questions ou si vous souhaitez modifier votre rendez-vous, n'hésitez pas à nous contacter au 06 XX XX XX XX du lundi au vendredi de 9h à 18h.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Nous vous remercions pour votre confiance et nous nous réjouissons de vous apporter le confort de la climatisation Airton.
            </Typography>
            
            <Typography variant="body1">
              L'équipe Airton Climatisation
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailPreview}>Fermer</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Si aucune réservation n'est à confirmer, ne rien afficher
  if (!bookingDetails && !showConfirmation) {
    return null;
  }
  
  return (
    <>
      {showConfirmation && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary">
            Confirmation de réservation
          </Typography>
          
          <Alert 
            severity="success" 
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            sx={{ mb: 3 }}
          >
            <AlertTitle>Réservation confirmée !</AlertTitle>
            Votre installation de climatisation est programmée pour le{' '}
            <strong>{formatDate(bookingDetails?.date)}</strong> à{' '}
            <strong>{formatTime(bookingDetails?.time)}</strong>.
            <Box mt={1}>
              Référence de réservation : <strong>{bookingDetails?.reference}</strong>
            </Box>
          </Alert>
          
          <Box display="flex" alignItems="center" mb={3}>
            <MarkEmailReadIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="body1">
              {isEmailSent ? (
                'Un email de confirmation a été envoyé à votre adresse email.'
              ) : (
                'L\'email de confirmation est en cours d\'envoi...'
              )}
            </Typography>
            
            {loading && <CircularProgress size={20} sx={{ ml: 1.5 }} />}
            
            {isEmailSent && (
              <Button 
                size="small" 
                color="primary"
                onClick={handleOpenEmailPreview}
                sx={{ ml: 2 }}
              >
                Voir l'email
              </Button>
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Vous recevrez un rappel la veille de votre rendez-vous. Le technicien vous contactera pour confirmer l'heure exacte d'intervention.
          </Typography>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Que se passe-t-il maintenant ?
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Confirmation par email" 
                  secondary="Tous les détails de votre réservation ont été envoyés à votre adresse email." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Préparation de votre commande" 
                  secondary="Votre climatiseur et la liaison ReadyClim sont préparés pour l'installation." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Appel de confirmation" 
                  secondary="Le technicien vous contactera la veille pour confirmer l'horaire exact." 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Installation rapide" 
                  secondary="Votre climatiseur sera installé en 20 minutes seulement ! Vous règlerez le solde au technicien." 
                />
              </ListItem>
            </List>
          </Box>
        </Paper>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      <EmailPreviewDialog />
    </>
  );
};

export default NotificationModule;