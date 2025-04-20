import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const QuoteContext = createContext();

/**
 * Provider du contexte pour la gestion des devis et commandes
 * Centralise l'état et les fonctions liées aux devis, paiements et commandes fournisseurs
 */
export const QuoteProvider = ({ children }) => {
  // État des devis
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // État des commandes
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // État des commandes fournisseurs
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [currentSupplierOrder, setCurrentSupplierOrder] = useState(null);
  const [supplierOrderLoading, setSupplierOrderLoading] = useState(false);
  const [supplierOrderError, setSupplierOrderError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchQuotes();
    fetchOrders();
    fetchSupplierOrders();
  }, []);

  // Fonction pour récupérer les devis
  const fetchQuotes = async () => {
    try {
      setQuoteLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.get('/api/quotes');
      // setQuotes(response.data);
      
      // Simulation
      setTimeout(() => {
        const mockQuotes = [
          {
            id: 'QTE-001',
            quoteNumber: 'ART-123456',
            date: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            customer: {
              id: 'CUST-001',
              firstName: 'Jean',
              lastName: 'Dupont',
              email: 'jean.dupont@example.com',
              phone: '0612345678',
              address: '123 Avenue des Climatiseurs',
              postalCode: '33320',
              city: 'Eysines'
            },
            configuration: {
              modelType: 'Mono-split Airton ReadyClim',
              capacity: '2.6kW',
              length: '6m',
              price: 1299
            },
            subtotal: 1299,
            tax: 259.8,
            total: 1558.8,
            installmentPayments: {
              firstPayment: 623.52,
              secondPayment: 467.64,
              thirdPayment: 467.64
            },
            status: 'validated'
          },
          {
            id: 'QTE-002',
            quoteNumber: 'ART-654321',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            customer: {
              id: 'CUST-002',
              firstName: 'Marie',
              lastName: 'Martin',
              email: 'marie.martin@example.com',
              phone: '0656789012',
              address: '45 Rue des Fleurs',
              postalCode: '33000',
              city: 'Bordeaux'
            },
            configuration: {
              modelType: 'Bi-split Airton ReadyClim',
              capacity: '3.5kW',
              length: '8m',
              price: 1899
            },
            subtotal: 1899,
            tax: 379.8,
            total: 2278.8,
            installmentPayments: {
              firstPayment: 911.52,
              secondPayment: 683.64,
              thirdPayment: 683.64
            },
            status: 'draft'
          }
        ];
        
        setQuotes(mockQuotes);
        setQuoteLoading(false);
      }, 1000);
    } catch (error) {
      setQuoteError('Erreur lors du chargement des devis.');
      setQuoteLoading(false);
    }
  };

  // Fonction pour récupérer les commandes
  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.get('/api/orders');
      // setOrders(response.data);
      
      // Simulation
      setTimeout(() => {
        const mockOrders = [
          {
            id: 'ORD-001',
            quoteId: 'QTE-001',
            date: new Date().toISOString(),
            customer: {
              id: 'CUST-001',
              firstName: 'Jean',
              lastName: 'Dupont'
            },
            total: 1558.8,
            status: 'in_progress',
            paymentSchedule: [
              {
                id: 'PAY-001',
                amount: 623.52,
                dueDate: new Date().toISOString(),
                status: 'paid',
                paymentDate: new Date().toISOString()
              },
              {
                id: 'PAY-002',
                amount: 467.64,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'pending',
                paymentDate: null
              },
              {
                id: 'PAY-003',
                amount: 467.64,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'not_due',
                paymentDate: null
              }
            ],
            installationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setOrders(mockOrders);
        setOrderLoading(false);
      }, 1000);
    } catch (error) {
      setOrderError('Erreur lors du chargement des commandes.');
      setOrderLoading(false);
    }
  };

  // Fonction pour récupérer les commandes fournisseurs
  const fetchSupplierOrders = async () => {
    try {
      setSupplierOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.get('/api/supplier-orders');
      // setSupplierOrders(response.data);
      
      // Simulation
      setTimeout(() => {
        const mockSupplierOrders = [
          {
            id: 'SUP-001',
            orderNumber: 'AIRTON-2025-1234',
            clientOrderId: 'ORD-001',
            date: new Date().toISOString(),
            status: 'ordered',
            supplierName: 'Airton France',
            trackingNumber: 'TRACK-ABC123',
            expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                id: 'ITEM-001',
                description: 'Climatiseur Airton ReadyClim - Mono-split 2.6kW',
                quantity: 1,
                reference: 'AIRTON-MS-26'
              },
              {
                id: 'ITEM-002',
                description: 'Liaison frigorifique pré-chargée en gaz R32 - 6m',
                quantity: 1,
                reference: 'READYCLIM-6M'
              }
            ]
          }
        ];
        
        setSupplierOrders(mockSupplierOrders);
        setSupplierOrderLoading(false);
      }, 1000);
    } catch (error) {
      setSupplierOrderError('Erreur lors du chargement des commandes fournisseurs.');
      setSupplierOrderLoading(false);
    }
  };

  // Fonction pour générer un devis
  const generateQuote = async (configuration, customer) => {
    try {
      setQuoteLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.post('/api/quotes', { configuration, customer });
      // const newQuote = response.data;
      
      // Simulation
      setTimeout(() => {
        const quoteNumber = Math.floor(100000 + Math.random() * 900000);
        
        const newQuote = {
          id: `QTE-${quoteNumber}`,
          quoteNumber: `ART-${quoteNumber}`,
          date: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          customer: customer,
          configuration: configuration,
          subtotal: configuration.price || 0,
          tax: (configuration.price || 0) * 0.2,
          total: (configuration.price || 0) * 1.2,
          installmentPayments: {
            firstPayment: (configuration.price || 0) * 1.2 * 0.4,
            secondPayment: (configuration.price || 0) * 1.2 * 0.3,
            thirdPayment: (configuration.price || 0) * 1.2 * 0.3
          },
          status: 'draft'
        };
        
        setQuotes([...quotes, newQuote]);
        setCurrentQuote(newQuote);
        setQuoteLoading(false);
        
        return newQuote;
      }, 1500);
    } catch (error) {
      setQuoteError('Erreur lors de la génération du devis.');
      setQuoteLoading(false);
      throw error;
    }
  };

  // Fonction pour valider un devis
  const validateQuote = async (quoteId) => {
    try {
      setQuoteLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.put(`/api/quotes/${quoteId}/validate`);
      // const updatedQuote = response.data;
      
      // Simulation
      setTimeout(() => {
        const updatedQuotes = quotes.map(quote => {
          if (quote.id === quoteId) {
            return {
              ...quote,
              status: 'validated'
            };
          }
          return quote;
        });
        
        const updatedQuote = updatedQuotes.find(quote => quote.id === quoteId);
        
        setQuotes(updatedQuotes);
        setCurrentQuote(updatedQuote);
        setQuoteLoading(false);
        
        return updatedQuote;
      }, 1000);
    } catch (error) {
      setQuoteError('Erreur lors de la validation du devis.');
      setQuoteLoading(false);
      throw error;
    }
  };

  // Fonction pour créer une commande à partir d'un devis
  const createOrder = async (quoteId) => {
    try {
      setOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.post('/api/orders', { quoteId });
      // const newOrder = response.data;
      
      // Simulation
      setTimeout(() => {
        const quote = quotes.find(q => q.id === quoteId);
        
        if (!quote) {
          throw new Error('Devis non trouvé.');
        }
        
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        
        const newOrder = {
          id: orderId,
          quoteId: quoteId,
          date: new Date().toISOString(),
          customer: {
            id: quote.customer.id,
            firstName: quote.customer.firstName,
            lastName: quote.customer.lastName
          },
          total: quote.total,
          status: 'pending',
          paymentSchedule: [
            {
              id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
              amount: quote.installmentPayments.firstPayment,
              dueDate: new Date().toISOString(),
              status: 'pending',
              paymentDate: null
            },
            {
              id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
              amount: quote.installmentPayments.secondPayment,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'not_due',
              paymentDate: null
            },
            {
              id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
              amount: quote.installmentPayments.thirdPayment,
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'not_due',
              paymentDate: null
            }
          ],
          installationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setOrders([...orders, newOrder]);
        setCurrentOrder(newOrder);
        setOrderLoading(false);
        
        return newOrder;
      }, 1500);
    } catch (error) {
      setOrderError('Erreur lors de la création de la commande.');
      setOrderLoading(false);
      throw error;
    }
  };

  // Fonction pour mettre à jour le statut d'un paiement
  const updatePaymentStatus = async (orderId, paymentId, status, paymentDetails = {}) => {
    try {
      setOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.put(`/api/orders/${orderId}/payments/${paymentId}`, { status, ...paymentDetails });
      // const updatedOrder = response.data;
      
      // Simulation
      setTimeout(() => {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            const updatedPaymentSchedule = order.paymentSchedule.map(payment => {
              if (payment.id === paymentId) {
                return {
                  ...payment,
                  status: status,
                  paymentDate: status === 'paid' ? new Date().toISOString() : payment.paymentDate,
                  ...paymentDetails
                };
              }
              return payment;
            });
            
            // Mettre à jour le statut de la commande
            let orderStatus = order.status;
            if (updatedPaymentSchedule.every(payment => payment.status === 'paid')) {
              orderStatus = 'completed';
            } else if (updatedPaymentSchedule.some(payment => payment.status === 'paid')) {
              orderStatus = 'in_progress';
            }
            
            return {
              ...order,
              paymentSchedule: updatedPaymentSchedule,
              status: orderStatus
            };
          }
          return order;
        });
        
        const updatedOrder = updatedOrders.find(order => order.id === orderId);
        
        setOrders(updatedOrders);
        setCurrentOrder(updatedOrder);
        setOrderLoading(false);
        
        return updatedOrder;
      }, 1000);
    } catch (error) {
      setOrderError('Erreur lors de la mise à jour du paiement.');
      setOrderLoading(false);
      throw error;
    }
  };

  // Fonction pour créer une commande fournisseur
  const createSupplierOrder = async (clientOrderId, items) => {
    try {
      setSupplierOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.post('/api/supplier-orders', { clientOrderId, items });
      // const newSupplierOrder = response.data;
      
      // Simulation
      setTimeout(() => {
        const order = orders.find(o => o.id === clientOrderId);
        
        if (!order) {
          throw new Error('Commande client non trouvée.');
        }
        
        const orderNumber = `AIRTON-2025-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newSupplierOrder = {
          id: `SUP-${Math.floor(100000 + Math.random() * 900000)}`,
          orderNumber: orderNumber,
          clientOrderId: clientOrderId,
          date: new Date().toISOString(),
          status: 'ordered',
          supplierName: 'Airton France',
          trackingNumber: '',
          expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          items: items || [
            {
              id: `ITEM-${Math.floor(100000 + Math.random() * 900000)}`,
              description: `Climatiseur Airton ReadyClim - ${order.configuration?.modelType || 'Mono-split'}`,
              quantity: 1,
              reference: 'AIRTON-MS-26'
            },
            {
              id: `ITEM-${Math.floor(100000 + Math.random() * 900000)}`,
              description: `Liaison frigorifique pré-chargée en gaz R32 - ${order.configuration?.length || '6m'}`,
              quantity: 1,
              reference: 'READYCLIM-6M'
            }
          ],
          history: [
            {
              date: new Date().toISOString(),
              status: 'ordered',
              comment: 'Commande passée au fournisseur'
            }
          ],
          notes: 'Livraison à notre entrepôt'
        };
        
        setSupplierOrders([...supplierOrders, newSupplierOrder]);
        setCurrentSupplierOrder(newSupplierOrder);
        setSupplierOrderLoading(false);
        
        return newSupplierOrder;
      }, 1500);
    } catch (error) {
      setSupplierOrderError('Erreur lors de la création de la commande fournisseur.');
      setSupplierOrderLoading(false);
      throw error;
    }
  };

  // Fonction pour mettre à jour le statut d'une commande fournisseur
  const updateSupplierOrderStatus = async (supplierOrderId, status, details = {}) => {
    try {
      setSupplierOrderLoading(true);
      // En environnement de production, remplacer par un appel API réel
      // const response = await axios.put(`/api/supplier-orders/${supplierOrderId}`, { status, ...details });
      // const updatedSupplierOrder = response.data;
      
      // Simulation
      setTimeout(() => {
        const now = new Date().toISOString();
        
        const updatedSupplierOrders = supplierOrders.map(order => {
          if (order.id === supplierOrderId) {
            // Mettre à jour l'historique
            const updatedHistory = [
              ...order.history,
              {
                date: now,
                status: status,
                comment: details.comment || `Statut mis à jour: ${status}`
              }
            ];
            
            // Mise à jour du statut et des détails
            let updatedOrder = {
              ...order,
              status: status,
              history: updatedHistory,
              ...details
            };
            
            // Ajouter la date de livraison effective si le statut est "delivered"
            if (status === 'delivered' && !order.actualDeliveryDate) {
              updatedOrder.actualDeliveryDate = now;
            }
            
            return updatedOrder;
          }
          return order;
        });
        
        const updatedSupplierOrder = updatedSupplierOrders.find(order => order.id === supplierOrderId);
        
        setSupplierOrders(updatedSupplierOrders);
        setCurrentSupplierOrder(updatedSupplierOrder);
        setSupplierOrderLoading(false);
        
        return updatedSupplierOrder;
      }, 1000);
    } catch (error) {
      setSupplierOrderError('Erreur lors de la mise à jour de la commande fournisseur.');
      setSupplierOrderLoading(false);
      throw error;
    }
  };

  // Valeurs et fonctions exposées par le contexte
  const value = {
    // État des devis
    quotes,
    currentQuote,
    quoteLoading,
    quoteError,
    // Fonctions liées aux devis
    fetchQuotes,
    generateQuote,
    validateQuote,
    setCurrentQuote,
    
    // État des commandes
    orders,
    currentOrder,
    orderLoading,
    orderError,
    // Fonctions liées aux commandes
    fetchOrders,
    createOrder,
    updatePaymentStatus,
    setCurrentOrder,
    
    // État des commandes fournisseurs
    supplierOrders,
    currentSupplierOrder,
    supplierOrderLoading,
    supplierOrderError,
    // Fonctions liées aux commandes fournisseurs
    fetchSupplierOrders,
    createSupplierOrder,
    updateSupplierOrderStatus,
    setCurrentSupplierOrder
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote doit être utilisé à l\'intérieur d\'un QuoteProvider');
  }
  return context;
};

export default QuoteContext;
