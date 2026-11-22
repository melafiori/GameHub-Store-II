import '../styles/panel-gestion.css';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../data/api';
import { useSession } from '../context/SessionContext';
import GarantiasOperador from '../components/GarantiasOperador';
import BandejaOrdenes from '../components/BandejaOrdenes';
import AjustesStock from '../components/AjustesStock';

export default function GestionDespachos() {
  const { token, rol, cerrarSesion } = useSession();
  const [ordenes, setOrdenes] = useState([]);
  const [despachos, setDespachos] = useState([]);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [seccion, setSeccion] = useState('despachos');
  const autorizado = ['OPERADOR', 'ADMINISTRADOR'].includes(rol);
  const request = useCallback(async (path, options = {}) => {
    const response = await apiFetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
    if (response.status === 401) { cerrarSesion(); throw new Error('La sesión vencio. Inicia sesión nuevamente.'); }
    if (!response.ok) throw new Error(response.status === 403 ? 'No tienes permisos para gestionar despachos.' : 'No se pudo completar la operación.');
    return response.status === 204 ? null : response.json();
  }, [token]);
  const cargar = useCallback(async () => {
    try { const [o, d] = await Promise.all([request('/api/v1/orders/paid'), request('/api/v1/shippings')]); setOrdenes(o); setDespachos(d); setError(''); }
    catch (e) { setError(e.message); }
  }, [request]);
  useEffect(() => { if (token && autorizado) cargar(); }, [token, autorizado, cargar]);
  const ejecutar = async (path, method, body) => {
    setOcupado(true); setError('');
    try { await request(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) }); await cargar(); }
    catch (e) { setError(e.message); }
    finally { setOcupado(false); }
  };
  const siguiente = { PENDIENTE: 'EN_PREPARACION', EN_PREPARACION: 'EN_CAMINO', EN_CAMINO: 'ENTREGADO' };
  return <main className="container panel-gestion panel-operador operator-dashboard">
    <header className="admin-header"><div><span className="admin-eyebrow">GAMEHUB · PANEL DE CONTROL</span><h1>Panel de operador</h1><p>Gestiona pedidos, despachos y stock desde un solo lugar.</p></div>{token && autorizado && <div className="admin-stats"><div><strong>{ordenes.length}</strong><span>Órdenes pagadas</span></div><div><strong>{despachos.length}</strong><span>Despachos</span></div></div>}</header>
    {!token ? <p>Inicia sesión para continuar. <Link className="enlace-cuenta" to="/login">Iniciar sesión</Link></p> : !autorizado ? <p role="alert">No tienes permisos para gestionar despachos.</p> : <>
      <nav className="admin-tabs" aria-label="Secciones de operador">{[['despachos','Despachos'],['ordenes','Órdenes'],['stock','Stock'],['garantias','Garantías']].map(([key,label])=><button type="button" key={key} className={seccion===key?'admin-tab active':'admin-tab'} aria-current={seccion===key?'page':undefined} onClick={()=>setSeccion(key)}>{label}</button>)}</nav>
      {error && <p role="alert" className="admin-message">{error}</p>}
      <div hidden={seccion!=='despachos'}><section className="operator-section"><div className="admin-section-heading"><span className="admin-kicker">PREPARA Y ENVÍA</span><h2>Órdenes pagadas</h2><p>Revisa las compras listas para despacho y actualiza su seguimiento.</p></div>
      {ordenes.length === 0 && <p className="operator-empty">No hay órdenes pagadas por el momento.</p>}
      {ordenes.map(o => { const envio = despachos.find(d => d.orderId === o.id); return <div className="orden-card" key={o.id}>
        <h3 className="h5">Orden #{o.id}</h3><p>Total: ${Number(o.total).toLocaleString('es-CL')}</p>
        <p>Dirección: {o.direccionDespacho ? `${o.direccionDespacho.direccion}, ${o.direccionDespacho.comuna}, ${o.direccionDespacho.region}` : 'No disponible'}</p>
        {envio ? <><p>Estado: {envio.estado}</p><p>Seguimiento: {envio.tracking}</p>{siguiente[envio.estado] && <button className="btn btn-neon-primario" disabled={ocupado} onClick={() => ejecutar(`/api/v1/shippings/${envio.shippingId}/status`, 'PATCH', { estado: siguiente[envio.estado] })}>Avanzar a {siguiente[envio.estado]}</button>}</> : <button className="btn btn-neon-primario" disabled={ocupado || !o.direccionDespacho} onClick={() => ejecutar(`/api/v1/shippings/orders/${o.id}`, 'POST')}>Crear despacho</button>}
      </div>})}
      </section></div>
      <div hidden={seccion!=='ordenes'}><BandejaOrdenes token={token} /></div>
      <div hidden={seccion!=='stock'}><AjustesStock token={token} /></div>
      <div hidden={seccion!=='garantias'}><GarantiasOperador token={token} /></div>
    </>}
  </main>;
}
