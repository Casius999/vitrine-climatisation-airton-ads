import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography, Paper, Alert } from '@mui/material';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Composant conteneur avec le provider Stripe
const PaymentFormContainer = ({ clientSecret, amount, onSuccess, onError }) => {
  if (!clientSecret) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent 
        clientSecret={clientSecret} 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
};

// Composant interne avec la logique de paiement
const PaymentFormContent = ({ clientSecret, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  useEffect(() => {
    if (!stripe || !clientSecret) return;
  }, [stripe, clientSecret]);

  const handleChange = (event) => {
    // Écouter les changements dans CardElement
    // et afficher les erreurs potentielles
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe n'est pas encore chargé
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (payload.error) {
        setError(`Erreur de paiement: ${payload.error.message}`);
        if (onError) onError(payload.error.message);
      } else {
        setSucceeded(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(`Une erreur est survenue: ${err.message}`);
      if (onError) onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      {succeeded ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Paiement réussi !
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Votre paiement a été traité avec succès. Vous recevrez une confirmation par email.
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Paiement de l'acompte
          </Typography>
          
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Montant à payer: <strong>{formatCurrency(amount)}</strong>
          </Typography>
          
          <Box sx={{ border: '1px solid #eee', p: 2, borderRadius: 1, mb: 3 }}>
            <CardElement 
              onChange={handleChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={processing || disabled || succeeded}
            sx={{ py: 1.5 }}
          >
            {processing ? (
              <CircularProgress size={24} />
            ) : (
              `Payer ${formatCurrency(amount)}`
            )}
          </Button>
          
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            Paiement sécurisé via Stripe. Vos informations de carte sont protégées.
          </Typography>
        </form>
      )}
    </Paper>
  );
};

export default PaymentFormContainer;