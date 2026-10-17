
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
  try {
    const guardado = localStorage.getItem('gamehub_cupon');

    if (!guardado) return null;

    const cupon = JSON.parse(guardado);

    if (
      !cupon ||
      typeof cupon.codigo !== 'string' ||
      !Number.isFinite(cupon.porcentaje) ||
      !Number.isFinite(cupon.maximo) ||
      !cupon.vigencia
    ) {
      return null;
    }

    // Comprobar nuevamente que el cupón no esté vencido.
    const hoy = new Date();
    const fechaLocal = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, '0'),
      String(hoy.getDate()).padStart(2, '0'),
    ].join('-');

    if (fechaLocal > cupon.vigencia) return null;

    return cupon;
  } catch {
    return null;
  }
}

function Checkout() {
  const { cart, vaciarCarrito } = useCart();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    metodoPago: '',
  });

  const [errores, setErrores] = useState({});
  const [ordenCompletada, setOrdenCompletada] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');

  // Recuperar el cupón y calcular los importes.
  const cuponGuardado = obtenerCuponGuardado();

  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const montoDescuento = cuponGuardado
    ? Math.min(
        Math.round((subtotal * cuponGuardado.porcentaje) / 100),
        cuponGuardado.maximo,
        subtotal
      )
    : 0;

  const total = Math.max(0, subtotal - montoDescuento);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const campo = name || id;

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

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    let ordenesGuardadas = [];

    try {
      const guardadas = localStorage.getItem('gamehub_ordenes');
      ordenesGuardadas = guardadas ? JSON.parse(guardadas) : [];

      if (!Array.isArray(ordenesGuardadas)) {
        ordenesGuardadas = [];
      }
    } catch {
      ordenesGuardadas = [];
    }

    const idOrden = `GH-${Date.now()}`;

    const nuevaOrden = {
      id: idOrden,
      fecha: new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      estado: 'Procesando',
      subtotal,
      descuento: montoDescuento,
      cupon: montoDescuento > 0 ? cuponGuardado?.codigo || null : null,
      total,
      productos: cart.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      cliente: {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        region: formData.region,
        comuna: formData.comuna,
        direccion: formData.direccion.trim(),
      },
      metodoPago: formData.metodoPago,
    };

    try {
      localStorage.setItem(
        'gamehub_ordenes',
        JSON.stringify([nuevaOrden, ...ordenesGuardadas])
      );

      // Limpiar el carrito y el cupón después de guardar la orden.
      localStorage.removeItem('gamehub_cupon');
      vaciarCarrito();

      setNumeroOrden(idOrden);
      setOrdenCompletada(true);
    } catch {
      alert(
        'No se pudo guardar la orden. Inténtalo nuevamente. Tu carrito no se ha vaciado.'
      );
    }
  };

  if (ordenCompletada) {
    return (
      <main className="container text-center my-5 py-5">
        <div
          className="card card-custom p-5 mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <div className="display-1 text-success mb-3">✓</div>

          <h1 className="h2 text-light mb-3">
            ¡Gracias por tu compra, {formData.nombre}!
          </h1>

          <p className="text-secondary mb-2">
            Tu orden <strong>{numeroOrden}</strong> se ha registrado correctamente.
          </p>

          <p className="text-secondary mb-4">
            El total de tu compra fue de{' '}
            <strong>${total.toLocaleString('es-CL')}</strong>.
          </p>

          <p className="text-secondary mb-4">
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

  return (
    <main className="container my-5">
      <h1 className="h2 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
        Finalizar compra
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="h4 text-light mb-3">
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
                    <label htmlFor="nombre" className="form-label text-light">
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
                    <label htmlFor="correo" className="form-label text-light">
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
                    <label htmlFor="telefono" className="form-label text-light">
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
                    <label htmlFor="region" className="form-label text-light">
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
                      <option value="valparaiso">Región de Valparaíso</option>
                      <option value="biobio">Región del Biobío</option>
                    </select>

                    <div className="invalid-feedback">
                      Por favor, selecciona una región.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="comuna" className="form-label text-light">
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
                    <label
                      htmlFor="direccion"
                      className="form-label text-light"
                    >
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
                      className="form-check-label text-light"
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
                      className="form-check-label text-light"
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
                      className="form-check-label text-light"
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
              >
                Confirmar orden y pagar
              </button>
            </form>
          </div>

          <div className="col-lg-4">
            <div
              className="card card-custom p-4 sticky-top"
              style={{ top: '20px' }}
            >
              <h2 className="h5 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
                Resumen de tu orden
              </h2>

              <ul className="list-unstyled mb-4 text-light">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex justify-content-between mb-2 small"
                  >
                    <span>
                      {item.nombre} x{item.cantidad}
                    </span>

                    <span className="fw-bold">
                      $
                      {(item.precio * item.cantidad).toLocaleString('es-CL')}
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

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Descuento
                  {montoDescuento > 0 && ` (${cuponGuardado.porcentaje}%)`}
                </span>

                <span className="text-danger fw-bold">
                  -${montoDescuento.toLocaleString('es-CL')}
                </span>
              </div>

              {montoDescuento > 0 && (
                <p className="small text-success mb-3">
                  Cupón aplicado: {cuponGuardado.codigo}
                </p>
              )}

              <div className="d-flex justify-content-between mb-3 border-bottom pb-3 border-secondary">
                <span className="text-secondary">Envío estimado</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="h5 m-0">Total a pagar</span>

                <span className="h4 m-0 text-acento fw-bold">
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