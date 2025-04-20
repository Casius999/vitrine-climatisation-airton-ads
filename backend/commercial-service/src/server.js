// Ajout des métriques de performance pour le dashboard

// Obtenir des métriques de performance commerciale
app.get('/api/dashboard/performance', async (req, res) => {
  try {
    // Définir la période de calcul (par défaut 30 derniers jours)
    const { period = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Récupérer les devis de la période
    const quotes = await Quote.find({
      createdAt: { $gte: startDate }
    });
    
    // Calculer le taux de conversion (devis acceptés / devis envoyés)
    const sentQuotes = quotes.filter(quote => quote.status === 'sent' || quote.status === 'accepted');
    const acceptedQuotes = quotes.filter(quote => quote.status === 'accepted');
    
    const conversionRate = sentQuotes.length > 0 
      ? (acceptedQuotes.length / sentQuotes.length) * 100
      : 0;
    
    // Calculer le taux de recouvrement (montant payé / montant total des devis acceptés)
    const totalAcceptedAmount = acceptedQuotes.reduce((sum, quote) => sum + quote.totalPrice, 0);
    
    // Calculer le montant payé
    let totalPaidAmount = 0;
    
    for (const quote of acceptedQuotes) {
      if (quote.paymentStatus?.deposit === 'paid') {
        totalPaidAmount += quote.deposit;
      }
      
      if (quote.paymentStatus?.installationPayment === 'paid') {
        totalPaidAmount += quote.installationPayment;
      }
      
      if (quote.paymentStatus?.finalPayment === 'paid') {
        totalPaidAmount += quote.finalPayment;
      }
    }
    
    const recoveryRate = totalAcceptedAmount > 0
      ? (totalPaidAmount / totalAcceptedAmount) * 100
      : 0;
    
    // Calculer le panier moyen
    const averageBasket = acceptedQuotes.length > 0
      ? totalAcceptedAmount / acceptedQuotes.length
      : 0;
    
    // Récupérer les commandes de la période
    const orders = await SupplierOrder.find({
      createdAt: { $gte: startDate }
    });
    
    // Calculer le délai moyen de livraison
    const deliveredOrders = orders.filter(order => 
      order.status === 'delivered' && 
      order.trackingInfo?.estimatedDeliveryDate
    );
    
    let averageDeliveryTime = 0;
    
    if (deliveredOrders.length > 0) {
      const totalDays = deliveredOrders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(order.trackingInfo.estimatedDeliveryDate);
        const diffTime = Math.abs(deliveryDate - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      
      averageDeliveryTime = totalDays / deliveredOrders.length;
    }
    
    res.json({
      period,
      quoteCount: quotes.length,
      sentQuoteCount: sentQuotes.length,
      acceptedQuoteCount: acceptedQuotes.length,
      conversionRate,
      totalAcceptedAmount,
      totalPaidAmount,
      recoveryRate,
      averageBasket,
      orderCount: orders.length,
      deliveredOrderCount: deliveredOrders.length,
      averageDeliveryTime
    });
  } catch (error) {
    console.error('Erreur lors du calcul des métriques de performance:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});