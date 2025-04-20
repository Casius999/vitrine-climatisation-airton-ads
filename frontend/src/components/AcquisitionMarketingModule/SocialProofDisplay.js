import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Rating, Avatar, Chip, Button, Skeleton } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';

// Configuration de l'URL de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Affichage des preuves sociales (avis, témoignages)
 * Renforce la crédibilité du service
 */
const SocialProofDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);
  
  // Récupération des avis depuis l'API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Dans un environnement de production, ceci viendrait de l'API
        // const response = await axios.get(`${API_URL}/api/reviews`);
        // setReviews(response.data.data);
        
        // Pour la démonstration, utilisons des données statiques
        const mockReviews = [
          {
            id: '1',
            fullName: 'Jean Dupont',
            rating: 5,
            content: "Installation impeccable et ultra rapide ! J'étais vraiment sceptique sur la durée annoncée de 20 minutes, mais l'équipe a tenu parole. La climatisation fonctionne parfaitement, et l'air est frais et agréable. Je recommande vivement leurs services.",
            date: '2025-03-15',
            source: 'Allovoisin',
            verified: true,
          },
          {
            id: '2',
            fullName: 'Marine Lambert',
            rating: 5,
            content: "Service au top ! Le technicien est arrivé à l'heure et a installé mon split Airton en un temps record. La technologie ReadyClim fait vraiment la différence. J'apprécie la fraîcheur pendant les canicules sans avoir eu à passer par des travaux interminables.",
            date: '2025-03-02',
            source: 'Allovoisin',
            verified: true,
          },
          {
            id: '3',
            fullName: 'Thomas Petit',
            rating: 4,
            content: "Très bonne prestation, installation rapide et propre. Le technicien a pris le temps de m'expliquer le fonctionnement de la télécommande. Seul petit bémol, un peu de poussière à nettoyer après l'installation, mais rien de grave. La clim fonctionne parfaitement.",
            date: '2025-02-18',
            source: 'Allovoisin',
            verified: true,
          },
          {
            id: '4',
            fullName: 'Sophie Martin',
            rating: 5,
            content: "Excellente entreprise ! J'ai été conseillée sur le choix du modèle adapté à mon appartement. L'installation a été faite proprement et rapidement. La climatisation est silencieuse et rafraîchit très bien l'espace. Le prix était aussi très compétitif.",
            date: '2025-02-10',
            source: 'Allovoisin',
            verified: true,
          },
          {
            id: '5',
            fullName: 'Pierre Leroy',
            rating: 5,
            content: "Je suis très satisfait de ma climatisation Airton. L'installation s'est déroulée comme prévu, en 20 minutes chrono. Le technicien était professionnel et souriant. La liaison ReadyClim pré-chargée en gaz est vraiment une innovation qui change tout !",
            date: '2025-01-25',
            source: 'Allovoisin',
            verified: true,
          },
          {
            id: '6',
            fullName: 'Émilie Dubois',
            rating: 5,
            content: "Une équipe très professionnelle et à l'écoute. La technologie ReadyClim est bluffante, installation super rapide et sans mauvaise surprise. Je recommande sans hésiter pour ceux qui cherchent une solution de climatisation efficace sans les tracas habituels.",
            date: '2025-01-14',
            source: 'Allovoisin',
            verified: true,
          },
        ];
        
        setReviews(mockReviews);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des avis:', err);
        setError('Impossible de charger les avis. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Charger plus d'avis
  const handleLoadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 3, reviews.length));
  };

  // Rendu des squelettes pendant le chargement
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Paper key={index} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Box>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </Box>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
      </Paper>
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Nos clients témoignent
        </Typography>
        <Chip 
          icon={<VerifiedIcon />} 
          label="+110 avis vérifiés" 
          color="primary" 
          variant="outlined" 
          sx={{ fontWeight: 'medium' }}
        />
      </Box>
      
      {loading ? (
        renderSkeletons()
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {reviews.slice(0, visibleReviews).map((review) => (
            <Paper key={review.id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: review.verified ? '#4caf50' : '#9e9e9e', mr: 1.5 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {review.fullName}
                      {review.verified && (
                        <VerifiedIcon sx={{ ml: 0.5, fontSize: 16, color: '#4caf50', verticalAlign: 'text-bottom' }} />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={review.rating} readOnly size="small" sx={{ mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Chip 
                  size="small" 
                  label={review.source} 
                  sx={{ bgcolor: '#f5f5f5' }}
                />
              </Box>
              
              <Typography variant="body2" sx={{ mt: 1.5, mb: 1 }}>
                {review.content}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  startIcon={<ThumbUpIcon />} 
                  size="small" 
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  Utile
                </Button>
              </Box>
            </Paper>
          ))}
          
          {visibleReviews < reviews.length && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="outlined" onClick={handleLoadMore}>
                Voir plus d'avis
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SocialProofDisplay;
