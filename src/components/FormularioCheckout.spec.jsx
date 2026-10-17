import { render, screen, fireEvent } from '@testing-library/react';
import FormularioCheckout from './FormularioCheckout.jsx';

describe('Componente FormularioCheckout', () => {
  
  it('9. Debe renderizar correctamente el título y el botón de confirmación', () => {
    render(<FormularioCheckout onSubmitPago={() => {}} />);
    
    expect(screen.getByText('Datos de Envío')).not.toBeNull();

    expect(screen.getByRole('button', { name: /confirmar pago/i })).not.toBeNull();
  });

  it('10. Debe interceptar el envío del formulario usando un espía de Jasmine', () => {

    const spySubmit = jasmine.createSpy('onSubmitPago');
    
    render(<FormularioCheckout onSubmitPago={spySubmit} />);
    
    const botonSubmit = screen.getByRole('button', { name: /confirmar pago/i });
    fireEvent.click(botonSubmit);
    
    expect(spySubmit).toHaveBeenCalledTimes(1);
  });

});