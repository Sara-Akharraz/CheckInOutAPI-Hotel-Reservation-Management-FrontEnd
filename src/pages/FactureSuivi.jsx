import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/FactureSuivi.css';
import '../styles/bootstrap-tables-only.css';
import { CiInboxIn } from 'react-icons/ci';
import SidebarNavClient from '../components/SideBarClient';

const SuiviFacture = () => {
  const [reservationId, setReservationId] = useState('');
  const [userId, setUserId] = useState('');
  const [factures, setFactures] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userIdFromUrl = window.location.pathname.split('/')[2];
    setUserId(userIdFromUrl);
  }, []);

  const fetchFactures = async () => {
    if (!reservationId || !userId) return;

    try {
      const response = await fetch(`/api/facture/facturescheckin/${reservationId}/${userId}`);
      if (response.ok) {
        const facturesData = await response.json();
        setFactures(facturesData);
        setErrorMessage('');
      } else {
        setErrorMessage('Aucune facture trouvée pour cette réservation.');
        setFactures([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      setErrorMessage('Erreur lors de la récupération des factures.');
      setFactures([]);
    }
  };

  const handleReservationIdSubmit = (e) => {
    e.preventDefault();
    fetchFactures();
  };

  const handleOpenFactureInBrowser = (factureId) => {
    window.open(`http://localhost:8080/api/facture/checkinfacture/${factureId}`, '_blank');
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNavClient />
        <div className="content flex-grow-1 p-4">
          <h1 className="fs-4 fw-bold mb-4">Suivi de la Facture</h1>

          <form onSubmit={handleReservationIdSubmit} className="form mb-4">
            <div>
              <label className="me-2">Numéro de réservation :</label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
              />
              <button type="submit" className="ms-3">Voir les factures</button>
            </div>
          </form>

          {errorMessage && (
            <p className="text-danger fw-semibold mb-3">{errorMessage}</p>
          )}

          {!errorMessage && factures.length > 0 && (
            <div className="table-responsive">
              <h2 className="table-title">Check-in Facture</h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID Facture</th>
                    <th>Montant Check-in</th>
                    <th>Taxe</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((facture) => (
                    <tr key={facture.id}>
                      <td>{facture.id}</td>
                      <td>{facture.checkInMontant} DH</td>
                      <td>{facture.tax} DH</td>
                      <td>
                        {facture.status === 'paye' ? (
                          <span className="badge custom-validé">Payée</span>
                        ) : (
                          <span className="badge bg-danger">Non payée</span>
                        )}
                      </td>
                      <td>
                        {facture.status === 'paye' ? (
                          <button
                            onClick={() => handleOpenFactureInBrowser(facture.id)}
                            className="action-btn"
                          >
                            <CiInboxIn />
                          </button>
                        ) : (
                          <span className="text-muted small">Non disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuiviFacture;
