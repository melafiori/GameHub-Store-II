
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('gamehub_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Referencia al carrito actual para validar antes de actualizarlo
  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
    localStorage.setItem('gamehub_cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar productos sin duplicarlos y respetando el stock
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const stock = Number(producto.stock);
    const cantidadSolicitada = Number(cantidad);

    if (!Number.isFinite(stock) || stock <= 0) {
      return {
        ok: false,
        mensaje: 'Este producto no tiene stock disponible.',
      };
    }

    if (
      !Number.isInteger(cantidadSolicitada) ||
      cantidadSolicitada < 1
    ) {
      return {
        ok: false,
        mensaje: 'La cantidad debe ser al menos 1.',
      };
    }

    const carritoActual = cartRef.current;
    const existente = carritoActual.find(
      (item) => item.id === producto.id
    );

    const cantidadActual = existente ? existente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidadSolicitada;

    if (nuevaCantidad > stock) {
      return {
        ok: false,
        mensaje: `Solo hay ${stock} unidades disponibles de este producto.`,
      };
    }

    let nuevoCarrito;

    if (existente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id === producto.id
          ? { ...item, ...producto, cantidad: nuevaCantidad }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carritoActual,
        { ...producto, cantidad: cantidadSolicitada },
      ];
    }

    cartRef.current = nuevoCarrito;
    setCart(nuevoCarrito);

    return {
      ok: true,
      mensaje: 'Producto agregado al carrito.',
    };
  };

  // Cambiar cantidad respetando el stock
  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidadNumerica = Number(nuevaCantidad);
    const carritoActual = cartRef.current;

    const nuevoCarrito = carritoActual.map((item) => {
      if (item.id !== id) return item;

      const stock = Number(item.stock);

      if (
        !Number.isInteger(cantidadNumerica) ||
        cantidadNumerica < 1 ||
        !Number.isFinite(stock) ||
        stock < 1
      ) {
        return item;
      }

      return {
        ...item,
        cantidad: Math.min(cantidadNumerica, stock),
      };
    });

    cartRef.current = nuevoCarrito;
    setCart(nuevoCarrito);
  };

  // Eliminar un producto
  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = cartRef.current.filter(
      (item) => item.id !== id
    );

    cartRef.current = nuevoCarrito;
    setCart(nuevoCarrito);
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    cartRef.current = [];
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        agregarAlCarrito,
        cambiarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}