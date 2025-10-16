import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!email.trim()) return 'Email is required.';
    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email is invalid.';
    if (!username.trim()) return 'Username is required.';
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
      const msg = err.response?.data || err.message;
      // normalize serializer errors (object) into a string
      if (typeof msg === 'object') {
        const flat = Object.entries(msg).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`).join(' | ');
        setError(flat || 'Registration failed');
      } else {
        setError(String(msg));
      }
    }
  };

  return (
    <div className="login-page">
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <label>First name</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" required />

        <label>Last name</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" required />

        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />

        <div style={{ marginTop: 12 }}>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
export default Register;