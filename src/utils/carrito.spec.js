import {
  calcularSubtotal,
  agregarAlCarrito,
  validarStock,
  aplicarCupon,
  cuponVigente,
  calcularTotal
} from './carrito.js';

describe('Pruebas de Lógica de Negocio (EP2)', () => {
  
  // Prueba 1
  it('calcularSubtotal debe multiplicar correctamente el precio por la cantidad', () => {
    expect(calcularSubtotal(25000, 2)).toBe(50000);
    expect(calcularSubtotal(10000, 0)).toBe(0);
  });

  // Prueba 2
  it('agregarAlCarrito debe sumar la cantidad si el producto ya existe en el carrito', () => {
    const carritoActual = [{ id: 1, nombre: 'Juego A', precio: 5000, cantidad: 1 }];
    const productoAgregado = { id: 1, cantidad: 2 };
    
    const resultado = agregarAlCarrito(carritoActual, productoAgregado);
    
    expect(resultado.length).toBe(1);
    expect(resultado[0].cantidad).toBe(3); 
  });

  // Prueba 3
  it('validarStock debe retornar false si la cantidad solicitada supera el stock disponible', () => {
    expect(validarStock(5, 3)).toBeFalse();
    expect(validarStock(2, 10)).toBeTrue();
  });

  // Prueba 4
  it('aplicarCupon debe descontar el porcentaje matemático exacto del monto base', () => {
    const subtotal = 10000;
    const porcentajeDescuento = 20; 
    expect(aplicarCupon(subtotal, porcentajeDescuento)).toBe(8000); 
  });

  // Prueba 5
  it('cuponVigente debe retornar true si la fecha de expiración es mayor a la fecha actual', () => {
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 5);
    expect(cuponVigente(fechaFutura)).toBeTrue();
  });

  // Prueba 6
  it('calcularTotal debe sumar el subtotal con el costo de envío y restar el descuento', () => {
    const subtotal = 15000;
    const envio = 3000;
    const descuento = 2000;
    expect(calcularTotal(subtotal, envio, descuento)).toBe(16000);
  });
});