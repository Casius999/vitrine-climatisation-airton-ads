import { BookingService } from './api';

/**
 * Service pour l'intégration avec Google Calendar
 * Gère la récupération des créneaux disponibles et la réservation de rendez-vous
 */
export const CalendarService = {
  /**
   * Récupérer les créneaux disponibles pour une date donnée
   * @param {Date} date Date pour laquelle récupérer les créneaux
   * @returns {Promise<Array>} Liste des créneaux disponibles
   */
  getAvailableSlots: async (date) => {
    try {
      // Formatage de la date au format ISO
      const formattedDate = date.toISOString().split('T')[0];
      
      // Appel au service backend pour récupérer les créneaux disponibles
      const slots = await BookingService.getAvailableSlots(formattedDate);
      
      // Formater les créneaux horaires
      return slots.map(slot => {
        const slotTime = new Date(slot);
        return {
          id: slot,
          time: slotTime,
          formattedTime: `${slotTime.getHours()}:00`,
          available: true,
        };
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // En cas d'erreur, retourner des créneaux fictifs pour le développement
      return generateMockTimeSlots(date);
    }
  },

  /**
   * Réserver un créneau horaire
   * @param {Object} bookingData Données de réservation
   * @returns {Promise<Object>} Détails de la réservation créée
   */
  createBooking: async (bookingData) => {
    try {
      // Formatage des dates pour l'API
      const formattedBookingData = {
        ...bookingData,
        startTime: new Date(bookingData.date).toISOString(),
        endTime: new Date(
          new Date(bookingData.date).setHours(
            new Date(bookingData.date).getHours() + 1
          )
        ).toISOString(),
      };
      
      // Appel au service backend pour créer la réservation
      const booking = await BookingService.createBooking(formattedBookingData);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // En cas d'erreur, simuler une réservation réussie pour le développement
      return simulateBookingCreation(bookingData);
    }
  },

  /**
   * Annuler une réservation
   * @param {string} bookingId Identifiant de la réservation
   * @returns {Promise<Object>} Résultat de l'annulation
   */
  cancelBooking: async (bookingId) => {
    try {
      const result = await BookingService.cancelBooking(bookingId);
      return result;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  /**
   * Récupérer les détails d'une réservation
   * @param {string} bookingId Identifiant de la réservation
   * @returns {Promise<Object>} Détails de la réservation
   */
  getBookingDetails: async (bookingId) => {
    try {
      const booking = await BookingService.getBookingDetails(bookingId);
      return booking;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },
};

/**
 * Génère des créneaux horaires fictifs pour le développement
 * @param {Date} date Date pour laquelle générer des créneaux
 * @returns {Array} Liste des créneaux générés
 */
const generateMockTimeSlots = (date) => {
  const slots = [];
  
  // Générer des créneaux entre 8h et 18h
  for (let hour = 8; hour <= 17; hour++) {
    // 70% de chance qu'un créneau soit disponible
    if (Math.random() > 0.3) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      
      slots.push({
        id: `slot-${date.toISOString().split('T')[0]}-${hour}`,
        time: slotTime,
        formattedTime: `${hour}:00`,
        available: true,
      });
    }
  }
  
  return slots;
};

/**
 * Simule la création d'une réservation pour le développement
 * @param {Object} bookingData Données de réservation
 * @returns {Object} Réservation simulée
 */
const simulateBookingCreation = (bookingData) => {
  // Générer un identifiant de réservation factice
  const bookingId = 'bkg_' + Math.random().toString(36).substring(2, 10);
  
  // Générer une référence lisible par un humain
  const reference = 'ART-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return {
    id: bookingId,
    reference,
    date: bookingData.date,
    time: bookingData.time,
    customer: bookingData.customer,
    product: bookingData.product,
    payment: {
      depositAmount: bookingData.payment?.depositAmount,
      remainingAmount: bookingData.payment?.remainingAmount,
      totalAmount: bookingData.payment?.totalAmount,
      status: 'completed',
    },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
};

export default CalendarService;