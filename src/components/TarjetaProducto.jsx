import React from 'react';

const TarjetaProducto = ({ producto, agregarAlCarrito }) => {
  if (!producto) return null;

  const sinStock = producto.stock <= 0;

  return (
    <div className="card">
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>${producto.precio}</p>

      {sinStock && (
        <p role="status">Producto sin stock</p>
      )}

      <button
        onClick={() => agregarAlCarrito(producto)}
        disabled={sinStock}
      >
        {sinStock ? 'Sin stock' : 'Agregar'}
      </button>
    </div>
  );
};

export default TarjetaProducto;