import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { getUserRole } from './utils/auth';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import EditProduct from './pages/EditProduct';
import SupplyList from './pages/SupplyList';
import NewSupply from './pages/NewSupply';
import CategoryList from './pages/CategoryList';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import EditSupply from './pages/EditSupply';
import Admin from './pages/Admin';
import AdminSql from './pages/AdminSql';
import AdminSupplierManagement from './pages/AdminSupplierManagement';
import EditAdminSupplier from './pages/EditAdminSupplier';
import AdminSupplierForm from './pages/AdminSupplierForm';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(null);

  React.useEffect(() => {
    const fetchRole = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:8000/api/users/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setRole(data.role);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };
    fetchRole();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  const ProtectedRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (role === 'viewer') return <Navigate to="/home" replace />;
    return children;
  };

  const ViewerRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (role === 'viewer') return <Navigate to="/home" replace />
    if (role === 'user') return <Navigate to="/home" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Navbar onLogout={handleLogout} token={token} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ViewerRoute>
              <Home role={role} />
            </ViewerRoute>
          }
        />
        {/* Only allow /home for viewers, all other routes redirect */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
  path="/categories/:id/edit"
  element={
    <ProtectedRoute>
      <EditCategory />
    </ProtectedRoute>
  }
/>
        <Route
          path="/supplies"
          element={
            <ProtectedRoute>
              <SupplyList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplies/new"
          element={
            <ProtectedRoute>
              <NewSupply />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplies/:id/edit"
          element={
            <ProtectedRoute>
              <EditSupply />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>

<     Route
          path="/admin/sql"
          element={
            <AdminRoute>
              <AdminSql />
            </AdminRoute>
          }
        />
          <Route
          path="/admin/suppliers"
          element={
            <AdminRoute>
              <AdminSupplierManagement />
            </AdminRoute>
          }
        />  
        route
        <Route
          path="/admin/suppliers/new" 
          element={
            <AdminRoute>
              <AdminSupplierForm />
            </AdminRoute>
          }
        />
          <Route
          path="/admin/suppliers/:id/edit"
          element={
            <AdminRoute>
              <EditAdminSupplier />
            </AdminRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryList />
            </ProtectedRoute>
          }
        />
        <Route
    path="/categories/new"
    element={
      <ProtectedRoute>
        <AddCategory />
      </ProtectedRoute>
    }
  />
        {/* Redirect any unknown route to /home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;