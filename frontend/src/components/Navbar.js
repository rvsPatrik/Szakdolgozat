import React from 'react';
import '../pages/styles/Navbar.css';



function Navbar({ onLogout, token }) {
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
        </ul>
      </div>
      <div className="navbar-section navbar-auth">
        {token ? (
          <button className="navbar-logout" onClick={onLogout}>Logout</button>
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