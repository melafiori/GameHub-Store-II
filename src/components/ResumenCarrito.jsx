
import React from 'react';
import { Link } from 'react-router-dom';

function ResumenCarrito({
  cart = [],
  subtotal = 0,
  montoDescuento = 0,
  descuentoPorcentaje = 0,
  total = 0,
}) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <h2 className="h3 text-light">Tu carrito está vacío</h2>
        <p className="text-secondary mb-4">
          Agrega productos para ver el resumen de tu compra.
        </p>
        <Link
          to="/catcategoria"
          className="btn btn-neon-primario px-4 py-2"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="card card-custom p-4">
      <h3 className="h5 mb-4 border-bottom pb-2 border-secondary">
        Resumen de compra
      </h3>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">Subtotal</span>
        <span className="fw-bold">
          ${subtotal.toLocaleString('es-CL')}
        </span>
      </div>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">
          Descuento
          {descuentoPorcentaje > 0 && ` (${descuentoPorcentaje}%)`}
        </span>
        <span className="text-danger fw-bold">
          -${montoDescuento.toLocaleString('es-CL')}
        </span>
      </div>

      <div className="d-flex justify-content-between mb-3 border-bottom pb-3 border-secondary">
        <span className="text-secondary">Envío estimado</span>
        <span className="text-success fw-bold">Gratis</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="h5 m-0">Total</span>
        <span className="h4 m-0 text-acento fw-bold">
          ${total.toLocaleString('es-CL')}
        </span>
      </div>

      <Link
        to="/checkout"
        className="btn btn-neon-primario w-100 py-2 fw-bold text-center"
      >
        Continuar al Checkout
      </Link>
    </div>
  );
}

export default ResumenCarrito;