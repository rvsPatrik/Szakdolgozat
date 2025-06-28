import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
    } catch {
      alert("Hibás bejelentkezés");
    }
  };

  return (
    <form onSubmit={login}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Felhasználónév" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Jelszó" />
      <button type="submit">Bejelentkezés</button>
    </form>
  );
};

export default Login;
