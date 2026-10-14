import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header-principal">
      {/* LOGO */}
      <div className="logo">
        <Link to="/">
          <img
            src="src/assets/icons/icono-wishlist.svg"
            alt="logotipo de GameHub Store"
          />
          GameHub
        </Link>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="busqueda">
        <form action="#" method="GET">
          <input
            type="text"
            placeholder="Buscar producto..."
            aria-label="busqueda en el catalogo"
            required
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {/* CARRITO, LOGIN Y ÓRDENES */}
      <nav className="nav-derecha">
        <ul>
          <li>
            <Link to="/carrito">
              <img
                src="src/assets/icons/icono-carrito.svg"
                alt="icono de carrito de compras"
              />
              Carrito
            </Link>
          </li>
          <li>
            <Link to="/login">
              <img
                src="src/assets/icons/icono-usuario.svg"
                alt="icono de inicio de sesion"
              />
              Login
            </Link>
          </li>
          <li>
            <Link to="/mis-ordenes">
              <img
                src="src/assets/icons/icono-ordenes.png"
                alt="icono de mis órdenes"
              />
              Mis órdenes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header