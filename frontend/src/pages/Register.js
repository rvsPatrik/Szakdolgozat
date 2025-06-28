import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
      navigate('/login');
    } catch (error) {
      alert('Hiba történt a regisztráció során.');
    }
  };

  return (
    <div>
      <h2>Regisztráció</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Felhasználónév" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Jelszó" value={form.password} onChange={handleChange} required />
        <button type="submit">Regisztrálok</button>
      </form>
    </div>
  );
};

export default Register;