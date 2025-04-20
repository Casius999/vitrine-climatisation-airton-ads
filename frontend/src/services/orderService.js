import axios from 'axios';

// URL de base de l'API - à remplacer par l'URL réelle en production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Service pour la gestion des commandes
 * Fournit les méthodes pour interagir avec l'API des commandes et paiements
 */
const orderService = {
  /**
   * Récupère la liste de toutes les commandes
   * @returns {Promise} Promesse contenant les données des commandes
   */
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  /**
   * Récupère une commande par son ID
   * @param {string} id ID de la commande à récupérer
   * @returns {Promise} Promesse contenant les données de la commande
   */
  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les commandes d'un client
   * @param {string} customerId ID du client
   * @returns {Promise} Promesse contenant les données des commandes du client
   */
  getOrdersByCustomer: async (customerId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes du client ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle commande
   * @param {Object} orderData Données de la commande à créer
   * @returns {Promise} Promesse contenant les données de la commande créée
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  /**
   * Crée une commande à partir d'un devis validé
   * @param {string} quoteId ID du devis validé
   * @returns {Promise} Promesse contenant les données de la commande créée
   */
  createOrderFromQuote: async (quoteId) => {
    try {
      const response = await axios.post(`${API_URL}/orders/from-quote/${quoteId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la création de la commande à partir du devis ${quoteId}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour une commande existante
   * @param {string} id ID de la commande à mettre à jour
   * @param {Object} orderData Nouvelles données de la commande
   * @returns {Promise} Promesse contenant les données de la commande mise à jour
   */
  updateOrder: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande ${id}:`, error);
      throw error;
    }
  },

  /**
   * Annule une commande
   * @param {string} id ID de la commande à annuler
   * @param {string} reason Raison de l'annulation
   * @returns {Promise} Promesse contenant les données de la commande annulée
   */
  cancelOrder: async (id, reason) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'annulation de la commande ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère l'historique des paiements d'une commande
   * @param {string} orderId ID de la commande
   * @returns {Promise} Promesse contenant l'historique des paiements
   */
  getPaymentHistory: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}/payments`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique des paiements pour la commande ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Traite un nouveau paiement pour une commande
   * @param {string} orderId ID de la commande
   * @param {Object} paymentData Données du paiement
   * @returns {Promise} Promesse contenant les données du paiement traité
   */
  processPayment: async (orderId, paymentData) => {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du traitement du paiement pour la commande ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'un paiement
   * @param {string} orderId ID de la commande
   * @param {string} paymentId ID du paiement
   * @param {string} status Nouveau statut du paiement
   * @returns {Promise} Promesse contenant les données du paiement mis à jour
   */
  updatePaymentStatus: async (orderId, paymentId, status) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/payments/${paymentId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut du paiement ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Génère une intention de paiement pour Stripe
   * @param {string} orderId ID de la commande
   * @param {number} amount Montant à payer
   * @returns {Promise} Promesse contenant le client secret pour Stripe
   */
  createPaymentIntent: async (orderId, amount) => {
    try {
      const response = await axios.post(`${API_URL}/payments/create-intent`, { 
        orderId,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      throw error;
    }
  },

  /**
   * Confirme un paiement réussi
   * @param {string} orderId ID de la commande
   * @param {string} paymentId ID du paiement
   * @param {string} transactionId ID de la transaction Stripe
   * @returns {Promise} Promesse contenant les données de confirmation
   */
  confirmPayment: async (orderId, paymentId, transactionId) => {
    try {
      const response = await axios.post(`${API_URL}/orders/${orderId}/payments/${paymentId}/confirm`, {
        transactionId
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la confirmation du paiement ${paymentId}:`, error);
      throw error;
    }
  }
};

export default orderService;