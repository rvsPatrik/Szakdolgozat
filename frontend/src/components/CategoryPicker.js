import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/styles/CategoryPicker.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function CategoryPicker({ value = null, onChange, allowNullLabel = 'Nincs kategória' }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    axios.get(`${API}/api/categories/`, { headers })
      .then(res => {
        if (!mounted) return;
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setCategories(list);
      })
      .catch(() => {
        if (!mounted) return;
        setCategories([]);
        setError('Nem sikerült betölteni a kategóriákat');
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  return (
    <div className="category-picker">
      <label className="field-label">Kategória</label>

      <select
        className="category-select input-like"
        value={value == null ? '' : String(value)}
        onChange={e => {
          const v = e.target.value === '' ? null : Number(e.target.value);
          onChange && onChange(v);
        }}
      >
        <option value="">{allowNullLabel}</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {loading && <div className="small-muted">Betöltés…</div>}
      {!loading && categories.length === 0 && <div className="small-muted">{error || 'Nincsenek kategóriák'}</div>}
    </div>
  );
}