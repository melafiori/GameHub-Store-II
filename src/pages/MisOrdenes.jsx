
import React, { useState } from 'react';

// Datos de prueba simulados para las órdenes.
const ORDENES_INICIALES = [
  {
    id: 'GH-8904',
    fecha: '12 de octubre de 2026',
    estado: 'Entregado',
    total: 899990,
    productos: [
      {
        id: 1,
        nombre: 'ASUS TUF Gaming A15',
        cantidad: 1,
        precio: 899990,
      },
    ],
  },
  {
    id: 'GH-7612',
    fecha: '28 de septiembre de 2026',
    estado: 'Entregado',
    total: 151980,
    productos: [
      {
        id: 19,
        nombre: 'Teclado Mecánico RGB',
        cantidad: 1,
        precio: 110990,
      },
      {
        id: 29,
        nombre: 'Mouse Pad gamer',
        cantidad: 1,
        precio: 40990,
      },
    ],
  },
];

// Cargar las órdenes guardadas y combinar con los datos de prueba.
function cargarOrdenes() {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem('gamehub_ordenes') || '[]'
    );

    if (!Array.isArray(guardadas)) {
      return ORDENES_INICIALES;
    }

    const idsGuardados = new Set(guardadas.map((orden) => orden.id));

    const ordenesPrueba = ORDENES_INICIALES.filter(
      (orden) => !idsGuardados.has(orden.id)
    );

    return [...guardadas, ...ordenesPrueba];
  } catch {
    return ORDENES_INICIALES;
  }
}

function cargarRegistros(clave) {
  try {
    const registros = JSON.parse(localStorage.getItem(clave) || '[]');
    return Array.isArray(registros) ? registros : [];
  } catch {
    return [];
  }
}

function MisOrdenes() {
  const [ordenes] = useState(cargarOrdenes);
  const [ordenExpandida, setOrdenExpandida] = useState(null);
  const [formularioActivo, setFormularioActivo] = useState({});
  const [mensajesFormulario, setMensajesFormulario] = useState({});
  const [resenas, setResenas] = useState(() =>
    cargarRegistros('gamehub_resenas')
  );
  const [solicitudesGarantia, setSolicitudesGarantia] = useState(() =>
    cargarRegistros('gamehub_garantias')
  );

  const toggleDetalle = (id) => {
    setOrdenExpandida((prev) => (prev === id ? null : id));
  };

  const toggleFormulario = (idOrden, tipo) => {
    setFormularioActivo((prev) => ({
      ...prev,
      [idOrden]: prev[idOrden] === tipo ? null : tipo,
    }));

    setMensajesFormulario((prev) => ({
      ...prev,
      [idOrden]: '',
    }));
  };

  const handleSubmitResena = (e, orden) => {
    e.preventDefault();

    const formulario = e.currentTarget;
    const calificacion = formulario.elements[
      `calificacion-${orden.id}`
    ].value;
    const comentario = formulario.elements[
      `comentario-${orden.id}`
    ].value.trim();

    if (!comentario) return;

    const nuevaResena = {
      id: `RES-${Date.now()}`,
      idOrden: orden.id,
      calificacion: Number(calificacion),
      comentario,
      fecha: new Date().toLocaleDateString('es-CL'),
      productos: orden.productos.map((producto) => producto.nombre),
    };

    const nuevasResenas = [...resenas, nuevaResena];

    try {
      localStorage.setItem(
        'gamehub_resenas',
        JSON.stringify(nuevasResenas)
      );

      setResenas(nuevasResenas);
      setMensajesFormulario((prev) => ({
        ...prev,
        [orden.id]: '¡Gracias por tu reseña! Ha sido guardada con éxito.',
      }));
      setFormularioActivo((prev) => ({
        ...prev,
        [orden.id]: null,
      }));
    } catch {
      setMensajesFormulario((prev) => ({
        ...prev,
        [orden.id]: 'No se pudo guardar la reseña. Inténtalo nuevamente.',
      }));
    }
  };

  const handleSubmitGarantia = (e, orden) => {
    e.preventDefault();

    const formulario = e.currentTarget;
    const motivo = formulario.elements[
      `motivo-${orden.id}`
    ].value.trim();

    if (!motivo) return;

    const nuevaSolicitud = {
      id: `GAR-${Date.now()}`,
      idOrden: orden.id,
      motivo,
      fecha: new Date().toLocaleDateString('es-CL'),
      estado: 'Pendiente',
    };

    const nuevasSolicitudes = [...solicitudesGarantia, nuevaSolicitud];

    try {
      localStorage.setItem(
        'gamehub_garantias',
        JSON.stringify(nuevasSolicitudes)
      );

      setSolicitudesGarantia(nuevasSolicitudes);
      setMensajesFormulario((prev) => ({
        ...prev,
        [orden.id]:
          'Solicitud de garantía guardada. Su estado es pendiente.',
      }));
      setFormularioActivo((prev) => ({
        ...prev,
        [orden.id]: null,
      }));
    } catch {
      setMensajesFormulario((prev) => ({
        ...prev,
        [orden.id]:
          'No se pudo guardar la solicitud. Inténtalo nuevamente.',
      }));
    }
  };

  return (
    <main className="ordenes-container">
      <h1>Mis órdenes</h1>

      <p className="ordenes-descripcion">
        Revisa tus compras y consulta el estado de tus pedidos.
      </p>

      <section className="lista-ordenes">
        {ordenes.length === 0 ? (
          <p>No tienes órdenes registradas todavía.</p>
        ) : (
          ordenes.map((orden) => {
            const esExpandida = ordenExpandida === orden.id;
            const formTipo = formularioActivo[orden.id];
            const mensaje = mensajesFormulario[orden.id];

            const garantiasDeOrden = solicitudesGarantia.filter(
              (solicitud) => solicitud.idOrden === orden.id
            );

            return (
              <div key={orden.id} className="orden-card">
                <div className="orden-informacion">
                  <h2>Orden #{orden.id}</h2>

                  <p>
                    Fecha de compra: <strong>{orden.fecha}</strong>
                  </p>

                  <p>
                    Estado:{' '}
                    <strong className="text-acento">
                      {orden.estado || 'Procesando'}
                    </strong>
                  </p>

                  <p>
                    Total:{' '}
                    <strong>
                      ${(Number(orden.total) || 0).toLocaleString('es-CL')}
                    </strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn"
                  onClick={() => toggleDetalle(orden.id)}
                >
                  {esExpandida ? 'Ocultar detalle' : 'Ver detalle'}
                </button>

                {esExpandida && (
                  <div className="detalle-orden">
                    <div className="detalle-separador"></div>

                    <h3>Estado del pedido</h3>

                    {orden.estado === 'Entregado' ? (
                      <>
                        <p className="estado-exitoso">
                          <span className="indicador-estado"></span>
                          Entregado con éxito el {orden.fecha}
                        </p>

                        <p className="paso-completado">
                          Producto recibido por el destinatario en la
                          dirección acordada.
                        </p>
                      </>
                    ) : (
                      <p>
                        Estado actual: <strong>{orden.estado || 'Procesando'}</strong>.
                        Todavía no se ha confirmado la entrega.
                      </p>
                    )}

                    <h3>Productos comprados</h3>

                    <div className="productos-orden">
                      {(Array.isArray(orden.productos) ? orden.productos : []).map(
                        (prod, indice) => (
                          <div
                            key={`${prod.id}-${indice}`}
                            className="producto-orden"
                          >
                            <span>{prod.nombre}</span>
                            <span>Cant: {prod.cantidad}</span>
                            <strong>
                              $
                              {(
                                (Number(prod.precio) || 0) *
                                (Number(prod.cantidad) || 0)
                              ).toLocaleString('es-CL')}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    {Number(orden.descuento) > 0 && (
                      <p>
                        Descuento aplicado:{' '}
                        <strong>
                          -$
                          {Number(orden.descuento).toLocaleString('es-CL')}
                        </strong>
                        {orden.cupon && ` (${orden.cupon})`}
                      </p>
                    )}

                    {garantiasDeOrden.length > 0 && (
                      <div className="mt-3">
                        <h3>Solicitudes de garantía</h3>

                        {garantiasDeOrden.map((solicitud) => (
                          <p key={solicitud.id}>
                            <strong>{solicitud.estado}:</strong>{' '}
                            {solicitud.motivo}
                          </p>
                        ))}
                      </div>
                    )}

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

                    {mensaje && (
                      <p
                        role="status"
                        className="mensaje-formulario mensaje-exito mt-3"
                      >
                        {mensaje}
                      </p>
                    )}

                    {formTipo === 'resena' && (
                      <form
                        className="formulario-resena"
                        onSubmit={(e) => handleSubmitResena(e, orden)}
                      >
                        <h3>Escribir una reseña</h3>

                        <label htmlFor={`calificacion-${orden.id}`}>
                          Calificación
                        </label>

                        <select
                          id={`calificacion-${orden.id}`}
                          name={`calificacion-${orden.id}`}
                          defaultValue="5"
                          required
                        >
                          <option value="5">★★★★★ (5/5)</option>
                          <option value="4">★★★★☆ (4/5)</option>
                          <option value="3">★★★☆☆ (3/5)</option>
                          <option value="2">★★☆☆☆ (2/5)</option>
                          <option value="1">★☆☆☆☆ (1/5)</option>
                        </select>

                        <label htmlFor={`comentario-${orden.id}`}>
                          Tu opinión
                        </label>

                        <textarea
                          id={`comentario-${orden.id}`}
                          name={`comentario-${orden.id}`}
                          rows="4"
                          placeholder="Escribe tu opinión sobre el producto..."
                          required
                        ></textarea>

                        <button type="submit" className="btn btn-resena">
                          Enviar reseña
                        </button>
                      </form>
                    )}

                    {formTipo === 'garantia' && (
                      <form
                        className="formulario-garantia"
                        onSubmit={(e) => handleSubmitGarantia(e, orden)}
                      >
                        <h3>Solicitar garantía</h3>

                        <label htmlFor={`motivo-${orden.id}`}>
                          Motivo de la falla
                        </label>

                        <textarea
                          id={`motivo-${orden.id}`}
                          name={`motivo-${orden.id}`}
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
          })
        )}
      </section>
    </main>
  );
}

export default MisOrdenes;