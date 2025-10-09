import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/Login.css';

function EditSupply() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [product, setProduct] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/products/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProducts(res.data));
    axios.get('http://localhost:8000/api/suppliers/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSuppliers(res.data));
    axios.get(`http://localhost:8000/api/supplies/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setProduct(res.data.product);
      setSupplier(res.data.supplier);
      setQuantity(res.data.quantity);
      setNote(res.data.note);
    })
    .catch(() => setError('Nem sikerült betölteni a beszállítást.'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/supplies/${id}/`, {
        product,
        supplier,
        quantity,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/supplies');
    } catch (err) {
      setError('Hiba történt a beszállítás módosításakor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Beszállítás szerkesztése</h2>
        <label>
          Termék:
          <select value={product} onChange={e => setProduct(e.target.value)} required>
            <option value="" disabled>Válassz terméket</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label>
          Beszállító:
          <select value={supplier} onChange={e => setSupplier(e.target.value)} required>
            <option value="" disabled>Válassz beszállítót</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label>
          Mennyiség:
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required />
        </label>
        <label>
          Megjegyzés:
          <textarea value={note} onChange={e => setNote(e.target.value)} />
        </label>
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div className="login-buttons">
          <button type="submit" className="login-btn">Mentés</button>
        </div>
      </form>
    </div>
  );
}

export default EditSupply;