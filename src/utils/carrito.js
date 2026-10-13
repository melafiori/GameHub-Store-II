// variables globales siempre arriba para evitar errores de lectura
const cuponesDisponibles = [
    { codigo: "NEON10", porcentaje: 10, tope: 50000, vigencia: "2026-12-31" },
    { codigo: "GAMER20", porcentaje: 20, tope: 80000, vigencia: "2026-12-31" },
    { codigo: "EXPIRADO", porcentaje: 15, tope: 30000, vigencia: "2025-01-01" }
];
let cuponActivo = null;

// obtiene datos del almacenamiento o devuelve un arreglo vacio en una linea
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// controla la vista usando toggle para ahorrar condicionales largos
function actualizarVista() {
    const estadoVacio = document.getElementById("estado-vacio");
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    
    if (!estadoVacio || !contenedorCarrito) return; 

    const carrito = obtenerCarrito();
    const estaVacio = carrito.length === 0;

    // toggle activa la clase si es true y la quita si es false
    estadoVacio.classList.toggle("d-none", !estaVacio);
    contenedorCarrito.classList.toggle("d-none", estaVacio);

    if (!estaVacio) {
        renderizarCarrito();
        calcularTotales();
    }
}

// dibuja la tabla combinando map y join para inyectar todo de una vez
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const tbody = document.getElementById("cuerpo-tabla-carrito");
    
    if (!tbody) return;

    tbody.innerHTML = carrito.map(producto => `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-miniatura rounded">
                    <div>
                        <strong class="d-block text-light">${producto.nombre}</strong>
                        <small class="text-secondary">disponibles: ${producto.stockMaximo || 10}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">$${producto.precio.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <input type="number" class="form-control form-control-sm input-cantidad text-center mx-auto input-cambio-cantidad" 
                       value="${producto.cantidad}" min="1" max="${producto.stockMaximo || 10}" data-id="${producto.id}">
            </td>
            <td class="text-end fw-bold text-acento">$${(producto.precio * producto.cantidad).toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger btn-eliminar-linea" data-id="${producto.id}" title="eliminar producto">✕</button>
            </td>
        </tr>
    `).join("");

    asignarEventosDinamicos();
}

// suma los montos usando reduce y calcula limites con math.min
function calcularTotales() {
    const carrito = obtenerCarrito();
    const resumenSubtotal = document.getElementById("resumen-subtotal");
    const resumenDescuento = document.getElementById("resumen-descuento");
    const resumenTotal = document.getElementById("resumen-total");

    if (!resumenSubtotal || !resumenTotal) return;

    // reduce acumula la suma de todo el arreglo en una sola linea
    const subtotalGeneral = carrito.reduce((suma, prod) => suma + (prod.precio * prod.cantidad), 0);
    let montoDescuento = 0;

    if (cuponActivo && subtotalGeneral > 0) {
        // math.min elige el numero mas pequeño, aplicando el tope y limitando al subtotal de forma limpia
        const calculoBase = Math.round(subtotalGeneral * (cuponActivo.porcentaje / 100));
        montoDescuento = Math.min(calculoBase, cuponActivo.tope, subtotalGeneral);
    }

    resumenSubtotal.textContent = "$" + subtotalGeneral.toLocaleString("es-CL");
    if (resumenDescuento) resumenDescuento.textContent = "-$" + montoDescuento.toLocaleString("es-CL");
    resumenTotal.textContent = "$" + (subtotalGeneral - montoDescuento).toLocaleString("es-CL");
}

// remueve el producto del arreglo filtrando su id
function eliminarProducto(id) {
    guardarCarrito(obtenerCarrito().filter(item => item.id !== id));
    actualizarVista();
}

// valida el stock y actualiza usando operadores ternarios cortos
function cambiarCantidad(id, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const producto = carrito.find(item => item.id === id);
    
    if (!producto) return;

    const limite = producto.stockMaximo || 10;
    
    if (nuevaCantidad > limite) {
        alert("no puedes agregar mas unidades de las disponibles en stock");
    } else {
        producto.cantidad = (nuevaCantidad < 1 || isNaN(nuevaCantidad)) ? 1 : nuevaCantidad;
        guardarCarrito(carrito);
    }
    actualizarVista();
}

function vaciarCarritoCompleto() {
    localStorage.removeItem("carrito");
    actualizarVista();
}

// compactacion de las validaciones del cupon
function aplicarCupon() {
    const input = document.getElementById("input-cupon");
    const msj = document.getElementById("mensaje-cupon");
    
    if (!input || !msj) return;

    const texto = input.value.trim().toUpperCase();
    if (!texto) {
        msj.textContent = "ingresa un codigo de cupon";
        msj.className = "d-block mt-2 text-warning";
        return;
    }

    const cupon = cuponesDisponibles.find(c => c.codigo === texto);
    
    if (!cupon) {
        cuponActivo = null;
        msj.textContent = "el cupon ingresado no existe";
        msj.className = "d-block mt-2 text-danger";
    } else if (new Date() > new Date(cupon.vigencia)) {
        cuponActivo = null;
        msj.textContent = "este cupon se encuentra vencido";
        msj.className = "d-block mt-2 text-danger";
    } else {
        cuponActivo = cupon;
        msj.textContent = `cupon aplicado: ${cupon.porcentaje}% de descuento`;
        msj.className = "d-block mt-2 text-success";
    }
    
    calcularTotales();
}

// asignacion de los listeners
function asignarEventosDinamicos() {
    document.querySelectorAll(".btn-eliminar-linea").forEach(btn => {
        btn.addEventListener("click", e => eliminarProducto(parseInt(e.target.getAttribute("data-id"))));
    });
    document.querySelectorAll(".input-cambio-cantidad").forEach(input => {
        input.addEventListener("change", e => cambiarCantidad(parseInt(e.target.getAttribute("data-id")), parseInt(e.target.value)));
    });
}

function inicializarEventosEstaticos() {
    const btnVaciar = document.getElementById("btn-vaciar");
    if (btnVaciar) btnVaciar.addEventListener("click", () => confirm("estas seguro de que deseas vaciar el carrito?") && vaciarCarritoCompleto());
    
    const btnCupon = document.getElementById("btn-cupon");
    if (btnCupon) btnCupon.addEventListener("click", aplicarCupon);
}

// inicio de la aplicacion
inicializarEventosEstaticos();
actualizarVista();