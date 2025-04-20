import React, { useEffect } from 'react';
import { Box } from '@mui/material';

/**
 * Composant invisible pour le tracking des conversions
 * Gère l'intégration des pixels (Facebook, Google Ads) et le suivi des événements
 */
const ConversionTracking = () => {
  useEffect(() => {
    // Fonction pour détecter les paramètres UTM
    const detectUtmParameters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmContent = urlParams.get('utm_content');
      
      // Si des paramètres UTM sont présents, les stocker dans localStorage pour attribution
      if (utmSource || utmMedium || utmCampaign || utmContent) {
        const utmData = {
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
          content: utmContent,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('utm_data', JSON.stringify(utmData));
      }
    };
    
    // Initialisation du tracking
    const initTracking = () => {
      // Détection des UTM
      detectUtmParameters();
      
      // Chargement du pixel Facebook (simulé)
      if (!window.fbq) {
        console.log('Chargement du pixel Facebook (simulation)');
        window.fbq = function() {
          console.log('Facebook Pixel Event:', arguments);
        };
        
        // Simuler un événement PageView
        window.fbq('init', 'FB_PIXEL_ID');
        window.fbq('track', 'PageView');
      }
      
      // Chargement du tracking Google Ads (simulé)
      if (!window.gtag) {
        console.log('Chargement du pixel Google Ads (simulation)');
        window.gtag = function() {
          console.log('Google Ads Event:', arguments);
        };
        
        // Simuler un événement page_view
        window.gtag('event', 'page_view');
      }
    };
    
    // Exécuter l'initialisation
    initTracking();
    
    // Nettoyage à la fermeture
    return () => {
      // Pas nécessaire dans ce cas mais pourrait être utilisé pour nettoyer les écouteurs d'événements
    };
  }, []);

  // Fonction pour suivre un événement (pourrait être exposée via un contexte)
  const trackEvent = (eventName, eventData = {}) => {
    // Suivi Facebook
    if (window.fbq) {
      window.fbq('track', eventName, eventData);
    }
    
    // Suivi Google Ads
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    // Suivi Google Analytics (si présent)
    if (window.ga) {
      window.ga('send', 'event', 'Conversion', eventName, JSON.stringify(eventData));
    }
    
    console.log(`Event tracked: ${eventName}`, eventData);
  };

  // Ce composant ne renvoie rien de visible
  return null;
};

export default ConversionTracking;
