import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Guardar y recuperar del localStorage para no perder el carrito al recargar
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('gamehub_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('gamehub_cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar un producto (si ya existe, suma la cantidad)
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCart((prevCart) => {
      const existe = prevCart.find((item) => item.id === producto.id);
      if (existe) {
        return prevCart.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prevCart, { ...producto, cantidad }];
    });
  };

  // Cambiar cantidad de un ítem
  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidadNumerica = Math.max(1, Number(nuevaCantidad) || 1);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, cantidad: cantidadNumerica } : item
      )
    );
  };

  // Eliminar un producto
  const eliminarDelCarrito = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar todo el carrito
  const vaciarCarrito = () => {
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

// Hook personalizado para usar el carrito en cualquier componente
export function useCart() {
  return useContext(CartContext);
}