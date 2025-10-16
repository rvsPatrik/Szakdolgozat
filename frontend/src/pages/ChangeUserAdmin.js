import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/UserManageAdminForm.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
];

export default function ChangeUserAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : null;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (!headers) { setError('Not authenticated'); setLoading(false); return; }
    let mounted = true;
    setLoading(true);
    axios.get(`${API}/api/users/${id}/`, { headers })
      .then(res => { if (mounted) setUser(res.data); })
      .catch(err => {
        const msg = err.response?.data || err.message;
        if (mounted) setError('Failed to load user: ' + String(msg));
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]); // eslint-disable-line

  function updateField(field, value) {
    setUser(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!headers) { setError('Not authenticated'); return; }
    if (!user) return;
    setSaving(true);
    setError('');
    const payload = {
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email ?? '',
      is_active: !!user.is_active,
      role: user.role ?? (user.is_staff ? 'admin' : 'viewer'),
    };
    try {
      await axios.patch(`${API}/api/users/${id}/`, payload, { headers });
      navigate('/admin/users');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data || err.message;
      setError('Save failed: ' + String(msg));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetPassword() {
    setPwError('');
    if (!pw || pw.length < 6) { setPwError('Password must be at least 6 characters'); return; }
    if (!headers) { setPwError('Not authenticated'); return; }
    try {
      await axios.post(`${API}/api/users/${id}/set_password/`, { password: pw }, { headers });
      setPw('');
      setPwError('');
      setError('Password changed');
    } catch (err) {
      const msg = err.response?.data || err.message;
      setPwError('Change failed: ' + String(msg));
    }
  }

  if (loading) return <div className="admin-page">Loading…</div>;
  if (!user) return <div className="admin-page">{error ? <div className="error">{error}</div> : 'User not found'}</div>;

  return (
    <div className="admin-page">
      <h2>Edit user "{user.username}"</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSave} className="user-edit-form">
        <div className="form-row">
          <label>Username</label>
          <div>{user.username}</div>
        </div>

        <div className="form-row">
          <label>First name</label>
          <input value={user.first_name ?? ''} onChange={e => updateField('first_name', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Last name</label>
          <input value={user.last_name ?? ''} onChange={e => updateField('last_name', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input value={user.email ?? ''} onChange={e => updateField('email', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Role</label>
          <select
            value={user.role ?? (user.is_staff ? 'admin' : 'viewer')}
            onChange={e => updateField('role', e.target.value)}
          >
            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Active</label>
          <input type="checkbox" checked={!!user.is_active} onChange={e => updateField('is_active', e.target.checked)} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" onClick={() => navigate('/admin/users')}>Cancel</button>
        </div>
      </form>

      <hr />

      <div className="pw-section">
        <h3>Change password</h3>
        {pwError && <div className="error">{pwError}</div>}
        <input type="password" placeholder="New password" value={pw} onChange={e => setPw(e.target.value)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleSetPassword}>Set password</button>
        </div>
      </div>
    </div>
  );
}