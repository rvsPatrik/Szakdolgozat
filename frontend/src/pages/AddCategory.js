import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Login.css';

function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/categories/', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/categories');
    } catch (err) {
      setError('Hiba történt a kategória hozzáadásakor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Új kategória hozzáadása</h2>
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
          <button type="submit" className="login-btn">Hozzáadás</button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;