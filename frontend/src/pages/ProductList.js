import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import ListItemCard from '../components/ListItemCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const role = getUserRole(localStorage.getItem('token'));
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/products/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(Array.isArray(response.data) ? response.data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h2>Terméklista</h2>
      {role !== 'viewer' && (
        <Link to="/products/new" className="add-item-btn">➕ Új termék hozzáadása</Link>
      )}
      <div className="list-header-row">
        <div className="list-header-cell">Név</div>
        <div className="list-header-cell">Mennyiség</div>
        <div className="list-header-cell">Ár</div>
        <div className="list-header-cell">Hely</div>
        <div className="list-header-cell">EAN kód</div>
      </div>
      <div>
        {(products || []).map(product => (
          <ListItemCard
            key={product.id}
            data={[
              product.name,
              product.quantity,
              product.price,
              product.location,
              product.ean_code
            ]}
            onEdit={() => navigate(`/products/${product.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;