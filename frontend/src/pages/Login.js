import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';
import axios from 'axios';


function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/users/token/', {
        username,
        password,
      });

      const token = res.data?.access || res.data?.token || res.data?.access_token;
      if (!token) {
        throw new Error('No token returned from server');
      }

      localStorage.setItem('token', token);
      if (setToken) setToken(token);
      navigate('/home');
    } catch (err) {
      const payload = err.response?.data;
      let message = 'Hibás bejelentkezés';

      if (payload) {
        if (typeof payload === 'string') {
          message = payload;
        } else if (payload.detail) {
          message = payload.detail;
        } else if (payload.non_field_errors) {
          message = Array.isArray(payload.non_field_errors)
            ? payload.non_field_errors.join(' ')
            : String(payload.non_field_errors);
        } else {
          const flat = Object.entries(payload)
            .map(([k, v]) => (Array.isArray(v) ? v.join(' ') : String(v)))
            .join(' | ');
          if (flat) message = flat;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
      alert(message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <div className="login-buttons">
          <button type="submit" className="login-btn">Login</button>
          <button type="button" className="register-btn" onClick={handleRegisterRedirect}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
