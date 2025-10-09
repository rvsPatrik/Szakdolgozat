import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ListItemCard from '../components/ListItemCard';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8000/api/categories/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    })
    .catch(() => setCategories([]));
  }, []);

  return (
    <div>
      <h2>Kategóriák</h2>
      <Link to="/categories/new" className="add-item-btn">➕ Új kategória hozzáadása</Link>
      <div className="list-header-row">
        <div className="list-header-cell">Név</div>
        <div className="list-header-cell">Leírás</div>
      </div>
      <div>
        {(categories || []).map(category => (
          <ListItemCard
            key={category.id}
            data={[category.name, category.description]}
            onEdit={() => navigate(`/categories/${category.id}/edit`)}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryList;