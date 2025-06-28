import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const role = getUserRole(localStorage.getItem('token'));
  
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/products/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Biztosan törölni szeretnéd ezt a terméket?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      alert('Hiba történt a törlés során');
    }
  };

  return (
    <div>
      <h2>Terméklista</h2>
      {role === 'admin' && (
        <Link to="/products/new">➕ Új termék hozzáadása</Link>
      )}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong><br />
            {product.quantity} db – {product.price} Ft<br />
            Hely: {product.location || '-'}<br />
            EAN: {product.ean_code || 'nincs megadva'}<br />
            <Link to={`/products/${product.id}/edit`}>✏️ Szerkesztés</Link>
            {' | '}
            <button onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>🗑️ Törlés</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;