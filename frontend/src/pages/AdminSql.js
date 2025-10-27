import React, { useState } from 'react';
import axios from 'axios';
import './styles/Admin.css';

function AdminSql() {
  const [query, setQuery] = useState('SELECT * FROM products_product LIMIT 50');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [modeWrite, setModeWrite] = useState(false);

  const token = localStorage.getItem('token');

  const toggleMode = () => {
    if (!modeWrite) {
      if (!window.confirm('Enable WRITE mode? This allows modifying data.')) return;
    }
    setError('');
    setModeWrite(!modeWrite);
  };

  const runQuery = async () => {
    setError('');
    setResult(null);
    if (!token) { setError('Not authenticated'); return; }

    try {
      const res = await axios.post('http://localhost:8000/api/admin/sql/', { query, mode: modeWrite ? 'write' : 'read' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div className="admin-sql-page" style={{ maxWidth: 1100, margin: '2rem auto' }}>
      <h2>Admin SQL</h2>
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={modeWrite}
            onChange={toggleMode}
          />
          {' '}Allow write (use with care)
        </label>
        <button onClick={runQuery} style={{ marginLeft: 12 }}>
          Run
        </button>
      </div>
      <textarea value={query} onChange={e => setQuery(e.target.value)} rows={8}
        style={{ width: '100%', boxSizing: 'border-box' }} />
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {result && result.columns && (
        <div style={{ overflowX: 'auto', marginTop: 12 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead><tr>{result.columns.map(c => <th key={c} style={{ border: '1px solid #ddd', padding: 6 }}>{c}</th>)}</tr></thead>
            <tbody>{result.rows.map((r,i)=>(<tr key={i}>{r.map((cell,j)=>(<td key={j} style={{ border: '1px solid #eee', padding: 6 }}>{String(cell)}</td>))}</tr>))}</tbody>
          </table>
        </div>
      )}
      {result && result.rows_affected !== undefined && <div style={{ marginTop: 12 }}>Rows affected: {result.rows_affected}</div>}
    </div>
  );
}

export default AdminSql;