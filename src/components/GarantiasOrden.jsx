import { useEffect, useState } from 'react';
import { apiFetch } from '../data/api';

export default function GarantiasOrden({ orden, token, entrega, nombres }) {
  const [garantias, setGarantias] = useState([]);
  const [estado, setEstado] = useState('cargando');
  const [elegibilidad, setElegibilidad] = useState(null);
  const [errorElegibilidad, setErrorElegibilidad] = useState(false);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const consultarElegibilidad = async (signal) => {
    setErrorElegibilidad(false); setElegibilidad(null);
    try {
      const r = await apiFetch('/api/v1/warranties/orders/' + orden.id + '/eligibility', { headers: { Authorization: 'Bearer ' + token }, signal });
      if (!r.ok) throw new Error('Consulta fallida');
      const data = await r.json();
      if (typeof data.elegible !== 'boolean') throw new Error('Respuesta invalida');
      if (!signal?.aborted) setElegibilidad(data);
    } catch (error) { if (!signal?.aborted) setErrorElegibilidad(true); }
  };
  const [producto, setProducto] = useState(orden.items[0]?.productId || '');
  const [motivo, setMotivo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const cargar = async (signal) => {
    setEstado('cargando');
    try {
      const r = await apiFetch('/api/v1/warranties/me', { headers: { Authorization: 'Bearer ' + token }, signal });
      if (!r.ok) throw new Error('No se pudieron cargar las garantías.');
      const data = await r.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inválida');
      if (!signal?.aborted) { setGarantias(data.filter(g => g.orderId === orden.id)); setEstado('listo'); }
    } catch (error) { if (!signal?.aborted) setEstado('error'); }
  };
  useEffect(() => { const controller = new AbortController(); cargar(controller.signal); consultarElegibilidad(controller.signal); return () => controller.abort(); }, [token, orden.id]);
  const solicitar = async event => {
    event.preventDefault(); setOcupado(true); setMensaje('');
    try {
      const r = await apiFetch('/api/v1/warranties', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: orden.id, productId: Number(producto), motivo }) });
      if (!r.ok) { const data = await r.json().catch(() => ({})); throw new Error(data.error || (r.status === 401 ? 'La sesión venció. Inicia sesión nuevamente.' : 'No se pudo solicitar la garantía.')); }
      setMotivo(''); setFormularioAbierto(false); await cargar(); setMensaje('Solicitud enviada.');
    } catch (e) { setMensaje(e.message || 'Error de conexión.'); } finally { setOcupado(false); }
  };
  return <section className="mt-4"><h3>Garantías</h3>
    {estado === 'cargando' && <p role="status">Cargando garantías...</p>}
    {estado === 'error' && <div><p role="alert">No se pudieron cargar las garantías.</p><button type="button" className="btn" onClick={() => cargar()}>Reintentar garantías</button></div>}
    {estado === 'listo' && (garantias.length === 0 ? <p>No hay solicitudes para esta orden.</p> : garantias.map(g => <p key={g.warrantyId}>{nombres[g.productId] || `Producto #${g.productId}`}: <strong>{g.estado}</strong>{g.resolution && <> - Resolución: {g.resolution}</>}</p>))}
    <button type="button" className="btn" disabled={!elegibilidad?.elegible} onClick={() => setFormularioAbierto(open => !open)}>Solicitar garantía</button>
    {!elegibilidad && !errorElegibilidad && <p role="status">Comprobando elegibilidad...</p>}
    {errorElegibilidad && <div><p role="alert">No se pudo comprobar el plazo de garantía.</p><button type="button" className="btn" onClick={() => consultarElegibilidad()}>Reintentar elegibilidad</button></div>}
    {elegibilidad && !elegibilidad.elegible && <p>{elegibilidad.motivo}</p>}
    {formularioAbierto && elegibilidad?.elegible && <form onSubmit={solicitar} className="formulario-garantia">
      <label>Producto <select className="form-select" value={producto} onChange={e => setProducto(e.target.value)}>{orden.items.map(i => <option key={i.productId} value={i.productId}>{nombres[i.productId] || `Producto #${i.productId}`}</option>)}</select></label>
      <label>Motivo <textarea className="form-control" required maxLength={255} value={motivo} onChange={e => setMotivo(e.target.value)} /></label>
      <button className="btn btn-primary mt-2" disabled={ocupado || !motivo.trim()}>Enviar solicitud</button>
    </form>}
    {mensaje && <p role="status">{mensaje}</p>}
  </section>;
}
