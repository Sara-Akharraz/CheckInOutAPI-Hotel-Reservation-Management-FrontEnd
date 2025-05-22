import React, { useState, useEffect } from 'react';
import ReservationCard from '../components/ReservationCard';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarNavClient from '../components/SideBarClient';
import Header from '../components/Header';

const ReservationSuivi = () => {
    const { userId } = useParams();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noDataMsg, setNoDataMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            setLoading(true);
            setError(null);
            setNoDataMsg('');

            fetch(`/api/reservation/reservations/user/${userId}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Erreur lors de la récupération des données');
                    }
                    return res.json();
                })
                .then(data => {
                    setLoading(false);
                    if (Array.isArray(data) && data.length > 0) {
                        setReservations(data);
                    } else {
                        setReservations([]);
                        setNoDataMsg("Aucune réservation trouvée");
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setError("Erreur de connexion au serveur");
                    setReservations([]);
                    setNoDataMsg('');
                });
        }
    }, [userId]);

    const handleCheckIn = (id) => {
        console.log(`Check-in pour la réservation ${id}`);
        navigate(`/check-in/${id}`);
    };

    const handleCheckOut = (id) => {
        console.log(`Check-out pour la réservation ${id}`);
    };

    return (
        <div className="container">
            <Header />
            <div className="right-side">
                <SidebarNavClient />
                <div className="content flex-grow-1 p-4">
                    <h1 className="fs-4 fw-bold mb-4">Suivi des Réservations</h1>

                    {error && <p className="text-danger">{error}</p>}
                    {loading && <p>Chargement...</p>}

                    {reservations.length > 0 ? (
                        <div>
                            {reservations.map((reservation) => (
                                <ReservationCard
                                    key={reservation.id}
                                    reservation={reservation}
                                    onCheckIn={handleCheckIn}
                                    onCheckOut={handleCheckOut}
                                    showClientName={false}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && noDataMsg && <p>{noDataMsg}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationSuivi;
