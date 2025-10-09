import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function ProductForm() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [ean_code, setEanCode] = useState('');
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
      await axios.post('http://localhost:8000/api/products/', {
        name,
        quantity,
        price,
        location,
        ean_code
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/products');
    } catch (err) {
      setError('Hiba történt a termék hozzáadásakor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Új termék hozzáadása</h2>
        <label>
          Név:
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Mennyiség:
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </label>
        <label>
          Ár:
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </label>
        <label>
          Hely:
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
        </label>
        <label>
          EAN kód:
          <input type="text" value={ean_code} onChange={e => setEanCode(e.target.value)} />
        </label>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div className="login-buttons">
          <button type="submit" className="login-btn">Hozzáadás</button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;