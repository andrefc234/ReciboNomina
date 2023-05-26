import React from 'react';
import Calendar from './Calendar';

const index = () => {
  // Dummy data for recibos
  const recibos = [
    { fecha: '2023-05-10' },
    { fecha: '2023-05-15' },
    { fecha: '2023-05-20' },
  ];

  return (
    <div>
      <h1>Recibo Calendar</h1>
      <Calendar />
    </div>
  );
};

export default index;
