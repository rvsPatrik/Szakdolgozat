import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home({ role }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:8000/api/users/me/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUsername(res.data.username);
    })
    .catch(() => {
      setUsername('');
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Üdvözöl a Raktárkezelő Rendszer!</h1>
      <p>Felhasználó: {username}</p>
      <p>Bejelentkezett szerepkör: <strong>{role}</strong></p>
      {role === 'viewer' && (
        <div style={{ marginTop: '2rem', color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
          Contact an admin for verification!
        </div>
      )}
    </div>
  );
}

export default Home;