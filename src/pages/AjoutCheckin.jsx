import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SidebarNav from '../components/SideBar';
import '../styles/bootstrap-tables-only.css';
import '../styles/FactureSuivi.css';

const AjoutCheckin = () => {
  const { id_reservation } = useParams();
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [passport, setPassport] = useState('');
  const [file, setFile] = useState(null);
  const [montant, setMontant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/facture/Montant_checkin`, { params: { id_reservation } })
      .then((res) => setMontant(res.data))
      .catch(() => setError('Erreur lors du chargement du montant'));

    axios.get(`/api/reservation/userinfo/${id_reservation}`)
      .then((res) => setUser(res.data))
      .catch(() => setError("Erreur lors du chargement des informations de l'utilisateur"));
  }, [id_reservation]);

  const extractInfoFromImage = async (selectedFile) => {
    if (!selectedFile || !type) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", type);

    try {
      const response = await axios.post('/api/check_in/extract-info', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { nom: extractedNom, prenom: extractedPrenom, cin: extractedCin } = response.data;

      if (extractedNom) setNom(extractedNom);
      if (extractedPrenom) setPrenom(extractedPrenom);
      if (type === 'CIN' && extractedCin) setCin(extractedCin);
      if (type === 'PASSPORT' && extractedCin) setPassport(extractedCin);

    } catch (err) {
      setError("Erreur lors de l'extraction des informations du document.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    extractInfoFromImage(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !nom || !prenom || !file) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (user) {
      if (nom !== user.name || prenom !== user.prenom) {
        alert("Le nom ou le prénom ne correspond pas aux informations de l'utilisateur.");
        return;
      }
      if (type === "CIN" && cin !== user.cin) {
        alert("Le CIN ne correspond pas à celui de l'utilisateur.");
        return;
      }
      if (type === "PASSPORT" && passport !== user.numeroPassport) {
        alert("Le numéro de passeport ne correspond pas à celui de l'utilisateur.");
        return;
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("id_reservation", id_reservation);
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("type", type);
    formData.append("cin", type === "CIN" ? cin : "");
    formData.append("passport", type === "PASSPORT" ? passport : "");
    formData.append("image", file);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);

    try {
      await axios.post("/api/check_in/ajoutercheckin", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/checkin");
    } catch (err) {
      setError("Erreur lors de l'ajout du check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNav />
        <div className="content flex-grow-1 p-4">
          <h1 className="fs-4 fw-bold mb-4">Ajouter un Check-in</h1>

          {montant !== null && (
            <div className="form" style={{ fontSize: "18px" }}>
              Montant Check-in : <strong>{montant.toFixed(2)} DH</strong>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form" style={{ justifyContent: "space-around" }}>
            <div className="col-md-7">
              <form onSubmit={handleSubmit} className="card ">
                <div className="mb-3">
                  <label className="form-label">Type de document *</label>
                  <select  className="custom-status-select "
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    
                    required
                  >
                    <option value="">-- Choisir --</option>
                    <option value="CIN">CIN</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                {type === "CIN" && (
                  <div className="mb-3">
                    <label className="form-label">CIN *</label>
                    <input
                      type="text"
                      value={cin}
                      onChange={(e) => setCin(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                {type === "PASSPORT" && (
                  <div className="mb-3">
                    <label className="form-label">Passport *</label>
                    <input
                      type="text"
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Image du document *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-valider"
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Valider"}
                </button>
              </form>
            </div>

            <div className="col-md-5">
              <div className="card">
              <h5 className="mb-6" style={{ fontSize: "18px" }}>Informations Utilisateur</h5>
                {user ? (
                  <>
                    <div className="mb-2">
                      <label className="form-label">Nom</label>
                      <input
                        type="text"
                        value={user.name || 'Non renseigné'}
                        className="form-control bg-light"
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Prénom</label>
                      <input
                        type="text"
                        value={user.prenom || 'Non renseigné'}
                        className="form-control bg-light"
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">CIN</label>
                      <input
                        type="text"
                        value={user.cin || 'Non renseigné'}
                        className="form-control bg-light"
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Numéro Passport</label>
                      <input
                        type="text"
                        value={user.numeroPassport || 'Non renseigné'}
                        className="form-control bg-light"
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <p>Chargement des informations de l'utilisateur...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjoutCheckin;
