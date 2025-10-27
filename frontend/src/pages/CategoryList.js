import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/CategoryList.css';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/categories/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
    .catch(() => setCategories([]));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Biztos törölni szeretnéd ezt a kategóriát?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      console.error('Delete category error', err);
      const msg = err.response?.data?.detail || 'A kategória törlése sikertelen volt.';
      alert(msg);
    }
  };

  return (
    <div className="category-list-container">
      <h2>Kategóriák</h2>
      <Link to="/categories/new" className="add-category-btn">➕ Új kategória hozzáadása</Link>
      <div className="category-table-header">
        <div className="category-table-cell">Név</div>
        <div className="category-table-cell">Leírás</div>
        <div className="category-table-cell"></div>
      </div>
      <div>
        {(categories || []).map(category => (
          <div className="category-table-row" key={category.id}>
            <div className="category-table-cell">{category.name}</div>
            <div className="category-table-cell">{category.description}</div>
            <div className="category-table-cell actions-cell">
              <button
                className="category-edit-btn"
                onClick={() => navigate(`/categories/${category.id}/edit`)}
              >
                Módosítás
              </button>
              <button
                className="category-delete-btn"
                onClick={() => handleDelete(category.id)}
                style={{ marginLeft: 8 }}
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;