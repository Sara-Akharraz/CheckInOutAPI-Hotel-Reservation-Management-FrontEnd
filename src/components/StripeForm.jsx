import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const StripeForm = ({ montantMAD, reservationId, method, setMessage, setPaiementEffectue }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (montantMAD !== null) {
      axios.post("/api/facture/create-intent", { amount: montantMAD })
        .then(res => {
          console.log("Client Secret reçu :", res.data);
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          console.error("Erreur lors de la création du PaymentIntent", err);
        });
    }
  }, [montantMAD]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      console.error("Stripe non prêt ou clientSecret manquant.");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Test Client",
        },
      },
    });

    if (result.error) {
      console.error("Erreur de paiement :", result.error.message);
      setMessage("Échec du paiement : " + result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setMessage("Paiement effectué avec succès !");
        setPaiementEffectue(true);
      } else {
        setMessage("Statut du paiement : " + result.paymentIntent.status);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || !elements || !clientSecret || loading}
        className="btn-valider bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
      >
        {loading ? "Traitement..." : "Payer"}
      </button>
    </form>
  );
};

export default StripeForm;
