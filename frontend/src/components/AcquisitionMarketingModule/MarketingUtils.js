/**
 * Utilitaires pour le module d'acquisition de clients et marketing
 * Fonctions réutilisables par différents composants
 */

/**
 * Extraction des paramètres UTM de l'URL
 * @returns {Object} Objet contenant les paramètres UTM
 */
export const extractUtmParameters = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    source: urlParams.get('utm_source') || null,
    medium: urlParams.get('utm_medium') || null,
    campaign: urlParams.get('utm_campaign') || null,
    content: urlParams.get('utm_content') || null,
    term: urlParams.get('utm_term') || null,
  };
};

/**
 * Génération d'URL avec paramètres UTM
 * @param {string} baseUrl - URL de base
 * @param {Object} utmParams - Paramètres UTM à ajouter
 * @returns {string} URL complète avec paramètres UTM
 */
export const generateUtmUrl = (baseUrl, utmParams) => {
  const url = new URL(baseUrl);
  const params = new URLSearchParams(url.search);
  
  if (utmParams.source) params.set('utm_source', utmParams.source);
  if (utmParams.medium) params.set('utm_medium', utmParams.medium);
  if (utmParams.campaign) params.set('utm_campaign', utmParams.campaign);
  if (utmParams.content) params.set('utm_content', utmParams.content);
  if (utmParams.term) params.set('utm_term', utmParams.term);
  
  url.search = params.toString();
  return url.toString();
};

/**
 * Tracking d'événement marketing
 * @param {string} eventName - Nom de l'événement à suivre
 * @param {Object} eventData - Données associées à l'événement
 */
export const trackMarketingEvent = (eventName, eventData = {}) => {
  // Tracking Facebook
  if (window.fbq) {
    window.fbq('track', eventName, eventData);
  }
  
  // Tracking Google Ads
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...eventData,
      event_category: 'Acquisition',
    });
  }
  
  // Tracking Google Analytics
  if (window.ga) {
    window.ga('send', 'event', 'Marketing', eventName, JSON.stringify(eventData));
  }
  
  // Logging pour le débogage
  console.log(`[Marketing Event] ${eventName}:`, eventData);
};

/**
 * Calcul du prix estimé en fonction de la configuration
 * @param {string} modelType - Type de modèle (mono-split, bi-split, etc.)
 * @param {string} liaisonLength - Longueur de liaison (4m, 6m, etc.)
 * @returns {number} Prix estimé en euros
 */
export const calculateEstimatedPrice = (modelType, liaisonLength) => {
  // Prix de base par modèle
  const baseModelPrices = {
    'mono-split': 1290,
    'bi-split': 2290,
    'tri-split': 3490,
    'quad-split': 4690,
  };
  
  // Supplément par longueur de liaison
  const liaisonPrices = {
    '4m': 0,      // Prix de base
    '6m': 100,    // Supplément pour 6m
    '8m': 200,    // Supplément pour 8m
    '10m': 300,   // Supplément pour 10m
    '12m': 400,   // Supplément pour 12m
  };
  
  // Vérifier si les valeurs existent
  if (!modelType || !liaisonLength) {
    return null; // Impossible de calculer
  }
  
  // Calcul du prix total
  const basePrice = baseModelPrices[modelType] || 0;
  const liaisonSupplement = liaisonPrices[liaisonLength] || 0;
  
  return basePrice + liaisonSupplement;
};

/**
 * Vérifie si l'adresse est dans la zone d'intervention (30km autour d'Eysines)
 * @param {string} postalCode - Code postal à vérifier
 * @returns {boolean} true si dans la zone d'intervention
 */
export const isInServiceArea = (postalCode) => {
  // Liste des codes postaux dans la zone d'intervention (30km autour d'Eysines)
  const serviceAreaPostalCodes = [
    // Bordeaux et proches communes
    '33000', '33100', '33200', '33300', '33800', // Bordeaux
    '33320', // Eysines
    '33700', // Mérignac
    '33600', // Pessac
    '33400', // Talence
    '33310', // Lormont
    '33530', // Bassens
    '33270', // Floirac
    '33130', // Bègles
    '33140', // Villenave-d'Ornon
    '33610', // Cestas
    '33160', // Saint-Médard-en-Jalles
    '33185', // Le Haillan
    '33520', // Bruges
    '33290', // Blanquefort
    '33440', // Ambares-et-Lagrave
    '33370', // Artigues-près-Bordeaux
    '33170', // Gradignan
    '33127', // Martignas-sur-Jalle
    '33560', // Carbon-Blanc
    '33150', // Cenon
    '33110', // Le Bouscat
    '33700', // Mérignac
    '33600', // Pessac
    // etc.
  ];
  
  return serviceAreaPostalCodes.includes(postalCode);
};
