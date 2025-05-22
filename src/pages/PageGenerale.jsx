import React, { useState,useEffect } from 'react';
import '../styles/PageGenerale.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';



const HeaderGeneral = () => (
  <header className="HeaderGeneral">
    <div className="logoH">
    <img src="/images/Logo.png" alt="Logo Hôtel" />
    </div>
    <div className="buttons">
      <button className="button">S'inscrire</button>
      <button className="button">Login</button>
    </div>
  </header>
);

const PanoramaSection = () => {
  const media = [
    { src: "/images/video1.mp4" },
    { src: "/images/arbre.mp4" },
    { src: "/images/video2.mp4" },
    { src: "/images/forest.mp4" },
    { src: "/images/water.mp4" },
    { src: "/images/nature.mp4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, [media.length]);

  return (
    <section className="panorama-section">
      {media.map((item, index) => (
        <div
          key={index}
          className={`panorama-slide ${index === currentIndex ? "visible" : ""}`}
        >
          <video
            src={item.src}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      ))}

      <div className="panorama-overlay">
        <h1 className="logo-panorama">
          <img src="/images/Logo.png" alt="Logo Hôtel" />
        </h1>
        <p className="panorama-subtitle">Un havre de paix au cœur de la nature</p>
      </div>
    </section>
  );
};

const WelcomeSection = () => {
  return (
    <section className="welcome-section">
      <div className="welcome-container">
        <img src="/images/panoramaviewemensemble.jpg" alt="Nature" className="welcome-image" />
        <div className="welcome-text">
          <h2 className="welcome-title">Bienvenue !</h2>
          <p>
            Nous sommes ravis que nos chemins se soient croisés.<br />
            Dans notre Hotel,<strong> votre seconde maison</strong>, nous laissons la nature montrer la voie : des espaces pensés pour faire entrer l’extérieur à l’intérieur, et un séjour placé sous le signe du bien-être naturel, de belles surprises, de nouvelles expériences, de routines réinventées et d’une sérénité absolue.

          </p>
        </div>
      </div>
    </section>
  );
};
const FeaturesSection = () => {
  const features = [
    { title: "L’Art du Yoga", desc: "Un Voyage Intérieur", image: "/images/yoga1.jpg" },
    { title: "Chaque Pas Compte", desc: "Marcher au Rythme de la Nature", image: "/images/hiking.jpg" },
    { title: "Un Parc, Mille Émotions", desc: "Le Royaume des Petits Aventuriers", image: "/images/kid-park.jpg" },
    { title: "Le Goût du Naturel", desc: "Saveurs Authentiques de la Terre", image: "/images/food1.jpg" },
    { title: "Un Parking Pensé pour Demain", desc: "Votre Voiture entre de Bonnes Mains", image: "/images/parking.jpg" },
    { title: "Mosquée Ar-Rahma", desc: "Lumière et Sérénité", image: "/images/salat.jpg" },
  ];

  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((current + 1) % features.length);
  const prevSlide = () => setCurrent((current - 1 + features.length) % features.length);

  return (
    <section className="features-section">
      {/* <h2 className="section-title">Caractéristiques</h2> */}
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${current * 100}%)` }}>
          {features.map((feature, i) => (
            <div key={i} className="slide feature-slide">
              <img src={feature.image} alt={feature.title} className="feature-image" />
              <div className="feature-overlay">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={prevSlide} className="slider-button left">←</button>
        <button onClick={nextSlide} className="slider-button right">→</button>
      </div>
    </section>
  );
};

const ReviewsSection = () => (
  <section className="reviews-section py-16 px-4 bg-gray-100">
    {/* <h2 className="reviews-section-title text-3xl font-semibold text-center mb-10">
      Avis de Nos Visiteurs
    </h2> */}
    <div className="reviews-grid grid gap-8 md:grid-cols-3">
      {[
        { text: "Un séjour inoubliable!", author: "Sara" },
        { text: "Randonnées à couper le souffle.", author: "Hasna" },
        { text: "Cuisine exceptionnelle et personnel chaleureux.", author: "Sophie" },
      ].map((review, i) => (
        <div
          key={i}
          className="review bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 animate-fadeIn opacity-0 animate-delay"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <p className="review-text text-lg italic mb-4">“{review.text}”</p>
          <p className="review-author text-right text-sm text-gray-600">— {review.author}</p>
        </div>
      ))}
    </div>
  </section>
);

const InfoSection = () => (
  <section className="info-section py-16 px-4 bg-gray-900 text-white font-sans">
    <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-12">
      Informations de l'Hôtel
    </h2>
    <div className="info-content max-w-2xl mx-auto space-y-6 text-center">
      <p className="flex items-center justify-center gap-2">
        <FaMapMarkerAlt className="text-teal-400 text-xl" aria-hidden="true" />
        123 Chemin de la Forêt, Natureville, Maroc
      </p>
      <p className="flex items-center justify-center gap-2">
        <FaPhone className="text-teal-400 text-xl" aria-hidden="true" />
        +212 6 23 45 67 89
      </p>
      <p className="flex items-center justify-center gap-2">
        <FaEnvelope className="text-teal-400 text-xl" aria-hidden="true" />
        contact@hotelnature.fr
      </p>
      <p className="flex items-center justify-center gap-2">
        <FaClock className ="undisclosed text-xl" aria-hidden="true" />
        Réception ouverte 24h/24, 7j/7
      </p>
       <footer class="footer">
      © 2025 Hotel. Tous droits réservés.
    </footer>

    </div>
  </section>
);

const GeneralPage = () => (
  <div className="general-page">
    <HeaderGeneral />
    <PanoramaSection />
    <WelcomeSection />
  <FeaturesSection/>

    <ReviewsSection />
    <InfoSection />
  </div>
);

export default GeneralPage;