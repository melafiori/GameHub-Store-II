export const calcularSubtotal = (precio, cantidad) => precio * cantidad;

export const agregarAlCarrito = (carritoActual, productoAgregado) => {
  const existe = carritoActual.find(item => item.id === productoAgregado.id);
  if (existe) {
    return carritoActual.map(item =>
      item.id === productoAgregado.id
        ? { ...item, cantidad: item.cantidad + productoAgregado.cantidad }
        : item
    );
  }
  return [...carritoActual, productoAgregado];
};

export const validarStock = (cantidad, stock) => cantidad <= stock;

export const aplicarCupon = (subtotal, porcentajeDescuento) => {
  const descuento = subtotal * (porcentajeDescuento / 100);
  return subtotal - descuento;
};

export const cuponVigente = (fechaExpiracion) => {
  const hoy = new Date();
  return fechaExpiracion > hoy;
};

export const calcularTotal = (subtotal, envio, descuento) => {
  return (subtotal + envio) - descuento;
};