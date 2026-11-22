import '../styles/enlaces-cuenta.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../data/api';

const campos = [
  ['nombre', 'Nombre completo', 'text'], ['rut', 'RUT', 'text'],
  ['email', 'Correo electrónico', 'email'], ['telefono', 'Teléfono', 'tel'],
  ['password', 'Contraseña', 'password'], ['calle', 'Calle', 'text'],
  ['numero', 'Número', 'number'], ['comuna', 'Comuna', 'text'], ['ciudad', 'Ciudad', 'text'],
];

export default function Registro() {
  const [datos, setDatos] = useState(Object.fromEntries(campos.map(([key]) => [key, ''])));
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const enviar = async event => {
    event.preventDefault();
    setError('');
    if (campos.some(([key]) => !datos[key].trim()) || !Number.isSafeInteger(Number(datos.numero)) || Number(datos.numero) <= 0) {
      setError('Completa todos los campos e ingresa un número de dirección válido.');
      return;
    }
    setEnviando(true);
    try {
      const response = await apiFetch('/api/v1/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: datos.nombre.trim(), rut: datos.rut.trim(), email: datos.email.trim(),
          telefono: datos.telefono.trim(), password: datos.password,
          direccion: { calle: datos.calle.trim(), numero: Number(datos.numero), comuna: datos.comuna.trim(), ciudad: datos.ciudad.trim() } }),
      });
      if (response.status === 201) {
        navigate('/login', { replace: true, state: { registroExitoso: true } });
      } else if (response.status === 400) {
        setError('Revisa los datos ingresados y completa todos los campos.');
      } else if (response.status === 409) {
        setError('El correo o RUT ya está registrado, o no coincide con un registro pendiente.');
      } else {
        setError('No se pudo completar el registro. Inténtalo nuevamente con los mismos datos.');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo nuevamente con los mismos datos.');
    } finally {
      setEnviando(false);
    }
  };

  return <main className="container my-5"><div className="card card-custom p-4 mx-auto" style={{ maxWidth: 600 }}>
    <h1 className="h2 mb-4">Crear cuenta</h1>
    <form onSubmit={enviar}>
      {campos.map(([key, label, type]) => <div key={key}>
        <label className="form-label" htmlFor={`registro-${key}`}>{label}</label>
        <input className="form-control mb-3" id={`registro-${key}`} type={type} required
          min={type === 'number' ? 1 : undefined} step={type === 'number' ? 1 : undefined}
          value={datos[key]} onChange={e => setDatos({ ...datos, [key]: e.target.value })} />
      </div>)}
      {error && <p role="alert" className="text-danger">{error}</p>}
      <button className="btn btn-primary w-100" disabled={enviando}>{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</button>
    </form><Link className="mt-3 enlace-cuenta" to="/login">Ya tengo cuenta</Link>
  </div></main>;
}
