# GameHub Store

Frontend de una tienda gamer en línea desarrollado como parte del **Caso Semestral de Desarrollo FullStack II (DSY1104)**.

GameHub Store permite explorar un catálogo de productos tecnológicos y gamers, consultar el detalle de cada producto, aplicar filtros y ordenar resultados, agregar productos al carrito y completar formularios asociados al flujo de compra.


## Información del proyecto

* **Asignatura:** Desarrollo FullStack II - DSY1104
* **Evaluación:** Evaluación Parcial 1 (EP1)
* **Etapa:** HTML5, CSS3 y JavaScript
* **Tipo de proyecto:** Frontend
* **Framework:** Sin framework en EP1

### Integrantes

* Carolina Rivera
* Ariel Rojo
* Cassie Muñoz

## Tecnologías utilizadas

* **HTML5** — Estructura y contenido semántico de las páginas.
* **CSS3** — Diseño, estilos y maquetación de la interfaz.
* **JavaScript** — Manipulación del DOM, generación dinámica del catálogo, filtros, validaciones e interacción con el usuario.
* **Bootstrap 5** — Componentes y apoyo en el diseño de la interfaz.
* **Git y GitHub** — Control de versiones y trabajo colaborativo.
* **Visual Studio Code** — Editor utilizado para el desarrollo.

## Funcionalidades implementadas

La versión correspondiente a la EP1 incluye:

* Página de inicio con navegación principal.
* Catálogo de productos por categoría.
* Detalle de productos.
* Filtros por categoría, marca, precio y disponibilidad de stock.
* Ordenamiento de productos por precio y nombre.
* Paginación del catálogo.
* Visualización dinámica de productos mediante JavaScript.
* Sistema de ofertas y descuentos.
* Carrito de compras utilizando `localStorage`.
* Selector de cantidad de productos.
* Validación de disponibilidad de stock.
* Formularios con validaciones y mensajes personalizados.
* Navegación mediante hipervínculos entre las distintas vistas.
* Video embebido (No era para EP1 pero lo pusimos probando de todas maneras).
* Imágenes con atributos `alt`.
* Diseño mediante hojas de estilo CSS externas.
* Footer informativo presente en las páginas.


## Vistas principales

El proyecto contempla las siguientes vistas correspondientes:

### Inicio

Página principal de GameHub Store, donde se presentan las categorías, productos destacados, ofertas y contenido multimedia.

### Catálogo por categoría

Permite explorar los productos disponibles mediante filtros, ordenamiento y paginación.

### Detalle de producto

Muestra información específica del producto seleccionado, incluyendo marca, precio, si tiene descuento, stock, especificaciones, descripción y reseñas (reseñas generales para todos, no personalizadas aún).

### Carrito de compras

Permite revisar los productos seleccionados, modificar cantidades y gestionar los elementos almacenados en el carrito.

### Checkout

Formulario destinado al ingreso de los datos necesarios para continuar con el proceso de compra.

### Mis órdenes

Vista destinada a la consulta de órdenes simuladas.


## Estructura del proyecto

```
GameHub-Store/
│
├── assets/icons
│   ├── icono-busqueda.webp
│   └── icono-carrito.svg
|   └── icono-ordenes.png
|   └── icono-usuario.svg
|   └── icono-wishlist.svg
│
├── css/
│   ├── style.css
│   ├── producto.css
│   └── catalogo.css
│
├── js/
│   ├── carrito.js
│   ├── catalogo.js
│   ├── checkout.js
│   ├── inicio.js
│   ├── ordenes.js
│   ├── producto.js
│   └── productos.js (productos con sus descripciones)
│
├── carrito.html
├── catcategoria.html
├── checkout.html
├── index.html
├── mis-ordenes.html
├── producto.html
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto se requiere:

* Un navegador web actualizado, como Google Chrome, Microsoft Edge o Firefox.
* Visual Studio Code u otro editor de código.
* Extensión **Live Server** para facilitar la ejecución local del proyecto.

No se requiere instalar un backend ni una base de datos para ejecutar esta versión.

## Ejecución del proyecto

1. Clonar el repositorio:

git clone [URL_DEL_REPOSITORIO]

2. Abrir la carpeta del proyecto en Visual Studio Code.

3. Instalar la extensión **Live Server**, si aún no está instalada.

4. Abrir `index.html`.

5. Seleccionar **"Open with Live Server"**.

6. El proyecto se abrirá en el navegador y permitirá navegar entre las diferentes vistas.


## Datos del catálogo

Durante la EP1, los productos se almacenan mediante **estructuras de datos en JavaScript**.

La información del catálogo se encuentra en archivos JavaScript y se utiliza para generar dinámicamente las tarjetas de productos mediante manipulación del DOM.

No se utiliza una base de datos ni una API en esta etapa.

## Carrito de compras

El carrito utiliza `localStorage` para mantener los productos seleccionados mientras el usuario navega entre las diferentes vistas.

Se controla:

* Producto seleccionado.
* Precio.
* Cantidad.
* Stock máximo disponible.
* Subtotal.
* Persistencia del carrito durante la navegación.

## Diseño

La interfaz utiliza hojas de estilo **CSS externas**, permitiendo mantener una separación entre la estructura HTML y la presentación visual.

La maquetación utiliza principalmente **Flexbox y/o Grid**, junto con variables CSS para mantener una identidad visual consistente.

## Evolución del proyecto

GameHub Store será desarrollado progresivamente durante el semestre:

### EP1 HTML5, CSS3 y JavaScript

Construcción de la base web, navegación, catálogo, formularios, validaciones y funcionalidades principales mediante JavaScript.

### EP2 React, Bootstrap y pruebas

Migración del proyecto a React, creación de componentes reutilizables, diseño responsivo con Bootstrap (aunque ya estaba permitido bootstrap para la EP1) y pruebas unitarias mediante Jasmine y Karma.

### EP3 Integración con backend

Integración con los microservicios mediante API REST, autenticación con JWT, gestión de sesiones y control de acceso según roles.

## Estado actual

**EP1 — Completada**

La versión actual corresponde a la primera etapa del proyecto y utiliza datos simulados en JavaScript. Las funcionalidades de backend, autenticación real y conexión con microservicios serán incorporadas en etapas posteriores.


## Repositorio
* **Repositorio GitHub:** https://github.com/melafiori/GameHub-Store-II.git