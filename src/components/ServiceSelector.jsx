import React, { useEffect, useState } from 'react';
import '../styles/ajoutService.css'; 
import{ useAuth } from '../components/AuthContext';
const ServiceSelector = ({ reservationId }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [message, setMessage] = useState('');
  const [servicesValidated, setServicesValidated] = useState(false);
  const { user, token } = useAuth();
  useEffect(() => {
    fetch('/api/services', { headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }})
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => {
        console.error(err);
        setMessage('Erreur lors du chargement des services.');
      });
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/reservation-services/addService?id_reservation=${reservationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedServices),
      });

      if (response.ok) {
        setMessage('Services ajoutés avec succès. Un email a été envoyé.');
        setServicesValidated(true);
      } else {
        const error = await response.text();
        setMessage('Erreur lors de l\'ajout des services : ' + error);
      }
    } catch (err) {
      setMessage(' Erreur de connexion : ' + err.message);
    }
  };

  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="">
      <h2 className="mb-3">Sélection des Services</h2>

      <div className="available-services mb-4">
        {services.length > 0 ? (
          <ul className="list-unstyled">
            {services.map((service) => (
              <li key={service.id} className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    className="me-2"
                    value={service.id}
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceSelection(service.id)}
                  />
                  <strong>{service.nom}</strong> - {service.description || 'Aucune description'} 
                  ({service.prix ? `${service.prix} DH` : 'Prix non spécifié'})
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chargement des services...</p>
        )}
      </div>

      <button onClick={handleSubmit} className="btn-valider">
        Valider les services
      </button>

      {message && (
        <p className={` card mt-3 fw-semibold ${message.startsWith('Services ajoutés') ? 'text-success' : 'text-danger'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ServiceSelector;
