// PRODUCTOS DESTACADOS - DATOS SIMULADOS

const productos = [
    {
        nombre: "Notebook ASUS TUF Gaming",
        categoria: "Notebooks",
        precio: 899990,
        imagen: "https://i5.walmartimages.cl/asr/f6bf4916-858f-4fdb-bd54-68a8fa57953c.d14b9db613970b4575a51d3a512e23fa.jpeg"
    },
    {
        nombre: "Tarjeta Gráfica RTX 4060",
        categoria: "Tarjetas Gráficas",
        precio: 399990,
        imagen: "assets/img/rtx-4060.jpg"
    },
    {
        nombre: "Procesador AMD Ryzen 5",
        categoria: "Procesadores",
        precio: 179190,
        imagen: "https://cintegral.cl/wp-content/uploads/2024/04/1436922_picture_1628622735-600x649.png"
    },
    {
        nombre: "Teclado Mecánico RK R65 Berry Red 65% Español RGB Royal Kludge",
        categoria: "Periféricos",
        precio: 55990,
        imagen: "https://mcielectronics.cl/wp-content/uploads/2026/05/image-9.jpg"
    }
];

// MOSTRAR PRODUCTOS EN EL HTML
const listaProductos = document.getElementById("lista-productos");

productos.forEach(producto => {

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("col-12", "col-md-6", "col-lg-3");

    tarjeta.innerHTML = `
        <div class="card h-100">

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

                <p class="card-text">
                    <strong>$${producto.precio.toLocaleString("es-CL")}</strong>
                </p>

                <button class="btn btn-primary">
                    Ver producto
                </button>

            </div>

        </div>
    `;
    listaProductos.appendChild(tarjeta);
});