import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productos } from '../data/productos';
import { useCart } from '../context/CartContext';
import '../styles/producto.css';

// Importación de ícono para producción en Vite/Vercel
import iconoCarrito from '../assets/icons/icono-carrito.svg';

const IDS_OFERTAS = [2, 4, 29, 19];

// Mapeo para convertir la categoría del producto a la Query Param correspondiente
const CATEGORIA_SLUGS = {
  "Notebooks": "notebooks",
  "Tarjetas Gráficas": "graficas",
  "Procesadores": "procesadores",
  "Periféricos": "perifericos",
  "Consolas": "consolas",
  "Monitores": "monitores",
  "Accesorios": "accesorios"
};

function DetalleProducto() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');
  const esOfertaParam = searchParams.get('oferta') === 'true';

  const { agregarAlCarrito } = useCart();
  const producto = productos.find((p) => p.id === Number(idParam));

  const [cantidad, setCantidad] = useState(1);
  const [imagenSeleccionada, setImagenSeleccionada] = useState('');
  const [mensajeCarrito, setMensajeCarrito] = useState('');

  useEffect(() => {
    if (producto) {
      setImagenSeleccionada(producto.imagen);
    }
  }, [producto]);

  if (!producto) {
    return (
      <main className="container text-center my-5">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido removido.</p>
        <Link to="/catcategoria" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const esOferta = esOfertaParam || IDS_OFERTAS.includes(producto.id);
  const precioOferta = Math.round(producto.precio * 0.9);
  const porcentajeDescuento = Math.round(
    ((producto.precio - precioOferta) / producto.precio) * 100
  );

  const handleRestar = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleSumar = () => {
    if (producto.stock > 0 && cantidad >= producto.stock) {
      alert(`Solo hay ${producto.stock} unidades en stock.`);
      return;
    }
    setCantidad((prev) => prev + 1);
  };

  const handleAgregarAlCarrito = (e) => {
    e.preventDefault();
    const precioFinal = esOferta ? precioOferta : producto.precio;

    agregarAlCarrito(
      {
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: precioFinal,
      },
      cantidad
    );

    setMensajeCarrito(`¡Añadido! (${cantidad}) ${producto.nombre} al carrito.`);
    setTimeout(() => setMensajeCarrito(''), 4000);
  };

  const claseStock =
    producto.stock === 0
      ? 'agotado'
      : producto.stock <= 3
      ? 'ultimas'
      : 'disponible';

  const slugCategoria = CATEGORIA_SLUGS[producto.categoria] || 'graficas';

  return (
    <main className="producto-main container my-4">
      {/* MIGA DE PAN */}
      <nav className="miga-de-pan mb-4" aria-label="ruta de navegación">
        <ul className="d-flex list-unstyled gap-2 align-items-center">
          <li>
            <Link to="/">Inicio</Link> /
          </li>
          <li>
            <Link to={`/catcategoria?categoria=${slugCategoria}`}>
              {producto.categoria}
            </Link>{' '}
            /
          </li>
          <li className="active" aria-current="page">
            {producto.nombre}
          </li>
        </ul>
      </nav>

      {/* SECCIÓN PRINCIPAL */}
      <div className="producto-detalle">
        <section className="producto-galeria">
          <div className="galeria-imagen-principal">
            <img src={imagenSeleccionada || producto.imagen} alt={producto.nombre} />
          </div>

          <ul className="galeria-miniaturas">
            {[...Array(4)].map((_, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="btn-miniatura"
                  onClick={() => setImagenSeleccionada(producto.imagen)}
                >
                  <img src={producto.imagen} alt={`Vista ${index + 1}`} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="producto-informacion">
          <p className="producto-marca">{producto.marca}</p>
          <h1 className="producto-titulo">{producto.nombre}</h1>

          <div className="producto-valoracion">
            <span className="estrellas">★★★★☆</span> <a href="#reseñas">128 reseñas</a>
          </div>

          <div className="producto-precio">
            {esOferta ? (
              <>
                <span className="precio-anterior">
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
                <span className="precio-actual">
                  ${precioOferta.toLocaleString('es-CL')}
                </span>
                <span className="etiqueta-descuento">-{porcentajeDescuento}%</span>
              </>
            ) : (
              <span className="precio-actual">
                ${producto.precio.toLocaleString('es-CL')}
              </span>
            )}
          </div>

          <p className="producto-cuotas">Hasta 12 cuotas sin interés</p>

          <p className={`producto-stock ${claseStock}`}>
            <span className="indicador-stock">{producto.estado}</span>
          </p>

          <form onSubmit={handleAgregarAlCarrito} className="producto-compra">
            <div className="selector-cantidad">
              <label htmlFor="cantidad">Cantidad</label>
              <div className="selector-cantidad-controles">
                <button
                  type="button"
                  className="btn-cantidad"
                  onClick={handleRestar}
                >
                  -
                </button>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={cantidad}
                  min="1"
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                />
                <button
                  type="button"
                  className="btn-cantidad"
                  onClick={handleSumar}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-agregar-carrito"
              disabled={producto.stock === 0}
            >
              <img src={iconoCarrito} alt="icono de carrito" />
              {producto.stock === 0 ? 'Sin Stock' : 'Agregar al carrito'}
            </button>

            {mensajeCarrito && (
              <p className="mensaje-carrito text-success mt-2">
                {mensajeCarrito}
              </p>
            )}
          </form>

          <ul className="producto-datos-envio">
            <li>Envíos a todo Chile</li>
            <li>Garantía de 6 meses</li>
            <li>Retiro gratis en tienda</li>
          </ul>
        </section>
      </div>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <section className="producto-especificaciones my-5">
        <h2>Especificaciones técnicas</h2>
        <table className="tabla-especificaciones table table-dark table-striped">
          <tbody>
            {producto.especificaciones &&
              Object.entries(producto.especificaciones).map(([clave, valor]) => (
                <tr key={clave}>
                  <th>{clave}</th>
                  <td>{valor}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="producto-descripcion mt-4">
          <h3>Descripción</h3>
          <p>{producto.descripcion}</p>
        </div>
      </section>

      {/* RESEÑAS */}
      <section className="producto-reseñas" id="reseñas">
        <h2>Reseñas de usuarios</h2>
        <div className="reseñas-resumen">
          <span className="reseñas-promedio">4.5</span>
          <span className="estrellas">★★★★☆</span>
          <p>Basado en 128 reseñas</p>
        </div>

        <ul className="reseñas-lista">
          <li className="reseña">
            <div className="reseña-cabecera">
              <span className="reseña-autor">Martín G.</span>
              <span className="estrellas">★★★★★</span>
              <span className="reseña-fecha">12 de agosto de 2026</span>
            </div>
            <p className="reseña-comentario">
              Excelente rendimiento para el precio, llevo tiempo probando sin
              problemas y muy buena experiencia.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default DetalleProducto;