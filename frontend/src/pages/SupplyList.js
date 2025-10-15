import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/SupplyList.css';

function SupplyList() {
  const [supplies, setSupplies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/supplies/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setSupplies(Array.isArray(res.data) ? res.data : []))
    .catch(() => setSupplies([]));
  }, []);

  return (
    <div className="supply-list-container">
      <h2>Beszállítások</h2>
      <Link to="/supplies/new" className="add-supply-btn">➕ Új beszállítás hozzáadása</Link>
      <div className="supply-table-header">
        <div className="supply-table-cell">Termék</div>
        <div className="supply-table-cell">Mennyiség</div>
        <div className="supply-table-cell">Beszállító</div>
        <div className="supply-table-cell">Megjegyzés</div>
        <div className="supply-table-cell"></div>
      </div>
      <div>
        {(supplies || []).map(supply => (
          <div className="supply-table-row" key={supply.id}>
            <div className="supply-table-cell">{supply.product_name || supply.product}</div>
            <div className="supply-table-cell">{supply.quantity}</div>
            <div className="supply-table-cell">{supply.supplier_name || supply.supplier}</div>
            <div className="supply-table-cell">{supply.note}</div>
            <button
              className="supply-edit-btn"
              onClick={() => navigate(`/supplies/${supply.id}/edit`)}
            >
              Módosítás
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupplyList;