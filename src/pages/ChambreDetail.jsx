import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Header from "../components/Header";
import SidebarNavClient from "../components/SideBarClient";
import Slider from "react-slick"; 
import "../styles/FactureSuivi.css";
import "../styles/bookingPage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Slider.css";
import{ useAuth } from '../components/AuthContext';
const ChambreDetail = () => {
  const { chambreId } = useParams();
  const [chambre, setChambre] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  useEffect(() => {
    const fetchChambreDetail = async () => {
      try {
        const response = await fetch(`/api/chambre/${chambreId}`,
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
        );
        const data = await response.json();
        setChambre(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la chambre:", error);
        setLoading(false);
      }
    };

    fetchChambreDetail();
  }, [chambreId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!chambre) {
    return <div>Chambre non trouvée</div>;
  }


  const settings = {
    dots: false,
    infinite: true,
    speed: 500, 
    slidesToShow: 1,
    slidesToScroll: 1, 
    arrows: true, 
  };


  const imageSuffixes = ['bath', 'detail', 'otherside'];

  return (
    <div className="container">
      <Header />
      <div className="right-side d-flex">
        <SidebarNavClient />
        <div className="content flex-grow-1 px-4">
          <h1 className="fs-4 fw-bold mb-4">Détails de la Chambre</h1>

          <div className="card">
            <div className="d-flex justify-content-between">
              <h2>{chambre.nom}</h2>
              <button
                className="btn-valider"
                onClick={() => window.history.back()}
              >
                <BiArrowBack /> Retour
              </button>
            </div>

            <div className="d-flex">
  <div className="image-slider">
    <Slider {...settings}>
      {/* Display the main chambre image without suffix */}
      <div>
        <img
          src={`/images/chambre${chambre.id}.jpg`} 
          alt={`Chambre ${chambre.nom}`}
          className="slide-image"
        />
      </div>
      
   
      {imageSuffixes.map((suffix, index) => (
        <div key={index}>
          <img
            src={`/images/chambre${chambre.id}${suffix}.jpg`}
            alt={`Chambre ${chambre.nom} ${suffix}`}
            className="slide-image"
          />
        </div>
      ))}
    </Slider>
  </div>

              <div className="details">
                <p><strong>Type :</strong> {chambre.type}</p>
                <p><strong>Capacité :</strong> {chambre.capacite} personnes</p>
                <p><strong>Étage :</strong> {chambre.etage}</p>
                <p><strong>Prix :</strong> {chambre.prix} DH</p>
                <p><strong>Description :</strong> Chambre confortable, lumineuse et soigneusement décorée, offrant un espace chaleureux avec un lit douillet, un coin bureau, et une belle vue sur l’extérieur.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChambreDetail;
