
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productos } from '../data/productos';
import { useCart } from '../context/CartContext';
import '../styles/producto.css';
import ListaResenas from '../components/ListaResenas';

import iconoCarrito from '../assets/icons/icono-carrito.svg';

const IDS_OFERTAS = [2, 4, 29, 19];

const CATEGORIA_SLUGS = {
  'Notebooks': 'notebooks',
  'Tarjetas Gráficas': 'graficas',
  'Procesadores': 'procesadores',
  'Periféricos': 'perifericos',
  'Consolas': 'consolas',
  'Monitores': 'monitores',
  'Accesorios': 'accesorios',
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
  const [esErrorCarrito, setEsErrorCarrito] = useState(false);

  useEffect(() => {
    if (producto) {
      setImagenSeleccionada(producto.imagen);
      setCantidad(1);
      setMensajeCarrito('');
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
    setCantidad((prev) => Math.max(1, prev - 1));
    setMensajeCarrito('');
  };

  const handleSumar = () => {
    if (producto.stock <= 0) {
      setMensajeCarrito('Este producto no tiene stock disponible.');
      setEsErrorCarrito(true);
      return;
    }

    setCantidad((prev) => {
      if (prev >= producto.stock) {
        setMensajeCarrito(
          `Solo hay ${producto.stock} unidades disponibles.`
        );
        setEsErrorCarrito(true);
        return producto.stock;
      }

      setMensajeCarrito('');
      return prev + 1;
    });
  };

  const handleCambiarCantidad = (e) => {
    const valor = e.target.value;

    if (valor === '') {
      setCantidad('');
      setMensajeCarrito('');
      return;
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero < 1) {
      setCantidad(1);
      return;
    }

    if (numero > producto.stock) {
      setCantidad(producto.stock);
      setMensajeCarrito(
        `Solo hay ${producto.stock} unidades disponibles.`
      );
      setEsErrorCarrito(true);
      return;
    }

    setCantidad(numero);
    setMensajeCarrito('');
    setEsErrorCarrito(false);
  };

  const handleAgregarAlCarrito = (e) => {
    e.preventDefault();

    if (producto.stock <= 0) {
      setMensajeCarrito('Este producto no tiene stock disponible.');
      setEsErrorCarrito(true);
      return;
    }

    if (!Number.isInteger(Number(cantidad)) || Number(cantidad) < 1) {
      setMensajeCarrito('Ingresa una cantidad válida.');
      setEsErrorCarrito(true);
      return;
    }

    if (Number(cantidad) > producto.stock) {
      setMensajeCarrito(
        `Solo hay ${producto.stock} unidades disponibles.`
      );
      setEsErrorCarrito(true);
      return;
    }

    const precioFinal = esOferta ? precioOferta : producto.precio;

    const resultado = agregarAlCarrito(
      {
        ...producto,
        precio: precioFinal,
      },
      Number(cantidad)
    );

    if (resultado?.ok) {
      setMensajeCarrito(
        `¡Añadido! (${cantidad}) ${producto.nombre} al carrito.`
      );
      setEsErrorCarrito(false);
    } else {
      setMensajeCarrito(
        resultado?.mensaje || 'No se pudo agregar el producto al carrito.'
      );
      setEsErrorCarrito(true);
    }
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
      <nav className="miga-de-pan mb-4" aria-label="Ruta de navegación">
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

      <div className="producto-detalle">
        <section className="producto-galeria">
          <div className="galeria-imagen-principal">
            <img
              src={imagenSeleccionada || producto.imagen}
              alt={producto.nombre}
            />
          </div>

          <ul className="galeria-miniaturas">
            {[...Array(4)].map((_, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="btn-miniatura"
                  onClick={() => setImagenSeleccionada(producto.imagen)}
                  aria-label={`Seleccionar vista ${index + 1}`}
                >
                  <img
                    src={producto.imagen}
                    alt={`Vista ${index + 1} de ${producto.nombre}`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="producto-informacion">
          <p className="producto-marca">{producto.marca}</p>
          <h1 className="producto-titulo">{producto.nombre}</h1>

          <div className="producto-valoracion">
            <a href="#reseñas">Ver reseñas y calificaciones</a>
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
                <span className="etiqueta-descuento">
                  -{porcentajeDescuento}%
                </span>
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
                  disabled={Number(cantidad) <= 1}
                  aria-label="Restar cantidad"
                >
                  -
                </button>

                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={cantidad}
                  min="1"
                  max={producto.stock}
                  onChange={handleCambiarCantidad}
                  aria-label="Cantidad de productos"
                />

                <button
                  type="button"
                  className="btn-cantidad"
                  onClick={handleSumar}
                  disabled={
                    producto.stock <= 0 || Number(cantidad) >= producto.stock
                  }
                  aria-label="Sumar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-agregar-carrito"
              disabled={producto.stock <= 0 || cantidad === ''}
            >
              <img src={iconoCarrito} alt="" />
              {producto.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

            {mensajeCarrito && (
              <p
                role="status"
                className={`mensaje-carrito mt-2 ${
                  esErrorCarrito ? 'text-danger mostrar' : 'mostrar'
                }`}
              >
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

      <section className="producto-especificaciones my-5">
        <h2>Especificaciones técnicas</h2>

        <div className="table-responsive">
          <table className="tabla-especificaciones table table-dark table-striped">
            <tbody>
              {producto.especificaciones &&
                Object.entries(producto.especificaciones).map(([clave, valor]) => (
                  <tr key={clave}>
                    <th scope="row">{clave}</th>
                    <td>{valor}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="producto-descripcion mt-4">
          <h3>Descripción</h3>
          <p>{producto.descripcion}</p>
        </div>
      </section>

      
      <ListaResenas
        resenas={[
          {
            id: 1,
            autor: 'Martín G.',
            calificacion: 5,
            fecha: '2026-08-12',
            comentario:
              'Excelente rendimiento para el precio, llevo tiempo probando sin problemas y muy buena experiencia.',
          },
          {
            id: 2,
            autor: 'Camila R.',
            calificacion: 4,
            fecha: '2026-09-20',
            comentario:
              'Buen producto, cumple con lo esperado y llegó en buenas condiciones.',
          },
          {
            id: 3,
            autor: 'Diego P.',
            calificacion: 4,
            fecha: '2026-09-01',
            comentario:
              'Buena experiencia y buen rendimiento.',
          },
        ]}
      />
    </main>
  );
}

export default DetalleProducto;