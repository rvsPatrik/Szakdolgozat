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
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      const token = response.data.token;
      if (token){
        setToken(token);
        localStorage.setItem('token', token);
        navigate('/products');
      }
      else{
        setError('Hibás bejelentkezés');
      }
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
      navigate('/home');
    } catch (err){
      alert("Hibás bejelentkezés");
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
