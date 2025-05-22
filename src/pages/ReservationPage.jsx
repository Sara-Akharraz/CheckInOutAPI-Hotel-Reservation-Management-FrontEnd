import React, { useState } from 'react';
import ReservationForm from '../components/ReservationForm';
import ServiceSelector from '../components/ServiceSelector';
import Header from '../components/Header';
import SidebarNavClient from '../components/SideBarClient';
import '../styles/bookingPage.css'; 

const ReservationPage = () => {
  const [reservationId, setReservationId] = useState(null);

  return (
    <div className="container">
   
      <Header />

      <div className="right-side">
     
        <SidebarNavClient />

        <div className="content flex-grow-1 px-4">
    
          <h1 className="fs-4 fw-bold mb-4">Réservation</h1>

       
          <div className="reservation-form-container">
            <ReservationForm onReservationComplete={setReservationId} />
          </div>

          {reservationId && (
            <div className="mt-4">
              <ServiceSelector reservationId={reservationId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
