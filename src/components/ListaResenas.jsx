
import React from 'react';

const ordenarResenasPorFecha = (resenas) => {
  return [...resenas].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );
};

const calcularPromedioResenas = (resenas) => {
  if (resenas.length === 0) return 0;

  const suma = resenas.reduce(
    (total, resena) => total + resena.calificacion,
    0
  );

  return Math.round((suma / resenas.length) * 10) / 10;
};

function ListaResenas({ resenas = [] }) {
  const resenasOrdenadas = ordenarResenasPorFecha(resenas);
  const promedio = calcularPromedioResenas(resenas);

  if (resenas.length === 0) {
    return (
      <section className="producto-reseñas" id="reseñas">
        <h2>Reseñas de usuarios</h2>
        <p className="text-secondary">
          Este producto todavía no tiene reseñas.
        </p>
      </section>
    );
  }

  return (
    <section className="producto-reseñas" id="reseñas">
      <h2>Reseñas de usuarios</h2>

      <div className="reseñas-resumen">
        <span className="reseñas-promedio">{promedio.toFixed(1)}</span>

        <span
          className="estrellas"
          aria-label={`${promedio} de 5 estrellas`}
        >
          {'★'.repeat(Math.round(promedio))}
          {'☆'.repeat(5 - Math.round(promedio))}
        </span>

        <p>Basado en {resenas.length} reseñas</p>
      </div>

      <ul className="reseñas-lista">
        {resenasOrdenadas.map((resena) => (
          <li className="reseña" key={resena.id}>
            <div className="reseña-cabecera">
              <span className="reseña-autor">{resena.autor}</span>

              <span
                className="estrellas"
                aria-label={`${resena.calificacion} de 5 estrellas`}
              >
                {'★'.repeat(resena.calificacion)}
                {'☆'.repeat(5 - resena.calificacion)}
              </span>

              <span className="reseña-fecha">
                {new Date(`${resena.fecha}T12:00:00`).toLocaleDateString(
                  'es-CL',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </span>
            </div>

            <p className="reseña-comentario">{resena.comentario}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { ordenarResenasPorFecha, calcularPromedioResenas };
export default ListaResenas;