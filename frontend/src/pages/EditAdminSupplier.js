// ...existing code...
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminSupplierForm from './AdminSupplierForm';

function EditAdminSupplier() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSupplier = async () => {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/api/suppliers/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSupplier(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Load failed');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: 20 }}>{error}</div>;
  if (!supplier) return <div style={{ padding: 20 }}>Supplier not found</div>;

  return <AdminSupplierForm initialData={supplier} mode="edit" />;
}

export default EditAdminSupplier;
// ...existing code...