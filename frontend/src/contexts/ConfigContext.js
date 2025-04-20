import React, { createContext, useState, useContext } from 'react';

// Création du contexte pour la configuration de produit
const ConfigContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig doit être utilisé à l\'intérieur d\'un ConfigProvider');
  }
  return context;
};

// Provider du contexte
export const ConfigProvider = ({ children }) => {
  // État pour la configuration du produit
  const [config, setConfig] = useState({
    model: null, // mono-split, bi-split, etc.
    liaisonLength: null, // 4m, 6m, etc.
    price: null, // Prix calculé
    features: [], // Caractéristiques du produit
  });

  // Mise à jour de la configuration
  const updateConfig = (newConfig) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }));
  };

  // Réinitialiser la configuration
  const resetConfig = () => {
    setConfig({
      model: null,
      liaisonLength: null,
      price: null,
      features: [],
    });
  };

  // Calcul du prix en fonction des options
  const calculatePrice = (model, liaisonLength) => {
    // Prix de base selon le modèle
    const basePrice = {
      'mono-split': 899,
      'bi-split': 1499,
      'tri-split': 1999,
      'quad-split': 2499,
    }[model] || 0;

    // Supplément pour la longueur de liaison
    const liaisonPrice = {
      '4m': 0,
      '6m': 49,
      '8m': 99,
      '10m': 149,
      '12m': 199,
    }[liaisonLength] || 0;

    return basePrice + liaisonPrice;
  };

  // Fonction pour mettre à jour le modèle et la longueur de liaison avec calcul de prix
  const setProductOptions = (model, liaisonLength) => {
    const price = calculatePrice(model, liaisonLength);
    setConfig({
      model,
      liaisonLength,
      price,
      features: [
        "Technologie ReadyClim pré-chargée en gaz R32",
        "Installation ultra-rapide (20 minutes)",
        "Sans intervention d'un frigoriste",
        "Climatiseur connecté pilotable par WiFi",
        "Garantie 3 ans constructeur",
      ],
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        setProductOptions,
        calculatePrice,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;