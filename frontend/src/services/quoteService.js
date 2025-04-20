import axios from 'axios';

// URL de base de l'API - à remplacer par l'URL réelle en production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Service pour la gestion des devis
 * Fournit les méthodes pour interagir avec l'API des devis
 */
const quoteService = {
  /**
   * Récupère la liste de tous les devis
   * @returns {Promise} Promesse contenant les données des devis
   */
  getAllQuotes: async () => {
    try {
      const response = await axios.get(`${API_URL}/quotes`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      throw error;
    }
  },

  /**
   * Récupère un devis par son ID
   * @param {string} id ID du devis à récupérer
   * @returns {Promise} Promesse contenant les données du devis
   */
  getQuoteById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du devis ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau devis
   * @param {Object} quoteData Données du devis à créer
   * @returns {Promise} Promesse contenant les données du devis créé
   */
  createQuote: async (quoteData) => {
    try {
      const response = await axios.post(`${API_URL}/quotes`, quoteData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      throw error;
    }
  },

  /**
   * Met à jour un devis existant
   * @param {string} id ID du devis à mettre à jour
   * @param {Object} quoteData Nouvelles données du devis
   * @returns {Promise} Promesse contenant les données du devis mis à jour
   */
  updateQuote: async (id, quoteData) => {
    try {
      const response = await axios.put(`${API_URL}/quotes/${id}`, quoteData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du devis ${id}:`, error);
      throw error;
    }
  },

  /**
   * Valide un devis (change son statut en "validated")
   * @param {string} id ID du devis à valider
   * @returns {Promise} Promesse contenant les données du devis validé
   */
  validateQuote: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/quotes/${id}/validate`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la validation du devis ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un devis
   * @param {string} id ID du devis à supprimer
   * @returns {Promise} Promesse de confirmation de suppression
   */
  deleteQuote: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du devis ${id}:`, error);
      throw error;
    }
  },

  /**
   * Génère un document PDF pour un devis
   * @param {string} id ID du devis
   * @returns {Promise} Promesse contenant l'URL du PDF généré
   */
  generateQuotePDF: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/quotes/${id}/pdf`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la génération du PDF pour le devis ${id}:`, error);
      throw error;
    }
  }
};

export default quoteService;