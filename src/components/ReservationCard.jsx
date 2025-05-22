import React from 'react';
import '../styles/bootstrap-tables-only.css';
import '../styles/FactureSuivi.css';

const ReservationCard = ({ reservation, onCheckIn, onCheckOut, showClientName }) => {
    const formatDate = (date) => new Date(date).toLocaleDateString();

    const clientName = reservation.user ? reservation.user.nom : 'Nom non disponible';

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro réservation</th>
                        {showClientName && <th>Nom Client</th>}
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{reservation.id}</td>
                        {showClientName && <td>{clientName}</td>}
                        <td>{formatDate(reservation.date_debut)}</td>
                        <td>{formatDate(reservation.date_fin)}</td>
                        <td>
                            <span className={`badge ${
                                reservation.status === 'Confirmee'
                                    ? 'badge custom-validé'
                                    : reservation.status === 'En_Attente'
                                    ? 'badge custom-en-attente'
                                    : 'custom-terminée'
                            }`}>
                                {reservation.status}
                            </span>
                        </td>
                        <td>
                        <button
    className={`btn btn-sm me-2 ${reservation.status === "En_Attente" ? "btn-voir-detail" : "btn-disabled"}`}
    onClick={() => onCheckIn(reservation.id)}
    title={reservation.status !== "En_Attente" ? "Non disponible" : "Effectuer le check-in"}
>
    Check-In
</button>

<button
    className={`btn btn-sm ${reservation.status === "Confirmee" ? "btn-voir-detail" : "btn-disabled"}`}
    onClick={() => onCheckOut(reservation.id)}
    title={reservation.status !== "Confirmee" ? "Non disponible" : "Effectuer le check-out"}
>
    Check-Out
</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ReservationCard;
