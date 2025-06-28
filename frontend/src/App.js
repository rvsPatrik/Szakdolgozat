import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { getUserRole } from './utils/auth';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import EditProduct from './pages/EditProduct';
import SupplyList from './pages/SupplyList';
import NewSupply from './pages/NewSupply';
import CategoryList from './pages/CategoryList';
import Register from './pages/Register';



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
        <Route path="/products" element={token ? <ProductList /> : <Navigate to="/login" />} />
        <Route path="/products/new" element={token ? <ProductForm /> : <Navigate to="/login" />} />
        <Route path="/products/:id/edit" element={token ? <EditProduct /> : <Navigate to="/login" />} />
        <Route path="/supplies" element={token ? <SupplyList /> : <Navigate to="/login" />} />
        <Route path="/supplies/new" element={token ? <NewSupply /> : <Navigate to="/login" />} />
        <Route path="/categories" element={token ? <CategoryList /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;