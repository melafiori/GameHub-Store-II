import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'; // 1. Importar Link

function Navigbar() {
  return (
    <Navbar expand="lg" className="barra-categorias">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* 2. Usar as={Link} en cada opción */}
            <Nav.Link as={Link} to="/catcategoria?categoria=notebooks">Notebooks</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=graficas">Tarjetas Gráficas</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=procesadores">Procesadores</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=perifericos">Periféricos</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=consolas">Consolas</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=monitores">Monitores</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=accesorios">Accesorios</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigbar;