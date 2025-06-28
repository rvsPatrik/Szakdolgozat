import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    ean_code: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8000/api/products/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/products');
    } catch (error) {
      alert('Hiba történt mentéskor');
    }
  };

  return (
    <div>
      <h2>Új termék hozzáadása</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Név" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" step="0.01" placeholder="Ár" value={form.price} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Mennyiség" value={form.quantity} onChange={handleChange} required />
        <input name="location" placeholder="Helyszín" value={form.location} onChange={handleChange} />
        <input name="ean_code" placeholder="EAN kód" value={form.ean_code} onChange={handleChange} />
        <textarea name="description" placeholder="Leírás" value={form.description} onChange={handleChange} />
        <button type="submit">Mentés</button>
      </form>
    </div>
  );
};

export default ProductForm;