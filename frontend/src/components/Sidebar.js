import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close" onClick={toggleSidebar}>×</button>
        <ul>
          <li><Link to="/">🏠 Főoldal</Link></li>
          <li><Link to="/products">📦 Termékek</Link></li>
          <li><Link to="/categories">🗂️ Kategóriák</Link></li>
          <li><Link to="/suppliers">🚚 Beszállítók</Link></li>
          <li><Link to="/supplies">📥 Beszállítások</Link></li>
          <li><Link to="/supplies/new">➕ Új beszállítás</Link></li>
          <li><Link to="/logout">🚪 Kijelentkezés</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;