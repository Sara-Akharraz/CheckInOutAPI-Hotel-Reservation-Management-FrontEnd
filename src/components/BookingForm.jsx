import React, { useState } from "react";
import "../styles/FactureSuivi.css";
import "../styles/bookingForm.css";

const BookingForm = ({ types, onSubmit }) => {
  const [formData, setFormData] = useState({
    dateDebut: "",
    dateFin: "",
    capacite: "",
    type: "",
    etage: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formDataToSubmit = {
      ...formData,
      etage: formData.etage === "" ? "" : formData.etage,
    };
    onSubmit(e, formDataToSubmit);
  };

  return (
    <form onSubmit={handleFormSubmit} className="form-booking">
        <div style={{ display: "flex" }}>
      <div className="mb-3">
        <label htmlFor="dateDebut" className="form-label">Date de début :</label>
        <input
          type="date"
          name="dateDebut"
          id="dateDebut"
          className="form-control"
          value={formData.dateDebut}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date de fin :</label>
        <input
          type="date"
          name="dateFin"
          id="dateFin"
          className="form-control"
          value={formData.dateFin}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Capacité :</label>
        <input
          type="number"
          name="capacite"
          id="capacite"
          className="form-control"
          value={formData.capacite}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="type" className="form-label">Type :</label>
        <select
          name="type"
          id="type"
          className="custom-status-select"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">--- Tous ---</option>
          {types?.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="etage" className="form-label">Étage :</label>
        <select
          name="etage"
          id="etage"
          className="custom-status-select"
          value={formData.etage}
          onChange={handleChange}
        >
          <option value="">--- Tous ---</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>
      </div>
      
      <div>
    <button type="submit" className="btn">Rechercher</button>
    </div>
     
    </form>
  );
};

export default BookingForm;
