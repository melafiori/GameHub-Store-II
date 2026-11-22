
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito.jsx';
import { CartProvider } from '../context/CartContext.jsx';

const PRODUCTO_PRUEBA = {
  id: 1,
  nombre: 'Teclado RGB',
  precio: 29990,
  cantidad: 1,
  stock: 10,
  imagen: 'teclado.jpg',
};

const SEGUNDO_PRODUCTO = {
  id: 2,
  nombre: 'Mouse Gamer',
  precio: 15990,
  cantidad: 2,
  stock: 5,
  imagen: 'mouse.jpg',
};

const renderCarrito = async (productos = [PRODUCTO_PRUEBA]) => {
  localStorage.setItem('gamehub_cart', JSON.stringify(productos));

  const result = render(
    <MemoryRouter>
      <CartProvider>
        <Carrito />
      </CartProvider>
    </MemoryRouter>
  );
  if (productos.length) await screen.findByRole('button', {name: /vaciar carrito/i});
  return result;
};

describe('Página Carrito', () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(window, 'fetch').and.callFake(async (url, options={}) => {
      if (url.includes('/products/')) { const id=Number(url.split('/').pop()); const item=JSON.parse(localStorage.getItem('gamehub_cart') || '[]').find(p=>p.id===id); return new Response(JSON.stringify({estado:'ACTIVO',precio:item.precio,precioVigente:item.precio}),{status:200}); }
      if (url.includes('/promotions/preview')) { const body=JSON.parse(options.body); if(body.codigo==='EXPIRADO') return new Response(JSON.stringify({error:'Cupon vencido'}),{status:400}); return new Response(JSON.stringify({codigo:'NEON10',subtotal:1000000,descuento:50000,total:950000}),{status:200}); }
      return new Response('{}',{status:404});
    });
    window.confirm = jasmine.createSpy('confirm').and.returnValue(true);
  });

  afterEach(() => {
    window.confirm.calls.reset();
  });

  it('debe mostrar los productos, precios y subtotales', async () => {
    await renderCarrito([PRODUCTO_PRUEBA, SEGUNDO_PRODUCTO]);

    expect(screen.getByText('Teclado RGB')).not.toBeNull();
    expect(screen.getByText('Mouse Gamer')).not.toBeNull();

    expect(screen.getAllByText('$29.990').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$15.990').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$31.980').length).toBeGreaterThan(0);
  });

  it('debe permitir modificar la cantidad de un producto', async () => {
    await renderCarrito();

    const cantidad = screen.getByRole('spinbutton', {
      name: /cantidad de teclado rgb/i,
    });

    fireEvent.change(cantidad, { target: { value: '3' } });

    await waitFor(() => {
      expect(
        screen.getByRole('spinbutton', {
          name: /cantidad de teclado rgb/i,
        }).value
      ).toBe('3');
    });

    expect(
      JSON.parse(localStorage.getItem('gamehub_cart'))[0].cantidad
    ).toBe(3);

    expect(screen.getAllByText('$89.970').length).toBeGreaterThan(0);
  });

  it('debe eliminar un producto del carrito', async () => {
    await renderCarrito([PRODUCTO_PRUEBA, SEGUNDO_PRODUCTO]);

    fireEvent.click(
      screen.getByRole('button', { name: /eliminar teclado rgb/i })
    );

    expect(screen.queryByText('Teclado RGB')).toBeNull();
    expect(screen.getByText('Mouse Gamer')).not.toBeNull();

    await waitFor(() => {
      const carrito = JSON.parse(localStorage.getItem('gamehub_cart'));
      expect(carrito).toHaveSize(1);
      expect(carrito[0].id).toBe(2);
    });
  });

  it('debe aplicar un cupón válido y respetar su descuento máximo', async () => {
    const productoCostoso = {
      ...PRODUCTO_PRUEBA,
      precio: 1000000,
    };

    await renderCarrito([productoCostoso]);

    fireEvent.change(screen.getByRole('textbox', {
      name: /código de cupón/i,
    }), {
      target: { value: 'NEON10' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^aplicar$/i }));

    expect(
      await screen.findByText(/validado/i)
    ).not.toBeNull();

    expect(screen.getByText('-$50.000')).not.toBeNull();
    expect(screen.getByText('$950.000')).not.toBeNull();

    const cupon = JSON.parse(localStorage.getItem('gamehub_cupon'));
    expect(cupon.codigo).toBe('NEON10');
  });

  it('debe rechazar un cupón vencido', async () => {
    await renderCarrito();

    fireEvent.change(screen.getByRole('textbox', {
      name: /código de cupón/i,
    }), {
      target: { value: 'EXPIRADO' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^aplicar$/i }));

    expect(await screen.findByText('Cupon vencido')).not.toBeNull();
    expect(localStorage.getItem('gamehub_cupon')).toBeNull();
  });

  it('debe mostrar un mensaje cuando el carrito está vacío', async () => {
    await renderCarrito([]);

    expect(
      screen.getByText(/tu carrito está vacío|carrito vacío/i)
    ).not.toBeNull();
  });

  it('debe vaciar el carrito cuando se confirma la acción', async () => {
    localStorage.setItem(
      'gamehub_cupon',
      JSON.stringify({ codigo: 'NEON10' })
    );

    await renderCarrito();

    fireEvent.click(
      screen.getByRole('button', { name: /vaciar carrito/i })
    );

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('gamehub_cart'))
      ).toEqual([]);
    });

    expect(localStorage.getItem('gamehub_cupon')).toBeNull();
  });

  it('no debe vaciar el carrito si se cancela la confirmación', async () => {
    window.confirm.and.returnValue(false);

    await renderCarrito();

    fireEvent.click(
      screen.getByRole('button', { name: /vaciar carrito/i })
    );

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        JSON.parse(localStorage.getItem('gamehub_cart'))
      ).toHaveSize(1);
    });
  });
});