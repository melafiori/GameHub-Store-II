import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../data/api';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gamehub_token'));
  const [perfil, setPerfil] = useState(null);
  const [errorPerfil, setErrorPerfil] = useState('');
  const cerrarSesion = () => { localStorage.removeItem('gamehub_token'); setToken(null); setPerfil(null); setErrorPerfil(''); };

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    apiFetch('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(async r => {
        if (r.status === 401) { cerrarSesion(); return; }
        if (!r.ok) throw new Error('perfil');
        setPerfil(await r.json()); setErrorPerfil('');
      }).catch(e => { if (e.name !== 'AbortError') setErrorPerfil('No se pudo consultar tu perfil.'); });
    return () => controller.abort();
  }, [token]);

  const iniciarSesion = async (email, password) => {
    const r = await apiFetch('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (r.status === 401) throw new Error('Correo o contraseña incorrectos.');
    if (!r.ok) throw new Error('No se pudo iniciar sesión. Inténtalo nuevamente.');
    const valor = await r.text();
    localStorage.setItem('gamehub_token', valor);
    setToken(valor);
    try { return JSON.parse(atob(valor.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role; } catch { return null; }
  };
  let rol = null;
  try { if (token) rol = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role; } catch { /* invalid session */ }
  return <SessionContext.Provider value={{ token, rol, perfil, errorPerfil, iniciarSesion, cerrarSesion }}>{children}</SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
