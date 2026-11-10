import React, { useState } from 'react';

const FormularioCheckout = ({ onSubmitPago }) => {
  const [region, setRegion] = useState('');
  const [direccion, setDireccion] = useState('');

  const direccionValida = direccion.trim().length > 0;
  const formularioValido = Boolean(region && direccionValida);

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!formularioValido) return;

    onSubmitPago({ region, direccion: direccion.trim() });
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h2>Datos de Envío</h2>

      <label htmlFor="region">Región</label>
      <select
        id="region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
      >
        <option value="">Seleccione una región</option>
        <option value="valparaiso">Valparaíso</option>
        <option value="metropolitana">Metropolitana</option>
      </select>

      <label htmlFor="direccion">Dirección de despacho</label>
      <input
        id="direccion"
        type="text"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
      />

      <button type="submit" disabled={!formularioValido}>
        Confirmar Pago
      </button>
    </form>
  );
};

export default FormularioCheckout;