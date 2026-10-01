// PRODUCTOS DESTACADOS

const listaProductos = document.getElementById("lista-productos");

// IDs de los productos que queremos mostrar como ofertas
const idsOfertas = [2, 4, 29, 19];

const productosOfertas = window.productos.filter(producto =>
    idsOfertas.includes(producto.id)
);

// MOSTRAR PRODUCTOS EN EL HTML
productosOfertas.forEach(producto => {

    // Precio de oferta: 10% de descuento
    const precioOferta = Math.round(producto.precio * 0.90);

    // Calcular porcentaje de descuento
    const descuento = Math.round(
        ((producto.precio - precioOferta) / producto.precio) * 100
    );

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("col-12", "col-md-6", "col-lg-3");

    tarjeta.innerHTML = `
        <div class="card h-100">

            <div class="etiqueta-oferta">
                -${descuento}%
            </div>

            <img
                src="${producto.imagen}"
                class="card-img-top"
                alt="${producto.nombre}"
            >

            <div class="card-body">

                <h5 class="card-title">
                    ${producto.nombre}
                </h5>

                <p class="card-text">
                    Categoría: ${producto.categoria}
                </p>

                <p class="precio-anterior">
                    $${producto.precio.toLocaleString("es-CL")}
                </p>

                <p class="precio-oferta">
                    $${precioOferta.toLocaleString("es-CL")}
                </p>

                <a
                    href="producto.html?id=${producto.id}&oferta=true"
                    class="btn btn-primary"
                >
                    Ver producto
                </a>

            </div>

        </div>
    `;

    listaProductos.appendChild(tarjeta);
});