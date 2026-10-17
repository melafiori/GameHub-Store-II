
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/style.css';

function Carrito() {
  const {
    cart,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCart();

  const [cupon, setCupon] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [maximoDescuento, setMaximoDescuento] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState({
    texto: '',
    esError: false,
  });

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      vaciarCarrito();
      setDescuentoPorcentaje(0);
      setMaximoDescuento(0);
      setMensajeCupon({ texto: '', esError: false });
      setCupon('');
    }
  };

  const handleAplicarCupon = () => {
    const codigo = cupon.trim().toUpperCase();

    const cupones = {
      NEON10: {
        porcentaje: 10,
        maximo: 50000,
        vigencia: '2026-12-31',
      },
      GAMEHUB20: {
        porcentaje: 20,
        maximo: 80000,
        vigencia: '2026-12-31',
      },
      GAMER20: {
        porcentaje: 20,
        maximo: 80000,
        vigencia: '2026-12-31',
      },
      EXPIRADO: {
        porcentaje: 15,
        maximo: 30000,
        vigencia: '2025-01-01',
      },
    };

    const cuponSeleccionado = cupones[codigo];

    if (!codigo) {
      setDescuentoPorcentaje(0);
      setMaximoDescuento(0);
      setMensajeCupon({
        texto: 'Ingresa un código de cupón.',
        esError: true,
      });
      return;
    }

    if (!cuponSeleccionado) {
      setDescuentoPorcentaje(0);
      setMaximoDescuento(0);
      setMensajeCupon({
        texto: 'Cupón no válido.',
        esError: true,
      });
      return;
    }

    const hoy = new Date();
    const fechaLocal = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0'),
    ].join('-');

    if (fechaLocal > cuponSeleccionado.vigencia) {
      setDescuentoPorcentaje(0);
      setMaximoDescuento(0);
      setMensajeCupon({
        texto: 'Este cupón está vencido.',
        esError: true,
      });
      return;
    }

    setDescuentoPorcentaje(cuponSeleccionado.porcentaje);
    setMaximoDescuento(cuponSeleccionado.maximo);
    setMensajeCupon({
      texto: `¡Cupón del ${cuponSeleccionado.porcentaje}% aplicado con éxito!`,
      esError: false,
    });
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const montoDescuento = Math.min(
    Math.round((subtotal * descuentoPorcentaje) / 100),
    maximoDescuento,
    subtotal
  );

  const total = Math.max(0, subtotal - montoDescuento);

  return (
    <main className="container my-5">
      <h1 className="h2 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
        Tu carrito de compras
      </h1>

      {cart.length === 0 ? (
        <div id="estado-vacio" className="text-center py-5">
          <div className="icono-vacio mb-3">🛒</div>

          <h2 className="h3 text-light">Tu carrito está vacío</h2>

          <p className="text-secondary mb-4">
            Parece que aún no has agregado componentes o periféricos a tu compra.
          </p>

          <Link
            to="/catcategoria"
            className="btn btn-neon-primario px-4 py-2"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div id="contenedor-carrito" className="row g-4">
          <div className="col-lg-8">
            <div className="card card-custom p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 m-0">Productos seleccionados</h2>

                <button
                  type="button"
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
                      <th scope="col" className="text-center">
                        Precio Unit.
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: '130px' }}
                      >
                        Cantidad
                      </th>
                      <th scope="col" className="text-end">
                        Subtotal
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: '60px' }}
                      >
                        Acción
                      </th>
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
                            min="1"
                            className="form-control form-control-sm input-cantidad text-center mx-auto"
                            value={item.cantidad}
                            aria-label={`Cantidad de ${item.nombre}`}
                            onChange={(e) =>
                              cambiarCantidad(item.id, e.target.value)
                            }
                          />
                        </td>

                        <td className="text-end fw-bold">
                          $
                          {(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </td>

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger border-0"
                            title="Eliminar producto"
                            aria-label={`Eliminar ${item.nombre}`}
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

          <div className="col-lg-4">
            <div className="card card-custom p-3 mb-3">
              <h3 className="h5 mb-3">¿Tienes un cupón?</h3>

              <div className="input-group">
                <input
                  type="text"
                  className="form-control input-dark"
                  placeholder="Ej: NEON10"
                  aria-label="Código de cupón"
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
                  role="status"
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
          </div>
        </div>
      )}
    </main>
  );
}

export default Carrito;