import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  LinearProgress,
  Divider,
  Chip,
  Button,
  IconButton,
  Skeleton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarsIcon from '@mui/icons-material/Stars';

/**
 * Module d'affichage des avis clients
 * Intègre les avis vérifiés d'Allovoisin avec ratings et commentaires
 */
const ReviewsModule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(isMobile ? 1 : 3);

  // Simuler le chargement des avis depuis l'API
  useEffect(() => {
    // Cette fonction simule l'appel au microservice reviews-service
    const fetchReviews = async () => {
      setLoading(true);
      
      try {
        // Simule un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données d'avis basées sur les screenshots partagés
        const mockReviews = [
          {
            id: 1,
            author: 'Marc D.',
            date: '10/03/2025',
            rating: 5,
            content: 'Installation impeccable en moins de 30min ! Le technicien était très professionnel et la climatisation fonctionne parfaitement. Je recommande vivement ce service.',
            verified: true,
          },
          {
            id: 2,
            author: 'Sophie L.',
            date: '22/02/2025',
            rating: 5,
            content: 'Excellente prestation, Florian a été très professionnel et l\'installation a été réalisée rapidement. Aucune mauvaise surprise sur le prix. Très satisfaite !',
            verified: true,
          },
          {
            id: 3,
            author: 'Jean-Pierre M.',
            date: '15/02/2025',
            rating: 5,
            content: 'Service de qualité. Installation rapide et sans souci. Technicien compétent qui a pris le temps d\'expliquer le fonctionnement. Je recommande.',
            verified: true,
          },
          {
            id: 4,
            author: 'Émilie F.',
            date: '02/02/2025',
            rating: 4,
            content: 'Bonne installation, rapide et efficace. Le technicien était à l\'heure et a tout bien expliqué. La climatisation fonctionne très bien.',
            verified: true,
          },
          {
            id: 5,
            author: 'Thomas B.',
            date: '28/01/2025',
            rating: 5,
            content: 'La technologie ReadyClim est vraiment impressionnante ! Installation en 20 minutes chrono comme promis. Merci pour ce service de qualité.',
            verified: true,
          },
          {
            id: 6,
            author: 'Laure D.',
            date: '17/01/2025',
            rating: 5,
            content: 'Super installation, rapide et propre. Le technicien a été très pédagogue et m\'a bien expliqué le fonctionnement. Je suis pleinement satisfaite.',
            verified: true,
          },
          {
            id: 7,
            author: 'Philippe R.',
            date: '05/01/2025',
            rating: 5,
            content: 'Excellente prestation du début à la fin. Installation rapide et soignée. Technicien compétent et aimable. Je recommande sans hésiter.',
            verified: true,
          },
          {
            id: 8,
            author: 'Mathilde V.',
            date: '20/12/2024',
            rating: 4,
            content: 'Installation rapide et efficace. Petit retard sur l\'horaire prévu mais le technicien a été très professionnel. Bon rapport qualité-prix.',
            verified: true,
          },
          {
            id: 9,
            author: 'François M.',
            date: '10/12/2024',
            rating: 5,
            content: 'Très satisfait de cette installation avec technologie ReadyClim. C\'est vraiment impressionnant la rapidité d\'installation !',
            verified: true,
          },
          {
            id: 10,
            author: 'Christine L.',
            date: '01/12/2024',
            rating: 2,
            content: 'Installation correcte mais délai d\'intervention non respecté. Le technicien est arrivé avec 2h de retard sans prévenir à l\'avance.',
            verified: true,
          },
          {
            id: 11,
            author: 'Nicolas B.',
            date: '25/11/2024',
            rating: 1,
            content: 'Déçu par l\'installation. Le technicien semblait pressé et n\'a pas pris le temps d\'expliquer le fonctionnement. Problème de fixation murale constaté après son départ.',
            verified: true,
          },
        ];
        
        // Statistiques des avis (basées sur le screenshot)
        const mockStats = {
          averageRating: 4.9,
          totalReviews: 111,
          distribution: {
            5: 93, // 93%
            4: 5,  // 5%
            3: 0,  // 0%
            2: 1,  // 1%
            1: 2,  // 2%
          },
          compliments: [
            { name: 'Super réactif', count: 9 },
            { name: 'Excellent rapport qualité/prix', count: 1 },
            { name: 'Très sympathique', count: 1 },
            { name: 'Expert dans son domaine', count: 1 },
            { name: 'Très soigneux', count: 1 }
          ]
        };
        
        setReviews(mockReviews);
        setStats(mockStats);
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Ajuster le nombre d'avis visibles en fonction de la taille d'écran
  useEffect(() => {
    setVisibleReviews(isMobile ? 1 : 3);
  }, [isMobile]);

  // Navigation dans le carrousel d'avis
  const handlePrevious = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === 0) return reviews.length - visibleReviews;
      return prevIndex - 1;
    });
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex + visibleReviews >= reviews.length) return 0;
      return prevIndex + 1;
    });
  };

  // Générer les avis visibles actuellement dans le carrousel
  const getVisibleReviews = () => {
    const result = [];
    for (let i = 0; i < visibleReviews; i++) {
      const index = (activeIndex + i) % reviews.length;
      result.push(reviews[index]);
    }
    return result;
  };

  // Composant de statistiques d'avis
  const ReviewStats = () => {
    if (!stats) return null;
    
    return (
      <Card elevation={0} variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column" mb={2}>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={stats.averageRating} precision={0.1} readOnly sx={{ mr: 1 }} />
              <Typography variant="h4" fontWeight={500}>
                {stats.averageRating.toFixed(1)}/5
              </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Basé sur {stats.totalReviews} avis
            </Typography>
          </Box>
          
          <Box mb={3}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box key={star} display="flex" alignItems="center" mb={0.5}>
                <Typography variant="body2" width={25}>{star}</Typography>
                <Box sx={{ width: '70%', mx: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.distribution[star]} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: star >= 4 ? theme.palette.success.main : star >= 3 ? theme.palette.warning.main : theme.palette.error.main
                      }
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stats.distribution[star]}%
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Compliments reçus
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={1}>
            {stats.compliments.map((compliment, index) => (
              <Chip 
                key={index}
                label={`${compliment.name} (${compliment.count})`}
                variant="outlined"
                size="small"
                icon={<StarsIcon fontSize="small" />}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Composant d'une carte d'avis individuel
  const ReviewCard = ({ review }) => {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36, mr: 1.5 }}>
                {review.author.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={500}>
                  {review.author}
                </Typography>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize="inherit" sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {review.verified && (
              <Chip
                size="small"
                icon={<VerifiedUserIcon fontSize="small" />}
                label="Vérifié"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          
          <Rating value={review.rating} readOnly size="small" sx={{ mb: 1.5 }} />
          
          <Box position="relative" minHeight={80}>
            <FormatQuoteIcon sx={{ position: 'absolute', top: -10, left: -8, opacity: 0.1, fontSize: 40 }} />
            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
              {review.content}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2" fontWeight={600} color="primary">
          Avis clients vérifiés
        </Typography>
        
        <Box display="flex" alignItems="center">
          {!loading && stats && (
            <>
              <Rating value={stats.averageRating} precision={0.1} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600} color="primary">
                {stats.averageRating.toFixed(1)}/5
              </Typography>
            </>
          )}
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {loading ? (
            <Box>
              <Skeleton variant="rectangular" height={240} />
            </Box>
          ) : (
            <ReviewStats />
          )}
          
          <Box textAlign="center">
            <Button 
              variant="outlined" 
              color="primary"
              endIcon={<ArrowForwardIosIcon fontSize="small" />}
              sx={{ mt: 2 }}
              href="https://www.allovoisin.com/profil/florian-c-compain"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tous les avis sur Allovoisin
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {loading ? (
            <Grid container spacing={2}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <>
              <Box position="relative">
                <Grid container spacing={2}>
                  {getVisibleReviews().map((review, index) => (
                    <Grid item xs={12} sm={12 / visibleReviews} key={index}>
                      <ReviewCard review={review} />
                    </Grid>
                  ))}
                </Grid>
                
                {reviews.length > visibleReviews && (
                  <>
                    <IconButton
                      onClick={handlePrevious}
                      sx={{
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'background.paper' }
                      }}
                    >
                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      onClick={handleNext}
                      sx={{
                        position: 'absolute',
                        right: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'background.paper' }
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
              
              <Box display="flex" justifyContent="center" mt={2}>
                {reviews.map((_, index) => {
                  const isActive = index === activeIndex || 
                    (index > activeIndex && index < activeIndex + visibleReviews);
                  
                  return (
                    <Box
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        mx: 0.5,
                        bgcolor: isActive ? 'primary.main' : 'grey.300',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveIndex(index)}
                    />
                  );
                })}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReviewsModule;