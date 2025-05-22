import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarNavClient from '../components/SideBarClient';
import '../styles/FactureSuivi.css';
import '../styles/ajoutService.css';
import '../styles/bootstrap-tables-only.css';
import { BiPlusCircle ,BiSolidChevronUpCircle} from "react-icons/bi";

const ServiceSuivi = () => {
  const [reservationId, setReservationId] = useState('');
  const [userId, setUserId] = useState('');
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [showAvailableServices, setShowAvailableServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userIdFromUrl = window.location.pathname.split('/')[2];
    setUserId(userIdFromUrl);
  }, []);

  const fetchServices = async () => {
    if (!reservationId || !userId) return;

    try {
      const response = await fetch(`/api/reservation-services/by-reservation/${reservationId}/user/${userId}`);
      if (!response.ok) {
        if (response.status === 403) {
          setErrorMessage("Vous n'avez pas accès à cette réservation !");
        } else if (response.status === 500) {
          setErrorMessage("Une erreur interne est survenue. Veuillez réessayer plus tard.");
        } else {
          setErrorMessage("Erreur lors de la récupération des services.");
        }
      } else {
        const data = await response.json();
        setServices(data);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setErrorMessage('Erreur de connexion.');
    }
  };

  const fetchAvailableServices = async () => {
    if (!reservationId) return;

    try {
      const response = await fetch(`/api/reservation-services/available-services/${reservationId}`);
      const data = await response.json();
      setAvailableServices(data);
    } catch (error) {
      console.error('Error fetching available services:', error);
      setMessage('Erreur lors du chargement des services disponibles.');
    }
  };

  const handleReservationIdSubmit = (e) => {
    e.preventDefault();
    fetchServices();
    fetchAvailableServices();
  };

  const handleAddService = async () => {
    try {
      const response = await fetch(`/api/reservation-services/addSejourService?id_reservation=${reservationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedServices),
      });

      if (response.ok) {
        fetchServices();
        setSelectedServices([]);
        setShowAvailableServices(false);
        setMessage('Services ajoutés avec succès !');
      } else {
        setMessage("Erreur lors de l'ajout des services.");
      }
    } catch (error) {
      console.error('Error adding services:', error);
      setMessage("Erreur lors de l'ajout des services.");
    }
  };

  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNavClient />
        <div className="content flex-grow-1 p-4">
          <h1 className="fs-4 fw-bold mb-4">Suivi des Services</h1>

          <form onSubmit={handleReservationIdSubmit} className="form mb-4">
            <div>
              <label className="me-2">Numéro de réservation :</label>
              <input
                type="text"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
              />
              <button type="submit" className="ms-3">Voir les services</button>
            </div>
          </form>

          {errorMessage && (
            <p className="text-danger fw-semibold mb-3">{errorMessage}</p>
          )}
          {message && (
            <p className="text-success fw-semibold mb-3">{message}</p>
          )}
             <button
                className="btn-voir-service"
                onClick={() => setShowAvailableServices(!showAvailableServices)}
              >
                {showAvailableServices ? <BiSolidChevronUpCircle /> : <BiPlusCircle />}
              </button>
          {!errorMessage && services.length > 0 && (
            <div className="table-responsive">
              <h2 className="table-title">Services liés à la réservation {reservationId}</h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Prix (DH)</th>
                    <th>Statut du paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.serviceName}</td>
                      <td>{service.serviceDescription}</td>
                      <td>{service.servicePrice} DH</td>
                      <td className={`badge ${service.paymentStatus === 'en_attente' ? 'custom-en-attente' : 'custom-validé'}`}style={{ height: '8px', marginTop: '5px' }}>
                        {service.paymentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!errorMessage && (
            <>
           

              {showAvailableServices && (
                <div className="mt-4 available-services">
                  <h2 className="table-title">Services disponibles à ajouter</h2>
                  <ul className="list-unstyled">
                    {availableServices.map((service) => (
                      <li key={service.id}>
                        <label>
                          <input
                            type="checkbox"
                            className="me-2"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceSelection(service.id)}
                          />
                          {service.nom} - {service.prix} DH
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleAddService} className="btn-valider">
                    Valider
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceSuivi;
