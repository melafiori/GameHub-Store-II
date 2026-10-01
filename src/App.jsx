import './styles/style.css'
import './styles/producto.css'
import './styles/catalogo.css'
import './App.css'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/Catcategoria'
import Navigbar from './components/Navbar';
import Catcategoria from './pages/Catcategoria';
import Footer from './components/Footer';

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Navigbar />



      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/catcategoria" element={<Catcategoria />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
