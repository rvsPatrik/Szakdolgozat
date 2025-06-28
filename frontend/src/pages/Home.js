import React from 'react';

const Home = ({ role }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Üdvözöl a Raktárkezelő Rendszer!</h1>
      <p>Bejelentkezett szerepkör: <strong>{role}</strong></p>
    </div>
  );
};

export default Home;