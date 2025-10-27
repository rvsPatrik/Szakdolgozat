import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import './styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const role = getUserRole(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/products/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setProducts(Array.isArray(res.data) ? res.data : (res.data.results || [])))
    .catch(() => setProducts([]));
  }, []);

  const renderCategoryName = (product) => {
    if (!product) return '-';
    if (product.category_name) return product.category_name;
    if (product.category && typeof product.category === 'object') return product.category.name ?? '-';
    if (product.category) return String(product.category);
    return '-';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztos törölni szeretnéd ezt a terméket?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      console.error('Delete product error', err);
      alert('A termék törlése sikertelen volt.');
    }
  };

  return (
    <div className="product-list-container">
      <h2>Terméklista</h2>
      {role !== 'viewer' && (
        <Link to="/products/new" className="add-product-btn">➕ Új termék hozzáadása</Link>
      )}
      <div className="product-table-header">
        <div className="product-table-cell">Név</div>
        <div className="product-table-cell">Mennyiség</div>
        <div className="product-table-cell">Ár (Ft)</div>
        <div className="product-table-cell">Kategória</div>
        <div className="product-table-cell">EAN kód</div>
        <div className="product-table-cell"></div>
      </div>
      <div>
        {(products || []).map(product => (
          <div className="product-table-row" key={product.id}>
            <div className="product-table-cell">{product.name}</div>
            <div className="product-table-cell">{product.quantity}</div>
            <div className="product-table-cell">{product.price}</div>
            <div className="product-table-cell">{renderCategoryName(product)}</div>
            <div className="product-table-cell">{product.ean_code}</div>
            <div className="product-table-cell actions-cell">
              <button
                className="product-edit-btn"
                onClick={() => navigate(`/products/${product.id}/edit`)}
              >
                Módosítás
              </button>
              {role !== 'viewer' && (
                <button
                  className="product-delete-btn"
                  onClick={() => handleDelete(product.id)}
                  style={{ marginLeft: 8 }}
                >
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

export default ProductList;