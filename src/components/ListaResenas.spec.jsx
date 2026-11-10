
import { render, screen } from '@testing-library/react';
import ListaResenas, {
  ordenarResenasPorFecha,
  calcularPromedioResenas,
} from './ListaResenas.jsx';

describe('Componente ListaResenas', () => {
  const resenasPrueba = [
    {
      id: 1,
      autor: 'Martín G.',
      calificacion: 5,
      fecha: '2026-08-12',
      comentario: 'Excelente producto.',
    },
    {
      id: 2,
      autor: 'Camila R.',
      calificacion: 3,
      fecha: '2026-09-20',
      comentario: 'Buen producto, pero puede mejorar.',
    },
    {
      id: 3,
      autor: 'Diego P.',
      calificacion: 4,
      fecha: '2026-09-01',
      comentario: 'Buena experiencia.',
    },
  ];

  it('debe ordenar las reseñas de la más reciente a la más antigua', () => {
    const resultado = ordenarResenasPorFecha(resenasPrueba);

    expect(resultado[0].autor).toBe('Camila R.');
    expect(resultado[1].autor).toBe('Diego P.');
    expect(resultado[2].autor).toBe('Martín G.');
  });

  it('debe calcular correctamente el promedio de las calificaciones', () => {
    expect(calcularPromedioResenas(resenasPrueba)).toBe(4);
  });

  it('debe devolver cero cuando no existen reseñas', () => {
    expect(calcularPromedioResenas([])).toBe(0);
  });

  it('debe mostrar el promedio y las reseñas en pantalla', () => {
    render(<ListaResenas resenas={resenasPrueba} />);

    expect(screen.getByText('Reseñas de usuarios')).not.toBeNull();
    expect(screen.getByText('4.0')).not.toBeNull();
    expect(screen.getByText('Basado en 3 reseñas')).not.toBeNull();

    expect(screen.getByText('Camila R.')).not.toBeNull();
    expect(screen.getByText('Diego P.')).not.toBeNull();
    expect(screen.getByText('Martín G.')).not.toBeNull();
  });

  it('debe mostrar un mensaje cuando no hay reseñas', () => {
    render(<ListaResenas resenas={[]} />);

    expect(
      screen.getByText('Este producto todavía no tiene reseñas.')
    ).not.toBeNull();
  });
});