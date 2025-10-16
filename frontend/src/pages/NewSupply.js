import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/SupplyForm.css';
import ProductPicker from '../components/ProductPicker'


function NewSupply() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [product, setProduct] = useState('');
  const [productId, setProductId] = useState(null);
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          axios.get('http://localhost:8000/api/products/', { headers: { Authorization: `Bearer ${token}` } })
            .catch(() => ({ data: [] })),
          axios.get('http://localhost:8000/api/suppliers/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProducts(Array.isArray(pRes.data) ? pRes.data : pRes.data.results || []);
        setSuppliers(Array.isArray(sRes.data) ? sRes.data : sRes.data.results || []);
      } catch (err) {
        setError('Failed to load products or suppliers');
      }
    };
    load();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) { setError('Not authenticated'); return; }

    try {
      await axios.post('http://localhost:8000/api/supplies/', {
        product_name: product,
        supplier,
        quantity,
        price: price === '' ? null : Number(price),
        note
      }, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/supplies');
    } catch (err) {
      const resp = err.response?.data;
      let msg = '';
      if (resp) {
        if (typeof resp === 'string') {
          msg = resp;
        } else if (resp.detail) {
          msg = resp.detail;
        } else if (typeof resp === 'object') {
          msg = Object.entries(resp)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
            .join(' | ');
        } else {
          msg = JSON.stringify(resp);
        }
      } else {
        msg = err.message || 'Save failed';
      }
      setError(msg);
    }
  };

  return (
    <div className="supply-form-wrapper">
      <h2>Új beszállítás</h2>
      {error && <div className="error">{String(error)}</div>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="supply-form-row">
          <div style={{ position: 'relative' }}>
            <label>Termék (név)</label>
            <ProductPicker
              initialName={product}
              placeholder="Termék neve"
              products={products}                
              onChange={({ id, name }) => {
                setProduct(name || '');
                setProductId(id || null);
              }}
            />
          </div>

          <div>
            <label>Beszállító</label>
            <select value={supplier} onChange={e => setSupplier(e.target.value)} required>
              <option value="">-- válassz --</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>


        <div className="supply-form-row">
          <div>
            <label>Mennyiség</label>
            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="0" required />
          </div>
          <div>
            <label>Ár</label>
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
          </div>
        </div>

        <div className="supply-form-row single">
          <div>
            <label>Megjegyzés</label>
            <input value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        <div className="supply-form-actions">
          <button type="submit" className="btn-primary">Create</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/supplies')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default NewSupply;
