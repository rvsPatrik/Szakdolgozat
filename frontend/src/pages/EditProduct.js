import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    ean_code: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm(response.data);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/products/${id}/`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/products');
    } catch (error) {
      alert('Hiba történt mentéskor');
    }
  };

  return (
    <div>
      <h2>Termék szerkesztése</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Név" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" step="0.01" placeholder="Ár" value={form.price} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Mennyiség" value={form.quantity} onChange={handleChange} required />
        <input name="location" placeholder="Helyszín" value={form.location} onChange={handleChange} />
        <input name="ean_code" placeholder="EAN kód" value={form.ean_code || ''} onChange={handleChange} />
        <textarea name="description" placeholder="Leírás" value={form.description} onChange={handleChange} />
        <button type="submit">Mentés</button>
      </form>
    </div>
  );
};

export default EditProduct;