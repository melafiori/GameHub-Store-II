import React, { useState } from 'react';

const FormularioCheckout = ({ onSubmitPago }) => {
  const [region, setRegion] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault(); 
    onSubmitPago({ region });
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Datos de Envío</h2>
      
      <label htmlFor="region">Región</label>
      <select 
        id="region" 
        value={region} 
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Seleccione una región</option>
        <option value="valparaiso">Valparaíso</option>
        <option value="metropolitana">Metropolitana</option>
      </select>

      <button type="submit">Confirmar Pago</button>
    </form>
  );
};

export default FormularioCheckout;