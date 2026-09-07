document.addEventListener('DOMContentLoaded', function () {

    /* ---- OBTENER PRODUCTO DESDE LA URL ---- */
    const parametros = new URLSearchParams(window.location.search);
    const idProducto = Number(parametros.get("id"));
    const esOferta = parametros.get("oferta") === "true";
    const productoSeleccionado = window.productos.find(function (producto) {
        return producto.id === idProducto;
    });

    if (!productoSeleccionado) {
        alert("No se encontró el producto seleccionado.");
        window.location.href = "catcategoria.html";
        return;
    }
    const precioFinal = esOferta
        ? Math.round(productoSeleccionado.precio * 0.90)
        : productoSeleccionado.precio;

    /* ---- ACTUALIZAR MIGA DE PAN ---- */
    const mapaCategorias = {
        "Notebooks": "notebooks",
        "Tarjetas Gráficas": "graficas",
        "Procesadores": "procesadores",
        "Periféricos": "perifericos",
        "Consolas": "consolas",
        "Monitores": "monitores",
        "Accesorios": "accesorios"
    };

    const breadcrumbCategoria = document.querySelector(".breadcrumb-categoria");
    const breadcrumbProducto = document.querySelector(".breadcrumb-producto");
    if (breadcrumbCategoria) {
        const categoriaUrl = mapaCategorias[productoSeleccionado.categoria];
        breadcrumbCategoria.innerHTML = `
            <a href="catcategoria.html?categoria=${categoriaUrl}">
                ${productoSeleccionado.categoria}
            </a>
        `;
    }
    if (breadcrumbProducto) {
        breadcrumbProducto.textContent = productoSeleccionado.nombre;
    }

    /* ---- MOSTRAR DATOS DEL PRODUCTO ---- */
    const marca = document.querySelector(".producto-marca");
    const titulo = document.querySelector(".producto-titulo");
    const imagenPrincipal = document.querySelector(".galeria-imagen-principal img");
    const precioAnterior = document.querySelector(".precio-anterior");
    const precioActual = document.querySelector(".precio-actual");
    const etiquetaDescuento = document.querySelector(".etiqueta-descuento");
    const stock = document.querySelector(".producto-stock");
    const formulario = document.querySelector(".producto-compra");
    const cantidad = document.getElementById("cantidad");

    if (marca) {
        marca.textContent = productoSeleccionado.marca;
    }
    if (titulo) {
        titulo.textContent = productoSeleccionado.nombre;
    }
    if (imagenPrincipal) {
        imagenPrincipal.src = productoSeleccionado.imagen;
        imagenPrincipal.alt = productoSeleccionado.nombre;
    }
    if (precioActual) {
        precioActual.textContent =
            "$" + precioFinal.toLocaleString("es-CL");
    }

    if (precioAnterior) {
        if (esOferta) {
            precioAnterior.textContent =
                "$" + productoSeleccionado.precio.toLocaleString("es-CL");
            precioAnterior.style.display = "inline";
        } else {
            precioAnterior.textContent = "";
            precioAnterior.style.display = "none";
        }
    }

    if (etiquetaDescuento) {
        if (esOferta) {
            etiquetaDescuento.textContent = "10% OFF";
            etiquetaDescuento.style.display = "inline";
        } else {
            etiquetaDescuento.textContent = "";
            etiquetaDescuento.style.display = "none";
        }
    }

    if (stock) {
        if (productoSeleccionado.stock > 0) {
            stock.innerHTML =
                '<span class="indicador-stock"></span> Stock disponible (' +
                productoSeleccionado.stock +
                ' unidades)';
            stock.classList.remove("agotado");
            stock.classList.add("disponible");
        } else {
            stock.innerHTML =
                '<span class="indicador-stock"></span> Sin stock';
            stock.classList.remove("disponible");
            stock.classList.add("agotado");
        }
    }

    /* ---- ACTUALIZAR DATOS DEL FORMULARIO ---- */
    if (formulario) {
        formulario.dataset.id = productoSeleccionado.id;
        formulario.dataset.nombre = productoSeleccionado.nombre;
        formulario.dataset.precio = precioFinal;
        formulario.dataset.imagen = productoSeleccionado.imagen;
        formulario.dataset.stockMaximo = productoSeleccionado.stock;
        if (cantidad) {
            cantidad.max = productoSeleccionado.stock;
        }
    }
    var formCompra = document.querySelector('.producto-compra');
    var inputCantidad = document.getElementById('cantidad');

    /* ---- MOSTRAR ESPECIFICACIONES Y DESCRIPCIÓN ---- */
    const tablaEspecificaciones = document.querySelector(".tabla-especificaciones tbody");
    const descripcion = document.querySelector(".producto-descripcion p");

    if (tablaEspecificaciones && productoSeleccionado.especificaciones) {
        tablaEspecificaciones.innerHTML = "";

        Object.entries(productoSeleccionado.especificaciones).forEach(function ([nombre, valor]) {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <th>${nombre}</th>
                <td>${valor}</td>
            `;
            tablaEspecificaciones.appendChild(fila);
        });
    }
    if (descripcion && productoSeleccionado.descripcion) {
        descripcion.textContent = productoSeleccionado.descripcion;
    }

    /* ---- BOTONES + Y - DEL SELECTOR DE CANTIDAD ---- */
    var botonesCantidad = document.querySelectorAll('.btn-cantidad');
    botonesCantidad.forEach(function (boton) {
        boton.addEventListener('click', function () {
            var valorActual = parseInt(inputCantidad.value, 10) || 1;
            var minimo = parseInt(inputCantidad.min, 10);
            var maximo = parseInt(inputCantidad.max, 10);

            if (boton.dataset.accion === 'sumar' && valorActual < maximo) {
                inputCantidad.value = valorActual + 1;
            }

            if (boton.dataset.accion === 'restar' && valorActual > minimo) {
                inputCantidad.value = valorActual - 1;
            }
        });
    });

    /* ---- GUARDAR PRODUCTO EN localStorage AL AGREGAR AL CARRITO ---- */
    formCompra.addEventListener('submit', function (evento) {
        evento.preventDefault(); // evita que el form navegue solo, primero guardamos

        var producto = {
            id: Number(formCompra.dataset.id),
            nombre: formCompra.dataset.nombre,
            precio: Number(formCompra.dataset.precio),
            imagen: formCompra.dataset.imagen,
            stockMaximo: Number(formCompra.dataset.stockMaximo),
            cantidad: parseInt(inputCantidad.value, 10) || 1
        };

        guardarProductoEnCarrito(producto);
        const mensajeCarrito = document.querySelector(".mensaje-carrito");

        if (mensajeCarrito) {
            mensajeCarrito.textContent = "Producto agregado al carrito";
            mensajeCarrito.classList.add("mostrar");

            setTimeout(function () {
                mensajeCarrito.classList.remove("mostrar");
            }, 3000);
        }
    });

    function guardarProductoEnCarrito(producto) {
        var carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        var itemExistente = carrito.find(function (item) {
            return item.id === producto.id;
        });

        if (itemExistente) {
            // si el producto ya estaba en el carrito, solo se suma la cantidad (sin pasar el stock maximo)
            var cantidadSumada = itemExistente.cantidad + producto.cantidad;
            itemExistente.cantidad = Math.min(cantidadSumada, itemExistente.stockMaximo);
        } else {
            carrito.push(producto);
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
});