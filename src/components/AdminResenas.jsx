import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../data/api';
export default function AdminResenas({ token, productos }) {
  const [resenas, setResenas] = useState([]), [error, setError] = useState(''), [ocupado, setOcupado] = useState(false);
  const cargar = useCallback(async () => {
    const r = await apiFetch('/api/v1/reviews', { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error('No se pudieron cargar las reseñas (HTTP ' + r.status + ').');
    setResenas(await r.json());
  }, [token]);
  useEffect(() => { cargar().catch(e => setError(e.message)); }, [cargar]);
  const cambiar = async r => {
    setOcupado(true); setError('');
    try {
      const response = await apiFetch('/api/v1/reviews/' + r.resenaId + '/visibility', { method: 'PATCH', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: r.estado !== 'ACTIVA' }) });
      if (!response.ok) throw new Error('No se pudo actualizar la reseña (HTTP ' + response.status + ').');
      await cargar();
    } catch (e) { setError(e.message); } finally { setOcupado(false); }
  };
  return <section className="card card-custom p-4 my-4"><h2>Moderación de reseñas</h2>
    {error && <p role="alert">{error}</p>}{!resenas.length && !error && <p>No hay reseñas registradas.</p>}
    {resenas.map(r => <article className="border-top mt-3 pt-3" key={r.resenaId}>
      <h3>{productos.find(p => p.id === r.productId)?.nombre || 'Producto #' + r.productId}</h3>
      <p>Puntuación: {r.puntuacion}/5 - Fecha: {r.fecha?.slice(0, 10)} - Estado: {r.estado === 'ACTIVA' ? 'Visible' : 'Oculta'}</p>
      <p>{r.comentario}</p><button type="button" className="btn btn-outline-info" disabled={ocupado} onClick={() => cambiar(r)}>{r.estado === 'ACTIVA' ? 'Ocultar' : 'Volver a publicar'}</button>
    </article>)}
  </section>;
}
