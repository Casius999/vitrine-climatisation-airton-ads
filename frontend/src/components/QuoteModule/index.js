import React from 'react';
import QuoteManager from './QuoteManager';
import QuoteDetails from './QuoteDetails';
import PaymentTracker from './PaymentTracker';
import SupplierOrderTracker from './SupplierOrderTracker';

/**
 * Module principal de gestion des devis, paiements en 3 tranches et suivi des commandes
 * Ce module sert de point d'entrée pour toutes les fonctionnalités liées à la partie commerciale
 */
const QuoteModule = ({ configuration, customer }) => {
  return (
    <div className="quote-module">
      <QuoteManager configuration={configuration} customer={customer} />
      <QuoteDetails />
      <PaymentTracker />
      <SupplierOrderTracker />
    </div>
  );
};

export default QuoteModule;
