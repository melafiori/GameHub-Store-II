
import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../data/api';
import { useSession } from '../context/SessionContext';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';

const COMUNAS_POR_REGION = {
  metropolitana: [
    'Santiago',
    'Providencia',
    'Las Condes',
    'Maipú',
    'La Florida',
    'Ñuñoa',
    'Puente Alto',
  ],
  valparaiso: [
    'Valparaíso',
    'Viña del Mar',
    'Quilpué',
    'Villa Alemana',
    'Concón',
    'San Antonio',
  ],
  biobio: [
    'Concepción',
    'Talcahuano',
    'San Pedro de la Paz',
    'Chiguayante',
    'Los Ángeles',
  ],
};

function obtenerCuponGuardado() {
  try { const coupon = JSON.parse(localStorage.getItem('gamehub_cupon') || 'null');
    return coupon && typeof coupon.codigo === 'string' && Number.isFinite(Number(coupon.subtotal)) && Number.isInteger(Number(coupon.descuento)) ? coupon : null;
  } catch { return null; }
}

function Checkout() {
  const { cart, vaciarCarrito, preciosCargando, errorPrecios, avisoPrecios, reintentarPrecios } = useCart();
  const { token, cerrarSesion } = useSession();
  const [enviando, setEnviando] = useState(false);
  const [errorCompra, setErrorCompra] = useState('');
  const [totalServidor, setTotalServidor] = useState(null);
  const enviandoRef = useRef(false);
  const [pendiente, setPendiente] = useState(null);
  useEffect(() => { reintentarPrecios(); }, []);
  const [avisoDireccion, setAvisoDireccion] = useState(false);
  useEffect(() => {
    if (!token) { setPendiente(null); return; }
    try {
      const user = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub;
      const prefix = 'gamehub_checkout_' + user + '_';
      const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
      const entry = keys.map(key => ({ storageKey: key, ...JSON.parse(localStorage.getItem(key)) })).find(item => item.key && item.items && item.direccionDespacho);
      setPendiente(entry || null);
    } catch { setPendiente(null); }
  }, [token]);

  const [formData, setFormData] = useState(() => {
    const defaults = { nombre: '', correo: '', telefono: '', region: '', comuna: '', direccion: '', metodoPago: '' };
    try {
      const saved = JSON.parse(sessionStorage.getItem('gamehub_checkout_form') || '{}');
      for (const key of Object.keys(defaults)) if (typeof saved[key] === 'string') defaults[key] = saved[key];
    } catch { /* Use an empty form if the saved draft is invalid. */ }
    return defaults;
  });
  useEffect(() => { sessionStorage.setItem('gamehub_checkout_form', JSON.stringify(formData)); }, [formData]);

  const [errores, setErrores] = useState({});
  const [ordenCompletada, setOrdenCompletada] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');
  const [totalOrdenConfirmada, setTotalOrdenConfirmada] = useState(0);

  const cuponGuardado = obtenerCuponGuardado();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // Los cupones simulados aún no se aplican en el checkout.
  const montoDescuento = cuponGuardado && Number(cuponGuardado.subtotal) === subtotal ? Number(cuponGuardado.descuento) : 0;

  const total = pendiente?.total != null ? Number(pendiente.total) : Math.max(0, subtotal - montoDescuento);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const campo = name || id;
    if (pendiente && ['region', 'comuna', 'direccion'].includes(campo)) setAvisoDireccion(true);

    setFormData((prev) => {
      const nuevoState = { ...prev, [campo]: value };

      if (campo === 'region') {
        nuevoState.comuna = '';
      }

      return nuevoState;
    });

    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
    }

    if (campo === 'region' && errores.comuna) {
      setErrores((prev) => ({ ...prev, comuna: false }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = true;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(formData.correo.trim())) {
      nuevosErrores.correo = true;
    }

    const regexTel = /^\d{9}$/;

    if (!regexTel.test(formData.telefono.trim())) {
      nuevosErrores.telefono = true;
    }

    if (!formData.region) nuevosErrores.region = true;
    if (!formData.comuna) nuevosErrores.comuna = true;
    if (!formData.direccion.trim()) nuevosErrores.direccion = true;
    if (!formData.metodoPago) nuevosErrores.metodoPago = true;

    setErrores(nuevosErrores);
    const primero = Object.keys(nuevosErrores)[0];
    if (primero) document.getElementById(primero === 'metodoPago' ? 'pago-debito' : primero)?.focus();
    return !primero;
  };

  const handleSubmit = async (e, retomar = false) => {
    e.preventDefault();
    if (enviandoRef.current) return;
    if (!retomar && pendiente) { setErrorCompra('Hay una compra pendiente. Retomala con su direccion original.'); return; }
    if (!retomar && (!cart.length || !validarFormulario())) { setErrorCompra(''); return; }
    if (retomar && !pendiente) return;
    if (!token) { setErrorCompra('Inicia sesión para confirmar tu compra.'); return; }
    enviandoRef.current = true; setEnviando(true); setErrorCompra('');
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload.sub) throw new Error('Sesión inválida. Inicia sesión nuevamente.');
      const itemsActuales = Object.fromEntries(cart.map(item => [String(item.id), Number(item.cantidad)]).sort(([a], [b]) => Number(a) - Number(b)));
      const region = { metropolitana: 'Región Metropolitana', valparaiso: 'Región de Valparaíso', biobio: 'Región del Biobío' }[formData.region];
      const direccionDespacho = { region, comuna: formData.comuna.trim(), direccion: formData.direccion.trim() };
      const storageKey = retomar ? pendiente.storageKey : 'gamehub_checkout_' + payload.sub + '_' + JSON.stringify(itemsActuales);
      const codigoCupon = cuponGuardado && Number(cuponGuardado.subtotal) === subtotal ? cuponGuardado.codigo : null;
      let intento = retomar ? pendiente : { key: crypto.randomUUID(), items: itemsActuales, direccionDespacho, carrito: cart, codigoCupon };
      if (!retomar) { localStorage.setItem(storageKey, JSON.stringify(intento)); setPendiente({ ...intento, storageKey }); }
      const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
      const checkResponse = async response => {
        if (response.status === 401) { cerrarSesion(); throw new Error('Tu sesión venció. Inicia sesión nuevamente; tu carrito se conserva.'); }
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          if (body.estado === 'RECHAZADA') { localStorage.removeItem(storageKey); setPendiente(null); throw new Error(body.motivoRechazo || 'La compra fue rechazada. Revisa el stock o el cupón.'); }
          throw new Error(body.error || 'No se pudo completar la compra. Puedes reintentar sin perder tu carrito.');
        }
        return response.json();
      };
      if (!intento.orderId) {
        const orden = await checkResponse(await apiFetch('/api/v1/orders', { method: 'POST', headers: { ...headers, 'Idempotency-Key': intento.key }, body: JSON.stringify({ items: intento.items, direccionDespacho: intento.direccionDespacho, codigoCupon: intento.codigoCupon || null }) }));
        intento = { ...intento, orderId: orden.id, total: orden.total }; localStorage.setItem(storageKey, JSON.stringify(intento)); setPendiente({ ...intento, storageKey });
      }
      setTotalServidor(intento.total);
      const pago = await checkResponse(await apiFetch('/api/v1/orders/' + intento.orderId + '/payment', { method: 'POST', headers }));
      if (pago.estado !== 'PAGADA') throw new Error('El pago aún no está confirmado. Puedes reintentarlo.');
      setTotalOrdenConfirmada(pago.total); setNumeroOrden(pago.id); setOrdenCompletada(true);
      localStorage.removeItem(storageKey); setPendiente(null); localStorage.removeItem('gamehub_cupon'); sessionStorage.removeItem('gamehub_checkout_form');
      if (JSON.stringify(itemsActuales) === JSON.stringify(intento.items)) vaciarCarrito();
    } catch (error) { setErrorCompra(error instanceof TypeError ? 'No se pudo conectar con el servidor. Reintenta: se conservaron el carrito y la compra.' : error.message); }
    finally { enviandoRef.current = false; setEnviando(false); }
  };

  if (ordenCompletada) {
    return (
      <main className="container text-center my-5 py-5 checkout-container">
        <div
          className="card card-custom confirmacion-compra p-5 mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <div className="display-1 text-success mb-3 icono-confirmacion">
            ✓
          </div>

          <h1 className="h2 mb-3">
            ¡Gracias por tu compra, {formData.nombre}!
          </h1>

          <p className="mb-2">
            Tu orden <strong>{numeroOrden}</strong> se ha registrado
            correctamente.
          </p>

          <p className="mb-4">
            El total de tu compra fue de{' '}
            <strong className="text-acento">
              ${totalOrdenConfirmada.toLocaleString('es-CL')}
            </strong>.
          </p>

          <p className="mb-4">
            Esta es una compra simulada: no se envía un correo electrónico real.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/mis-ordenes"
              className="btn btn-neon-primario px-4 py-2"
            >
              Ver mis órdenes
            </Link>

            <Link
              to="/catcategoria"
              className="btn btn-outline-secondary px-4 py-2"
            >
              Volver al catálogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!pendiente && cart.length && (preciosCargando || errorPrecios)) return <main className="container my-5" role="status">{preciosCargando ? 'Consultando precios vigentes...' : <>{errorPrecios} <button onClick={reintentarPrecios}>Reintentar</button></>}</main>;
  return (
    <main className="container my-5 checkout-container">
      {avisoPrecios && <p role="alert">{avisoPrecios}</p>}
      <h1 className="h2 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
        Finalizar compra
      </h1>
      <p role="note">El cupón se valida de nuevo al crear la orden. La dirección de despacho quedará guardada.</p>

      {errorCompra && <p role="alert" className="text-danger">{errorCompra} {!token && <Link to="/login" state={{ volverA: '/checkout' }}>Iniciar sesion</Link>}</p>}
      {totalServidor !== null && <p role="status">Total confirmado por el servidor: ${Number(totalServidor).toLocaleString('es-CL')}</p>}
      {pendiente && <section className="card card-custom p-3 mb-3" role="status">
        <strong>Compra pendiente{pendiente.orderId ? ' #' + pendiente.orderId : ''}</strong>
        <p>Dirección original: {pendiente.direccionDespacho.direccion}, {pendiente.direccionDespacho.comuna}, {pendiente.direccionDespacho.region}</p>
        {pendiente.total != null && <p>Total guardado por el servidor: ${Number(pendiente.total).toLocaleString('es-CL')}</p>}
        <p>Productos: {Object.entries(pendiente.items).map(([id, cantidad]) => ' #' + id + ' x' + cantidad).join(', ')}</p>
        <p>La compra pendiente conserva estos productos y esta dirección, aunque cambies el formulario.</p>
        {avisoDireccion && <p role="alert">El cambio no modifica la dirección de la compra pendiente.</p>}
        <button type="button" className="btn btn-neon-primario" disabled={enviando} onClick={e => handleSubmit(e, true)}>Retomar compra pendiente</button>
      </section>}
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="h4 mb-3">
            No hay productos en tu carrito para procesar el pago.
          </h2>

          <Link
            to="/catcategoria"
            className="btn btn-neon-primario px-4 py-2"
          >
            Volver a la tienda
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Formulario de compra */}
          <div className="col-lg-8">
            <form
              id="formulario-checkout"
              className="card card-custom p-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  1. Datos personales
                </legend>

                <div className="row g-3 mt-1">
                  <div className="col-md-12">
                    <label htmlFor="nombre" className="form-label">
                      Nombre completo
                    </label>

                    <input
                      type="text"
                      className={`form-control input-dark ${
                        errores.nombre ? 'is-invalid' : ''
                      }`}
                      id="nombre"
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombre}
                      onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                      Debes ingresar tu nombre completo.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      className={`form-control input-dark ${
                        errores.correo ? 'is-invalid' : ''
                      }`}
                      id="correo"
                      placeholder="ej: correo@dominio.com"
                      value={formData.correo}
                      onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                      Ingresa un formato de correo válido.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono móvil
                    </label>

                    <input
                      type="tel"
                      className={`form-control input-dark ${
                        errores.telefono ? 'is-invalid' : ''
                      }`}
                      id="telefono"
                      placeholder="Ej: 912345678"
                      value={formData.telefono}
                      onChange={handleChange}
                    />

                    <div className="form-text text-secondary">
                      Ingresa 9 dígitos numéricos.
                    </div>

                    <div className="invalid-feedback">
                      El teléfono debe contener exactamente 9 números.
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  2. Datos de despacho
                </legend>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label htmlFor="region" className="form-label">
                      Región
                    </label>

                    <select
                      className={`form-select input-dark ${
                        errores.region ? 'is-invalid' : ''
                      }`}
                      id="region"
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Selecciona una región...
                      </option>
                      <option value="metropolitana">
                        Región Metropolitana
                      </option>
                      <option value="valparaiso">
                        Región de Valparaíso
                      </option>
                      <option value="biobio">Región del Biobío</option>
                    </select>

                    <div className="invalid-feedback">
                      Por favor, selecciona una región.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="comuna" className="form-label">
                      Comuna
                    </label>

                    <select
                      className={`form-select input-dark ${
                        errores.comuna ? 'is-invalid' : ''
                      }`}
                      id="comuna"
                      disabled={!formData.region}
                      value={formData.comuna}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        {formData.region
                          ? 'Selecciona una comuna...'
                          : 'Primero selecciona una región...'}
                      </option>

                      {formData.region &&
                        COMUNAS_POR_REGION[formData.region]?.map((com) => (
                          <option key={com} value={com}>
                            {com}
                          </option>
                        ))}
                    </select>

                    <div className="invalid-feedback">
                      Por favor, selecciona una comuna.
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="direccion" className="form-label">
                      Dirección de entrega
                    </label>

                    <input
                      type="text"
                      className={`form-control input-dark ${
                        errores.direccion ? 'is-invalid' : ''
                      }`}
                      id="direccion"
                      placeholder="Ej: Av. Siempre Viva 742, depto. 3B"
                      value={formData.direccion}
                      onChange={handleChange}
                    />

                    <div className="invalid-feedback">
                      La dirección de entrega es obligatoria.
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  3. Método de pago simulado
                </legend>

                <div className="mt-3">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="metodoPago"
                      id="pago-debito"
                      value="debito"
                      checked={formData.metodoPago === 'debito'}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="pago-debito"
                    >
                      Tarjeta de débito
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="metodoPago"
                      id="pago-credito"
                      value="credito"
                      checked={formData.metodoPago === 'credito'}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="pago-credito"
                    >
                      Tarjeta de crédito
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="metodoPago"
                      id="pago-transferencia"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label"
                      htmlFor="pago-transferencia"
                    >
                      Transferencia bancaria
                    </label>
                  </div>

                  {errores.metodoPago && (
                    <div className="text-danger small mt-2">
                      Debes seleccionar un método de pago.
                    </div>
                  )}
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-neon-primario w-100 py-3 fw-bold"
                disabled={enviando || !!pendiente || preciosCargando || !!errorPrecios}
              >
                {enviando ? 'Procesando...' : 'Confirmar orden y pagar'}
              </button>
            </form>
          </div>

          {/* Resumen de la compra */}
          <div className="col-lg-4">
            <div
              className="card card-custom resumen-compra p-4 sticky-top"
              style={{ top: '20px' }}
            >
              <h2 className="h5 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
                Resumen de tu orden
              </h2>

              <ul className="list-unstyled mb-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex justify-content-between gap-3 mb-2 small"
                  >
                    <span>
                      {item.nombre} x{item.cantidad}
                    </span>

                    <span className="fw-bold text-nowrap">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span className="fw-bold">
                  ${subtotal.toLocaleString('es-CL')}
                </span>
              </div>

              <div className="d-flex justify-content-between gap-3 mb-2">
                <span className="text-secondary">
                  Descuento
                  {montoDescuento > 0 && ` (${cuponGuardado.codigo})`}
                </span>

                <span className="text-danger fw-bold text-nowrap">
                  -${montoDescuento.toLocaleString('es-CL')}
                </span>
              </div>

              {montoDescuento > 0 && (
                <p className="small text-success mb-3">
                  Cupón estimado: {cuponGuardado.codigo}
                </p>
              )}

              <div className="d-flex justify-content-between mb-3 border-bottom pb-3 border-secondary">
                <span className="text-secondary">Envío estimado</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-3">
                <span className="h5 m-0">Total a pagar</span>

                <span className="h4 m-0 text-acento fw-bold text-nowrap">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Checkout;

