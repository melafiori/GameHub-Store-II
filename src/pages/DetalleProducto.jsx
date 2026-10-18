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
      <main className="container text-center my-5 py-5">
        <h2 className="text-light">Producto no encontrado</h2>
        <p className="text-secondary">El producto que buscas no existe o ha sido removido.</p>
        <Link to="/catalogo" className="btn btn-primary mt-3">
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
    <main className="container my-5">
      {/* MIGAS DE PAN */}
      <nav className="mb-4" aria-label="Ruta de navegación">
        <ul className="d-flex list-unstyled gap-2 align-items-center m-0 p-0">
          <li>
            <Link to="/" className="text-info text-decoration-none">Inicio</Link> <span className="text-secondary ms-2">/</span>
          </li>
          <li>
            <Link to={`/catalogo?categoria=${slugCategoria}`} className="text-info text-decoration-none">
              {producto.categoria}
            </Link> <span className="text-secondary ms-2">/</span>
          </li>
          <li className="text-light fw-bold" aria-current="page">
            {producto.nombre}
          </li>
        </ul>
      </nav>

      {/* GRILLA PRINCIPAL BOOTSTRAP (2 COLUMNAS EN PC, 1 EN MÓVIL) */}
      <div className="row g-5">
        
        {/* COLUMNA IZQUIERDA: GALERÍA */}
        <section className="col-12 col-lg-6">
          <div className="producto-galeria">
            <div className="galeria-imagen-principal">
              <img
                src={imagenSeleccionada || producto.imagen}
                alt={producto.nombre}
                className="img-fluid"
              />
            </div>

            {/* GRILLA BOOTSTRAP PARA MINIATURAS */}
            <ul className="row g-2 list-unstyled mt-3 mb-0">
              {[...Array(4)].map((_, index) => (
                <li className="col-3" key={index}>
                  <button
                    type="button"
                    className="btn p-1 w-100 h-100 border-info bg-dark"
                    onClick={() => setImagenSeleccionada(producto.imagen)}
                    aria-label={`Seleccionar vista ${index + 1}`}
                  >
                    <img
                      src={producto.imagen}
                      alt={`Vista ${index + 1} de ${producto.nombre}`}
                      className="img-fluid"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* COLUMNA DERECHA: INFORMACIÓN Y COMPRA */}
        <section className="col-12 col-lg-6 producto-informacion">
          <p className="producto-marca">{producto.marca}</p>
          <h1 className="producto-titulo">{producto.nombre}</h1>

          <div className="producto-valoracion mb-4">
            <span className="estrellas">★★★★☆</span>
            <a href="#resenas" className="text-info text-decoration-none ms-2">Ver reseñas y calificaciones</a>
          </div>

          <div className="producto-precio d-flex align-items-center flex-wrap gap-3 mb-2">
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

          <p className={`producto-stock ${claseStock} mb-4`}>
            <span className="indicador-stock"></span>
            {producto.estado}
          </p>

          {/* FORMULARIO DE COMPRA CON INPUT-GROUP DE BOOTSTRAP */}
          <form onSubmit={handleAgregarAlCarrito} className="d-flex flex-column flex-md-row align-items-md-end gap-3 p-4 bg-dark border border-secondary rounded mb-4 shadow">
            
            <div className="selector-cantidad" style={{ maxWidth: '180px' }}>
              <label htmlFor="cantidad" className="form-label text-light fw-bold mb-2">Cantidad</label>
              <div className="input-group">
                <button
                  type="button"
                  className="btn btn-outline-info fw-bold fs-5"
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
                  className="form-control bg-dark text-light text-center border-info"
                  value={cantidad}
                  min="1"
                  max={producto.stock}
                  onChange={handleCambiarCantidad}
                  aria-label="Cantidad de productos"
                />
                <button
                  type="button"
                  className="btn btn-outline-info fw-bold fs-5"
                  onClick={handleSumar}
                  disabled={producto.stock <= 0 || Number(cantidad) >= producto.stock}
                  aria-label="Sumar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={producto.stock <= 0 || cantidad === ''}
            >
              <img src={iconoCarrito} alt="" style={{ width: '22px' }} />
              {producto.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>

            {mensajeCarrito && (
              <p
                role="status"
                className={`mensaje-carrito mostrar ${
                  esErrorCarrito ? 'mensaje-carrito-error' : 'mensaje-carrito-ok'
                }`}
              >
                {mensajeCarrito}
              </p>
            )}
          </form>

          <ul className="producto-datos-envio list-unstyled m-0 d-flex flex-column gap-2 text-light">
            <li><span className="text-info me-2">✓</span> Envíos a todo Chile</li>
            <li><span className="text-info me-2">✓</span> Garantía de 6 meses</li>
            <li><span className="text-info me-2">✓</span> Retiro gratis en tienda</li>
          </ul>
        </section>
      </div>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <section className="producto-especificaciones my-5">
        <h2 className="mb-4">Especificaciones técnicas</h2>

        <div className="table-responsive">
          <table className="tabla-especificaciones table table-dark table-striped table-hover border-secondary m-0">
            <tbody>
              {producto.especificaciones &&
                Object.entries(producto.especificaciones).map(([clave, valor]) => (
                  <tr key={clave}>
                    <th scope="row" className="text-info w-25">{clave}</th>
                    <td className="text-light">{valor}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="producto-descripcion mt-4 pt-4 border-top border-secondary">
          <h3 className="producto-descripcion-titulo mb-3">Descripción</h3>
          <p className="text-light" style={{ opacity: 0.9, lineHeight: 1.7 }}>{producto.descripcion}</p>
        </div>
      </section>

      {/* RESEÑAS */}
      <div id="resenas">
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
      </div>
    </main>
  );
}

export default DetalleProducto;