import React from 'react';
import { Link } from 'react-router-dom';
import { productos } from '../data/productos'; 

function OfertasDestacadas() {
  // IDs de los productos que queremos mostrar como ofertas
  const idsOfertas = [2, 4, 29, 19];

  // Filtrar los productos
  const productosOfertas = productos.filter((producto) =>
    idsOfertas.includes(producto.id)
  );

  return (
    <section className="ofertas-destacadas my-5">
      <h2>Ofertas destacadas</h2>
      <div className="row g-4">
        {productosOfertas.map((producto) => {
          // Cálculo de precio de oferta y descuento
          const precioOferta = Math.round(producto.precio * 0.90);
          const descuento = Math.round(
            ((producto.precio - precioOferta) / producto.precio) * 100
          );

          return (
            <div key={producto.id} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="etiqueta-oferta">-{descuento}%</div>

                <img
                  src={producto.imagen}
                  className="card-img-top"
                  alt={producto.nombre}
                />

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">
                      Categoría: {producto.categoria}
                    </p>
                  </div>

                  <div>
                    <p className="precio-anterior">
                      ${producto.precio.toLocaleString('es-CL')}
                    </p>
                    <p className="precio-oferta">
                      ${precioOferta.toLocaleString('es-CL')}
                    </p>

                    <Link
                      to={`/producto/${producto.id}?oferta=true`}
                      className="btn btn-primary w-100"
                    >
                      Ver producto
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default OfertasDestacadas;