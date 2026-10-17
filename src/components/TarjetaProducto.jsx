import React from 'react';

const TarjetaProducto = ({ producto, agregarAlCarrito }) => {
  if (!producto) return null;

  return (
    <div className="card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>
      <button onClick={() => agregarAlCarrito(producto)}>Agregar</button>
    </div>
  );
};

export default TarjetaProducto;