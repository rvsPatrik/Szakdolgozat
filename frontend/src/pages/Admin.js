import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Admin.css';

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <div className="admin-menu-bar">
        <button className="admin-menu-btn" onClick={() => navigate('/admin/users')}>users</button>
        <button className="admin-menu-btn" onClick={() => navigate('/admin/suppliers')}>suppliers</button>
        <button className="admin-menu-btn" onClick={() => navigate('/admin/sql')}>sql query</button>
      </div>
      {/* Ide jön majd a tartalom */}
    </div>
  );
}

export default Admin;   