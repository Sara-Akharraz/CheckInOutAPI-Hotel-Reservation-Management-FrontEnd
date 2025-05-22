import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import SidebarNav from '../components/SideBar';
import '../styles/bootstrap-tables-only.css';
import '../styles/FactureSuivi.css'; 

const DetailReservation = () => {
  const { id: idFromURL } = useParams();
  const [reservationId, setReservationId] = useState(idFromURL || '');
  const [reservationDetails, setReservationDetails] = useState(null);
  const [error, setError] = useState('');

  const fetchReservationDetails = async () => {
    if (!reservationId) return;

    try {
      const response = await axios.get(`/api/reservation/details/${reservationId}`);
      setReservationDetails(response.data);
      setError('');
    } catch (err) {
      setError('Réservation introuvable ou erreur serveur.');
      setReservationDetails(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReservationDetails();
  };

  useEffect(() => {
    if (reservationId) fetchReservationDetails();
  }, [reservationId]);

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNav />
        <div className="content flex-grow-1 p-4">
          <h1 className="fs-4 fw-bold mb-4">Détail de la Réservation</h1>

         
          <form onSubmit={handleSubmit} className="form mb-4">
            <div>
              <label>Numéro de réservation:</label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
              />
            </div>
            <button type="submit">Rechercher</button>
          </form>

          {error && <p className="text-danger fw-semibold mb-3">{error}</p>}

          {reservationDetails && (
            <div className="card shadow rounded p-4 mb-4" >
              <h2 className="fs-5 mb-3">Informations générales</h2>
              <p><strong>ID Réservation:</strong> {reservationDetails.reservationDTO.id}</p>
              <div className='c1'>
              <p><strong>Client:</strong> {reservationDetails.userFirstName} {reservationDetails.userLastName}</p>
              <p><strong>CIN:</strong> {reservationDetails.userCin}</p>
              <p><strong>Téléphone:</strong> {reservationDetails.userPhone}</p>
            
                
                <p>
                <strong>Statut:</strong>{' '}
                <span
                  className={`px-3 py-1 rounded text-white fw-bold ${
                    reservationDetails.reservationDTO.status === 'En_Attente'
                      ? 'badge custom-en-attente'
                      : reservationDetails.reservationDTO.status === 'Confirmee'
                      ? 'badge custom-validé'
                      : 'badge custom-terminée'
                  }`}
                >
                  {reservationDetails.reservationDTO.status.replace('_', ' ')}
                </span>
              </p>
              <p>
                <strong>Date Début:</strong> {reservationDetails.reservationDTO.date_debut} |
                <strong> Date Fin:</strong> {reservationDetails.reservationDTO.date_fin}
              </p>
                
                

              
                <h3 className="fs-6 fw-bold">Chambres</h3>
                <ul className="list-unstyled">
                  {reservationDetails.chambreList.map((chambre) => (
                    <li key={chambre.id} className="mb-2">
                      <strong>{chambre.nom}</strong> - {chambre.prix} DH 
                      Capacité: {chambre.capacite} 
                      Étage: {chambre.etage}
                    </li>
                  ))}
                </ul>
             
                <h3 className="fs-6 fw-bold">Services</h3>
                {reservationDetails.reservationServiceRequestDTO?.length > 0 ? (
                  <ul className="list-unstyled">
                    {reservationDetails.reservationServiceRequestDTO.map((service, index) => (
                      <li key={index} className="mb-2">
                      <strong>{service.serviceName}</strong> - {service.servicePrice} DH {"   "}
                      <span className={`badge ${service.paymentStatus === 'paye' ? 'badge custom-validé' : 'bg-warning text-dark'}`}>
                        {service.paymentStatus === 'paye' ? 'Payé' : 'Non payé'}
                      </span>
                    </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted fst-italic">Aucun service</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailReservation;
