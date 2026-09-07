/*OBTENER CATEGORÍA DESDE LA URL*/
const parametros = new URLSearchParams(window.location.search);
const categoriaSeleccionada = parametros.get("categoria");

/* ----------------------------------------------------- CATEGORÍAS DISPONIBLES -----------------------------------------------------*/
const categorias = {
    notebooks: "Notebooks",
    graficas: "Tarjetas Gráficas",
    procesadores: "Procesadores",
    perifericos: "Periféricos",
    consolas: "Consolas",
    monitores: "Monitores",
    accesorios: "Accesorios"
};

// Si no se selecciona una categoría, mostramos Tarjetas Gráficas por defecto
const categoria = categorias[categoriaSeleccionada] || "Tarjetas Gráficas";

/* ----------------------------------------------------- CAMBIAR TÍTULO DEL CATÁLOGO -----------------------------------------------------*/
const tituloCatalogo = document.querySelector(".catalogo-encabezado h3");
if (tituloCatalogo) {
    tituloCatalogo.textContent = categoria;
}

/* ----------------------------------------------------- MARCAR LA CATEGORÍA SELECCIONADA -----------------------------------------------------*/
const checkboxesCategoria = document.querySelectorAll(
    'input[name="categoria"]'
);

checkboxesCategoria.forEach(checkbox => {
    checkbox.checked = false;
});

const checkboxSeleccionado = document.querySelector(
    `input[name="categoria"][value="${categoriaSeleccionada}"]`
);

if (checkboxSeleccionado) {
    checkboxSeleccionado.checked = true;
}

/* ----------------------------------------------------- FILTROS DEL CATÁLOGO -----------------------------------------------------*/
const grillaProductos = document.getElementById("grilla-productos");
const formularioFiltros = document.querySelector(".filtros form");
const idsOfertas = [1, 4, 17, 19];

function mostrarTodosLosProductos() {
    if (!grillaProductos) return;

    grillaProductos.innerHTML = "";
    const resultados = document.querySelector(".catalogo-resultados");

    if (resultados) {
        resultados.textContent =
            `Mostrando ${productos.length} productos`;
    }

    productos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-producto");
        const esOferta = idsOfertas.includes(producto.id);
        let claseStock = "disponible";
    

        if (producto.stock === 0) {
            claseStock = "agotado";
        } else if (producto.stock <= 3) {
            claseStock = "ultimas";
        }
        tarjeta.innerHTML = `
            <span class="etiqueta-stock ${claseStock}">
                ${producto.estado}
            </span>

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <h5>${producto.nombre}</h5>

            <p class="marca-producto">
                ${producto.marca}
            </p>

            <p class="precio-producto">
                ${esOferta
                    ? `
                        <span class="precio-anterior">
                            $${producto.precio.toLocaleString("es-CL")}
                        </span>
                            <span class="precio-oferta">
                                $${Math.round(producto.precio * 0.90).toLocaleString("es-CL")}
                            </span>
                        `
                        : `
                            $${producto.precio.toLocaleString("es-CL")}
                        `
                }
            </p>

            <a
                href="producto.html?id=${producto.id}${esOferta ? "&oferta=true" : ""}"
                class="btn-ver-producto"
            >
                Ver producto
            </a>
        `;
        grillaProductos.appendChild(tarjeta);
    });
}
let paginaActual = 1;
function mostrarProductos() {
    if (!grillaProductos) return;
    const ordenSeleccionado = document.getElementById("orden").value;

    // Limpiar productos anteriores
    grillaProductos.innerHTML = "";

    // Obtener categoría seleccionada desde los checkboxes
    const categoriasSeleccionadas = Array.from(
        document.querySelectorAll('input[name="categoria"]:checked')
    ).map(checkbox => categorias[checkbox.value]);


    // Obtener marcas seleccionadas
    const marcasSeleccionadas = Array.from(
        document.querySelectorAll('input[name="marca"]:checked')
    ).map(checkbox => checkbox.value.toLowerCase());

    // Obtener precios mínimo y máximo
    const precioMin = Number(document.getElementById("precio-min").value) || 0;
    const precioMaxInput = document.getElementById("precio-max").value;
    const precioMax = precioMaxInput === "" ? Infinity : Number(precioMaxInput);

    // Obtener filtro de stock
    const soloStock = document.getElementById("stock-disponible").checked;

    // Filtrar productos
    const productosFiltrados = productos.filter(producto => {

        const coincideCategoria =
            categoriasSeleccionadas.length === 0 ||
            categoriasSeleccionadas.includes(producto.categoria);

        const coincideMarca =
            marcasSeleccionadas.length === 0 ||
            marcasSeleccionadas.includes(producto.marca.toLowerCase());

        const coincidePrecio =
            producto.precio >= precioMin &&
            producto.precio <= precioMax;

        const coincideStock =
            !soloStock || producto.stock > 0;

        return coincideCategoria && coincideMarca && coincidePrecio && coincideStock;
    });

    // Ordenar productos
    productosFiltrados.sort((a, b) => {

        if (ordenSeleccionado === "precio-asc") {
            return a.precio - b.precio;
        }

        if (ordenSeleccionado === "precio-desc") {
            return b.precio - a.precio;
        }

        if (ordenSeleccionado === "nombre-asc") {
            return a.nombre.localeCompare(b.nombre);
        }

        if (ordenSeleccionado === "nombre-desc") {
            return b.nombre.localeCompare(a.nombre);
        }
    });

    /* ----------------------------------------------------- CAMBIAR TÍTULO -----------------------------------------------------*/
    if (tituloCatalogo) {
        tituloCatalogo.textContent = "Catálogo de productos";
    }

    /* ----------------------------------------------------- MOSTRAR CANTIDAD -----------------------------------------------------*/
    const resultados = document.querySelector(".catalogo-resultados");
    if (resultados) {
        resultados.textContent =
            `Mostrando ${productosFiltrados.length} productos`;
    }

    /* ----------------------------------------------------- PAGINACIÓN -----------------------------------------------------*/
    // Cantidad de productos por página
    const productosPorPagina = 12;

    // Calcular desde qué producto hasta qué producto mostrar
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;

    // Obtener solamente los productos de la página actual
    const productosPagina = productosFiltrados.slice(inicio, fin);
    /* ----------------------------------------------------- CREAR TARJETAS -----------------------------------------------------*/
    productosPagina.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-producto");
        const esOferta = idsOfertas.includes(producto.id);
        let claseStock = "disponible";

        if (producto.stock === 0) {
            claseStock = "agotado";
        } else if (producto.stock <= 3) {
            claseStock = "ultimas";
        }

        tarjeta.innerHTML = `
            <span class="etiqueta-stock ${claseStock}">
                ${producto.estado}
            </span>

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <h5>${producto.nombre}</h5>

            <p class="marca-producto">
                ${producto.marca}
            </p>

            <p class="precio-producto">
                ${esOferta
                    ? `
                        <span class="precio-anterior">
                            $${producto.precio.toLocaleString("es-CL")}
                        </span>
                        <span class="precio-oferta">
                            $${Math.round(producto.precio * 0.90).toLocaleString("es-CL")}
                        </span>
                    `
                    : `
                        $${producto.precio.toLocaleString("es-CL")}
                    `
                }
            </p>

            <a
                href="producto.html?id=${producto.id}${esOferta ? "&oferta=true" : ""}"
                class="btn-ver-producto"
            >
                Ver producto
            </a>
        `;
        grillaProductos.appendChild(tarjeta);
    });

    // Actualizar número de página activa
    const botonesPaginas = document.querySelectorAll(".paginacion a");
    botonesPaginas.forEach(boton => {
        boton.classList.remove("pagina-activa");

        if (boton.textContent.trim() === String(paginaActual)) {
            boton.classList.add("pagina-activa");
        }
    });
}

/* ----------------------------------------------------- APLICAR FILTROS -----------------------------------------------------*/
if (formularioFiltros) {
    formularioFiltros.addEventListener("submit", function(evento) {
        evento.preventDefault();
        const precioMin = Number(document.getElementById("precio-min").value) || 0;
        const precioMaxInput = document.getElementById("precio-max").value;
        const precioMax = precioMaxInput === "" ? Infinity : Number(precioMaxInput);

        if (precioMin > precioMax) {
            alert("El precio mínimo no puede ser mayor que el precio máximo.");
            return;
        }
        mostrarProductos();
    });
}
/* ----------------------------------------------------- LIMPIAR FILTROS -----------------------------------------------------*/
if (formularioFiltros) {
    formularioFiltros.addEventListener("reset", function() {
        setTimeout(() => {
            // Quitar todas las categorías seleccionadas
            document
                .querySelectorAll('input[name="categoria"]')
                .forEach(checkbox => {
                    checkbox.checked = false;
                });

            // Quitar todas las marcas seleccionadas
            document
                .querySelectorAll('input[name="marca"]')
                .forEach(checkbox => {
                    checkbox.checked = false;
                });
            mostrarProductos();
        }, 0);
    });
}
/* ----------------------------------------------------- MOSTRAR PRODUCTOS AL CARGAR -----------------------------------------------------*/
mostrarProductos();
/* ----------------------------------------------------- CAMBIAR ORDEN -----------------------------------------------------*/
const selectorOrden = document.getElementById("orden");
if (selectorOrden) {
    selectorOrden.addEventListener("change", mostrarProductos);
}
/* ----------------------------------------------------- PAGINACIÓN -----------------------------------------------------*/
const botonesPaginacion = document.querySelectorAll(".paginacion a");
botonesPaginacion.forEach(boton => {
    boton.addEventListener("click", function(evento) {
        evento.preventDefault();
        const texto = boton.textContent.trim();
        if (texto === "1") {
            paginaActual = 1;
        }

        if (texto === "2") {
            paginaActual = 2;
        }

        if (texto === "3") {
            paginaActual = 3;
        }

        if (texto.includes("Siguiente")) {
            paginaActual++;
        }

        if (texto.includes("Anterior")) {
            paginaActual--;
        }

        if (paginaActual < 1) {
            paginaActual = 1;
        }
        mostrarProductos();
    });
});