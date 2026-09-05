// recupera los datos preparados o devuelve al usuario si el carrito esta vacio
function cargarDatosOrden() {
    const ordenGuardada = localStorage.getItem("orden_activa");
    const carritoNormal = localStorage.getItem("carrito");

    // bloquea el paso si no hay productos
    if (!ordenGuardada && (!carritoNormal || JSON.parse(carritoNormal).length === 0)) {
        alert("no tienes productos en tu carrito. seras redirigido al inicio.");
        window.location.href = "index.html";
        return null;
    }

    // si no paso por el boton del carrito, tenemos un respaldo
    return ordenGuardada ? JSON.parse(ordenGuardada) : { items: JSON.parse(carritoNormal), descuento: 0, cupon: null };
}

// dibuja la lista de productos y los valores finales en la columna derecha
function renderizarResumenCheckout() {
    const orden = cargarDatosOrden();
    if (!orden) return;

    const listaResumen = document.getElementById("lista-resumen-checkout");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const filaDescuento = document.getElementById("fila-descuento-checkout");
    const descuentoEl = document.getElementById("checkout-descuento");
    const totalEl = document.getElementById("checkout-total");

    if (!listaResumen) return;

    let subtotalCalculado = 0;

    // inyecta los items como una lista compacta
    listaResumen.innerHTML = orden.items.map(producto => {
        const subtotalLinea = producto.precio * producto.cantidad;
        subtotalCalculado += subtotalLinea;
        
        return `
            <li class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <div>
                    <span class="d-block">${producto.nombre}</span>
                    <small class="text-secondary">cantidad: ${producto.cantidad}</small>
                </div>
                <span>$${subtotalLinea.toLocaleString("es-CL")}</span>
            </li>
        `;
    }).join("");

    // calcula el descuento aplicando el porcentaje guardado sobre el subtotal
    let montoDescuento = 0;
    if (orden.descuento > 0) {
        montoDescuento = Math.round(subtotalCalculado * (orden.descuento / 100));
        
        if (montoDescuento > subtotalCalculado) montoDescuento = subtotalCalculado;

        filaDescuento.classList.remove("d-none");
        descuentoEl.textContent = "-$" + montoDescuento.toLocaleString("es-CL");
    }

    const totalFinal = subtotalCalculado - montoDescuento;

    subtotalEl.textContent = "$" + subtotalCalculado.toLocaleString("es-CL");
    totalEl.textContent = "$" + totalFinal.toLocaleString("es-CL");
}

// evalua el formulario antes de procesar la compra
function configurarValidacionFormulario() {
    const formulario = document.getElementById("formulario-checkout");
    if (!formulario) return;

    // evalua los cambios en los inputs para limpiar los errores a medida que se escribe
    const camposFormulario = formulario.querySelectorAll("input, select");
    camposFormulario.forEach(campo => {
        campo.addEventListener("input", () => {
            campo.classList.remove("is-invalid");
        });
    });

    // evalua el formulario completo al intentar enviarlo
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); 

        let esFormularioValido = true;

        // 1. validacion de nombre (minimo 3 caracteres)
        const inputNombre = document.getElementById("nombre");
        if (inputNombre.value.trim().length < 3) {
            inputNombre.classList.add("is-invalid");
            esFormularioValido = false;
        }

        // 2. validacion de correo
        const inputCorreo = document.getElementById("correo");
        const formatoCorreo = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
        if (!formatoCorreo.test(inputCorreo.value.trim())) {
            inputCorreo.classList.add("is-invalid");
            esFormularioValido = false;
        }

        // 3. validacion de telefono (deben ser 9 numeros)
        const inputTelefono = document.getElementById("telefono");
        const formatoTelefono = /^[0-9]{9}$/;
        if (!formatoTelefono.test(inputTelefono.value.trim())) {
            inputTelefono.classList.add("is-invalid");
            esFormularioValido = false;
        }

        // 4. validacion de selects y textos obligatorios
        const idsRequeridos = ["region", "comuna", "direccion"];
        idsRequeridos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo.value.trim() === "") {
                campo.classList.add("is-invalid");
                esFormularioValido = false;
            }
        });

        // 5. validacion del grupo de radio buttons para el metodo de pago
        const opcionesPago = document.querySelectorAll('input[name="metodoPago"]');
        const errorPago = document.getElementById("error-pago");
        let hayPagoSeleccionado = false;
        
        opcionesPago.forEach(radio => {
            if (radio.checked) hayPagoSeleccionado = true;
        });

        if (!hayPagoSeleccionado) {
            errorPago.classList.remove("d-none");
            esFormularioValido = false;
        } else {
            errorPago.classList.add("d-none");
        }

        // 6. resolucion final
        if (esFormularioValido) {
            simularCompraExitosa();
        }
    });
}

// vacia la memoria y notifica al usuario el numero de orden simulado
function simularCompraExitosa() {
    // genera un numero aleatorio de 6 digitos para la orden
    const numeroOrden = Math.floor(100000 + Math.random() * 900000);
    
    alert(`¡compra exitosa!\n\ntu numero de orden es: #${numeroOrden}\ngracias por preferir nuestra tienda.`);
    
    // borra los datos compartidos para dejar la tienda en blanco
    localStorage.removeItem("carrito");
    localStorage.removeItem("orden_activa");
    
    // redirige al inicio
    window.location.href = "index.html";
}


renderizarResumenCheckout();
configurarValidacionFormulario();