# Frontend GameHub Store EP3

Descomprime el backend y el frontend en carpetas separadas. La guía completa de inicio, puertos y cuentas de demostración está en `ENTREGA_EP3.md` del ZIP de backend. Una vez arrancado el backend, en PowerShell:

```powershell
Set-Location 'C:\GameHubEP3\frontend'
npm.cmd ci
$env:VITE_API_URL = 'http://localhost:19646'
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Abre http://localhost:5173. Cambia las rutas al lugar donde hayas descomprimido los archivos. Para compilar usa `npm.cmd run build`; para pruebas, `npm.cmd test -- --single-run`. Se incluyen `package.json`, `package-lock.json`, las páginas, componentes, estilos e imágenes locales. `node_modules` se instala con npm y no se incluye en el ZIP.

## Verificación de esta entrega

Con la instalación extraída se completó una compra y se comprobó la persistencia de la orden, el despacho, una reseña y una garantía entre React y los servicios. La garantía se resolvió desde el panel del operador y la resolución apareció en Mis órdenes. `npm.cmd run build` terminó correctamente y Jasmine/Karma pasó 35 de 35 pruebas. Se actualizaron dependencias sin cambios mayores: `npm audit` reporta cinco vulnerabilidades moderadas transitivas de las herramientas de pruebas. Consulta el archivo de entrega del backend para el detalle y las limitaciones de Java 21.
