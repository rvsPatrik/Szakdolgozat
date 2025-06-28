import React from 'react';

const Navbar = ({ onLogout }) => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <div><strong>Raktárkezelő</strong></div>
      <button onClick={onLogout}>Kilépés</button>
    </nav>
  );
};

export default Navbar;