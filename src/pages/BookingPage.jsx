import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import Header from "../components/Header";
import "../styles/bootstrap-tables-only.css";
import "../styles/FactureSuivi.css";
import "../styles/bookingPage.css";
import SidebarNavClient from "../components/SideBarClient";
import { BiPointer } from "react-icons/bi";

const BookingPage = () => {
  const [types, setTypes] = useState([]);
  const [chambres, setChambres] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    fetch("/api/chambres/types")
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((err) => console.error("Erreur chargement types:", err));
  }, []);

  const handleSearchSubmit = (e, formData) => {
    e.preventDefault();
    setSearchParams(formData);
    const { dateDebut, dateFin, capacite, type, etage } = formData;
    const url = `/api/chambres/disponibles/filtre?dateDebut=${dateDebut}&dateFin=${dateFin}&capacite=${capacite}&type=${type}&etage=${etage}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setChambres(data))
      .catch((err) => console.error("Erreur recherche chambres :", err));
  };

  const handleSubmit = () => {
    const selected = document.querySelectorAll("input[name='chambre']:checked");
    const selectedIds = Array.from(selected).map((input) => input.value);

    if (selectedIds.length === 0) {
      alert("Veuillez sélectionner au moins une chambre !");
      return;
    }

    const dataToStore = {
      chambres: selectedIds,
      dateDebut: searchParams.dateDebut,
      dateFin: searchParams.dateFin,
    };

    sessionStorage.setItem("reservationData", JSON.stringify(dataToStore));
    navigate("/reservation-form");
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side d-flex">
        <SidebarNavClient />
        <div className="content flex-grow-1 px-4">
          <h1 className="fs-4 fw-bold mb-4">Réservation de chambres</h1>

          <BookingForm types={types} onSubmit={handleSearchSubmit} />

          <div className="mt-4">
            {chambres.length > 0 ? (
              <>
                <h3>Chambres disponibles :</h3>
                <div className="row">
                  {chambres.map((chambre) => (
                    <div className="col-md-4 mb-4" key={chambre.id}>
                      <div className="card-booking">
                       
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="chambre"
                            value={chambre.id}
                            id={`chambre-${chambre.id}`}
                          />
                        </div>
                        <div className="d-flex">
                          <img
                            src={chambre.photo || `/images/chambre${chambre.id}.jpg`}
                            className="card-img-left"
                            alt={`Chambre ${chambre.nom}`}
                          />
                        </div>

                          <div className="card-body">
                            <h5 className="card-title">Chambre {chambre.nom}</h5>
                            <p className="card-text">
                              Type : {chambre.type} <br />
                              Capacité : {chambre.capacite} <br />
                              Étage : {chambre.etage} <br />
                              Prix : {chambre.prix} DH
                            </p>
                           
                          
                        </div>
                        <button
                              className="btn-voir-detail"
                              onClick={() => navigate(`/chambreDetailPage/${chambre.id}`)}
                            >
                              <BiPointer />
                            </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-valider" onClick={handleSubmit}>
                  Réserver
                </button>
              </>
            ) : (
              <p className="text-muted">Aucune chambre disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;