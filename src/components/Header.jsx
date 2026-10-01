import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
    return (
      <header className="header-principal">
        {/*LOGO UBICADO EN EL HEADER*/}
        <div className="logo">
          <Link to="/">
            <img
              src="src/assets/icons/icono-wishlist.svg"
              alt="logotipo de GameHub Store"
            />{" "}
            GameHub{" "}
            {/* hay que cambiar el nombre del archivo de la imagen, ruta o tipo de formato una vez tengamos la imagen*/}
          </Link>
        </div>
        {/*BARRA DE BUSQUEDA EN EL HEADER*/}
        <div className="busqueda">
          <form action="#" method="GET">
            <input
              type="text"
              placeholder="Buscar producto..."
              aria-label="busqueda en el catalogo"
              required=""
            />
            <button tipe="submit">Buscar</button>
          </form>
        </div>
        {/*CARRITO E INICIO DE SESION*/}
        <nav className="nav-derecha">
          <ul>
            <li>
              <a href="carrito.html">
                {" "}
                <img
                  src="src/assets/icons/icono-carrito.svg"
                  alt="icono de carrito de compras"
                />{" "}
                Carrito{" "}
              </a>
            </li>{" "}
            {/*AÑADIR MAS ADELANTE*/}
            <li>
              <a href="login.html">
                {" "}
                <img
                  src="src/assets/icons/icono-usuario.svg"
                  alt="icono de inicio de sesion"
                />{" "}
                Login{" "}
              </a>
            </li>{" "}
            {/*AÑADIR MAS ADELANTE*/}
            <li>
              <a href="mis-ordenes.html">
                {" "}
                <img
                  src="src/assets/icons/icono-ordenes.png"
                  alt="icono de mis órdenes"
                />
                Mis órdenes
              </a>
            </li>
          </ul>
        </nav>
      </header>

     
    )
}

export default Header