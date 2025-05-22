import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import Header from "../components/Header";
import SidebarNavClient from "../components/SideBarClient";
import StripeForm from "../components/StripeForm";

import "../styles/FactureSuivi.css";
import "../styles/bookingForm.css";
import "../styles/bootstrap-tables-only.css";

const stripePromise = loadStripe("pk_test_51RI1kcBG5woV8cDSIq0HjhG5vnTdxuBdAzJlglOLMHlXOTIWojrDM9XYv4wID7650i2kiuvO6jfJFRXsuPC7srbQ00U98EZJ2K");

const Paiement = () => {
  const { reservationId } = useParams();  
  const [montantMAD, setMontant] = useState(null);
  const [paiementEffectue, setPaiementEffectue] = useState(false);
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("STRIPE");

  useEffect(() => {
    
    axios
      .get(`/api/facture/Montant_checkin`, {
        params: { id_reservation: reservationId },
      })
      .then((res) => setMontant(res.data))
      .catch((err) => console.error("Erreur lors du chargement du montant", err));
  }, [reservationId]);

  // Validation du check-in (with STRIPE method)
  const handleValidationCheckIn = () => {
    if (!paiementEffectue) {
      alert("Veuillez effectuer le paiement avant de valider le check-in.");
      return;
    }

    axios
      .post(`/api/check_in/validerCheckIn`, null, {
        params: { reservationId } 
      })
      .then((res) => {
        alert(res.data); 
        setMessage("Check-in validé avec succès!");
      })
      .catch((err) => {
        alert("Erreur lors de la validation du check-in.");
        console.error(err);
      });
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNavClient />
        <div className="content p-6 w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Paiement Check-In
          </h2>

          <div className="card p-6 max-w-2xl mx-auto">
            {montantMAD !== null ? (
              <p className="text-lg mb-4">
                Montant à payer : <strong>{montantMAD} DH</strong>
              </p>
            ) : (
              <p>Chargement du montant...</p>
            )}

            <label className="block mt-4 mb-2">Méthode de paiement :</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="custom-status-select w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="STRIPE">Stripe</option>
              <option value="PAYPAL">PayPal</option>
            </select>
            <div style={{ marginTop: '2rem' }}></div>
            {method === "STRIPE" && (
              <Elements stripe={stripePromise}>
                <StripeForm
                  montantMAD={montantMAD}
                  reservationId={reservationId}
                  method={method}
                  setMessage={setMessage}
                  setPaiementEffectue={setPaiementEffectue}
                />
              </Elements>
            )}

            {message && (
              <p className="mt-4 text-green-600 font-semibold text-center">{message}</p>
            )}

            {paiementEffectue && (
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleValidationCheckIn}
                  className="btn-valider w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Valider Check-in
                </button>

                {/* <button
                  onClick={handleAfficherFacture}
                  className="btn-valider w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Générer Facture PDF
                </button> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paiement;
