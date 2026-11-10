
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout.jsx';
import { CartProvider } from '../context/CartContext.jsx';

const PRODUCTO_PRUEBA = {
  id: 1,
  nombre: 'Teclado RGB',
  precio: 29990,
  cantidad: 1,
  stock: 10,
};

const renderCheckout = () => {
  localStorage.setItem(
    'gamehub_cart',
    JSON.stringify([PRODUCTO_PRUEBA])
  );

  return render(
    <MemoryRouter>
      <CartProvider>
        <Checkout />
      </CartProvider>
    </MemoryRouter>
  );
};

const completarFormulario = ({
  direccion = 'Av. Providencia 123',
} = {}) => {
  fireEvent.change(screen.getByLabelText(/nombre completo/i), {
    target: { value: 'Juan Pérez' },
  });

  fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
    target: { value: 'juan@correo.cl' },
  });

  fireEvent.change(screen.getByLabelText(/teléfono móvil/i), {
    target: { value: '912345678' },
  });

  fireEvent.change(screen.getByLabelText(/^región$/i), {
    target: { value: 'metropolitana' },
  });

  fireEvent.change(screen.getByLabelText(/^comuna$/i), {
    target: { value: 'Santiago' },
  });

  fireEvent.change(screen.getByLabelText(/dirección de entrega/i), {
    target: { value: direccion },
  });

  fireEvent.click(
    screen.getByRole('radio', { name: /tarjeta de débito/i })
  );
};

describe('Página Checkout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Debe mostrar los campos principales del formulario', () => {
    renderCheckout();

    expect(screen.getByLabelText(/nombre completo/i)).not.toBeNull();
    expect(screen.getByLabelText(/correo electrónico/i)).not.toBeNull();
    expect(screen.getByLabelText(/teléfono móvil/i)).not.toBeNull();
    expect(screen.getByLabelText(/^región$/i)).not.toBeNull();
    expect(screen.getByLabelText(/^comuna$/i)).not.toBeNull();
    expect(screen.getByLabelText(/dirección de entrega/i)).not.toBeNull();

    expect(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    ).not.toBeNull();
  });

  it('Debe impedir la compra cuando falta la dirección', async () => {
    renderCheckout();

    completarFormulario({ direccion: '' });

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      screen.getByText(/la dirección de entrega es obligatoria/i)
    ).not.toBeNull();

    expect(localStorage.getItem('gamehub_ordenes')).toBeNull();

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('gamehub_cart'))
      ).toHaveSize(1);
    });
  });

  it('Debe rechazar una dirección que contiene solo espacios', () => {
    renderCheckout();

    completarFormulario({ direccion: '   ' });

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      screen.getByText(/la dirección de entrega es obligatoria/i)
    ).not.toBeNull();

    expect(localStorage.getItem('gamehub_ordenes')).toBeNull();
  });

  it('Debe impedir la compra si faltan otros datos obligatorios', () => {
    renderCheckout();

    fireEvent.change(screen.getByLabelText(/dirección de entrega/i), {
      target: { value: 'Av. Providencia 123' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      screen.getByText(/debes ingresar tu nombre completo/i)
    ).not.toBeNull();

    expect(
      screen.getByText(/ingresa un formato de correo válido/i)
    ).not.toBeNull();

    expect(localStorage.getItem('gamehub_ordenes')).toBeNull();
  });

  it('Debe registrar la orden y vaciar el carrito si los datos son válidos', async () => {
    renderCheckout();

    completarFormulario();

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      await screen.findByText(/se ha registrado correctamente/i)
    ).not.toBeNull();

    const ordenes = JSON.parse(localStorage.getItem('gamehub_ordenes'));

    expect(ordenes).toHaveSize(1);
    expect(ordenes[0].cliente.direccion).toBe('Av. Providencia 123');
    expect(ordenes[0].cliente.comuna).toBe('Santiago');
    expect(ordenes[0].metodoPago).toBe('debito');

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('gamehub_cart'))
      ).toEqual([]);
    });
  });
});