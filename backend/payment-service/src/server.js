const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configuration
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payment';

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB établie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèle de données pour les transactions
const Transaction = mongoose.model('Transaction', {
  stripePaymentIntentId: String,
  customerId: String,
  bookingId: String,
  amount: Number, // en centimes
  currency: { type: String, default: 'eur' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Créer une intention de paiement
app.post('/api/payment/intent', async (req, res) => {
  try {
    const { amount, bookingId, customerId, metadata } = req.body;
    
    if (!amount || !bookingId || !customerId) {
      return res.status(400).json({ message: 'Données de paiement incomplètes' });
    }
    
    // Créer l'intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centimes (40% du montant total)
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        bookingId,
        customerId,
        ...metadata
      }
    });
    
    // Enregistrer la transaction
    const transaction = new Transaction({
      stripePaymentIntentId: paymentIntent.id,
      customerId,
      bookingId,
      amount,
      status: 'pending',
    });
    
    await transaction.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    res.status(500).json({ message: 'Erreur lors du traitement du paiement' });
  }
});

// Confirmer un paiement
app.post('/api/payment/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'ID d\'intention de paiement requis' });
    }
    
    // Vérifier le statut du paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Mettre à jour la transaction dans notre base de données
    const transaction = await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { 
        status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed',
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    
    // Si le paiement est réussi, notifier le service de réservation
    if (paymentIntent.status === 'succeeded') {
      // TODO: Implémenter la notification au service de réservation
      // via un message dans RabbitMQ ou un appel API direct
    }
    
    res.json({
      status: transaction.status,
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la confirmation du paiement' });
  }
});

// Obtenir le statut d'un paiement
app.get('/api/payment/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }
    
    res.json({
      transactionId: transaction._id,
      status: transaction.status,
      amount: transaction.amount,
      createdAt: transaction.createdAt
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Webhook pour les événements Stripe
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur de signature webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Gérer l'événement
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Mettre à jour la transaction
      await Transaction.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { 
          status: 'succeeded',
          updatedAt: Date.now()
        }
      );
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      // Mettre à jour la transaction
      await Transaction.findOneAndUpdate(
        { stripePaymentIntentId: failedPaymentIntent.id },
        { 
          status: 'failed',
          updatedAt: Date.now()
        }
      );
      break;
    default:
      console.log(`Événement non géré: ${event.type}`);
  }
  
  res.json({received: true});
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur de paiement démarré sur le port ${PORT}`);
});