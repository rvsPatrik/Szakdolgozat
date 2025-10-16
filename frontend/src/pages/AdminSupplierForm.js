import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminSupplierForm({ initialData = null, mode = 'create' /* 'create' | 'edit' */ }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || initialData.contact_person || initialData.contact || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setAddress(initialData.address || initialData.location || '');
    }
  }, [initialData]);

  const submit = async (e) => {
    e && e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError('Not authenticated');
      return;
    }

    const payload = { name, description, phone, email, address };

    try {
      if (mode === 'create') {
        await axios.post('http://localhost:8000/api/suppliers/', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(`http://localhost:8000/api/suppliers/${initialData.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/admin/suppliers');
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data || err.message || 'Save failed');
      setLoading(false);
    }
  };

  return (
    <form className="admin-supplier-form" onSubmit={submit} style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 12 }}>
        <label>Név</label><br />
        <input value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Kapcsolattartó</label><br />
        <input value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label>Telefon</label><br />
          <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Cím</label><br />
        <input value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%' }} />
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{String(error)}</div>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={loading} style={{ background: '#1976d2', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6 }}>
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
        <button type="button" onClick={() => navigate('/admin/suppliers')} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AdminSupplierForm;
