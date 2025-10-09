import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../pages/styles/Login.css';

function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:8000/api/categories/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setName(res.data.name);
      setDescription(res.data.description);
    })
    .catch(() => setError('Nem sikerült betölteni a kategóriát.'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/categories/${id}/`, { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/categories');
    } catch (err) {
      setError('Hiba történt a kategória módosításakor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Kategória szerkesztése</h2>
        <label>
          Kategória neve:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Leírás:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            style={{ minHeight: '60px', marginTop: '0.5rem' }}
          />
        </label>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div className="login-buttons">
          <button type="submit" className="login-btn">Mentés</button>
        </div>
      </form>
    </div>
  );
}

export default EditCategory;