// datos de prueba para simular los productos del catalogo
const catalogoSimulado = [
    { id: 1, nombre: "Tarjeta Gráfica RTX 4070 Ti", precio: 799990, imagen: "img/promo1.jpg" },
    { id: 2, nombre: "Teclado Mecánico RGB", precio: 54990, imagen: "img/promo2.jpg" }
];

// recupera el carrito guardado en el navegador o devuelve un arreglo vacio si no existe
function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : []; 
}

console.log("Contenido del carrito al cargar:", obtenerCarrito());

// gestiona la visibilidad de los elementos de la interfaz segun el estado del carrito
function actualizarVista() {
    const estadoVacio = document.getElementById("estado-vacio");
    const contenedorCarrito = document.getElementById("contenedor-carrito");

    // previene errores deteniendo la funcion si los elementos html no estan en la pagina actual
    if (!estadoVacio || !contenedorCarrito) {
        return; 
    }

    const carrito = obtenerCarrito();

    // alterna entre mostrar el mensaje de carrito vacio o la tabla de productos
    if (carrito.length === 0) {
        estadoVacio.classList.remove("d-none");
        contenedorCarrito.classList.add("d-none");
    } else {
        estadoVacio.classList.add("d-none");
        contenedorCarrito.classList.remove("d-none");
        
        // dibuja los elementos y calcula sus valores si el carrito tiene productos
        renderizarCarrito();
        calcularTotales();
    }
}

// llama a la funcion de inicio para preparar la vista inmediatamente
actualizarVista();

// se encarga de crear el html de cada producto y mostrarlo en la tabla
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const tbody = document.getElementById("cuerpo-tabla-carrito");

    // detiene el proceso si no detecta el cuerpo de la tabla
    if (!tbody) return;

    // vacia el contenedor html para evitar elementos duplicados al volver a renderizar
    tbody.innerHTML = "";

    // construye una fila de tabla por cada item guardado en el carrito
    carrito.forEach((producto, index) => {
        // calcula el costo total dependiendo de la cantidad elegida
        const subtotal = producto.precio * producto.cantidad;

        // genera la estructura de la fila inyectando las variables del producto
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-miniatura rounded">
                    <div>
                        <strong class="d-block text-light">${producto.nombre}</strong>
                    </div>
                </div>
            </td>
            <td class="text-center">$${producto.precio.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <input type="number" class="form-control form-control-sm input-cantidad text-center mx-auto" 
                       value="${producto.cantidad}" min="1" data-id="${producto.id}">
            </td>
            <td class="text-end fw-bold text-acento">$${subtotal.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" data-id="${producto.id}">✕</button>
            </td>
        `;
        
        // inserta la fila generada dentro del cuerpo de la tabla en el dom
        tbody.appendChild(fila);
    });
}

// calcula la suma de todos los productos y plasma el resultado en la interfaz
function calcularTotales() {
    const carrito = obtenerCarrito();
    const resumenSubtotal = document.getElementById("resumen-subtotal");
    const resumenTotal = document.getElementById("resumen-total");

    // asegura que existan los campos de texto para no generar errores
    if (!resumenSubtotal || !resumenTotal) return;

    let subtotalGeneral = 0;

    // acumula el valor monetario total de todo el carrito
    carrito.forEach(producto => {
        subtotalGeneral += producto.precio * producto.cantidad;
    });

    // convierte el numero en texto con separadores de miles
    const totalFormateado = "$" + subtotalGeneral.toLocaleString("es-CL");

    // muestra el total calculado en los nodos de texto correspondientes
    resumenSubtotal.textContent = totalFormateado;
    resumenTotal.textContent = totalFormateado; 
}