import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/UserManageAdmin.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function UserManageAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : null;

  useEffect(() => {
    loadUsers();
    
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');
    if (!headers) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/api/users/`, { headers });
      const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setUsers(list);
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.error
        || (typeof err.response?.data === 'string' && err.response?.data)
        || err.message;
      setError('Failed to load users: ' + String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <h2>User management (admins)</h2>
      {error && <div className="error">{error}</div>}

      {loading ? (
        <div>Loading users…</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Role / is_staff</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{[u.first_name, u.last_name].filter(Boolean).join(' ')}</td>
                <td>{u.email}</td>
                <td>
                  {u.role ?? (u.is_staff ? 'admin/editor' : 'viewer')}
                </td>
                <td>{u.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => navigate(`/admin/users/${u.id}/edit`)}>
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}