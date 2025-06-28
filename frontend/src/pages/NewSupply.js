import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewSupply = () => {
  const [form, setForm] = useState({
    supplier: '',
    product: '',
    quantity: '',
    note: '',
  });

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [productRes, supplierRes] = await Promise.all([
        axios.get('http://localhost:8000/api/products/', config),
        axios.get('http://localhost:8000/api/suppliers/', config)
      ]);
      setProducts(productRes.data);
      setSuppliers(supplierRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8000/api/supplies/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/supplies');
    } catch (error) {
      alert('Hiba történt mentés közben');
    }
  };

  return (
    <div>
      <h2>Új beszállítás rögzítése</h2>
      <form onSubmit={handleSubmit}>
        <select name="supplier" value={form.supplier} onChange={handleChange} required>
          <option value="">Válassz beszállítót</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select name="product" value={form.product} onChange={handleChange} required>
          <option value="">Válassz terméket</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input name="quantity" type="number" placeholder="Mennyiség" value={form.quantity} onChange={handleChange} required />
        <textarea name="note" placeholder="Megjegyzés" value={form.note} onChange={handleChange} />

        <button type="submit">Rögzítés</button>
      </form>
    </div>
  );
};

export default NewSupply;