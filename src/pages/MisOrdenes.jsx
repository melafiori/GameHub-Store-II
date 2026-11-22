import '../styles/enlaces-cuenta.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../data/api';
import { useSession } from '../context/SessionContext';
import '../styles/ordenes.css';
import GarantiasOrden from '../components/GarantiasOrden';

function MisOrdenes() {
  const { token, cerrarSesion } = useSession();
  const [ordenes, setOrdenes] = useState([]);
  const [nombres, setNombres] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [expandida, setExpandida] = useState(null);
  const [seguimientos, setSeguimientos] = useState({});
  const [formularios, setFormularios] = useState({});
  const [resenaEstado, setResenaEstado] = useState({});
  const enviarResena = async (event, orden) => {
    event.preventDefault();
    const datos = formularios[orden.id] || {};
    setResenaEstado(prev => ({ ...prev, [orden.id]: { enviando: true } }));
    try {
      const response = await apiFetch('/api/v1/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ orderId: orden.id, productId: Number(datos.productId || orden.items[0]?.productId), puntuacion: Number(datos.puntuacion || 5), comentario: datos.comentario || '' }) });
      if (response.status === 401) { cerrarSesion(); throw new Error('Tu sesión venció. Inicia sesión nuevamente.'); }
      if (response.status === 409) throw new Error('Esta orden ya fue reseñada. Solo se permite una reseña por orden.');
      if (!response.ok) throw new Error('No se pudo publicar la reseña. Revisa los datos e inténtalo nuevamente.');
      setResenaEstado(prev => ({ ...prev, [orden.id]: { exito: true, mensaje: 'Reseña publicada correctamente.' } }));
    } catch (error) { setResenaEstado(prev => ({ ...prev, [orden.id]: { mensaje: error.message || 'No se pudo conectar con el servidor.' } })); }
  };
  const actualizarResena = (id, campo, valor) => setFormularios(prev => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
  const verDetalle = async id => {
    if (expandida === id) { setExpandida(null); return; }
    setExpandida(id);
    await cargarSeguimiento(id);
  };
  const cargarSeguimiento = async id => {
    setSeguimientos(prev => ({...prev, [id]: { cargando: true }}));
    try {
      const r = await apiFetch('/api/v1/shippings/order/' + id, { headers: { Authorization: 'Bearer ' + token } });
      if (r.status === 401) { cerrarSesion(); return; }
      if (r.status === 204) { setSeguimientos(prev => ({...prev, [id]: { sinDespacho: true }})); return; }
      if (!r.ok) throw new Error('seguimiento');
      const data = await r.json(); setSeguimientos(prev => ({...prev, [id]: data}));
    } catch { setSeguimientos(prev => ({...prev, [id]: { error: true }})); }
  };
  useEffect(() => {
    if (!token) { setOrdenes([]); return; }
    const controller = new AbortController();
    setOrdenes([]); setCargando(true); setMensaje('');
    apiFetch('/api/v1/orders/me', { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(async response => {
        if (response.status === 401) { cerrarSesion(); setMensaje('Tu sesión venció. Inicia sesión nuevamente.'); return; }
        if (!response.ok) throw new Error('No se pudieron cargar tus órdenes.');
        setOrdenes(await response.json());
      }).catch(error => { if (error.name !== 'AbortError') setMensaje('No se pudieron cargar tus órdenes. Comprueba la conexión.'); })
      .finally(() => { if (!controller.signal.aborted) setCargando(false); });
    apiFetch('/api/v1/products', { signal: controller.signal }).then(r => r.ok ? r.json() : []).then(productos => {
      setNombres(Object.fromEntries(productos.map(p => [p.id ?? p.productId, p.nombre])));
    }).catch(() => {});
    return () => controller.abort();
  }, [token]);
  return <main className="container my-5 ordenes-container">
    <h1>Mis órdenes</h1>
    <p className="ordenes-descripcion">Revisa tus compras y consulta el estado de tus pedidos.</p>
    {!token && <p>Inicia sesión para ver tus órdenes. <Link className="enlace-cuenta" to="/login">Iniciar sesion</Link></p>}
    {mensaje && <p role="alert">{mensaje}</p>}
    {cargando && <p role="status">Cargando órdenes...</p>}
    {token && !cargando && !mensaje && <section className="lista-ordenes">
      {ordenes.length === 0 ? <p>No tienes órdenes registradas todavía.</p> : ordenes.map(orden => <div key={orden.id} className="orden-card">
        <div className="orden-informacion"><h2>Orden #{orden.id}</h2><p>Estado: <strong className="text-acento">{orden.estado}</strong></p><p>Total: <strong>${Number(orden.total).toLocaleString('es-CL')}</strong></p></div>
        <button type="button" className="btn" onClick={() => verDetalle(orden.id)}>{expandida === orden.id ? 'Ocultar detalle' : 'Ver detalle'}</button>
        {expandida === orden.id && <div className="detalle-orden"><div className="detalle-separador" />{Number(orden.descuento) > 0 && <p>Subtotal: ${Number(orden.subtotal).toLocaleString('es-CL')} - Descuento: ${Number(orden.descuento).toLocaleString('es-CL')} ({orden.codigoCupon})</p>}<h3>Seguimiento</h3>{seguimientos[orden.id]?.cargando ? <p>Cargando seguimiento...</p> : seguimientos[orden.id]?.error ? <div><p role="alert">No se pudo cargar el seguimiento.</p><button type="button" className="btn" onClick={() => cargarSeguimiento(orden.id)}>Reintentar seguimiento</button></div> : seguimientos[orden.id]?.sinDespacho ? <p>Aún sin despacho</p> : seguimientos[orden.id] && <p>Estado: {seguimientos[orden.id].estado} · Seguimiento: {seguimientos[orden.id].tracking}</p>}<h3>Dirección de despacho</h3><p>{orden.direccionDespacho ? `${orden.direccionDespacho.direccion}, ${orden.direccionDespacho.comuna}, ${orden.direccionDespacho.region}` : 'Dirección no registrada para esta orden.'}</p><h3>Productos comprados</h3><div className="productos-orden">
          {orden.items.map(item => <div key={item.productId} className="producto-orden"><span>{nombres[item.productId] || `Producto #${item.productId}`}</span><span>Cant: {item.cantidad}</span><strong>${(item.precioUnitario * item.cantidad).toLocaleString('es-CL')}</strong></div>)}
        </div>{orden.estado === 'PAGADA' && <form onSubmit={event => enviarResena(event, orden)} className="formulario-resena">
          <h3>Reseñar un producto</h3><p>Una reseña por orden; elige el producto que quieres reseñar.</p>
          <div className="resena-campos">
            {orden.items.length === 1 ? <div className="resena-producto"><span>Producto</span><p>{nombres[orden.items[0].productId] || 'Producto #' + orden.items[0].productId}</p></div> : <label>Producto <select className="form-select" value={formularios[orden.id]?.productId || orden.items[0]?.productId || ''} onChange={e => actualizarResena(orden.id, 'productId', e.target.value)}>{orden.items.map(item => <option key={item.productId} value={item.productId}>{nombres[item.productId] || 'Producto #' + item.productId}</option>)}</select></label>}
            <label>Calificación <select className="form-select" value={formularios[orden.id]?.puntuacion || 5} onChange={e => actualizarResena(orden.id, 'puntuacion', e.target.value)}>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrellas</option>)}</select></label>
          </div>
          <label className="d-block">Comentario <textarea className="form-control" required maxLength={1000} value={formularios[orden.id]?.comentario || ''} onChange={e => actualizarResena(orden.id, 'comentario', e.target.value)} /></label>
          <button className="btn btn-primary mt-2" disabled={resenaEstado[orden.id]?.enviando || resenaEstado[orden.id]?.exito}>Publicar reseña</button>
          {resenaEstado[orden.id]?.mensaje && <p role="status">{resenaEstado[orden.id].mensaje}</p>}
        </form>}<GarantiasOrden orden={orden} token={token} entrega={seguimientos[orden.id]} nombres={nombres} /></div>}
      </div>)}
    </section>}
  </main>;
}
export default MisOrdenes;
