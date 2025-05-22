import React, { useEffect, useState } from "react";
import "../styles/bootstrap-tables-only.css";
import "../styles/FactureSuivi.css";


const ReservationForm = ({ onReservationComplete }) => {
  const [userId, setUserId] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("reservationData"));

    if (!data) {
      alert("Aucune donnée de réservation trouvée.");
    } else {
      setReservationData(data);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reservationData) return;

    const { dateDebut, dateFin, chambres } = reservationData;

    const dataToSend = {
      reservationDTO: {
        userId: parseInt(userId),
        date_debut: dateDebut,
        date_fin: dateFin,
        status: "En_Attente",
      },
      chambresId: chambres,
    };

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        setResultMessage(`Réservation ajoutée avec succès ! ID :${result.id}`);
        onReservationComplete(result.id);
      } else {
        const error = await response.text();
        setResultMessage("Erreur: " + error);
      }
    } catch (err) {
      setResultMessage("Erreur de connexion : " + err.message);
    }
  };

  if (!reservationData) return null;

  const { dateDebut, dateFin, chambres } = reservationData;
  const chambresNames =
    Array.isArray(chambres) ? chambres.map((id) => `Chambre ${id}`).join(", ") : "";

  return (
    <form onSubmit={handleSubmit} className="form-booking">
      <div className="form-group">
        <label htmlFor="userId">Id User</label>
        <input
          type="number"
          id="userId"
          className="form-control"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateDebut">Date début</label>
        <input
          type="text"
          id="dateDebut"
          className="form-control"
          value={dateDebut}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateFin">Date Arrivée</label>
        <input
          type="text"
          id="dateFin"
          className="form-control"
          value={dateFin}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="chambres">Chambres sélectionnées</label>
        <input
          type="text"
          id="chambres"
          className="form-control"
          value={chambresNames}
          readOnly
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Valider réservation
      </button>

      {resultMessage && <p className="mt-3 text-center">{resultMessage}</p>}
    </form>
  );
};

export default ReservationForm;
