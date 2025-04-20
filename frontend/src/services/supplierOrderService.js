import axios from 'axios';

// URL de base de l'API - à remplacer par l'URL réelle en production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Service pour la gestion des commandes fournisseurs
 * Fournit les méthodes pour interagir avec l'API des commandes fournisseurs
 */
const supplierOrderService = {
  /**
   * Récupère la liste de toutes les commandes fournisseurs
   * @returns {Promise} Promesse contenant les données des commandes fournisseurs
   */
  getAllSupplierOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/supplier-orders`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes fournisseurs:', error);
      throw error;
    }
  },

  /**
   * Récupère une commande fournisseur par son ID
   * @param {string} id ID de la commande fournisseur à récupérer
   * @returns {Promise} Promesse contenant les données de la commande fournisseur
   */
  getSupplierOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/supplier-orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les commandes fournisseurs liées à une commande client
   * @param {string} orderId ID de la commande client
   * @returns {Promise} Promesse contenant les commandes fournisseurs liées
   */
  getSupplierOrdersByOrder: async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/supplier-orders/by-order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des commandes fournisseurs pour la commande ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle commande fournisseur
   * @param {Object} orderData Données de la commande fournisseur à créer
   * @returns {Promise} Promesse contenant les données de la commande fournisseur créée
   */
  createSupplierOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/supplier-orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande fournisseur:', error);
      throw error;
    }
  },

  /**
   * Met à jour une commande fournisseur existante
   * @param {string} id ID de la commande fournisseur à mettre à jour
   * @param {Object} orderData Nouvelles données de la commande fournisseur
   * @returns {Promise} Promesse contenant les données de la commande fournisseur mise à jour
   */
  updateSupplierOrder: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_URL}/supplier-orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une commande fournisseur
   * @param {string} id ID de la commande fournisseur
   * @param {string} status Nouveau statut de la commande
   * @param {Object} details Détails supplémentaires (optionnel)
   * @returns {Promise} Promesse contenant les données de la commande fournisseur mise à jour
   */
  updateSupplierOrderStatus: async (id, status, details = {}) => {
    try {
      const response = await axios.put(`${API_URL}/supplier-orders/${id}/status`, { 
        status,
        ...details
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Ajoute un suivi de livraison à une commande fournisseur
   * @param {string} id ID de la commande fournisseur
   * @param {string} trackingNumber Numéro de suivi
   * @param {string} carrier Transporteur (optionnel)
   * @returns {Promise} Promesse contenant les données de la commande fournisseur mise à jour
   */
  addTrackingNumber: async (id, trackingNumber, carrier = '') => {
    try {
      const response = await axios.put(`${API_URL}/supplier-orders/${id}/tracking`, { 
        trackingNumber,
        carrier
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout du numéro de suivi à la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Ajoute une entrée à l'historique d'une commande fournisseur
   * @param {string} id ID de la commande fournisseur
   * @param {string} status Statut associé à l'entrée
   * @param {string} comment Commentaire sur l'entrée
   * @returns {Promise} Promesse contenant les données de la commande fournisseur mise à jour
   */
  addHistoryEntry: async (id, status, comment) => {
    try {
      const response = await axios.post(`${API_URL}/supplier-orders/${id}/history`, { 
        status,
        comment
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'une entrée à l'historique de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marque une commande fournisseur comme livrée
   * @param {string} id ID de la commande fournisseur
   * @param {Object} deliveryDetails Détails de la livraison
   * @returns {Promise} Promesse contenant les données de la commande fournisseur mise à jour
   */
  markAsDelivered: async (id, deliveryDetails) => {
    try {
      const response = await axios.put(`${API_URL}/supplier-orders/${id}/delivered`, deliveryDetails);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du marquage comme livrée de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Annule une commande fournisseur
   * @param {string} id ID de la commande fournisseur
   * @param {string} reason Raison de l'annulation
   * @returns {Promise} Promesse contenant les données de la commande fournisseur annulée
   */
  cancelSupplierOrder: async (id, reason) => {
    try {
      const response = await axios.put(`${API_URL}/supplier-orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'annulation de la commande fournisseur ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les rapports d'inventaire pour les commandes
   * @param {Object} filters Filtres pour les rapports (dates, statuts, etc.)
   * @returns {Promise} Promesse contenant les données des rapports
   */
  getInventoryReports: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/supplier-orders/inventory-reports`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports d\'inventaire:', error);
      throw error;
    }
  },

  /**
   * Génère un document d'ordre d'achat pour une commande fournisseur
   * @param {string} id ID de la commande fournisseur
   * @returns {Promise} Promesse contenant l'URL du PDF généré
   */
  generatePurchaseOrderPDF: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/supplier-orders/${id}/purchase-order-pdf`, { 
        responseType: 'blob' 
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la génération du PDF d'ordre d'achat pour la commande fournisseur ${id}:`, error);
      throw error;
    }
  }
};

export default supplierOrderService;