import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productos } from '../data/productos'; // Ajusta la ruta a tu archivo de datos
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
    const busquedaURL = searchParams.get("busqueda"); // Extraído dentro del componente

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

    // Manejadores de cambios temporales (Checkbox e Inputs)
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

        // Aplicar los filtros temporales al estado global de filtrado
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
            // Filtro por término de búsqueda en el nombre o marca
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
        <main className="catalogo-main">
            <div className="catalogo-encabezado">
                <h3>{tituloEncabezado}</h3>
                <p className="catalogo-resultados">
                    Mostrando {productosPagina.length} de {productosFiltrados.length} productos
                </p>
            </div>
            <div className="catalogo-contenido">

                {/* FILTROS LATERALES */}
                <aside className="filtros">
                    <form onSubmit={handleAplicarFiltros} onReset={handleLimpiarFiltros}>
                        <div className="filtro-grupo">
                            <h4>Categoría</h4>
                            <ul className="filtro-lista">
                                {Object.entries(CATEGORIAS).map(([key, label]) => (
                                    <li key={key}>
                                        <input
                                            type="checkbox"
                                            id={`cat-${key}`}
                                            name="categoria"
                                            className="form-check-input"
                                            value={key}
                                            checked={filtrosTemp.categorias.includes(label)}
                                            onChange={() => handleCategoriaChange(label)}
                                        />
                                        <label htmlFor={`cat-${key}`}>{label}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="filtro-grupo">
                            <h4>Marca</h4>
                            <ul className="filtro-lista">
                                {["asus", "msi", "gigabyte", "nvidia", "amd", "zotac"].map((marca) => (
                                    <li key={marca}>
                                        <input
                                            type="checkbox"
                                            id={`marca-${marca}`}
                                            name="marca"
                                            className="form-check-input"
                                            value={marca}
                                            checked={filtrosTemp.marcas.includes(marca)}
                                            onChange={() => handleMarcaChange(marca)}
                                        />
                                        <label htmlFor={`marca-${marca}`}>{marca.toUpperCase()}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="filtro-grupo">
                            <h4>Rango de precio</h4>
                            <div className="filtro-precio">
                                <label htmlFor="precio-min">Mínimo</label>
                                <input
                                    type="number"
                                    id="precio-min"
                                    name="precio_min"
                                    className="form-control"
                                    placeholder="$0"
                                    min={0}
                                    value={filtrosTemp.precioMin}
                                    onChange={(e) => setFiltrosTemp(prev => ({ ...prev, precioMin: e.target.value }))}
                                />
                                <label htmlFor="precio-max">Máximo</label>
                                <input
                                    type="number"
                                    id="precio-max"
                                    name="precio_max"
                                    className="form-control"
                                    placeholder="$2.000.000"
                                    min={0}
                                    value={filtrosTemp.precioMax}
                                    onChange={(e) => setFiltrosTemp(prev => ({ ...prev, precioMax: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="filtro-grupo">
                            <h4>Disponibilidad</h4>
                            <ul className="filtro-lista">
                                <li>
                                    <input
                                        type="checkbox"
                                        id="stock-disponible"
                                        name="disponibilidad"
                                        className="form-check-input"
                                        checked={filtrosTemp.soloStock}
                                        onChange={(e) => setFiltrosTemp(prev => ({ ...prev, soloStock: e.target.checked }))}
                                    />
                                    <label htmlFor="stock-disponible">
                                        Solo con stock disponible
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <button type="submit" className="btn btn-aplicar-filtros">
                            Aplicar filtros
                        </button>
                        <button type="reset" className="btn btn-limpiar-filtros">
                            Limpiar filtros
                        </button>
                    </form>
                </aside>

                {/* LISTADO DE PRODUCTOS */}
                <section className="catalogo-productos">
                    {/* BARRA DE ORDEN */}
                    <div className="barra-orden">
                        <label htmlFor="orden">Ordenar por:</label>
                        <select
                            id="orden"
                            name="orden"
                            className="form-select"
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
                    <div className="row g-4 grilla-productos" id="grilla-productos">
                        {productosPagina.length === 0 ? (
                            <p className="sin-resultados">No se encontraron productos con estos filtros.</p>
                        ) : (
                            productosPagina.map((producto) => {
                                const esOferta = IDS_OFERTAS.includes(producto.id);
                                let claseStock = "disponible";
                                if (producto.stock === 0) claseStock = "agotado";
                                else if (producto.stock <= 3) claseStock = "ultimas";

                                return (
                                    <div className="col-12 col-sm-6 col-lg-4" key={producto.id}>
                                        <article className="card h-100 tarjeta-producto">
                                        <span className={`etiqueta-stock ${claseStock}`}>
                                            {producto.estado}
                                        </span>
                                        <img src={producto.imagen} alt={producto.nombre} />
                                        <h5>{producto.nombre}</h5>
                                        <p className="marca-producto">{producto.marca}</p>
                                        <p className="precio-producto">
                                            {esOferta ? (
                                                <>
                                                    <span className="precio-anterior">
                                                        ${producto.precio.toLocaleString("es-CL")}
                                                    </span>{" "}
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
                                            className="btn btn-ver-producto"
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
                        <nav className="paginacion">
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        disabled={paginaActual === 1}
                                        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                        aria-label="página anterior"
                                    >
                                        « Anterior
                                    </button>
                                </li>
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                    <li key={num}>
                                        <button
                                            type="button"
                                            className={paginaActual === num ? "pagina-activa" : ""}
                                            onClick={() => setPaginaActual(num)}
                                        >
                                            {num}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        disabled={paginaActual === totalPaginas}
                                        onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                        aria-label="página siguiente"
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