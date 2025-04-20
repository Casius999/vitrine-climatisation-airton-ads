/**
 * Middleware de gestion des erreurs centralisé
 */
exports.errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  
  // Définir le code HTTP par défaut à 500 si non défini
  const statusCode = err.statusCode || 500;
  
  // Déterminer le message d'erreur à renvoyer
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Une erreur interne s\'est produite'
    : err.message;
  
  // Préparer les détails d'erreur pour le développement
  const errorDetails = process.env.NODE_ENV === 'production'
    ? undefined
    : {
        stack: err.stack,
        name: err.name,
        code: err.code,
      };
  
  // Envoyer la réponse d'erreur formatée
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Middleware pour traiter les routes non trouvées
 */
exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.originalUrl}`,
  });
};
