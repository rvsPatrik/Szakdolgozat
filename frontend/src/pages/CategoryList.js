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
            <button
              className="category-edit-btn"
              onClick={() => navigate(`/categories/${category.id}/edit`)}
            >
              Módosítás
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;