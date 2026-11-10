
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResumenCarrito from './ResumenCarrito';

describe('Componente ResumenCarrito', () => {
  it('8. Debe mostrar el mensaje de carrito vacío cuando no hay productos', () => {
    render(
      <MemoryRouter>
        <ResumenCarrito cart={[]} />
      </MemoryRouter>
    );

    expect(screen.getByText('Tu carrito está vacío')).not.toBeNull();
    expect(
      screen.getByRole('link', { name: /explorar productos/i })
    ).not.toBeNull();
  });
});