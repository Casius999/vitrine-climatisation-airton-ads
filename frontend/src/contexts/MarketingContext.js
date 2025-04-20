import React, { createContext, useState, useContext, useEffect } from 'react';
import { extractUtmParameters } from '../components/AcquisitionMarketingModule/MarketingUtils';

// Création du contexte
const MarketingContext = createContext();

/**
 * Fournisseur de contexte pour le module d'acquisition et marketing
 * Gère l'état global des leads, campagnes et paramètres marketing
 */
export const MarketingProvider = ({ children }) => {
  // État du lead
  const [lead, setLead] = useState(null);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  
  // État des campagnes marketing
  const [activeCampaign, setActiveCampaign] = useState(null);
  
  // Données UTM et attribution
  const [utmData, setUtmData] = useState(null);
  
  // Récupération des paramètres UTM au chargement initial
  useEffect(() => {
    // Récupérer les UTM de l'URL actuelle
    const currentUtmParams = extractUtmParameters();
    
    // Récupérer les UTM stockés dans le localStorage
    const storedUtmData = localStorage.getItem('utm_data');
    let parsedUtmData = null;
    
    if (storedUtmData) {
      try {
        parsedUtmData = JSON.parse(storedUtmData);
      } catch (e) {
        console.error('Erreur lors du parsing des UTM stockés:', e);
      }
    }
    
    // Si des UTM sont présents dans l'URL, ils prennent priorité
    if (currentUtmParams.source || currentUtmParams.medium || currentUtmParams.campaign) {
      setUtmData(currentUtmParams);
      localStorage.setItem('utm_data', JSON.stringify({
        ...currentUtmParams,
        timestamp: new Date().toISOString(),
      }));
    } 
    // Sinon, utiliser les UTM stockés s'ils existent
    else if (parsedUtmData) {
      setUtmData(parsedUtmData);
    }
  }, []);

  // Mise à jour des informations de lead
  const updateLead = (newLeadData) => {
    setLead(prevLead => {
      // Si un lead existe déjà, fusionner les données
      if (prevLead) {
        return { ...prevLead, ...newLeadData };
      }
      // Sinon, créer un nouveau lead
      return newLeadData;
    });
    
    // Marquer que nous avons capturé un lead
    if (newLeadData) {
      setIsLeadCaptured(true);
      
      // Suivre l'événement de conversion si les pixels sont chargés
      if (window.trackLeadConversion) {
        window.trackLeadConversion();
      }
    }
  };

  // Définir la campagne active
  const setCampaign = (campaignData) => {
    setActiveCampaign(campaignData);
  };

  // Valeur du contexte exposée aux composants
  const contextValue = {
    // Données de lead
    lead,
    updateLead,
    isLeadCaptured,
    setIsLeadCaptured,
    
    // Données de campagne
    activeCampaign,
    setCampaign,
    
    // Données d'attribution
    utmData,
  };

  return (
    <MarketingContext.Provider value={contextValue}>
      {children}
    </MarketingContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMarketingContext = () => {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error('useMarketingContext doit être utilisé à l\'intérieur d\'un MarketingProvider');
  }
  return context;
};

export default MarketingContext;
