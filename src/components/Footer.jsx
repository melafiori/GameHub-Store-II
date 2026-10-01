function Footer() {
    return (
        <footer className="footer-principal">
            <div className="footer-contenido">
                {/* QUIÉNES SOMOS */}
                <div className="footer-seccion">
                    <h3>GameHub Store</h3>
                    <p>
                        Somos una tienda gamer especializada en tarjetas grácas, procesadores,
                        periféricos, consolas, monitores y accesorios para potenciar tu
                        experiencia.
                    </p>
                </div>
                {/* CONTACTO, PUSE NÚMERO Y CORREO */}
                <div className="footer-seccion">
                    <h3>Contacto</h3>
                    <p>+56 9 1234 5678</p>
                    <p>contacto@gamehubstore.cl</p>
                </div>
                {/* UBICACIÓN */}
                <div className="footer-seccion">
                    <h3>Ubicación</h3>
                    <p>Valparaíso, Chile</p>
                    <p>Lunes a Viernes: De 08:00 AM a 17:30</p>
                </div>
            </div>
            {/* COPYRIGHT */}
            <div className="footer-copyright">
                <p>© 2026 GameHub Store. Todos los derechos reservados.</p>
            </div>
        </footer>

    )
}

export default Footer