import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/categories/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Kategóriák</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <strong>{cat.name}</strong><br />
            {cat.description || 'Nincs leírás'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;