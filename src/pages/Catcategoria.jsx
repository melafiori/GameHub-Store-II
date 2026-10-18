import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productos } from '../data/productos'; 
import '../styles/catalogo.css';

const CATEGORIAS = {
    notebooks: "Notebooks",
    graficas: "Tarjetas Gráficas",
    procesadores: "Procesadores",
    perifericos: "Periféricos",
    consolas: "Consolas",
    monitores: "Monitores",
    accesorios: "Accesorios"
};

const IDS_OFERTAS = [2, 4, 29, 19];
const PRODUCTOS_POR_PAGINA = 12;

const FILTROS_VACIOS = {
    categorias: [],
    marcas: [],
    precioMin: "",
    precioMax: "",
    soloStock: false
};

function Catcategoria() {
    const [searchParams] = useSearchParams();
    const categoriaURL = searchParams.get("categoria");
    const busquedaURL = searchParams.get("busqueda"); 

// Estado con los filtros que se están seleccionando en el formulario (Temporales)
    const [filtrosTemp, setFiltrosTemp] = useState(FILTROS_VACIOS);

    // Estado con los filtros efectivamente aplicados
    const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_VACIOS);

    // Estados independientes de ordenamiento y paginación
    const [orden, setOrden] = useState("precio-asc");
    const [paginaActual, setPaginaActual] = useState(1);

    // Sincronizar categoría inicial desde la URL
    useEffect(() => {
        const catInicial = (categoriaURL && CATEGORIAS[categoriaURL])
            ? [CATEGORIAS[categoriaURL]]
            : [];

        const nuevoEstado = { ...FILTROS_VACIOS, categorias: catInicial };
        setFiltrosTemp(nuevoEstado);
        setFiltrosAplicados(nuevoEstado);
        setPaginaActual(1);
    }, [categoriaURL]);

    // Manejadores de cambios (Checkbox e Inputs)
    const handleCategoriaChange = (nombreCat) => {
        setFiltrosTemp(prev => ({
            ...prev,
            categorias: prev.categorias.includes(nombreCat)
                ? prev.categorias.filter(c => c !== nombreCat)
                : [...prev.categorias, nombreCat]
        }));
    };

    const handleMarcaChange = (marca) => {
        const marcaLower = marca.toLowerCase();
        setFiltrosTemp(prev => ({
            ...prev,
            marcas: prev.marcas.includes(marcaLower)
                ? prev.marcas.filter(m => m !== marcaLower)
                : [...prev.marcas, marcaLower]
        }));
    };

    const handleAplicarFiltros = (e) => {
        e.preventDefault();
        const min = Number(filtrosTemp.precioMin) || 0;
        const max = filtrosTemp.precioMax === "" ? Infinity : Number(filtrosTemp.precioMax);

        if (min > max) {
            alert("El precio mínimo no puede ser mayor que el precio máximo.");
            return;
        }

        setFiltrosAplicados({ ...filtrosTemp });
        setPaginaActual(1);
    };

    const handleLimpiarFiltros = () => {
        setFiltrosTemp(FILTROS_VACIOS);
        setFiltrosAplicados(FILTROS_VACIOS);
        setOrden("precio-asc");
        setPaginaActual(1);
    };

    // Filtrado y Ordenamiento dinámico basado en 'filtrosAplicados' y 'busquedaURL'
    const productosFiltrados = useMemo(() => {
        let lista = productos.filter(producto => {
            const coincideBusqueda =
                !busquedaURL ||
                producto.nombre.toLowerCase().includes(busquedaURL.toLowerCase()) ||
                producto.marca.toLowerCase().includes(busquedaURL.toLowerCase());

            const coincideCat =
                filtrosAplicados.categorias.length === 0 ||
                filtrosAplicados.categorias.includes(producto.categoria);

            const coincideMarca =
                filtrosAplicados.marcas.length === 0 ||
                filtrosAplicados.marcas.includes(producto.marca.toLowerCase());

            const min = Number(filtrosAplicados.precioMin) || 0;
            const max = filtrosAplicados.precioMax === "" ? Infinity : Number(filtrosAplicados.precioMax);
            const coincidePrecio = producto.precio >= min && producto.precio <= max;

            const coincideStock = !filtrosAplicados.soloStock || producto.stock > 0;

            return coincideBusqueda && coincideCat && coincideMarca && coincidePrecio && coincideStock;
        });

        lista.sort((a, b) => {
            if (orden === "precio-asc") return a.precio - b.precio;
            if (orden === "precio-desc") return b.precio - a.precio;
            if (orden === "nombre-asc") return a.nombre.localeCompare(b.nombre);
            if (orden === "nombre-desc") return b.nombre.localeCompare(a.nombre);
            return 0;
        });

        return lista;
    }, [busquedaURL, filtrosAplicados, orden]);

    // Cálculo de Paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

    // Título Encabezado
    const tituloEncabezado = busquedaURL
        ? `Resultados para: "${busquedaURL}"`
        : (categoriaURL && CATEGORIAS[categoriaURL]
            ? CATEGORIAS[categoriaURL]
            : (filtrosAplicados.categorias.length === 1 ? filtrosAplicados.categorias[0] : "Catálogo de productos"));

    return (
        <main className="container my-5 catalogo-main">
            {/* ENCABEZADO */}
            <div className="mb-4">
                <h3 className="titulo-gamer mb-2" style={{ color: "var(--color-texto)", fontFamily: "'Press Start 2P', cursive", fontSize: "24px" }}>
                    {tituloEncabezado}
                </h3>
                <p className="text-secondary fs-5 m-0">
                    Mostrando {productosPagina.length} de {productosFiltrados.length} productos
                </p>
            </div>

            {/* CONTENEDOR PRINCIPAL BOOTSTRAP (Grilla) */}
            <div className="row g-4">

                {/* COLUMNA IZQUIERDA: FILTROS LATERALES (100% en móvil, 25% en PC) */}
                <aside className="col-12 col-lg-3">
                    <div className="filtros p-4 rounded">
                        <form onSubmit={handleAplicarFiltros} onReset={handleLimpiarFiltros}>
                            <div className="mb-4">
                                <h4 className="text-info fs-6 mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>Categoría</h4>
                                <ul className="list-unstyled m-0 p-0">
                                    {Object.entries(CATEGORIAS).map(([key, label]) => (
                                        <li key={key} className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                id={`cat-${key}`}
                                                name="categoria"
                                                className="form-check-input"
                                                value={key}
                                                checked={filtrosTemp.categorias.includes(label)}
                                                onChange={() => handleCategoriaChange(label)}
                                            />
                                            <label className="form-check-label text-light" htmlFor={`cat-${key}`}>
                                                {label}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-info fs-6 mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>Marca</h4>
                                <ul className="list-unstyled m-0 p-0">
                                    {["asus", "msi", "gigabyte", "nvidia", "amd", "zotac"].map((marca) => (
                                        <li key={marca} className="form-check mb-2">
                                            <input
                                                type="checkbox"
                                                id={`marca-${marca}`}
                                                name="marca"
                                                className="form-check-input"
                                                value={marca}
                                                checked={filtrosTemp.marcas.includes(marca)}
                                                onChange={() => handleMarcaChange(marca)}
                                            />
                                            <label className="form-check-label text-light" htmlFor={`marca-${marca}`}>
                                                {marca.toUpperCase()}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-info fs-6 mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>Rango de precio</h4>
                                <div className="d-flex flex-column gap-2">
                                    <label className="text-light" htmlFor="precio-min">Mínimo</label>
                                    <input
                                        type="number"
                                        id="precio-min"
                                        name="precio_min"
                                        className="form-control bg-dark text-light border-secondary"
                                        placeholder="$0"
                                        min={0}
                                        value={filtrosTemp.precioMin}
                                        onChange={(e) => setFiltrosTemp(prev => ({ ...prev, precioMin: e.target.value }))}
                                    />
                                    <label className="text-light mt-2" htmlFor="precio-max">Máximo</label>
                                    <input
                                        type="number"
                                        id="precio-max"
                                        name="precio_max"
                                        className="form-control bg-dark text-light border-secondary"
                                        placeholder="$2.000.000"
                                        min={0}
                                        value={filtrosTemp.precioMax}
                                        onChange={(e) => setFiltrosTemp(prev => ({ ...prev, precioMax: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-info fs-6 mb-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>Disponibilidad</h4>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="stock-disponible"
                                        name="disponibilidad"
                                        className="form-check-input"
                                        checked={filtrosTemp.soloStock}
                                        onChange={(e) => setFiltrosTemp(prev => ({ ...prev, soloStock: e.target.checked }))}
                                    />
                                    <label className="form-check-label text-light" htmlFor="stock-disponible">
                                        Solo con stock disponible
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold mb-2">
                                Aplicar filtros
                            </button>
                            <button type="reset" className="btn btn-outline-info w-100 fw-bold">
                                Limpiar filtros
                            </button>
                        </form>
                    </div>
                </aside>

                {/* COLUMNA DERECHA: LISTADO DE PRODUCTOS (100% en móvil, 75% en PC) */}
                <section className="col-12 col-lg-9">
                    {/* BARRA DE ORDEN */}
                    <div className="barra-orden d-flex justify-content-lg-end justify-content-between align-items-center mb-4 gap-2">
                        <label className="text-light fw-bold text-nowrap" htmlFor="orden">Ordenar por:</label>
                        <select
                            id="orden"
                            name="orden"
                            className="form-select bg-dark text-light w-auto"
                            value={orden}
                            onChange={(e) => {
                                setOrden(e.target.value);
                                setPaginaActual(1);
                            }}
                        >
                            <option value="precio-asc">Precio: de menor a mayor</option>
                            <option value="precio-desc">Precio: de mayor a menor</option>
                            <option value="nombre-asc">Nombre: A-Z</option>
                            <option value="nombre-desc">Nombre: Z-A</option>
                        </select>
                    </div>

                    {/* Grilla de productos dinámica */}
                    <div className="row g-4" id="grilla-productos">
                        {productosPagina.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <p className="text-secondary fs-4">No se encontraron productos con estos filtros.</p>
                            </div>
                        ) : (
                            productosPagina.map((producto) => {
                                const esOferta = IDS_OFERTAS.includes(producto.id);
                                let claseStock = "disponible";
                                if (producto.stock === 0) {
                                    claseStock = "agotado";
                                } else if (producto.stock <= 3) {
                                    claseStock = "ultimas";
                                }
                                return (
                                    <div className="col-12 col-sm-6 col-xl-4" key={producto.id}>
                                        <article className="card h-100 bg-dark text-light border-secondary tarjeta-producto position-relative p-3">
                                            <span className={`etiqueta-stock ${claseStock}`}>
                                                {producto.estado}
                                            </span>
                                            
                                            <div className="text-center mb-3">
                                                <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{height: "170px", objectFit: "contain", transition: "transform 0.3s ease"}} />
                                            </div>
                                            
                                            <h5 className="card-title fs-5 fw-bold">{producto.nombre}</h5>
                                            <p className="text-info fw-bold mb-2">{producto.marca}</p>
                                            
                                            <p className="fs-4 fw-bold mb-3 mt-auto">
                                                {esOferta ? (
                                                    <>
                                                        <span className="text-secondary text-decoration-line-through fs-6 me-2">
                                                            ${producto.precio.toLocaleString("es-CL")}
                                                        </span>
                                                        <span className="precio-oferta">
                                                            ${Math.round(producto.precio * 0.90).toLocaleString("es-CL")}
                                                        </span>
                                                    </>
                                                ) : (
                                                    `$${producto.precio.toLocaleString("es-CL")}`
                                                )}
                                            </p>
                                            
                                            <Link
                                                to={`/producto?id=${producto.id}${esOferta ? "&oferta=true" : ""}`}
                                                className="btn btn-primary w-100 fw-bold"
                                            >
                                                Ver producto
                                            </Link>
                                        </article>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    
                    {/* PAGINACIÓN */}
                    {totalPaginas > 1 && (
                        <nav className="paginacion" aria-label="Paginación de productos">
                            <ul className="pagination">
                                <li>
                                    <button
                                        type="button"
                                        className="boton-pagina boton-navegacion"
                                        disabled={paginaActual === 1}
                                        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                    >
                                        « Anterior
                                    </button>
                                </li>

                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                    <li key={num}>
                                        <button
                                            type="button"
                                            className={`boton-pagina ${paginaActual === num ? 'pagina-activa' : ''}`}
                                            aria-current={paginaActual === num ? 'page' : undefined}
                                            onClick={() => setPaginaActual(num)}
                                        >
                                            {num}
                                        </button>
                                    </li>
                                ))}

                                <li>
                                    <button
                                        type="button"
                                        className="boton-pagina boton-navegacion"
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                    >
                                        Siguiente »
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}

                </section>
            </div>
        </main>
    );
}

export default Catcategoria;