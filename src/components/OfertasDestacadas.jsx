import React from 'react';
import { Link } from 'react-router-dom';
import { useCatalogo } from '../data/catalogoApi'; 

function OfertasDestacadas() {
  const { productos } = useCatalogo();
  const productosOfertas = productos.filter(p => p.precio < p.precioNormal);
  return (
    <section className="ofertas-destacadas my-5">
      <h2 className="titulo-gamer text-light mb-4" style={{fontFamily: "'Press Start 2P', cursive", fontSize: "24px"}}>
        Ofertas destacadas
      </h2>
      <div className="row g-4">
        {productosOfertas.map((producto) => {
          const precioOferta = producto.precio;
          const descuento = Math.round((1 - producto.precio / producto.precioNormal) * 100);
          return (
            <div key={producto.id} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 bg-dark text-light border-secondary tarjeta-producto position-relative p-3">
                <span className="badge bg-primary text-white position-absolute top-0 start-0 m-3 z-1 etiqueta-oferta">
                  -{descuento}%
                </span>

                <div className="text-center mb-3">
                  <img
                    src={producto.imagen}
                    className="img-fluid"
                    style={{height: "170px", objectFit: "contain", transition: "transform 0.3s ease"}}
                    alt={producto.nombre}
                  />
                </div>

                <div className="card-body d-flex flex-column justify-content-between p-0">
                  <div>
                    <h5 className="card-title fs-5 fw-bold">{producto.nombre}</h5>
                    <p className="card-text text-info fw-bold mb-2">
                      {producto.categoria}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <p className="precio-anterior text-secondary text-decoration-line-through fs-6 m-0">
                      ${producto.precioNormal.toLocaleString('es-CL')}
                    </p>
                    <p className="precio-oferta fs-4 text-primary fw-bold mb-3">
                      ${precioOferta.toLocaleString('es-CL')}
                    </p>

                    <Link
                      to={`/producto?id=${producto.id}`}
                      className="btn btn-primary w-100 fw-bold"
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