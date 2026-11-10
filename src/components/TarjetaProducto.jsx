import React from 'react';

const TarjetaProducto = ({ producto, agregarAlCarrito }) => {
  if (!producto) return null;

  const sinStock = producto.stock <= 0;

  return (
    <div className="card h-100 bg-dark text-light border-secondary tarjeta-producto position-relative p-3">
      <div className="text-center mb-3">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="img-fluid"
          style={{height: "170px", objectFit: "contain", transition: "transform 0.3s ease"}} 
        />
      </div>
      
      <div className="card-body d-flex flex-column p-0">
        <h5 className="card-title fs-5 fw-bold">{producto.nombre}</h5>
        
        <p className="precio-producto mb-3 mt-auto">
          ${Number(producto.precio).toLocaleString('es-CL')}
        </p>

        {sinStock && (
          <p role="status" className="text-danger fw-bold mb-2">Producto sin stock</p>
        )}

        <button
          className="btn btn-primary w-100 fw-bold mt-auto"
          onClick={() => agregarAlCarrito(producto)}
          disabled={sinStock}
        >
          {sinStock ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </div>
  );
};

export default TarjetaProducto;