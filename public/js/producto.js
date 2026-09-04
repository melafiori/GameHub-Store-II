document.addEventListener('DOMContentLoaded', function () {

    var formCompra = document.querySelector('.producto-compra');
    var inputCantidad = document.getElementById('cantidad');

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

        // recien ahora navegamos al carrito, con el producto ya guardado
        window.location.href = formCompra.action;
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