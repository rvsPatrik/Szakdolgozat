import React from 'react';
import '../pages/styles/ListItemCard.css';

const ListItemCard = ({ data, onEdit }) => (
  <div className="list-item-card">
    <div className="list-item-data-row">
      {data.map((value, idx) => (
        <div className="list-item-data" key={idx}>{value}</div>
      ))}
    </div>
    <button className="list-item-edit-btn" onClick={onEdit}>Módosítás</button>
  </div>
);

export default ListItemCard;