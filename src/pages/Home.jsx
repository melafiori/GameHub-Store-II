import CarouselFade from "../components/Carousel";
import OfertasDestacadas from "../components/OfertasDestacadas";

function Home() {
  return (
    <main>
      {/* PANEL DE IMÁGENES Y VIDEO */}
      <section className="my-4">
        <CarouselFade />
      </section>

      {/* OFERTAS DESTACADAS */}
      <section className="container my-5">
        <OfertasDestacadas />
      </section>
    </main>
  );
}

export default Home;