import './styles/style.css'
import './styles/producto.css'
import './styles/catalogo.css'
import './App.css'
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'; // Se quita BrowserRouter
import Home from './pages/Home';
import About from './pages/Catcategoria'
import Navigbar from './components/Navbar';
import Catcategoria from './pages/Catcategoria';
import Footer from './components/Footer';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import MisOrdenes from './pages/MisOrdenes';
import Checkout from './pages/Checkout';

function App() {
  return (
    <>
      <Header />
      <Navigbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catcategoria" element={<Catcategoria />} />
        <Route path="/producto" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/mis-ordenes" element={<MisOrdenes />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App