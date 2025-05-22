import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SidebarNav from '../components/SideBar';
import Header from '../components/Header';
import '../styles/FactureSuivi.css';
import '../styles/bootstrap-tables-only.css';
import { BiPointer } from "react-icons/bi";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchReservations = useCallback(async () => {
    let url = '/api/reservation/search';
    const params = [];

    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (dateDebut) params.push(`dateDebut=${dateDebut}`);
    if (dateFin) params.push(`dateFin=${dateFin}`);
    if (selectedStatus) params.push(`status=${selectedStatus}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur serveur');

      const data = await response.json();
      setReservations(data);

      if (data.length === 0) {
        setErrorMessage('Aucune réservation trouvée.');
      } else {
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Erreur récupération réservations :', error);
      setReservations([]);
      setErrorMessage('Erreur lors de la récupération des réservations.');
    }
  }, [search, dateDebut, dateFin, selectedStatus]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case 'En_Attente': return 'En Attente';
      case 'Confirmee': return 'Confirmée';
      case 'Annulee': return 'Annulée';
      case 'Terminee': return 'Terminée';
      default: return status;
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNav />
        <div className="content flex-grow-1 p-4">
          <h1 className="fs-4 fw-bold mb-4">Liste des Réservations</h1>

          <form onSubmit={(e) => { e.preventDefault(); fetchReservations(); }} className="form mb-4">
            <div className="mb-3">
              <label className="form-label">Recherche :</label>
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ID, nom, prénom..."
              />
            </div>

           
              <div className="col">
                <label className="form-label">Date Début :</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">Date Fin :</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                />
              </div>
              <div className="col">
                <label className="form-label">Statut :</label>
                <select
                  className="custom-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">-- Tous --</option>
                  <option value="En_Attente">En Attente</option>
                  <option value="Confirmee">Confirmée</option>
                  <option value="Terminee">Terminée</option>
                </select>
              </div>
            

            <button type="submit" className="btn btn-primary">Filtrer</button>
          </form>

          {errorMessage && (
            <p className="text-danger fw-semibold mb-3">{errorMessage}</p>
          )}

          {!errorMessage && reservations.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID Réservation</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{reservation.date_debut}</td>
                      <td>{reservation.date_fin}</td>
                      <td>
                        <span className={`badge ${reservation.status === 'Confirmee' ? 'badge custom-validé' : reservation.status === 'En_Attente' ? 'badge custom-en-attente' : 'badge custom-terminée'}`}>
                          {formatStatus(reservation.status)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/reservationDetail/${reservation.id}`}>
                          <button className="btn-voir-detail"><BiPointer /></button>
                        </Link>
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

export default Reservations;
