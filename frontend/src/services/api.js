import axios from 'axios';

// Création d'une instance axios avec configuration de base
const api = axios.create({
  // L'URL de base est récupérée depuis les variables d'environnement
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Services pour les différents microservices

// Service de configuration de produit
export const ConfiguratorService = {
  // Récupérer tous les modèles disponibles
  getModels: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  // Récupérer les options de liaison disponibles
  getOptions: async () => {
    try {
      const response = await api.get('/api/options');
      return response.data;
    } catch (error) {
      console.error('Error fetching options:', error);
      throw error;
    }
  },

  // Calculer le prix selon la configuration
  calculatePrice: async (config) => {
    try {
      const response = await api.post('/api/configure', config);
      return response.data;
    } catch (error) {
      console.error('Error calculating price:', error);
      throw error;
    }
  },
};

// Service de gestion des avis clients
export const ReviewsService = {
  // Récupérer tous les avis
  getReviews: async () => {
    try {
      const response = await api.get('/api/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Récupérer les statistiques des avis
  getReviewStats: async () => {
    try {
      const response = await api.get('/api/reviews/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  },

  // Récupérer les avis mis en avant
  getFeaturedReviews: async () => {
    try {
      const response = await api.get('/api/reviews/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      throw error;
    }
  },
};

// Service de gestion des réservations
export const BookingService = {
  // Récupérer les créneaux disponibles
  getAvailableSlots: async (date) => {
    try {
      const response = await api.get('/api/slots', {
        params: { date },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Créer une réservation
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/booking', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Récupérer les détails d'une réservation
  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(`/api/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  // Annuler une réservation
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/api/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },
};

// Service de gestion des paiements
export const PaymentService = {
  // Créer une intention de paiement
  createPaymentIntent: async (paymentData) => {
    try {
      const response = await api.post('/api/payment/intent', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Confirmer un paiement
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await api.post('/api/payment/confirm', {
        paymentIntentId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Vérifier le statut d'un paiement
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/api/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error;
    }
  },
};

// Service de notification
export const NotificationService = {
  // Envoyer un email
  sendEmail: async (emailData) => {
    try {
      const response = await api.post('/api/notify/email', emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Programmer un rappel
  scheduleReminder: async (reminderData) => {
    try {
      const response = await api.post('/api/notify/reminder', reminderData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  },
};

export default api;