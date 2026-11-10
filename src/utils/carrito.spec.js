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
  it('calcularSubtotal debe sumar todas las líneas del carrito', () => {
  const carrito = [
    { id: 1, precio: 25000, cantidad: 2 },
    { id: 2, precio: 10000, cantidad: 1 }
  ];

  expect(calcularSubtotal(carrito)).toBe(60000);
  expect(calcularSubtotal([])).toBe(0);
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
  it('aplicarCupon debe calcular el porcentaje y respetar el tope', () => {
  expect(aplicarCupon(10000, 20)).toBe(8000);
  expect(aplicarCupon(100000, 20, 10000)).toBe(90000);
});

  // Prueba 5
  it('cuponVigente debe rechazar cupones fuera de sus fechas', () => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - 5);

  const fechaExpiracion = new Date();
  fechaExpiracion.setDate(fechaExpiracion.getDate() + 5);

  expect(cuponVigente(fechaExpiracion, fechaInicio)).toBeTrue();

  const fechaFutura = new Date();
  fechaFutura.setDate(fechaFutura.getDate() + 5);

  expect(cuponVigente(fechaExpiracion, fechaFutura)).toBeFalse();
});

  // Prueba 6
  it('calcularTotal debe sumar el subtotal con el costo de envío y restar el descuento', () => {
    const subtotal = 15000;
    const envio = 3000;
    const descuento = 2000;
    expect(calcularTotal(subtotal, envio, descuento)).toBe(16000);
  });

  
  // Prueba 7
  it('agregarAlCarrito debe incorporar un producto nuevo', () => {
    const carritoActual = [
      { id: 1, nombre: 'Juego A', precio: 5000, cantidad: 1 }
    ];
    const productoNuevo = {
      id: 2, nombre: 'Juego B', precio: 8000, cantidad: 1
    };

    const resultado = agregarAlCarrito(carritoActual, productoNuevo);

    expect(resultado.length).toBe(2);
    expect(resultado[1].id).toBe(2);
  });

  // Prueba 8
  it('validarStock debe aceptar una cantidad igual al stock', () => {
    expect(validarStock(5, 5)).toBeTrue();
  });

  // Prueba 9
  it('cuponVigente debe retornar false si el cupón ya venció', () => {
    const fechaVencida = new Date();
    fechaVencida.setDate(fechaVencida.getDate() - 5);

    expect(cuponVigente(fechaVencida)).toBeFalse();
  });

  
  // Prueba 10
  it('calcularTotal no debe devolver un valor negativo', () => {
    expect(calcularTotal(5000, 1000, 10000)).toBe(0);
  });

});