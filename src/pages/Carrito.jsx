// src/pages/Carrito.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/style.css';

function Carrito() {
  const { cart, cambiarCantidad, eliminarDelCarrito, vaciarCarrito } = useCart();
  
  const [cupon, setCupon] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState({ texto: '', esError: false });

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      vaciarCarrito();
    }
  };

  const handleAplicarCupon = () => {
    const codigo = cupon.trim().toUpperCase();
    if (codigo === 'NEON10') {
      setDescuentoPorcentaje(10);
      setMensajeCupon({ texto: '¡Cupón del 10% aplicado con éxito!', esError: false });
    } else if (codigo === 'GAMEHUB20') {
      setDescuentoPorcentaje(20);
      setMensajeCupon({ texto: '¡Cupón del 20% aplicado con éxito!', esError: false });
    } else if (codigo === '') {
      setMensajeCupon({ texto: 'Ingresa un código de cupón.', esError: true });
    } else {
      setDescuentoPorcentaje(0);
      setMensajeCupon({ texto: 'Cupón no válido o expirado.', esError: true });
    }
  };

  // CÁLCULOS DINÁMICOS SOBRE EL ESTADO REAL DEL CARRITO
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const montoDescuento = Math.round((subtotal * descuentoPorcentaje) / 100);
  const total = subtotal - montoDescuento;

  return (
    <main className="container my-5">
      <h1 className="h2 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
        tu carrito de compras
      </h1>

      {cart.length === 0 ? (
        <div id="estado-vacio" className="text-center py-5">
          <div className="icono-vacio mb-3">🛒</div>
          <h2 className="h3 text-light">Tu carrito está vacío</h2>
          <p className="text-secondary mb-4">
            Parece que aún no has agregado componentes o periféricos a tu compra.
          </p>
          <Link to="/catcategoria" className="btn btn-neon-primario px-4 py-2">
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div id="contenedor-carrito" className="row g-4">
          {/* Columna Izquierda: Tabla/Lista de productos */}
          <div className="col-lg-8">
            <div className="card card-custom p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 m-0">Productos seleccionados</h2>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleVaciarCarrito}
                >
                  Vaciar carrito
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-dark align-middle m-0">
                  <thead>
                    <tr className="text-secondary border-secondary">
                      <th scope="col">Producto</th>
                      <th scope="col" className="text-center">Precio Unit.</th>
                      <th scope="col" className="text-center" style={{ width: '130px' }}>Cantidad</th>
                      <th scope="col" className="text-end">Subtotal</th>
                      <th scope="col" className="text-center" style={{ width: '60px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="img-miniatura rounded"
                            />
                            <Link
                              to={`/producto?id=${item.id}`}
                              className="text-decoration-none text-light fw-bold"
                            >
                              {item.nombre}
                            </Link>
                          </div>
                        </td>
                        <td className="text-center">
                          ${item.precio.toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="form-control form-control-sm input-cantidad text-center mx-auto"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => cambiarCantidad(item.id, e.target.value)}
                          />
                        </td>
                        <td className="text-end fw-bold">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger border-0"
                            title="Eliminar producto"
                            onClick={() => eliminarDelCarrito(item.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Cupón y resumen de compra */}
          <div className="col-lg-4">
            <div className="card card-custom p-3 mb-3">
              <h3 className="h5 mb-3">¿Tienes un cupón?</h3>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control input-dark"
                  placeholder="Ej: NEON10"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                />
                <button
                  className="btn btn-neon-primario"
                  type="button"
                  onClick={handleAplicarCupon}
                >
                  Aplicar
                </button>
              </div>
              {mensajeCupon.texto && (
                <small
                  className={`d-block mt-2 ${
                    mensajeCupon.esError ? 'text-danger' : 'text-success'
                  }`}
                >
                  {mensajeCupon.texto}
                </small>
              )}
            </div>

            <div className="card card-custom p-4">
              <h3 className="h5 mb-4 border-bottom pb-2 border-secondary">
                Resumen de Compra
              </h3>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span className="fw-bold">
                  ${subtotal.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Descuento {descuentoPorcentaje > 0 && `(${descuentoPorcentaje}%)`}
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
          </div>
        </div>
      )}
    </main>
  );
}

export default Carrito;