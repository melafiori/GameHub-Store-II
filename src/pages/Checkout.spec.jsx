
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { SessionProvider } from '../context/SessionContext.jsx';

const PRODUCTO_PRUEBA = {
  id: 1,
  nombre: 'Teclado RGB',
  precio: 29990,
  cantidad: 1,
  stock: 10,
};

const renderCheckout = async () => {
  localStorage.setItem(
    'gamehub_cart',
    JSON.stringify([PRODUCTO_PRUEBA])
  );

  const result = render(
    <MemoryRouter>
      <SessionProvider>
      <CartProvider>
        <Checkout />
      </CartProvider>
      </SessionProvider>
    </MemoryRouter>
  );
  await screen.findByLabelText(/nombre completo/i);
  return result;
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
    localStorage.clear(); sessionStorage.clear();
    localStorage.setItem('gamehub_token', 'x.' + btoa(JSON.stringify({sub:'7',role:'CLIENTE'})) + '.x');
    spyOn(window, 'fetch').and.callFake(async (url, options={}) => {
      if (url.includes('/products/')) return new Response(JSON.stringify({estado:'ACTIVO',precio:29990,precioVigente:29990}),{status:200});
      if (url.includes('/users/me')) return new Response('{}',{status:200});
      if (url.includes('/orders/42/payment')) return new Response(JSON.stringify({id:42,estado:'PAGADA',total:29990}),{status:200});
      if (url.endsWith('/orders')) return new Response(JSON.stringify({id:42,estado:'PENDIENTE_DE_PAGO',total:29990}),{status:201});
      return new Response('{}',{status:404});
    });
  });

  it('Debe mostrar los campos principales del formulario', async () => {
    await renderCheckout();

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
    await renderCheckout();

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

  it('Debe rechazar una dirección que contiene solo espacios', async () => {
    await renderCheckout();

    completarFormulario({ direccion: '   ' });

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      screen.getByText(/la dirección de entrega es obligatoria/i)
    ).not.toBeNull();

    expect(localStorage.getItem('gamehub_ordenes')).toBeNull();
  });

  it('Debe impedir la compra si faltan otros datos obligatorios', async () => {
    await renderCheckout();

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
    await renderCheckout();

    completarFormulario();

    fireEvent.click(
      screen.getByRole('button', { name: /confirmar orden y pagar/i })
    );

    expect(
      await screen.findByText(/se ha registrado correctamente/i)
    ).not.toBeNull();

    const request = window.fetch.calls.allArgs().find(([url]) => url.endsWith('/api/v1/orders'));
    expect(JSON.parse(request[1].body).direccionDespacho.direccion).toBe('Av. Providencia 123');
    expect(JSON.parse(request[1].body).direccionDespacho.comuna).toBe('Santiago');
    await waitFor(() => {
      if (JSON.parse(localStorage.getItem('gamehub_cart')).length !== 0) throw new Error('El carrito todavia no se actualiza');
    });
  });
});