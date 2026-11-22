import '../styles/enlaces-cuenta.css';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function Perfil() {
  const { token, rol, perfil, errorPerfil, cerrarSesion } = useSession();
  return <main className="container my-5"><div className="card card-custom p-4 mx-auto" style={{ maxWidth: 600 }}>
    <h1 className="h2 mb-4">Mi perfil</h1>
    {!token ? <p>Inicia sesión para ver tu perfil. <Link className="enlace-cuenta" to="/login">Iniciar sesión</Link></p> : <>
      {errorPerfil ? <p role="alert">{errorPerfil}</p> : !perfil ? <p role="status">Cargando perfil…</p> : <>
        <p><strong>Nombre:</strong> {perfil.nombre}</p><p><strong>Correo:</strong> {perfil.email}</p><p><strong>Teléfono:</strong> {perfil.telefono}</p>
        {perfil.direcciones?.map(direccion => <p key={direccion.id}><strong>Dirección:</strong> {direccion.calle} {direccion.numero}, {direccion.comuna}, {direccion.ciudad}</p>)}
      </>}
      {['OPERADOR', 'ADMINISTRADOR'].includes(rol) && <p><strong>Rol: {rol}</strong> <Link className="enlace-cuenta" to="/gestion-despachos">Gestionar despachos</Link></p>}
      {rol === 'ADMINISTRADOR' && <p><Link className="enlace-cuenta" to="/admin">Panel de administración</Link></p>}
      <button className="btn btn-outline-info" onClick={cerrarSesion}>Cerrar sesión</button>
    </>}
  </div></main>;
}
