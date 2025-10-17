import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductForm from './ProductForm';
import './styles/ProductList.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      if (mounted) {
        setError('Nincs bejelentkezve.');
        setLoading(false);
      }
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API}/api/products/${id}/`, { headers })
      .then(res => {
        if (!mounted) return;
        setProduct(res.data);
      })
      .catch(err => {
        if (!mounted) return;
        const msg = err.response?.data?.detail || err.response?.data || err.message;
        setError(String(msg));
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="product-list-container">Betöltés…</div>;
  if (error) return <div className="product-list-container"><div className="error">{error}</div></div>;
  if (!product) return <div className="product-list-container">A termék nem található.</div>;

  return (
    <div className="product-list-container">
      <ProductForm product={product} onSaved={null} />
    </div>
  );
}