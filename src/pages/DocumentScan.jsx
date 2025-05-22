import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SidebarNavClient from '../components/SideBarClient';
import '../styles/FactureSuivi.css';
import '../styles/bookingForm.css';
import '../styles/bootstrap-tables-only.css';

function DocumentScan() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [data, setData] = useState({ nom: '', prenom: '', cin: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationReussie, setValidationReussie] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier est trop volumineux.");
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError("Le fichier doit être une image.");
      return;
    }
    setImageFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('nom', data.nom);
    formData.append('prenom', data.prenom);
    formData.append('cin', data.cin);
    formData.append('type', 'CIN');

    try {
      const response = await fetch('http://localhost:8000/extract-doc-info', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setData(result.data || {});
      } else {
        setData(result);
        setError('');
      }
    } catch (err) {
      setError("Erreur lors de la communication avec l'API.");
    }
  };

  const handleValider = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('nom', data.nom);
      formData.append('prenom', data.prenom);
      formData.append('cin', data.cin);
      formData.append('type', 'CIN');

      const response = await fetch(`/api/check_in/validerScan?reservationId=${reservationId}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setError('');
        setMessage(result.message || 'Scan validé avec succès');
        setValidationReussie(true);
      } else {
        setError('Erreur lors de la validation du scan');
        setValidationReussie(false);
      }
    } catch (err) {
      setError('Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="right-side">
        <SidebarNavClient />
        <div className="content p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Scanner un Document</h2>

          <div className="flex">
            <div className="card p-4 border-r">
              <h3 className="text-lg font-semibold mb-2">Uploader votre carte</h3>
              {imageFile && (
                <div className="mb-4">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Aperçu"
                    className="w-full h-auto max-h-64 object-contain border"
                    style={{ width: '300px', height: '200px', objectFit: 'contain', borderRadius: '12px' }}
                  />
                </div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="card p-2 mb-4 w-full"
              />
              <button
                className="btn-valider px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                onClick={handleUpload}
              >
                Envoyer
              </button>
            </div>

            <div className="card form-booking p-4">
              <h3 className="text-lg font-semibold mb-2">Informations extraites</h3>

              {error && <div className="text-red-500 mb-2">{error}</div>}

              <div className="mb-2">
                <label>Type de document :</label>
                <input
                  type="text"
                  value="CIN"
                  readOnly
                  className="border w-full p-2 bg-gray-100"
                />
              </div>

              <div className="mb-2">
                <label>CIN :</label>
                <input
                  type="text"
                  value={data.cin}
                  readOnly={error !== "Impossible d'extraire correctement les informations"}
                  onChange={(e) => setData({ ...data, cin: e.target.value })}
                  className="border w-full p-2"
                />
              </div>

              <div className="mb-2">
                <label>Nom :</label>
                <input
                  type="text"
                  value={data.nom}
                  readOnly={error !== "Impossible d'extraire correctement les informations"}
                  onChange={(e) => setData({ ...data, nom: e.target.value })}
                  className="border w-full p-2"
                />
              </div>

              <div className="mb-2">
                <label>Prénom :</label>
                <input
                  type="text"
                  value={data.prenom}
                  readOnly={error !== "Impossible d'extraire correctement les informations"}
                  onChange={(e) => setData({ ...data, prenom: e.target.value })}
                  className="border w-full p-2"
                />
              </div>

             <button
  className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
  onClick={handleValider}
  disabled={loading}
>
  {loading ? 'Validation en cours...' : 'Valider'}
</button>

{validationReussie && (
  <>
    <p className="mt-4 text-green-600 text-center">{message}</p>

    <button
      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
      onClick={() => navigate(`/paiement/${reservationId}?type=checkin`)}
    >
      Payer
    </button>
      </>
               
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentScan;
