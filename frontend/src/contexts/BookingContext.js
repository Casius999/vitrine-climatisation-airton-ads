import React, { createContext, useState, useContext } from 'react';

// Création du contexte pour la réservation
const BookingContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking doit être utilisé à l\'intérieur d\'un BookingProvider');
  }
  return context;
};

// Provider du contexte
export const BookingProvider = ({ children }) => {
  // État pour les détails de réservation
  const [bookingDetails, setBookingDetails] = useState({
    date: null,
    time: null,
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      city: '',
    },
    payment: {
      method: 'card',
      depositAmount: 0,
      remainingAmount: 0,
      totalAmount: 0,
      status: null, // 'pending', 'completed', 'failed'
    },
    status: null, // 'pending', 'confirmed', 'cancelled'
  });

  // Référence de réservation unique
  const [bookingReference, setBookingReference] = useState(null);

  // Mettre à jour les détails de réservation
  const updateBookingDetails = (newDetails) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      ...newDetails,
    }));
  };

  // Réinitialiser les détails de réservation
  const resetBooking = () => {
    setBookingDetails({
      date: null,
      time: null,
      customer: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        postalCode: '',
        city: '',
      },
      payment: {
        method: 'card',
        depositAmount: 0,
        remainingAmount: 0,
        totalAmount: 0,
        status: null,
      },
      status: null,
    });
    setBookingReference(null);
  };

  // Définir la date et l'heure de réservation
  const setBookingDateTime = (date, time) => {
    updateBookingDetails({
      date,
      time,
    });
  };

  // Mettre à jour les informations client
  const setCustomerInfo = (customerInfo) => {
    updateBookingDetails({
      customer: {
        ...bookingDetails.customer,
        ...customerInfo,
      },
    });
  };

  // Mettre à jour les informations de paiement
  const setPaymentInfo = (paymentInfo) => {
    updateBookingDetails({
      payment: {
        ...bookingDetails.payment,
        ...paymentInfo,
      },
    });
  };

  // Confirmer la réservation
  const confirmBooking = (reference) => {
    setBookingReference(reference);
    updateBookingDetails({
      status: 'confirmed',
      payment: {
        ...bookingDetails.payment,
        status: 'completed',
      },
    });
  };

  // Annuler la réservation
  const cancelBooking = () => {
    updateBookingDetails({
      status: 'cancelled',
    });
  };

  // Calculer l'acompte (40% du prix total)
  const calculateDeposit = (totalAmount) => {
    const deposit = Math.round(totalAmount * 0.4);
    const remaining = totalAmount - deposit;

    setPaymentInfo({
      depositAmount: deposit,
      remainingAmount: remaining,
      totalAmount,
    });

    return { deposit, remaining };
  };

  return (
    <BookingContext.Provider
      value={{
        bookingDetails,
        bookingReference,
        updateBookingDetails,
        resetBooking,
        setBookingDateTime,
        setCustomerInfo,
        setPaymentInfo,
        confirmBooking,
        cancelBooking,
        calculateDeposit,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;