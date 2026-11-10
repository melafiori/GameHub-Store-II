
import { render, screen, fireEvent } from '@testing-library/react';
import FormularioCheckout from './FormularioCheckout.jsx';

describe('Componente FormularioCheckout', () => {

  it('9. Debe renderizar correctamente el título y el botón de confirmación', () => {
    render(<FormularioCheckout onSubmitPago={() => {}} />);

    expect(screen.getByText('Datos de Envío')).not.toBeNull();

    expect(
      screen.getByRole('button', { name: /confirmar pago/i })
    ).not.toBeNull();
  });

  it('10. Debe interceptar el envío del formulario usando un espía de Jasmine', () => {
    const spySubmit = jasmine.createSpy('onSubmitPago');

    render(<FormularioCheckout onSubmitPago={spySubmit} />);

    fireEvent.change(screen.getByLabelText('Región'), {
      target: { value: 'metropolitana' }
    });

    fireEvent.change(screen.getByLabelText('Dirección de despacho'), {
      target: { value: 'Av. Providencia 123' }
    });

    const botonSubmit = screen.getByRole('button', {
      name: /confirmar pago/i
    });

    expect(botonSubmit.disabled).toBeFalse();

    fireEvent.click(botonSubmit);

    expect(spySubmit).toHaveBeenCalledTimes(1);
    expect(spySubmit).toHaveBeenCalledWith({
      region: 'metropolitana',
      direccion: 'Av. Providencia 123'
    });
  });

  it('Debe mantener deshabilitado el envío cuando falta la dirección', () => {
    const spySubmit = jasmine.createSpy('onSubmitPago');

    render(<FormularioCheckout onSubmitPago={spySubmit} />);

    fireEvent.change(screen.getByLabelText('Región'), {
      target: { value: 'metropolitana' }
    });

    const botonSubmit = screen.getByRole('button', {
      name: /confirmar pago/i
    });

    expect(botonSubmit.disabled).toBeTrue();

    fireEvent.click(botonSubmit);

    expect(spySubmit).not.toHaveBeenCalled();
  });

});