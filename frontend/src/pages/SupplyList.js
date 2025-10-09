import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ListItemCard from '../components/ListItemCard';

function SupplyList() {
  const [supplies, setSupplies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/supplies/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setSupplies(Array.isArray(res.data) ? res.data : []);
    })
    .catch(() => setSupplies([]));
  }, []);

  return (
    <div>
      <h2>Beszállítások</h2>
      <Link to="/supplies/new" className="add-item-btn">➕ Új beszállítás hozzáadása</Link>
      <div className="list-header-row">
        <div className="list-header-cell">Termék</div>
        <div className="list-header-cell">Mennyiség</div>
        <div className="list-header-cell">Beszállító</div>
        <div className="list-header-cell">Megjegyzés</div>
      </div>
      <div>
        {(supplies || []).map(supply => (
          <ListItemCard
            key={supply.id}
            data={[
              supply.product_name || supply.product,
              supply.quantity,
              supply.supplier_name || supply.supplier,
              supply.note
            ]}
            onEdit={() => navigate(`/supplies/${supply.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
}

export default SupplyList;