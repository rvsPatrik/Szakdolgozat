import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import './styles/AdminSupplierManagement.css';

function AdminSupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = getUserRole(localStorage.getItem('token'));

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:8000/api/suppliers/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load suppliers');
        }
      }
    };
    fetchSuppliers();
  }, [navigate]);

  return (
    <div className="admin-supplier-container">
      <h2>Suppliers (Admin)</h2>

      <div className="admin-supplier-actions">
        <Link to="/admin/suppliers/new" className="add-supplier-btn">➕ Új beszállító hozzáadása</Link>
      </div>

      <div className="supplier-table-header">
        <div className="supplier-table-cell">Név</div>
        <div className="supplier-table-cell">Kapcsolattartó</div>
        <div className="supplier-table-cell">Telefon</div>
        <div className="supplier-table-cell">Email</div>
        <div className="supplier-table-cell">Cím</div>
        <div className="supplier-table-cell"></div>
      </div>

      {error && <div className="supplier-error">{error}</div>}

      <div className="supplier-list">
        {(suppliers || []).map(s => (
          <div className="supplier-table-row" key={s.id}>
            <div className="supplier-table-cell">{s.name || ''}</div>
            <div className="supplier-table-cell">{s.description || ''}</div> 
            <div className="supplier-table-cell">{s.phone || ''}</div>
            <div className="supplier-table-cell">{s.email || ''}</div>
            <div className="supplier-table-cell">{s.address || s.location || ''}</div>
            <button
              className="supplier-edit-btn"
              onClick={() => navigate(`/admin/suppliers/${s.id}/edit`)}
            >
              Módosítás
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSupplierManagement;