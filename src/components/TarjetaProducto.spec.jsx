import { render, screen, fireEvent } from '@testing-library/react';
import TarjetaProducto from './TarjetaProducto';

describe('Componente TarjetaProducto', () => {
  const mockProducto = {
    id: 1,
    nombre: 'Juego Prueba',
    precio: 15000,
    imagen: 'test.jpg'
  };

  it('4. Debe renderizar correctamente las propiedades (props) recibidas', () => {

    // Se renderiza el componente pasandole el mock
    render(<TarjetaProducto producto={mockProducto} agregarAlCarrito={() => {}} />);
    
    // Verifica que el nombre y el precio esten en el DOM
    expect(screen.getByText('Juego Prueba')).not.toBeNull();
    expect(screen.getByText('$15000')).not.toBeNull();
  });

  it('5. Debe ejecutar el evento onClick usando un Mock al presionar "Agregar"', () => {
    // Crea un mock con Jasmine
    const spyAgregar = jasmine.createSpy('agregarAlCarrito');
    
    render(<TarjetaProducto producto={mockProducto} agregarAlCarrito={spyAgregar} />);
    
    // Simula el evento de clic en el boton
    const boton = screen.getByText(/agregar/i);
    fireEvent.click(boton);
    
    // Verifica que el espia haya sido llamado con el producto correcto
    expect(spyAgregar).toHaveBeenCalledTimes(1);
    expect(spyAgregar).toHaveBeenCalledWith(mockProducto);
  });

  
  it('7. Debe mostrar el aviso y deshabilitar el botón si no hay stock', () => {
    const productoSinStock = {
      ...mockProducto,
      stock: 0
    };

    render(
      <TarjetaProducto
        producto={productoSinStock}
        agregarAlCarrito={jasmine.createSpy('agregarAlCarrito')}
      />
    );

    expect(screen.getByText('Producto sin stock')).not.toBeNull();

    expect(
      screen.getByRole('button', { name: /sin stock/i }).disabled
    ).toBeTrue();
  });
});