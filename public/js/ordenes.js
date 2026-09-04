/*Simulación de orden*/
const ordenes = [
    {
        numero: "1001",
        fecha: "02/09/2026",
        total: 949980,
        estado: "Entregada",
        pago: "Pagado",
        despacho: "Entregado",
        productos: [
            {
                nombre: "Notebook ASUS TUF Gaming",
                cantidad: 1,
                precio: 899990
            },
            {
                nombre: "Teclado Mecánico RGB",
                cantidad: 1,
                precio: 49990
            }
        ]
    },

    {
        numero: "1002",
        fecha: "28/08/2026",
        total: 399990,
        estado: "En despacho",
        pago: "Pagado",
        despacho: "En camino",
        productos: [
            {
                nombre: "Tarjeta Gráfica RTX 4060",
                cantidad: 1,
                precio: 399990
            }
        ]
    },

    {
        numero: "1003",
        fecha: "20/08/2026",
        total: 189990,
        estado: "Procesando",
        pago: "Pagado",
        despacho: "Preparando pedido",
        productos: [
            {
                nombre: "Monitor Gaming 24 pulgadas",
                cantidad: 1,
                precio: 189990
            }
        ]
    }
];

const listaOrdenes = document.getElementById("lista-ordenes");

ordenes.forEach(orden => {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("orden-card");

    tarjeta.innerHTML = `
        <div class="orden-informacion">
            <h2>Orden #${orden.numero}</h2>
            <p>
                <strong>Fecha:</strong> ${orden.fecha}
            </p>

            <p>
                <strong>Total:</strong>
                $${orden.total.toLocaleString("es-CL")}
            </p>

            <p>
                <strong>Estado:</strong>
                ${orden.estado}
            </p>
        </div>

        <button 
            class="btn btn-primary btn-detalle"
            data-orden="${orden.numero}"
        >
            Ver detalle
        </button>

    `;
    listaOrdenes.appendChild(tarjeta);

});


/* --------------------- MOSTRAR DETALLE DE LA ORDEN ---------------------*/

const botonesDetalle = document.querySelectorAll(".btn-detalle");


botonesDetalle.forEach(boton => {

    boton.addEventListener("click", () => {
        const numeroOrden = boton.dataset.orden;

        const orden = ordenes.find(
            orden => orden.numero === numeroOrden
        );

        const tarjeta = boton.closest(".orden-card");

        /* Si el detalle ya está abierto, lo cerramos */
        const detalleExistente = tarjeta.querySelector(".detalle-orden");

        if (detalleExistente) {detalleExistente.remove();
            boton.textContent = "Ver detalle";
            return;
        }

        /* Crear detalle */
        const detalle = document.createElement("div");
        detalle.classList.add("detalle-orden");

        /* Productos */
        let productosHTML = "";
        orden.productos.forEach(producto => {
            productosHTML += `
                <div class="producto-orden">

                    <span>
                        ${producto.nombre}
                    </span>

                    <span>
                        x${producto.cantidad}
                    </span>

                    <span>
                        $${producto.precio.toLocaleString("es-CL")}
                    </span>

                </div>

            `;

        });


        detalle.innerHTML = `<div class="detalle-separador"></div>
            <h3>Productos comprados</h3>
            <div class="productos-orden">

                ${productosHTML}

            </div>


            <h3>Estado del pago</h3>

            <p class="estado-exitoso">
                ✓ ${orden.pago}
            </p>


            <h3>Seguimiento del despacho</h3>

            <div class="seguimiento">

                <div class="paso-completado">
                    ✓ Pedido confirmado
                </div>

                <div class="paso-completado">
                    ✓ Pago confirmado
                </div>

                <div class="paso-completado">
                    ✓ ${orden.despacho}
                </div>

            </div>


            <div class="acciones-orden">
                <button class="btn btn-resena">
                    Escribir reseña
                </button>

                <button class="btn btn-garantia">
                    Solicitar garantía
                </button>
            </div>

        `;


        tarjeta.appendChild(detalle);
        boton.textContent = "Ocultar detalle";

    });

});