import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useMarketingContext } from '../../contexts/MarketingContext';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Formulaire de capture de leads
 * Permet aux visiteurs de soumettre directement leurs informations
 */
const LeadCaptureForm = () => {
  const { updateLead, setIsLeadCaptured } = useMarketingContext();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
    },
    interests: {
      modelType: '',
      liaisonLength: '',
    },
    notes: '',
    consent: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Modèles de climatiseurs disponibles
  const modelTypes = [
    { value: 'mono-split', label: 'Mono-split (1 pièce)' },
    { value: 'bi-split', label: 'Bi-split (2 pièces)' },
    { value: 'tri-split', label: 'Tri-split (3 pièces)' },
    { value: 'quad-split', label: 'Quad-split (4 pièces)' },
  ];

  // Longueurs de liaison disponibles
  const liaisonLengths = [
    { value: '4m', label: '4 mètres' },
    { value: '6m', label: '6 mètres' },
    { value: '8m', label: '8 mètres' },
    { value: '10m', label: '10 mètres' },
    { value: '12m', label: '12 mètres' },
  ];

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Gestion des champs imbriqués (address, interests)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    
    // Effacer l'erreur éventuelle sur le champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom est requis';
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    // Validation du téléphone (format français)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^0[1-9](\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    // Validation du code postal
    if (formData.address.postalCode && !/^\d{5}$/.test(formData.address.postalCode)) {
      newErrors['address.postalCode'] = 'Code postal invalide';
    }
    
    // Validation du consentement obligatoire
    if (!formData.consent) {
      newErrors.consent = 'Vous devez accepter les conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Récupérer les paramètres UTM de l'URL si présents
      const utmData = {
        source: new URLSearchParams(window.location.search).get('utm_source'),
        medium: new URLSearchParams(window.location.search).get('utm_medium'),
        campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        content: new URLSearchParams(window.location.search).get('utm_content'),
      };
      
      // Préparer les données à envoyer
      const leadData = {
        ...formData,
        source: 'form',
        utmData,
        ipAddress: '', // Sera rempli côté serveur
        userAgent: navigator.userAgent,
        notes: formData.notes ? [{ content: formData.notes }] : [],
      };
      
      // Envoyer les données au serveur
      const response = await axios.post(`${API_URL}/api/leads`, leadData);
      
      if (response.data.success) {
        // Mettre à jour le contexte
        updateLead(response.data.data);
        setIsLeadCaptured(true);
        
        // Notification de succès
        setSnackbar({
          open: true,
          message: 'Votre demande a été enregistrée avec succès !',
          severity: 'success',
        });
        
        // Réinitialiser le formulaire
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            postalCode: '',
          },
          interests: {
            modelType: '',
            liaisonLength: '',
          },
          notes: '',
          consent: false,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSnackbar({
        open: true,
        message: 'Une erreur s\'est produite. Veuillez réessayer.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fermer la notification
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Demande de devis gratuit
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Recevez un devis personnalisé pour l'installation de votre climatisation Airton avec technologie ReadyClim. Notre équipe vous contactera sous 24h.
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>
              Vos coordonnées
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="fullName"
              label="Nom et prénom"
              variant="outlined"
              fullWidth
              required
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Téléphone"
              variant="outlined"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="06 XX XX XX XX"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="address.city"
              label="Ville"
              variant="outlined"
              fullWidth
              value={formData.address.city}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="address.postalCode"
              label="Code postal"
              variant="outlined"
              fullWidth
              value={formData.address.postalCode}
              onChange={handleChange}
              error={!!errors['address.postalCode']}
              helperText={errors['address.postalCode']}
            />
          </Grid>
          
          {/* Intérêts et besoins */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'medium' }}>
              Votre projet
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                select
                name="interests.modelType"
                label="Modèle de climatiseur"
                value={formData.interests.modelType}
                onChange={handleChange}
              >
                <MenuItem value="">Sélectionnez un modèle</MenuItem>
                {modelTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                select
                name="interests.liaisonLength"
                label="Longueur de liaison"
                value={formData.interests.liaisonLength}
                onChange={handleChange}
              >
                <MenuItem value="">Sélectionnez une longueur</MenuItem>
                {liaisonLengths.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="notes"
              label="Informations complémentaires"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Décrivez votre projet ou posez vos questions..."
            />
          </Grid>
          
          {/* Consentement */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="J'accepte de recevoir des informations sur mon projet de climatisation et d'être contacté par l'équipe Airton."
            />
            {errors.consent && (
              <Typography variant="caption" color="error">
                {errors.consent}
              </Typography>
            )}
          </Grid>
          
          {/* Bouton de soumission */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={24} /> : <SendIcon />}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? 'Envoi en cours...' : 'Recevoir mon devis gratuit'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Notification de succès/erreur */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LeadCaptureForm;
