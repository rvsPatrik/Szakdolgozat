import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/suppliers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data);
    };

    fetchSuppliers();
  }, []);

  return (
    <div>
      <h2>Beszállítók</h2>
      <ul>
        {suppliers.map(supplier => (
          <li key={supplier.id}>
            <strong>{supplier.name}</strong><br />
            {supplier.email && <span>Email: {supplier.email}<br /></span>}
            {supplier.phone && <span>Telefon: {supplier.phone}<br /></span>}
            {supplier.address && <span>Cím: {supplier.address}<br /></span>}
            {supplier.description && <em>{supplier.description}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;
