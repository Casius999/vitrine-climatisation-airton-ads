const axios = require('axios');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Quote, SupplierOrder } = require('../src/models');
const app = require('../src/server');

// Configuration des tests
let mongod;
let server;
const PORT = 3099;
const API_URL = `http://localhost:${PORT}/api`;

// Données de test
const testQuote = {
  customerId: 'customer_test_123',
  customerInfo: {
    name: 'Client Test',
    email: 'client.test@example.com',
    phone: '0123456789',
    address: '1 Rue du Test',
    postalCode: '33000',
    city: 'Bordeaux'
  },
  productConfiguration: {
    productId: 'product_123',
    productName: 'Climatiseur Airton 9000 BTU',
    productType: 'mono-split',
    price: 899,
    options: [
      {
        optionId: 'option_123',
        optionName: 'Liaison frigorifique ReadyClim 6m',
        optionType: 'liaison',
        price: 99
      }
    ]
  },
  installationDate: new Date('2025-05-15T10:00:00Z')
};

// Setup - Avant tous les tests
beforeAll(async () => {
  // Démarrer MongoDB en mémoire
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connecter Mongoose à la BD en mémoire
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Démarrer le serveur Express
  server = app.listen(PORT);
});

// Teardown - Après tous les tests
afterAll(async () => {
  // Arrêter le serveur
  await server.close();
  
  // Déconnecter Mongoose
  await mongoose.disconnect();
  
  // Arrêter MongoDB
  await mongod.stop();
});

// Nettoyer la BD entre les tests
afterEach(async () => {
  await Quote.deleteMany({});
  await SupplierOrder.deleteMany({});
});

// Tests unitaires
describe('Module de devis', () => {
  // Test de création de devis
  describe('POST /api/quotes', () => {
    it('devrait créer un nouveau devis', async () => {
      const response = await axios.post(`${API_URL}/quotes`, testQuote);
      
      expect(response.status).toBe(201);
      expect(response.data.quote).toHaveProperty('_id');
      expect(response.data.quote).toHaveProperty('quoteNumber');
      expect(response.data.quote.totalPrice).toBe(998); // 899 + 99
      expect(response.data.quote.deposit).toBe(399.2); // 40% de 998
      expect(response.data.quote.installationPayment).toBe(299.4); // 30% de 998
      expect(response.data.quote.finalPayment).toBe(299.4); // 30% de 998
    });
    
    it('devrait renvoyer une erreur si des données sont manquantes', async () => {
      try {
        await axios.post(`${API_URL}/quotes`, { customerId: 'test' });
        // Si on arrive ici, le test échoue
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });
  
  // Test de récupération de devis
  describe('GET /api/quotes/:id', () => {
    it('devrait récupérer un devis par ID', async () => {
      // Créer d'abord un devis
      const createResponse = await axios.post(`${API_URL}/quotes`, testQuote);
      const quoteId = createResponse.data.quote._id;
      
      // Récupérer le devis
      const response = await axios.get(`${API_URL}/quotes/${quoteId}`);
      
      expect(response.status).toBe(200);
      expect(response.data._id).toBe(quoteId);
      expect(response.data.customerInfo.name).toBe('Client Test');
    });
    
    it('devrait renvoyer une erreur 404 pour un ID inexistant', async () => {
      try {
        await axios.get(`${API_URL}/quotes/60c72b2f5ea68f001c8f0f7f`);
        // Si on arrive ici, le test échoue
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });
  
  // Test de mise à jour du statut de paiement
  describe('PATCH /api/quotes/:id/payment-status', () => {
    it('devrait mettre à jour le statut de paiement d\'un devis', async () => {
      // Créer d'abord un devis
      const createResponse = await axios.post(`${API_URL}/quotes`, testQuote);
      const quoteId = createResponse.data.quote._id;
      
      // Mettre à jour le statut de paiement
      const response = await axios.patch(`${API_URL}/quotes/${quoteId}/payment-status`, {
        paymentType: 'deposit',
        status: 'paid'
      });
      
      expect(response.status).toBe(200);
      expect(response.data.quote.paymentStatus.deposit).toBe('paid');
    });
  });
});

// Tests d'intégration
describe('Module de commandes fournisseurs', () => {
  // Test de création de commande fournisseur
  describe('POST /api/supplier-orders', () => {
    it('devrait créer une nouvelle commande fournisseur à partir d\'un devis', async () => {
      // Créer d'abord un devis
      const quoteResponse = await axios.post(`${API_URL}/quotes`, testQuote);
      const quoteId = quoteResponse.data.quote._id;
      
      // Créer une commande fournisseur
      const response = await axios.post(`${API_URL}/supplier-orders`, {
        quoteIds: [quoteId],
        notes: 'Commande de test'
      });
      
      expect(response.status).toBe(201);
      expect(response.data.supplierOrder).toHaveProperty('orderNumber');
      expect(response.data.supplierOrder.quotes).toContain(quoteId);
      expect(response.data.supplierOrder.totalAmount).toBe(998);
      expect(response.data.supplierOrder.products).toHaveLength(1);
      expect(response.data.supplierOrder.products[0].productName).toBe('Climatiseur Airton 9000 BTU');
    });
  });
  
  // Test de mise à jour du statut d'une commande
  describe('PATCH /api/supplier-orders/:id/status', () => {
    it('devrait mettre à jour le statut d\'une commande', async () => {
      // Créer un devis
      const quoteResponse = await axios.post(`${API_URL}/quotes`, testQuote);
      const quoteId = quoteResponse.data.quote._id;
      
      // Créer une commande
      const orderResponse = await axios.post(`${API_URL}/supplier-orders`, {
        quoteIds: [quoteId],
        notes: 'Commande de test'
      });
      const orderId = orderResponse.data.supplierOrder._id;
      
      // Mettre à jour le statut
      const response = await axios.patch(`${API_URL}/supplier-orders/${orderId}/status`, {
        status: 'confirmed'
      });
      
      expect(response.status).toBe(200);
      expect(response.data.supplierOrder.status).toBe('confirmed');
    });
  });
});
