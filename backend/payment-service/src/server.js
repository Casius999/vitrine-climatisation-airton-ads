// Ajout de la route pour marquer un paiement manuellement

app.patch('/api/mark-payment-manually', async (req, res) => {
  try {
    const { quoteId, paymentType, status } = req.body;
    
    if (!quoteId || !paymentType || !status) {
      return res.status(400).json({ message: 'Informations incomplètes' });
    }
    
    // Créer une nouvelle transaction pour enregistrer le paiement manuel
    const transaction = new Transaction({
      stripePaymentIntentId: `manual_${Date.now()}`,
      customerId: 'manual',
      quoteId,
      amount: 0, // Le montant sera mis à jour via le service commercial
      type: paymentType,
      status: status,
    });
    
    await transaction.save();
    
    // Mettre à jour le statut de paiement du devis
    try {
      await axios.patch(`${COMMERCIAL_SERVICE_URL}/api/quotes/${quoteId}/payment-status`, {
        paymentType,
        status
      });
      
      console.log(`Statut de paiement du devis ${quoteId} mis à jour manuellement: ${paymentType} = ${status}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement du devis:', error);
      // Ne pas échouer la requête, juste logger l'erreur
    }
    
    res.json({
      success: true,
      message: 'Paiement marqué manuellement avec succès',
      transactionId: transaction._id
    });
  } catch (error) {
    console.error('Erreur lors du marquage manuel du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur lors du marquage du paiement' });
  }
});