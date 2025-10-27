import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/SupplyList.css';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

function SupplyList() {
  const [supplies, setSupplies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = getUserRole(localStorage.getItem('token'));

  useEffect(() => {
    const fetchSupplies = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await axios.get('http://localhost:8000/api/supplies/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSupplies(Array.isArray(res.data) ? res.data : res.data.results || []);
      } catch (err) {
        setError('Failed to load supplies');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchSupplies();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Biztos törölni szeretnéd ezt a beszállítást?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/supplies/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupplies(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      console.error('Delete supply error', err);
      alert('A beszállítás törlése sikertelen volt.');
    }
  };

  return (
    <div className="product-list-container"> {}
      <h2>Beszállítások</h2>

      {role !== 'viewer' && (
        <Link to="/supplies/new" className="add-btn">➕ Új beszállítás hozzáadása</Link>
      )}
      <div className="product-table-header">
        <div className="product-table-cell">Termék</div>
        <div className="product-table-cell">Beszállító</div>
        <div className="product-table-cell">Mennyiség</div>
        <div className="product-table-cell">Ár</div>
        <div className="product-table-cell">Dátum</div>
        <div className="product-table-cell">Megjegyzés</div>
        <div className="product-table-cell"></div>
      </div>

      {error && <div className="list-error">{error}</div>}

      <div className="product-list">
        {supplies.map(s => (
          <div className="product-table-row" key={s.id}>
            <div className="product-table-cell">{s.product_name || (s.product && s.product.name) || ''}</div>
            <div className="product-table-cell">{s.supplier_name || (s.supplier && s.supplier.name) || ''}</div>
            <div className="product-table-cell">{s.quantity ?? ''}</div>
            <div className="product-table-cell">{s.price != null ? Number(s.price).toFixed(2) : ''}</div>
            <div className="product-table-cell">{s.date_supplied || ''}</div>
            <div className="product-table-cell">{s.note || ''}</div>
            <div className="product-table-cell actions-cell">
              <button className="product-edit-btn" onClick={() => navigate(`/supplies/${s.id}/edit`)}>Módosítás</button>
              {role !== 'viewer' && (
                <button className="product-delete-btn" onClick={() => handleDelete(s.id)} style={{ marginLeft: 8 }}>
                  Törlés
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplyList;