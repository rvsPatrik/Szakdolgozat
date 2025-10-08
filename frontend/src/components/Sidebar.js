import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const menuItems = [
  { path: '/', label: 'Főoldal', icon: '🏠' },
  { path: '/products', label: 'Termékek', icon: '📦' },
  { path: '/categories', label: 'Kategóriák', icon: '🗂️' },
  { path: '/suppliers', label: 'Beszállítók', icon: '🚚' },
  { path: '/supplies', label: 'Beszállítások', icon: '📥' },
  { path: '/supplies/new', label: 'Új beszállítás', icon: '➕' },
  { path: '/logout', label: 'Kijelentkezés', icon: '🚪' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
