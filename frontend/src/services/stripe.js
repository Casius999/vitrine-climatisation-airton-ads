import { loadStripe } from '@stripe/stripe-js';
import { PaymentService } from './api';

// Obtenir la clé publique Stripe depuis les variables d'environnement
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_sample_key';

// Charger Stripe (singleton)
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

/**
 * Service pour l'intégration avec Stripe
 * Gère la création d'intentions de paiement et la confirmation des paiements
 */
export const StripeService = {
  /**
   * Créer une intention de paiement avec Stripe
   * @param {Object} paymentData Données de paiement (montant, devise, description)
   * @returns {Promise} Intention de paiement créée
   */
  createPaymentIntent: async (paymentData) => {
    try {
      // Appel au service back-end pour créer une intention de paiement
      const paymentIntent = await PaymentService.createPaymentIntent(paymentData);
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  /**
   * Confirmer un paiement avec Stripe
   * @param {string} clientSecret Secret client de l'intention de paiement
   * @param {Object} paymentMethodData Données du moyen de paiement
   * @returns {Promise} Résultat de la confirmation
   */
  confirmCardPayment: async (clientSecret, paymentMethodData) => {
    try {
      const stripe = await getStripe();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodData,
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result.paymentIntent;
    } catch (error) {
      console.error('Error confirming card payment:', error);
      throw error;
    }
  },

  /**
   * Créer un formulaire de carte de crédit avec Stripe Elements
   * @returns {Promise} Instance Stripe et éléments
   */
  createCardElement: async () => {
    try {
      const stripe = await getStripe();
      const elements = stripe.elements();
      
      // Créer et styler l'élément de carte
      const cardElement = elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });
      
      return { stripe, elements, cardElement };
    } catch (error) {
      console.error('Error creating card element:', error);
      throw error;
    }
  },

  /**
   * Effectuer un paiement complet avec Stripe
   * Crée une intention de paiement et confirme le paiement
   * @param {Object} paymentData Données de paiement
   * @param {Object} cardElement Élément de carte Stripe
   * @returns {Promise} Résultat du paiement
   */
  processPayment: async (paymentData, cardElement) => {
    try {
      // 1. Créer une intention de paiement
      const paymentIntent = await StripeService.createPaymentIntent(paymentData);
      
      // 2. Obtenir Stripe
      const stripe = await getStripe();
      
      // 3. Confirmer le paiement avec l'élément de carte
      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentData.customerName,
            email: paymentData.customerEmail,
          },
        },
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // 4. Vérifier le statut du paiement
      if (result.paymentIntent.status === 'succeeded') {
        // Appel au service back-end pour enregistrer le paiement confirmé
        await PaymentService.confirmPayment(
          result.paymentIntent.id,
          result.paymentIntent.payment_method
        );
        
        return {
          success: true,
          paymentIntent: result.paymentIntent,
        };
      } else {
        throw new Error(`Payment status: ${result.paymentIntent.status}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Simuler un paiement pour le développement sans Stripe
   * @param {Object} paymentData Données de paiement
   * @returns {Promise} Résultat du paiement simulé
   */
  simulatePayment: async (paymentData) => {
    // Simuler un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Générer un ID de paiement factice
    const fakePaymentIntentId = 'pi_' + Math.random().toString(36).substring(2, 15);
    
    return {
      success: true,
      paymentIntent: {
        id: fakePaymentIntentId,
        status: 'succeeded',
        amount: paymentData.amount,
        currency: paymentData.currency || 'eur',
        created: Date.now(),
      },
    };
  },
};

export default getStripe;