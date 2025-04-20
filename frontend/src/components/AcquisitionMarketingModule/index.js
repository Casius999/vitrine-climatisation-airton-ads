import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ChatbotAgent from './ChatbotAgent';
import LeadCaptureForm from './LeadCaptureForm';
import SocialProofDisplay from './SocialProofDisplay';
import { useMarketingContext } from '../../contexts/MarketingContext';

/**
 * Module principal d'acquisition de clients et marketing automatisé
 * Ce composant orchestre tous les sous-composants du module d'acquisition
 */
const AcquisitionMarketingModule = () => {
  const { isLeadCaptured } = useMarketingContext();

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Bénéficiez d'une installation ultra-rapide
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          Notre équipe certifiée installe votre climatisation Airton en 20 minutes grâce à la technologie ReadyClim
        </Typography>

        {/* Zone de chatbot intelligent */}
        <Box sx={{ mt: 4 }}>
          <ChatbotAgent />
        </Box>

        {/* Formulaire de capture de lead (affiché conditionnellement) */}
        {!isLeadCaptured && (
          <Box sx={{ mt: 6 }}>
            <LeadCaptureForm />
          </Box>
        )}

        {/* Zone de preuve sociale */}
        <Box sx={{ mt: 6 }}>
          <SocialProofDisplay />
        </Box>
      </Box>
    </Container>
  );
};

export default AcquisitionMarketingModule;
