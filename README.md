# Especificación del Proyecto: GameHub Store - Frontend

## Descripción General
Este repositorio contiene el código fuente correspondiente a la Evaluación Parcial 2 (EP2) del proyecto GameHub Store. 

## 1. Alcance Técnico y Funcionalidades
*   **Migración Arquitectónica:** Refactorización a React, implementando componentes funcionales, propiedades (`props`) y manejo del ciclo de vida a través de hooks (`useState`, `useEffect`).
*   **Enrutamiento de Cliente (Client-Side Routing):** Implementación de navegación dinámica mediante `react-router-dom`, eliminando las recargas de página para optimizar la experiencia de usuario.
*   **Gestión Global de Estado:** Integración de la API de Contexto (`Context API`) para administrar la persistencia de datos y las reglas de negocio del carrito de compras.
*   **Diseño Responsivo y Framework CSS:** Sustitución de hojas de estilo manuales por el sistema de grillas de Bootstrap. Garantiza adaptabilidad en resoluciones de 360px, 768px y 1280px, respetando la paleta         de colores Neón requerida a través de la sobrescritura de variables nativas.
*   **Testing Automatizado:** Configuración de un entorno de pruebas unitarias utilizando Jasmine y Karma. Se alcanza un 100% de cobertura en la lógica de negocio y en la simulación de eventos mediante el uso de       objetos espía (Mocks).

## 2. Vistas Implementadas
El sistema cuenta con seis interfaces funcionales:
1.  **Inicio:** Carrusel dinámico de promociones y visualización estructurada de ofertas destacadas.
2.  **Catálogo por Categoría:** Grilla responsiva que permite filtrado dinámico por categoría, marca, precio y disponibilidad, además de ordenamiento ascendente y descendente.
3.  **Detalle de Producto:** Galería interactiva de imágenes, validación de stock para la adición de productos al carrito y visualización de reseñas.
4.  **Carrito de Compras:** Motor de cálculo en tiempo real de subtotales, validación de cupones de descuento y manipulación de productos.
5.  **Checkout:** Formulario controlado mediante React que incluye selectores de ubicación dependientes (Región/Comuna), simulación de pasarela de pago y validación estricta de campos obligatorios.
6.  **Mis Órdenes:** Historial de transacciones con detalles de despacho y despliegue condicional de formularios para la emisión de reseñas o solicitud de garantías.

## 3. Stack Tecnológico
*   **Librería Principal:** React 19, Vite.
*   **Navegación:** React Router DOM v7.
*   **Diseño Visual:** Bootstrap 5, CSS3.
*   **Entorno de Pruebas:** Jasmine, Karma, Babel, React Testing Library, Istanbul.
*   **Control de Versiones:** Git, GitHub.

## 4. Instrucciones Paso a Paso: Instalación y Ejecución Local
Para desplegar el entorno de desarrollo en una máquina local, ejecute la siguiente secuencia de comandos en su terminal:

1.  **Clonar el repositorio:**
    ```bash
    git clone gh repo clone melafiori/GameHub-Store-II
    ```
2.  **Acceder al directorio del proyecto:**
    ```bash
    cd GameHub-FrontEnd
    ```
3.  **Instalar las dependencias:**
    ```bash
    npm install
    ```
4.  **Iniciar el servidor de desarrollo local:**
    ```bash
    npm run dev
    ```
5.  **Acceder a la aplicación:** Abra un navegador web e ingrese al enlace adjunto en la terminal.

## 5. Instrucciones Paso a Paso: Ejecución de Pruebas Unitarias
El proyecto incluye una suite de mas de 10 pruebas unitarias requeridas, ejecutadas en un entorno de navegador simulado (Chrome/Edge). Para auditar la lógica y los componentes:

1.  **Ejecutar la suite de pruebas:**
    ```bash
    npm run test
    ```
2.  **Revisar los resultados:** La terminal compilará los módulos mediante Webpack e indicará el resultado de los casos evaluados (ej. `35 SUCCESS`).
3.  **Visualizar el reporte de cobertura (Coverage):**
    *   Navegue hacia la ruta generada automáticamente por el plugin de Istanbul: `/coverage/html`.
    *   Abra el archivo `index.html` en su navegador web para acceder al desglose métrico detallado (100% de cobertura en Statements, Branches, Functions y Lines).

## 6. Equipo de Desarrollo
*   Carolina Rivera
*   Cassie Muñoz
*   Ariel Rojo
