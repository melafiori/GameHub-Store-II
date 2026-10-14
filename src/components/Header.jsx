import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Importaciones de íconos para que Vite los procese en producción
import iconoWishlist from '../assets/icons/icono-wishlist.svg'
import iconoCarrito from '../assets/icons/icono-carrito.svg'
import iconoUsuario from '../assets/icons/icono-usuario.svg'
import iconoOrdenes from '../assets/icons/icono-ordenes.png'

function Header() {
  const { cart } = useCart()
  const totalItems = cart ? cart.reduce((acc, item) => acc + item.cantidad, 0) : 0

  return (
    <header className="header-principal">
      {/* LOGO */}
      <div className="logo">
        <Link to="/">
          <img
            src={iconoWishlist}
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
                src={iconoCarrito}
                alt="icono de carrito de compras"
              />
              Carrito {totalItems > 0 && <span className="badge bg-danger ms-1">{totalItems}</span>}
            </Link>
          </li>
          <li>
            <Link to="/login">
              <img
                src={iconoUsuario}
                alt="icono de inicio de sesion"
              />
              Login
            </Link>
          </li>
          <li>
            <Link to="/mis-ordenes">
              <img
                src={iconoOrdenes}
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