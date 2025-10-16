import React from 'react';
import '../pages/styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';


function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = getUserRole(token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <nav className="navbar">
      <div className="navbar-section navbar-logo">
        <a href="/" className="navbar-logo-link">Warehouse</a>
      </div>
      <div className="navbar-section navbar-center">
        <ul className="navbar-links">
          <li><a href="/products">Products</a></li>
          <li><a href="/supplies">Supplies</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </div>
      <div className="navbar-section navbar-auth">
        {role === 'admin' &&(
          <button
            className="admin-btn"
            onClick={() => navigate('/admin')}
            style={{ marginRight: '1rem' }}
          >
            Admin
          </button>
        )}
        {token ? (
          <button className="navbar-logout" onClick={handleLogout}>Logout</button>
        ) : (
          <a href="/login">
            <button className="navbar-logout">Login</button>
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;