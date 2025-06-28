import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SupplyList = () => {
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    const fetchSupplies = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/supplies/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSupplies(response.data);
    };
    fetchSupplies();
  }, []);

  return (
    <div>
      <h2>Beszállítási rekordok</h2>
      <Link to="/supplies/new">➕ Új beszállítás rögzítése</Link>
      <ul>
        {supplies.map(supply => (
          <li key={supply.id}>
            {supply.date_supplied} – <strong>{supply.product_name}</strong> ({supply.quantity} db)<br />
            Beszállító: {supply.supplier_name}<br />
            {supply.note && <em>Megjegyzés: {supply.note}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplyList;