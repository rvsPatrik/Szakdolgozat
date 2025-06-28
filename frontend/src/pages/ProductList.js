import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(response.data);
    };
    fetchData();
  }, []);

     return (
    <div>
      <h2>Terméklista</h2>
      <Link to="/products/new">➕ Új termék hozzáadása</Link>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong><br />
            {product.quantity} db – {product.price} Ft<br />
            Hely: {product.location || '-'}<br />
            EAN: {product.ean_code || 'nincs megadva'}<br />
            <Link to={`/products/${product.id}/edit`}>✏️ Szerkesztés</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProductList;
