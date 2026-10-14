import React, { useState } from 'react';

// Datos de prueba simulados para las órdenes
const ORDENES_INICIALES = [
  {
    id: "GH-8904",
    fecha: "12 de octubre de 2026",
    estado: "Entregado",
    total: 899990,
    productos: [
      { id: 1, nombre: "ASUS TUF Gaming A15", cantidad: 1, precio: 899990 }
    ]
  },
  {
    id: "GH-7612",
    fecha: "28 de septiembre de 2026",
    estado: "Entregado",
    total: 151980,
    productos: [
      { id: 19, nombre: "Teclado Mecánico RGB", cantidad: 1, precio: 110990 },
      { id: 29, nombre: "Mouse Pad gamer", cantidad: 1, precio: 40990 }
    ]
  }
];

function MisOrdenes() {
  const [ordenes] = useState(ORDENES_INICIALES);
  const [ordenExpandida, setOrdenExpandida] = useState(null);
  const [formularioActivo, setFormularioActivo] = useState({});
  const [mensajesFormulario, setMensajesFormulario] = useState({});

  const toggleDetalle = (id) => {
    setOrdenExpandida(prev => (prev === id ? null : id));
  };

  const toggleFormulario = (idOrden, tipo) => {
    setFormularioActivo(prev => ({
      ...prev,
      [idOrden]: prev[idOrden] === tipo ? null : tipo
    }));
  };

  const handleSubmitResena = (e, idOrden) => {
    e.preventDefault();
    setMensajesFormulario(prev => ({
      ...prev,
      [idOrden]: "¡Gracias por tu reseña! Ha sido enviada con éxito."
    }));
  };

  const handleSubmitGarantia = (e, idOrden) => {
    e.preventDefault();
    setMensajesFormulario(prev => ({
      ...prev,
      [idOrden]: "Solicitud de garantía enviada. Nos pondremos en contacto contigo pronto."
    }));
  };

  return (
    <main className="ordenes-container">
      <h1>Mis órdenes</h1>
      <p className="ordenes-descripcion">
        Revisa tus compras y consulta el estado de tus pedidos.
      </p>

      <section className="lista-ordenes">
        {ordenes.map((orden) => {
          const esExpandida = ordenExpandida === orden.id;
          const formTipo = formularioActivo[orden.id];
          const mensaje = mensajesFormulario[orden.id];

          return (
            <div key={orden.id} className="orden-card">
              <div className="orden-informacion">
                <h2>Orden #{orden.id}</h2>
                <p>Fecha de compra: <strong>{orden.fecha}</strong></p>
                <p>Estado: <strong className="text-acento">{orden.estado}</strong></p>
                <p>Total: <strong>${orden.total.toLocaleString('es-CL')}</strong></p>
              </div>

              <button
                type="button"
                className="btn"
                onClick={() => toggleDetalle(orden.id)}
              >
                {esExpandida ? 'Ocultar detalle' : 'Ver detalle'}
              </button>

              {/* DETALLE DESPLEGABLE DE LA ORDEN */}
              {esExpandida && (
                <div className="detalle-orden">
                  <div className="detalle-separador"></div>

                  <h3>Estado del pedido</h3>
                  <p className="estado-exitoso">
                    <span className="indicador-estado"></span>
                    Entregado con éxito el {orden.fecha}
                  </p>
                  <p className="paso-completado">
                    Producto recibido por el destinatario en la dirección acordada.
                  </p>

                  <h3>Productos comprados</h3>
                  <div className="productos-orden">
                    {orden.productos.map((prod) => (
                      <div key={prod.id} className="producto-orden">
                        <span>{prod.nombre}</span>
                        <span>Cant: {prod.cantidad}</span>
                        <strong>${prod.precio.toLocaleString('es-CL')}</strong>
                      </div>
                    ))}
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="acciones-orden">
                    <button
                      type="button"
                      className="btn btn-resena"
                      onClick={() => toggleFormulario(orden.id, 'resena')}
                    >
                      Escribir reseña
                    </button>
                    <button
                      type="button"
                      className="btn btn-garantia"
                      onClick={() => toggleFormulario(orden.id, 'garantia')}
                    >
                      Solicitar garantía
                    </button>
                  </div>

                  {/* MENSAJE DE NOTIFICACIÓN */}
                  {mensaje && (
                    <p className="mensaje-formulario mensaje-exito mt-3">
                      {mensaje}
                    </p>
                  )}

                  {/* FORMULARIO DE RESEÑA */}
                  {formTipo === 'resena' && (
                    <form
                      className="formulario-resena"
                      onSubmit={(e) => handleSubmitResena(e, orden.id)}
                    >
                      <h3>Escribir una reseña</h3>
                      <label htmlFor={`calificacion-${orden.id}`}>Calificación</label>
                      <select id={`calificacion-${orden.id}`} required>
                        <option value="5">★★★★★ (5/5)</option>
                        <option value="4">★★★★☆ (4/5)</option>
                        <option value="3">★★★☆☆ (3/5)</option>
                        <option value="2">★★☆☆☆ (2/5)</option>
                        <option value="1">★☆☆☆☆ (1/5)</option>
                      </select>

                      <label htmlFor={`comentario-${orden.id}`}>Tu opinión</label>
                      <textarea
                        id={`comentario-${orden.id}`}
                        rows="4"
                        placeholder="Escribe tu opinión sobre el producto..."
                        required
                      ></textarea>

                      <button type="submit" className="btn btn-resena">
                        Enviar reseña
                      </button>
                    </form>
                  )}

                  {/* FORMULARIO DE GARANTÍA */}
                  {formTipo === 'garantia' && (
                    <form
                      className="formulario-garantia"
                      onSubmit={(e) => handleSubmitGarantia(e, orden.id)}
                    >
                      <h3>Solicitar garantía</h3>
                      <label htmlFor={`motivo-${orden.id}`}>Motivo de la falla</label>
                      <textarea
                        id={`motivo-${orden.id}`}
                        rows="4"
                        placeholder="Describe el problema que presenta tu producto..."
                        required
                      ></textarea>

                      <button type="submit" className="btn btn-garantia">
                        Enviar solicitud
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default MisOrdenes;