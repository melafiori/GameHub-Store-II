# Manual de usuario EP3 ? revisi?n

Abra http://localhost:5173 con los servicios indicados en la gu?a de arranque del backend. Para compras de prueba use exclusivamente un entorno H2 aislado: una compra en el entorno habitual modifica su inventario persistente.

## Visitante

Abra el cat?logo, filtre por categor?a y entre en una ficha para consultar el precio y la disponibilidad. Limpie los filtros para volver a ver todos los productos.

## Cliente

1. Cree una cuenta con su direcci?n de despacho e inicie sesi?n.
2. Agregue productos disponibles al carrito y contin?e al checkout. Complete la direcci?n y el m?todo de pago.
3. En **Mis ?rdenes**, abra el detalle para consultar productos, total, seguimiento y garant?as. **Solicitar garant?a** indica si falta confirmar la entrega; cuando sea elegible, permite seleccionar un producto y escribir el motivo. El plazo de la demo es de 180 d?as calendario desde la entrega confirmada.
4. Para salir, abra **Mi perfil** y cierre sesi?n.

## Operador y administrador

El operador accede a la gesti?n de ?rdenes, pagos, despachos, garant?as e inventario desde su panel. El administrador accede a /admin para gestionar productos, categor?as, promociones y rese?as. Utilice cuentas locales preparadas para cada rol seg?n la gu?a de arranque.

## Evidencia y alcance

Se comprob? en navegador el cat?logo, el ingreso, el perfil de una cuenta cliente y el aviso de garant?a sin entrega. Hay capturas en docs/evidencia/ del backend. Se revisaron cat?logo, ingreso y registro a 360, 768 y 1280 px. Queda pendiente repetir desde un arranque aislado completo la solicitud de garant?a entregada y los recorridos de operador y administrador.
