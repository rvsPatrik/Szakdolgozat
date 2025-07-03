import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import CategoryList from './pages/CategoryList';
import SupplierList from './pages/SupplierList';
import SupplyList from './pages/SupplyList';
import NewSupply from './pages/NewSupply';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token && <Sidebar />}
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={token ? <ProductList /> : <Navigate to="/login" />} />
        <Route path="/products/new" element={token ? <ProductForm /> : <Navigate to="/login" />} />
        <Route path="/products/:id/edit" element={token ? <ProductForm /> : <Navigate to="/login" />} />
        <Route path="/categories" element={token ? <CategoryList /> : <Navigate to="/login" />} />
        <Route path="/suppliers" element={token ? <SupplierList /> : <Navigate to="/login" />} />
        <Route path="/supplies" element={token ? <SupplyList /> : <Navigate to="/login" />} />
        <Route path="/supplies/new" element={token ? <NewSupply /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;