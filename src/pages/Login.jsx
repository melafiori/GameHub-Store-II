import '../styles/enlaces-cuenta.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const enviar = async e => {
    e.preventDefault(); setError(''); setEnviando(true);
    try { const rol = await iniciarSesion(email, password); navigate(rol === 'CLIENTE' && location.state?.volverA === '/checkout' ? '/checkout' : rol === 'ADMINISTRADOR' ? '/admin' : '/perfil'); }
    catch (err) { setError(err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message); }
    finally { setEnviando(false); }
  };
  return <main className="container my-5"><div className="card card-custom p-4 mx-auto" style={{ maxWidth: 500 }}>
    <h1 className="h2 mb-4 titulo-login">Iniciar sesión</h1>
    {location.state?.registroExitoso && <p role="status" className="text-success">Cuenta creada correctamente. Inicia sesión para continuar.</p>}
    <form onSubmit={enviar}>
      <label className="form-label" htmlFor="email">Correo electrónico</label>
      <input className="form-control mb-3" id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      <label className="form-label" htmlFor="password">Contraseña</label>
      <input className="form-control mb-3" id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p role="alert" className="text-danger">{error}</p>}
      <button className="btn btn-primary w-100" disabled={enviando}>Ingresar</button>
    </form><Link className="mt-3 enlace-cuenta" to="/registro">Crear cuenta</Link><Link className="mt-2 enlace-cuenta" to="/catcategoria">Volver al catálogo</Link>
  </div></main>;
}
