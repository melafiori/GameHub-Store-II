
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ResumenCarrito from '../components/ResumenCarrito';
import { apiFetch } from '../data/api';
import '../styles/carrito.css';

function Carrito() {
  const {
    cart, preciosCargando, errorPrecios, avisoPrecios, reintentarPrecios,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCart();

  const [cupon, setCupon] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [vistaCupon, setVistaCupon] = useState(() => {
    try { const quote = JSON.parse(localStorage.getItem('gamehub_cupon') || 'null');
      if (quote && !Number.isInteger(Number(quote.descuento))) { localStorage.removeItem('gamehub_cupon'); return null; }
      return quote;
    } catch { return null; }
  });
  useEffect(() => { if (avisoPrecios) setVistaCupon(null); }, [avisoPrecios]);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [maximoDescuento, setMaximoDescuento] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState({
    texto: '',
    esError: false,
  });

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
      vaciarCarrito();
      localStorage.removeItem('gamehub_cupon'); setVistaCupon(null);

      setDescuentoPorcentaje(0);
      setMaximoDescuento(0);
      setMensajeCupon({ texto: '', esError: false });
      setCupon('');
    }
  };

  const handleAplicarCupon = async () => {
    const codigo = cupon.trim().toUpperCase();
    if (!codigo) { setMensajeCupon({ texto: 'Ingresa un código de cupón.', esError: true }); return; }
    setValidandoCupon(true); setMensajeCupon({ texto: '', esError: false });
    try {
      const items = Object.fromEntries(cart.map(item => [String(item.id), Number(item.cantidad)]));
      const response = await apiFetch('/api/v1/promotions/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo, items }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No se pudo validar el cupón.');
      localStorage.setItem('gamehub_cupon', JSON.stringify(result)); setVistaCupon(result); setDescuentoPorcentaje(0);
      setMensajeCupon({ texto: 'Cupón validado. Se confirmará al crear la orden.', esError: false });
    } catch (error) {
      localStorage.removeItem('gamehub_cupon'); setVistaCupon(null);
      setMensajeCupon({ texto: error instanceof TypeError ? 'No se pudo conectar con promociones.' : error.message, esError: true });
    } finally { setValidandoCupon(false); }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const montoDescuento = vistaCupon && Number(vistaCupon.subtotal) === subtotal ? Number(vistaCupon.descuento) : 0;

  const total = Math.max(0, subtotal - montoDescuento);

  if (cart.length && (preciosCargando || errorPrecios)) return <main className="container my-5" role="status">{preciosCargando ? 'Consultando precios vigentes...' : <>{errorPrecios} <button onClick={reintentarPrecios}>Reintentar</button></>}</main>;
  return (
    <main className="container my-5">
      {avisoPrecios && <p role="alert">{avisoPrecios}</p>}
      <h1 className="h2 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
        Tu carrito de compras
      </h1>

      {cart.length === 0 ? (
        <ResumenCarrito cart={cart} />
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
                  disabled={validandoCupon}
                  onClick={handleAplicarCupon}
                >
                  Aplicar
                </button>
              </div>

              {vistaCupon && Number(vistaCupon.subtotal) !== subtotal && <small role="status">El carrito cambió; valida el cupón nuevamente.</small>}
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

            <ResumenCarrito
              cart={cart}
              subtotal={subtotal}
              montoDescuento={montoDescuento}
              descuentoPorcentaje={descuentoPorcentaje}
              total={total}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Carrito;