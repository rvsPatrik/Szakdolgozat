import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditSupply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supply, setSupply] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [product, setProduct] = useState('');
  const [supplier, setSupplier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const load = async () => {
      try {
        const [sRes, pRes, supRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/supplies/${id}/`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/products/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8000/api/suppliers/', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setSupply(sRes.data);
        setProducts(Array.isArray(pRes.data) ? pRes.data : pRes.data.results || []);
        setSuppliers(Array.isArray(supRes.data) ? supRes.data : supRes.data.results || []);
        setProduct(sRes.data.product || sRes.data.product_id || sRes.data.product);
        setSupplier(sRes.data.supplier || sRes.data.supplier_id || sRes.data.supplier);
        setQuantity(sRes.data.quantity ?? '');
        setPrice(sRes.data.price != null ? String(sRes.data.price) : '');
        setNote(sRes.data.note || '');
      } catch (err) {
        setError('Failed to load supply data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/supplies/${id}/`, {
        product,
        supplier,
        quantity,
        price: price === '' ? null : Number(price),
        note
      }, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/supplies');
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '1.5rem auto', padding: '0 1rem' }}>
      <h2>Beszállítás szerkesztése</h2>

      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 12 }}>
          <label>Termék</label><br />
          <select value={product} onChange={e => setProduct(e.target.value)} required style={{ width: '100%' }}>
            <option value="">-- válassz --</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Beszállító</label><br />
          <select value={supplier} onChange={e => setSupplier(e.target.value)} required style={{ width: '100%' }}>
            <option value="">-- válassz --</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>Mennyiség</label><br />
            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min="0" required />
          </div>
          <div>
            <label>Ár</label><br />
            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Megjegyzés</label><br />
          <input value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" style={{ background: '#1976d2', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6 }}>Save</button>
          <button type="button" onClick={() => navigate('/supplies')} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditSupply;
