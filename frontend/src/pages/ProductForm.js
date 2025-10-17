import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import CategoryPicker from '../components/CategoryPicker';

function ProductForm({ product = null, onSaved = null }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [ean_code, setEanCode] = useState('');
  const [categoryId, setCategoryId] = useState(null); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!product) return;
    setName(product.name ?? '');
    setQuantity(product.quantity ?? '');
    setPrice(product.price ?? '');
    setLocation(product.location ?? '');
    setEanCode(product.ean_code ?? '');
    const initialCategory = product.category ?? (product.category && product.category.id) ?? product.category_id ?? null;
    setCategoryId(initialCategory === undefined ? null : initialCategory);
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const payload = {
      name,
      quantity: quantity === '' ? null : Number(quantity),
      price: price === '' ? null : Number(price),
      location,
      ean_code,
      category: categoryId,
    };

    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (product && product.id) {
        await axios.patch(`http://localhost:8000/api/products/${product.id}/`, payload, { headers });
        onSaved?.();
        navigate('/products');
      } else {
        await axios.post('http://localhost:8000/api/products/', payload, { headers });
        onSaved?.();
        navigate('/products');
      }
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Hiba történt a termék mentésekor.';
      if (data) {
        if (typeof data === 'string') msg = data;
        else if (data.detail) msg = data.detail;
        else {
          const flat = Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
            .join(' | ');
          if (flat) msg = flat;
        }
      } else if (err.message) msg = err.message;
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{product && product.id ? 'Termék szerkesztése' : 'Új termék hozzáadása'}</h2>

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

        <div style={{ marginTop: 8, marginBottom: 6 }}>
          <CategoryPicker value={categoryId} onChange={setCategoryId} allowNullLabel="Nincs kategória" />
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

        <div className="login-buttons">
          <button type="submit" className="login-btn">{product && product.id ? 'Mentés' : 'Hozzáadás'}</button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;