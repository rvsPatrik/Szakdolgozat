import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { getUserRole } from './utils/auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const role = token ? getUserRole(token) : null;

  return (
    <BrowserRouter>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={token ? <Home role={role} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;