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

/* ----------------------------------------------------- PRODUCTOS SIMULADOS -----------------------------------------------------*/
const productos = [

    /*---------------- NOTEBOOKS ----------------*/
    {
        nombre: "ASUS TUF Gaming A15",
        categoria: "Notebooks",
        marca: "ASUS",
        precio: 899990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "MSI Katana 15",
        categoria: "Notebooks",
        marca: "MSI",
        precio: 999990,
        stock: 5,
        estado: "En stock"
    },

    {
        nombre: "ASUS ROG Strix G16",
        categoria: "Notebooks",
        marca: "ASUS",
        precio: 1299990,
        stock: 3,
        estado: "Últimas unidades"
    },

    /*---------------- TARJETAS GRÁFICAS ----------------*/
    {
        nombre: "ASUS Dual GeForce RTX 4070 Super",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 799990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "MSI Gaming X RTX 4060 Ti",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 549990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "Gigabyte Gaming OC RX 7800 XT",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 649990,
        stock: 0,
        estado: "Sin stock"
    },

    {
        nombre: "Zotac Gaming Trinity RTX 4090",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 2199990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "ASUS TUF Gaming RTX 4060",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 399990,
        stock: 3,
        estado: "Últimas unidades"
    },

    {
        nombre: "MSI Gaming Trio RX 7900 XTX",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 1099990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "Gigabyte Aorus Master RTX 4080 Super",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 1549990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "Zotac Twin Edge RTX 4070",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 599990,
        stock: 0,
        estado: "Sin stock"
    },

    {
        nombre: "ASUS Dual RX 7600",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 279990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "Gigabyte Windforce RTX 4060 Ti",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 519990,
        stock: 10,
        estado: "En stock"
    },

    {
        nombre: "MSI Suprim X RTX 4070 Ti Super",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 999990,
        stock: 3,
        estado: "Últimas unidades"
    },

    {
        nombre: "Zotac Gaming RX 7700 XT",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 549990,
        stock: 10,
        estado: "En stock"
    },


    /*---------------- PROCESADORES ----------------*/
    {
        nombre: "AMD Ryzen 5 7600",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 189990,
        stock: 15,
        estado: "En stock"
    },

    {
        nombre: "AMD Ryzen 7 7800X3D",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 399990,
        stock: 7,
        estado: "En stock"
    },

    {
        nombre: "Intel Core i7-14700K",
        categoria: "Procesadores",
        marca: "Intel",
        precio: 449990,
        stock: 4,
        estado: "Últimas unidades"
    },

    /*---------------- PERIFÉRICOS ----------------*/
    {
        nombre: "Teclado Mecánico RGB",
        categoria: "Periféricos",
        marca: "ASUS",
        precio: 69990,
        stock: 20,
        estado: "En stock"
    },

    {
        nombre: "Mouse Logitech G502",
        categoria: "Periféricos",
        marca: "Logitech",
        precio: 49990,
        stock: 12,
        estado: "En stock"
    },

    {
        nombre: "Audífonos Gamer HyperX",
        categoria: "Periféricos",
        marca: "HyperX",
        precio: 79990,
        stock: 0,
        estado: "Sin stock"
    },

    /*---------------- CONSOLAS ----------------*/
    {
        nombre: "PlayStation 5 Slim",
        categoria: "Consolas",
        marca: "Sony",
        precio: 649990,
        stock: 5,
        estado: "En stock"
    },

    {
        nombre: "Xbox Series X",
        categoria: "Consolas",
        marca: "Microsoft",
        precio: 599990,
        stock: 3,
        estado: "Últimas unidades"
    },

    {
        nombre: "Nintendo Switch OLED",
        categoria: "Consolas",
        marca: "Nintendo",
        precio: 349990,
        stock: 10,
        estado: "En stock"
    },

    /*---------------- MONITORES ----------------*/
    {
        nombre: "ASUS TUF Gaming 27 pulgadas",
        categoria: "Monitores",
        marca: "ASUS",
        precio: 299990,
        stock: 8,
        estado: "En stock"
    },

    {
        nombre: "MSI Optix 27 pulgadas",
        categoria: "Monitores",
        marca: "MSI",
        precio: 349990,
        stock: 5,
        estado: "En stock"
    },

    {
        nombre: "Gigabyte Gaming 32 pulgadas",
        categoria: "Monitores",
        marca: "Gigabyte",
        precio: 499990,
        stock: 2,
        estado: "Últimas unidades"
    },

    /*---------------- ACCESORIOS ----------------*/
    {
        nombre: "Controlador Gamer RGB",
        categoria: "Accesorios",
        marca: "ASUS",
        precio: 59990,
        stock: 15,
        estado: "En stock"
    },

    {
        nombre: "Mousepad Gamer XL",
        categoria: "Accesorios",
        marca: "MSI",
        precio: 29990,
        stock: 20,
        estado: "En stock"
    },

    {
        nombre: "Soporte para Notebook",
        categoria: "Accesorios",
        marca: "Gigabyte",
        precio: 39990,
        stock: 0,
        estado: "Sin stock"
    }
];

/* ----------------------------------------------------- FILTROS DEL CATÁLOGO -----------------------------------------------------*/
const grillaProductos = document.getElementById("grilla-productos");
const formularioFiltros = document.querySelector(".filtros form");

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
                src="assets/img/producto-placeholder.jpg"
                alt="${producto.nombre}"
            >

            <h5>${producto.nombre}</h5>

            <p class="marca-producto">
                ${producto.marca}
            </p>

            <p class="precio-producto">
                $${producto.precio.toLocaleString("es-CL")}
            </p>

            <a
                href="producto.html"
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
                src="assets/img/producto-placeholder.jpg"
                alt="${producto.nombre}"
            >

            <h5>${producto.nombre}</h5>

            <p class="marca-producto">
                ${producto.marca}
            </p>

            <p class="precio-producto">
                $${producto.precio.toLocaleString("es-CL")}
            </p>

            <a
                href="producto.html"
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