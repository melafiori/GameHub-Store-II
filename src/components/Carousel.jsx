import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function CarouselFade() {
    return (
        <Carousel fade className="custom-carrusel">
            {/* Slide 1: Video de YouTube */}
            <Carousel.Item>
                <div className="ratio ratio-16x9">
                    <iframe
                        src="https://www.youtube.com/embed/rcx6I2A0TyM?si=SwNdaYML9vY8tt2M&start=1"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>
                <Carousel.Caption>
                    <h5>PRÓXIMAMENTE</h5>
                    <p>Grand Theft Auto VI Limited Edition DualSense Controllers | PS5</p>
                </Carousel.Caption>
            </Carousel.Item>

            {/* Slide 2: ROG Strix */}
            <Carousel.Item>
                <div className="ratio ratio-16x9">
                    <img
                        className="d-block w-100 carrusel-media"
                        src="https://www.notebookcheck.org/fileadmin/Notebooks/News/_nc4/Asus-ROG-Strix-Ace-xg248qsg-global-debut.jpg"
                        alt="Tarjetas Gráficas de última generación"
                    />
                </div>
                <Carousel.Caption>
                    <h5>ROG Strix XG248QSG Ace</h5>
                    <p>
                        Panel Super TN FHD (1920 x 1080) de 24,1 pulgadas - 61,21 cm con frecuencia de actualización de 610 Hz (OC), diseñado específicamente para jugadores profesionales de deportes electrónicos.
                    </p>

                </Carousel.Caption>
            </Carousel.Item>

            {/* Slide 3: Notebooks Gaming */}
            <Carousel.Item>
                <div className='ratio ratio-16x9'>
                    <img
                        className="d-block w-100 carrusel-media"
                        src="https://i0.wp.com/www.madboxpc.com/wp-content/uploads/2023/05/Strix-SCAR-18_03.jpg?resize=850%2C420&ssl=1"
                        alt="Periféricos Neón"
                    />
                </div>
                <Carousel.Caption>
                    <h5>Los notebooks más potentes para gaming</h5>
                    <p>
                        Diseñados para ofrecer potencia extrema en formatos de 16 y 18 pulgadas, ideales para videojuegos pesados y multitarea.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselFade;