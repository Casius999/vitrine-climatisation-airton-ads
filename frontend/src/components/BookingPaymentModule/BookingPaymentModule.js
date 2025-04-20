import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Card,
  CardContent,
  Collapse,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { formatDate, formatTime, addDays, isWeekend } from 'date-fns';

/**
 * Module de réservation et paiement
 * Permet de réserver un créneau d'installation et de payer l'acompte via Stripe
 */
const BookingPaymentModule = ({ productConfig, onBookingComplete }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [dateSelected, setDateSelected] = useState(null);
  const [timeSelected, setTimeSelected] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);
  
  // Validation du formulaire
  const [errors, setErrors] = useState({});
  
  // Calcul de l'acompte (40% du prix total)
  const depositAmount = productConfig ? Math.round(productConfig.totalPrice * 0.4) : 0;
  const remainingAmount = productConfig ? productConfig.totalPrice - depositAmount : 0;
  
  // Définir les jours disponibles (14 jours à partir d'aujourd'hui, sans les week-ends)
  const getAvailableDays = () => {
    const today = new Date();
    const availableDays = [];
    
    // Ajouter 14 jours, en excluant les week-ends
    let daysToAdd = 0;
    while (availableDays.length < 14) {
      const nextDay = addDays(today, daysToAdd);
      if (!isWeekend(nextDay)) {
        availableDays.push(nextDay);
      }
      daysToAdd++;
    }
    
    return availableDays;
  };
  
  // Générer des créneaux disponibles pour la date sélectionnée
  useEffect(() => {
    if (dateSelected) {
      setLoading(true);
      
      // Simuler un appel à l'API pour récupérer les créneaux disponibles
      setTimeout(() => {
        // Générer des créneaux disponibles fictifs entre 8h et 18h
        const mockTimeSlots = [];
        for (let hour = 8; hour <= 17; hour++) {
          // Simuler que certains créneaux sont déjà réservés
          if (Math.random() > 0.3) {
            const slotTime = new Date(dateSelected);
            slotTime.setHours(hour, 0, 0);
            mockTimeSlots.push(slotTime);
          }
        }
        
        setAvailableTimeSlots(mockTimeSlots);
        setLoading(false);
      }, 800);
    }
  }, [dateSelected]);
  
  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Valider en temps réel
    validateField(name, value);
  };
  
  // Valider un champ spécifique
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'Ce champ est requis';
        } else {
          delete newErrors[name];
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors[name] = 'Ce champ est requis';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors[name] = 'Email invalide';
        } else {
          delete newErrors[name];
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors[name] = 'Ce champ est requis';
        } else if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(value.replace(/\s/g, ''))) {
          newErrors[name] = 'Numéro de téléphone invalide';
        } else {
          delete newErrors[name];
        }
        break;
      case 'address':
      case 'city':
        if (!value.trim()) {
          newErrors[name] = 'Ce champ est requis';
        } else {
          delete newErrors[name];
        }
        break;
      case 'postalCode':
        if (!value.trim()) {
          newErrors[name] = 'Ce champ est requis';
        } else if (!/^\d{5}$/.test(value.trim())) {
          newErrors[name] = 'Code postal invalide';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };
  
  // Valider tout le formulaire
  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'postalCode', 'city'];
    let newErrors = {};
    let isValid = true;
    
    requiredFields.forEach(field => {
      validateField(field, formData[field]);
      if (errors[field]) {
        isValid = false;
        newErrors[field] = errors[field];
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Étapes de réservation
  const steps = [
    { 
      label: 'Date & heure', 
      icon: <CalendarMonthIcon />,
      isValid: () => dateSelected && timeSelected 
    },
    { 
      label: 'Coordonnées', 
      icon: <ReceiptLongIcon />,
      isValid: validateForm 
    },
    { 
      label: 'Paiement', 
      icon: <PaymentIcon />,
      isValid: () => true 
    },
    { 
      label: 'Confirmation', 
      icon: <CheckCircleIcon />,
      isValid: () => true 
    }
  ];
  
  // Passer à l'étape suivante
  const handleNext = () => {
    if (activeStep === 1 && !validateForm()) {
      return;
    }
    
    if (activeStep === 2) {
      handlePayment();
      return;
    }
    
    setActiveStep(prevStep => prevStep + 1);
  };
  
  // Revenir à l'étape précédente
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Simuler le traitement du paiement
  const handlePayment = () => {
    setLoading(true);
    setError(null);
    
    // Simuler un appel à l'API de paiement (Stripe)
    setTimeout(() => {
      try {
        // Générer une référence de réservation aléatoire
        const reference = 'ART-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setBookingReference(reference);
        setActiveStep(prevStep => prevStep + 1);
        
        // Notifier le parent de la réservation terminée
        if (onBookingComplete) {
          onBookingComplete({
            reference,
            product: productConfig,
            date: dateSelected,
            time: timeSelected,
            customer: formData,
            payment: {
              method: paymentMethod,
              deposit: depositAmount,
              remaining: remainingAmount,
              total: productConfig?.totalPrice
            }
          });
        }
      } catch (error) {
        setError('Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };
  
  // Rendu de l'étape de sélection de date et heure
  const renderDateTimeStep = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Sélectionnez une date d'installation
          </Typography>
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <DatePicker
              label="Date d'installation"
              value={dateSelected}
              onChange={setDateSelected}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              disablePast
              shouldDisableDate={(date) => isWeekend(date)}
              minDate={new Date()}
              maxDate={addDays(new Date(), 30)}
            />
          </LocalizationProvider>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Nous intervenons du lundi au vendredi, dans un rayon de 30 km autour d'Eysines.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Sélectionnez une heure
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : !dateSelected ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              Veuillez d'abord sélectionner une date
            </Alert>
          ) : availableTimeSlots.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {availableTimeSlots.map((time, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Button
                      variant={timeSelected && timeSelected.getTime() === time.getTime() ? "contained" : "outlined"}
                      color="primary"
                      fullWidth
                      onClick={() => setTimeSelected(time)}
                      sx={{ mb: 1 }}
                    >
                      {time.getHours()}:00
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    );
  };
  
  // Rendu de l'étape de saisie des coordonnées
  const renderContactStep = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Adresse"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            label="Code postal"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.postalCode}
            helperText={errors.postalCode}
          />
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <TextField
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleFormChange}
            fullWidth
            required
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
      </Grid>
    );
  };
  
  // Rendu de l'étape de paiement
  const renderPaymentStep = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Mode de paiement
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel 
                value="card" 
                control={<Radio />} 
                label="Carte bancaire" 
              />
              <Collapse in={paymentMethod === 'card'}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ mb: 2, border: '1px solid #e0e0e0', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Saisie sécurisée via Stripe
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LockIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary">
                        Connexion sécurisée
                      </Typography>
                    </Box>
                  </Box>
                  
                  <TextField
                    label="Numéro de carte"
                    fullWidth
                    margin="normal"
                    placeholder="•••• •••• •••• ••••"
                    InputLabelProps={{ shrink: true }}
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Date d'expiration"
                        fullWidth
                        margin="normal"
                        placeholder="MM/AA"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="CVC"
                        fullWidth
                        margin="normal"
                        placeholder="•••"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
              
              <FormControlLabel 
                value="paypal" 
                control={<Radio />} 
                label="PayPal" 
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Récapitulatif de commande
              </Typography>
              
              {productConfig && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {productConfig.name} - Liaison {productConfig.description.includes('4m') ? '4m' : 
                                                   productConfig.description.includes('6m') ? '6m' : 
                                                   productConfig.description.includes('8m') ? '8m' : 
                                                   productConfig.description.includes('10m') ? '10m' : '12m'}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Date d'installation : {dateSelected ? dateSelected.toLocaleDateString('fr-FR') : ''} à{' '}
                    {timeSelected ? `${timeSelected.getHours()}:00` : ''}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Adresse : {formData.address}, {formData.postalCode} {formData.city}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Prix total</Typography>
                    <Typography variant="body2">{productConfig.totalPrice} €</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Acompte à payer aujourd'hui (40%)</Typography>
                    <Typography variant="body2" fontWeight={500} color="primary">
                      {depositAmount} €
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Solde à régler à l'installation</Typography>
                    <Typography variant="body2">{remainingAmount} €</Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            En validant le paiement, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
          </Alert>
        </Grid>
      </Grid>
    );
  };
  
  // Rendu de l'étape de confirmation
  const renderConfirmationStep = () => {
    return (
      <Box textAlign="center" my={4}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        
        <Typography variant="h5" gutterBottom>
          Réservation confirmée !
        </Typography>
        
        <Typography variant="body1" paragraph>
          Votre rendez-vous d'installation est programmé pour le{' '}
          <strong>{dateSelected?.toLocaleDateString('fr-FR')}</strong> à{' '}
          <strong>{timeSelected?.getHours()}:00</strong>.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Référence de réservation : <strong>{bookingReference}</strong>
        </Typography>
        
        <Typography variant="body1" paragraph>
          Un email de confirmation a été envoyé à <strong>{formData.email}</strong> avec tous les détails de votre réservation.
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3, mb: 2, maxWidth: 600, mx: 'auto' }}>
          Un acompte de <strong>{depositAmount} €</strong> a été débité. Le solde de <strong>{remainingAmount} €</strong> sera à régler au technicien le jour de l'installation.
        </Alert>
      </Box>
    );
  };
  
  // Rendu de l'étape courante
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderDateTimeStep();
      case 1:
        return renderContactStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary" mb={4}>
        Réservez votre installation
      </Typography>
      
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel StepIconComponent={() => (
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeStep >= index ? 'white' : 'grey.700',
                }}
              >
                {step.icon}
              </Box>
            )}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {renderStep()}
      
      {activeStep !== 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }} disabled={loading}>
              Retour
            </Button>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && (!dateSelected || !timeSelected)) ||
              loading
            }
            startIcon={activeStep === 2 ? <PaymentIcon /> : null}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {activeStep === 2 ? `Payer ${depositAmount} €` : 'Continuer'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default BookingPaymentModule;