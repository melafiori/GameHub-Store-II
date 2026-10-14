import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const COMUNAS_POR_REGION = {
  metropolitana: ["Santiago", "Providencia", "Las Condes", "Maipú", "La Florida", "Ñuñoa", "Puente Alto"],
  valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón", "San Antonio"],
  biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"]
};

function Checkout() {
  const { cart, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  // Estados del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    metodoPago: ''
  });

  const [errores, setErrores] = useState({});
  const [ordenCompletada, setOrdenCompletada] = useState(false);

  // Manejar cambios en inputs de texto
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const campo = name || id;

    setFormData(prev => {
      const nuevoState = { ...prev, [campo]: value };
      // Resetear comuna si cambia la región
      if (campo === 'region') {
        nuevoState.comuna = '';
      }
      return nuevoState;
    });

    // Limpiar error al escribir
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: false }));
    }
  };

  // Validaciones
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) nuevosErrores.nombre = true;
    
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.correo.trim())) nuevosErrores.correo = true;

    const regexTel = /^\d{9}$/;
    if (!regexTel.test(formData.telefono.trim())) nuevosErrores.telefono = true;

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
      alert("Tu carrito está vacío.");
      return;
    }

    if (validarFormulario()) {
      vaciarCarrito();
      setOrdenCompletada(true);
    }
  };

  // Cálculos de totales
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const total = subtotal;

  if (ordenCompletada) {
    return (
      <main className="container text-center my-5 py-5">
        <div className="card card-custom p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="display-1 text-success mb-3">✓</div>
          <h1 className="h2 text-light mb-3">¡Gracias por tu compra, {formData.nombre}!</h1>
          <p className="text-secondary mb-4">
            Hemos enviado la confirmación y el detalle del pedido a <strong>{formData.correo}</strong>.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/mis-ordenes" className="btn btn-neon-primario px-4 py-2">
              Ver mis órdenes
            </Link>
            <Link to="/catcategoria" className="btn btn-outline-secondary px-4 py-2">
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
        finalizar compra
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <h2 className="h4 text-light mb-3">No hay productos en tu carrito para procesar el pago.</h2>
          <Link to="/catcategoria" className="btn btn-neon-primario px-4 py-2">
            Volver a la tienda
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="col-lg-8">
            <form id="formulario-checkout" className="card card-custom p-4" onSubmit={handleSubmit} noValidate>
              
              {/* SECCIÓN 1: DATOS PERSONALES */}
              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  1. datos personales
                </legend>
                <div className="row g-3 mt-1">
                  <div className="col-md-12">
                    <label htmlFor="nombre" className="form-label text-light">nombre completo</label>
                    <input
                      type="text"
                      className={`form-control input-dark ${errores.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      placeholder="ej: juan perez"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">debes ingresar tu nombre completo.</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label text-light">correo electronico</label>
                    <input
                      type="email"
                      className={`form-control input-dark ${errores.correo ? 'is-invalid' : ''}`}
                      id="correo"
                      placeholder="ej: correo@dominio.com"
                      value={formData.correo}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">ingresa un formato de correo valido.</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label text-light">telefono movil</label>
                    <input
                      type="tel"
                      className={`form-control input-dark ${errores.telefono ? 'is-invalid' : ''}`}
                      id="telefono"
                      placeholder="ej: 912345678"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                    <div id="ayuda-tel" className="form-text text-secondary">ingresa 9 digitos numericos.</div>
                    <div className="invalid-feedback">el telefono debe contener exactamente 9 numeros.</div>
                  </div>
                </div>
              </fieldset>

              {/* SECCIÓN 2: DATOS DE DESPACHO */}
              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  2. datos de despacho
                </legend>
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label htmlFor="region" className="form-label text-light">region</label>
                    <select
                      className={`form-select input-dark ${errores.region ? 'is-invalid' : ''}`}
                      id="region"
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="" disabled>selecciona una region...</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="valparaiso">Región de Valparaiso</option>
                      <option value="biobio">Región del Biobio</option>
                    </select>
                    <div className="invalid-feedback">por favor, selecciona una region.</div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="comuna" className="form-label text-light">comuna</label>
                    <select
                      className={`form-select input-dark ${errores.comuna ? 'is-invalid' : ''}`}
                      id="comuna"
                      disabled={!formData.region}
                      value={formData.comuna}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        {formData.region ? "selecciona una comuna..." : "primero selecciona una region..."}
                      </option>
                      {formData.region && COMUNAS_POR_REGION[formData.region]?.map((com) => (
                        <option key={com} value={com}>{com}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback">por favor, selecciona una comuna.</div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="direccion" className="form-label text-light">direccion de entrega</label>
                    <input
                      type="text"
                      className={`form-control input-dark ${errores.direccion ? 'is-invalid' : ''}`}
                      id="direccion"
                      placeholder="ej: av. siempre viva 742, depto 3b"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">la direccion de entrega es obligatoria.</div>
                  </div>
                </div>
              </fieldset>

              {/* SECCIÓN 3: MÉTODO DE PAGO */}
              <fieldset className="mb-4">
                <legend className="h5 border-bottom pb-2 border-secondary">
                  3. metodo de pago simulado
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
                    <label className="form-check-label text-light" htmlFor="pago-debito">
                      tarjeta de debito
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
                    <label className="form-check-label text-light" htmlFor="pago-credito">
                      tarjeta de credito
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
                    <label className="form-check-label text-light" htmlFor="pago-transferencia">
                      transferencia bancaria
                    </label>
                  </div>

                  {errores.metodoPago && (
                    <div className="text-danger small mt-2">debes seleccionar un metodo de pago.</div>
                  )}
                </div>
              </fieldset>

              <button type="submit" className="btn btn-neon-primario w-100 py-3 fw-bold">
                confirmar orden y pagar
              </button>
            </form>
          </div>

          {/* COLUMNA DERECHA: RESUMEN FINAL */}
          <div className="col-lg-4">
            <div className="card card-custom p-4 sticky-top" style={{ top: '20px' }}>
              <h2 className="h5 mb-4 border-bottom pb-2 border-secondary titulo-gamer">
                resumen de tu orden
              </h2>

              <ul className="list-unstyled mb-4 text-light">
                {cart.map((item) => (
                  <li key={item.id} className="d-flex justify-content-between mb-2 small">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span className="fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">subtotal</span>
                <span className="fw-bold">${subtotal.toLocaleString('es-CL')}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 border-bottom pb-3 border-secondary">
                <span className="text-secondary">envio estimado</span>
                <span className="text-success fw-bold">gratis</span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="h5 m-0">total a pagar</span>
                <span className="h4 m-0 text-acento fw-bold">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}

export default Checkout;