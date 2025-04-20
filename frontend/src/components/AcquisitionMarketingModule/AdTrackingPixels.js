import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * Composant pour l'intégration des pixels de tracking publicitaires
 * Gère l'insertion des scripts nécessaires pour Facebook Ads, Google Ads, etc.
 */
const AdTrackingPixels = () => {
  // IDs des pixels (à remplacer par les IDs réels en production)
  const facebookPixelId = 'FB_PIXEL_ID';
  const googleAdsId = 'AW-CONVERSION_ID';
  
  useEffect(() => {
    // Cette fonction pourrait être appelée lorsqu'un lead est capturé
    const trackLeadConversion = () => {
      // Suivi de conversion Facebook
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }
      
      // Suivi de conversion Google Ads
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': `${googleAdsId}/CONVERSION_LABEL`,
          'value': 1.0,
          'currency': 'EUR',
        });
      }
    };
    
    // Rendre la fonction disponible globalement pour d'autres composants
    window.trackLeadConversion = trackLeadConversion;
    
    // Nettoyage
    return () => {
      delete window.trackLeadConversion;
    };
  }, [googleAdsId]);

  return (
    <Helmet>
      {/* Script du pixel Facebook */}
      <script>
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${facebookPixelId}');
          fbq('track', 'PageView');
        `}
      </script>
      
      {/* Script Google Ads */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAdsId}');
        `}
      </script>
      
      {/* Noscript pour Facebook */}
      <noscript>
        {`
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1"/>
        `}
      </noscript>
    </Helmet>
  );
};

export default AdTrackingPixels;
