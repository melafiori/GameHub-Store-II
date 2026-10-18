
export const calcularSubtotal = (precioOCarrito, cantidad) => {
  if (Array.isArray(precioOCarrito)) {
    return precioOCarrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  }

  return precioOCarrito * cantidad;
};

export const agregarAlCarrito = (carritoActual, productoAgregado) => {
  const existe = carritoActual.find(
    item => item.id === productoAgregado.id
  );

  if (existe) {
    return carritoActual.map(item =>
      item.id === productoAgregado.id
        ? { ...item, cantidad: item.cantidad + productoAgregado.cantidad }
        : item
    );
  }

  return [...carritoActual, productoAgregado];
};

export const validarStock = (cantidad, stock) => {
  return cantidad <= stock;
};

export const aplicarCupon = (
  subtotal,
  porcentajeDescuento,
  topeDescuento = Infinity
) => {
  const descuento = subtotal * (porcentajeDescuento / 100);
  return subtotal - Math.min(descuento, topeDescuento);
};

export const cuponVigente = (fechaExpiracion, fechaInicio = null) => {
  const hoy = new Date();
  const inicio = fechaInicio ? new Date(fechaInicio) : null;
  const expiracion = new Date(fechaExpiracion);

  return (!inicio || hoy >= inicio) && hoy <= expiracion;
};

export const calcularTotal = (subtotal, envio, descuento) => {
  return Math.max(0, subtotal + envio - descuento);
};