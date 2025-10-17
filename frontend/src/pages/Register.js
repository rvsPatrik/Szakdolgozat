import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!username.trim()) return 'Username is required.';
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email is invalid.';
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }

    try {
      await axios.post(`${API}/api/users/register/`, {
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
      });
      navigate('/login');
    } catch (err) {
      const payload = err.response?.data;
      if (payload && typeof payload === 'object') {
        const flat = Object.entries(payload)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
          .join(' | ');
        setError(flat || 'Registration failed');
      } else {
        setError(err.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create account</h2>
        {error && <div className="error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-row">
            <label>First name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" required />
          </div>

          <div className="form-row">
            <label>Last name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" required />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">Register</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>Back to login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
