import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

/**
 * Module de sélection des options techniques de climatisation
 * Permet la sélection du modèle et de la longueur de liaison ReadyClim
 */
const ConfiguratorModule = ({ onConfigure, onSubmit }) => {
  // État pour les options sélectionnées
  const [model, setModel] = useState('');
  const [liaisonLength, setLiaisonLength] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState(null);

  // Options disponibles
  const modelOptions = [
    { value: 'mono-split', label: 'Mono-split (1 unité - Pièce unique)', basePrice: 899 },
    { value: 'bi-split', label: 'Bi-split (2 unités - 2 pièces)', basePrice: 1499 },
    { value: 'tri-split', label: 'Tri-split (3 unités - 3 pièces)', basePrice: 1999 },
    { value: 'quad-split', label: 'Quad-split (4 unités - 4 pièces)', basePrice: 2499 }
  ];

  const liaisonOptions = [
    { value: '4m', label: '4 mètres', price: 0 },
    { value: '6m', label: '6 mètres', price: 49 },
    { value: '8m', label: '8 mètres', price: 99 },
    { value: '10m', label: '10 mètres', price: 149 },
    { value: '12m', label: '12 mètres', price: 199 }
  ];

  // Charger les données du produit depuis l'API
  useEffect(() => {
    if (model && liaisonLength) {
      setIsLoading(true);
      
      // Simulation d'un appel API au microservice configurator-service
      setTimeout(() => {
        const selectedModel = modelOptions.find(option => option.value === model);
        const selectedLiaison = liaisonOptions.find(option => option.value === liaisonLength);
        
        const price = selectedModel.basePrice + selectedLiaison.price;
        
        // Données produit complètes
        const product = {
          id: `${model}-${liaisonLength}`,
          name: `Climatiseur Airton ${selectedModel.label}`,
          description: `Climatiseur réversible avec technologie ReadyClim, liaison ${liaisonLength}`,
          basePrice: selectedModel.basePrice,
          liaisonPrice: selectedLiaison.price,
          totalPrice: price,
          features: [
            "Technologie ReadyClim pré-chargée en gaz R32",
            `Installation ultra-rapide (20 minutes)`,
            "Sans intervention d'un frigoriste",
            "Climatiseur connecté pilotable par WiFi",
            "Garantie 3 ans constructeur"
          ],
          specifications: {
            puissance: model === 'mono-split' ? '2.64 kW' : model === 'bi-split' ? '5.28 kW' : model === 'tri-split' ? '7.92 kW' : '10.56 kW',
            niveau_sonore: '21 dB',
            classe_energetique: 'A++',
            couleur: 'Blanc',
            dimensions: model === 'mono-split' ? '81.5 x 20.4 x 30.3 cm' : 'Variable selon unités',
          }
        };
        
        setProductData(product);
        setTotalPrice(price);
        setIsLoading(false);
        
        // Transmettre la configuration au parent si la fonction est fournie
        if (onConfigure) {
          onConfigure(product);
        }
      }, 800);
    }
  }, [model, liaisonLength]);

  const handleSubmit = () => {
    if (onSubmit && productData) {
      onSubmit(productData);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight={600} color="primary">
        Configurez votre climatisation
      </Typography>
      
      <Typography variant="body1" gutterBottom color="text.secondary" sx={{ mb: 3 }}>
        Sélectionnez le modèle adapté à vos besoins et la longueur de liaison ReadyClim nécessaire.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="model-select-label">Modèle de climatiseur Airton</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="Modèle de climatiseur Airton"
              onChange={(e) => setModel(e.target.value)}
            >
              {modelOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} - {option.basePrice}€
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="liaison-select-label">Longueur de liaison ReadyClim</InputLabel>
            <Select
              labelId="liaison-select-label"
              id="liaison-select"
              value={liaisonLength}
              label="Longueur de liaison ReadyClim"
              onChange={(e) => setLiaisonLength(e.target.value)}
            >
              {liaisonOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} {option.price > 0 ? `(+${option.price}€)` : '(inclus)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ mt: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
      ) : productData && (
        <>
          <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif de votre configuration
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {productData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {productData.description}
                </Typography>
                
                <List dense>
                  {productData.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Prix total
                    </Typography>
                    <Typography variant="h4" component="div" color="primary" fontWeight={600}>
                      {productData.totalPrice}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      TVA incluse
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Typography variant="body2">
                      Appareil: {productData.basePrice}€
                    </Typography>
                    <Typography variant="body2">
                      Liaison {liaisonLength}: {productData.liaisonPrice > 0 ? `+${productData.liaisonPrice}€` : 'inclus'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Card variant="outlined" sx={{ flex: 1, minWidth: 240 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Installation rapide</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Seulement 20 minutes pour une installation complète
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ flex: 1, minWidth: 240 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <SpeedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Performance</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Puissance: {productData.specifications.puissance}
                </Typography>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ flex: 1, minWidth: 240 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <EnergySavingsLeafIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Efficacité</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Classe énergétique: {productData.specifications.classe_energetique}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={!productData}
              onClick={handleSubmit}
            >
              Réserver mon installation
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ConfiguratorModule;