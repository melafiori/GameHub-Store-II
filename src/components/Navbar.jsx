import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Navigbar() {
  return (
    <Navbar expand="lg" className="barra-categorias navbar-dark">

      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/catcategoria?categoria=notebooks" className="text-light fw-bold">Notebooks</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=graficas" className="text-light fw-bold">Tarjetas Gráficas</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=procesadores" className="text-light fw-bold">Procesadores</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=perifericos" className="text-light fw-bold">Periféricos</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=consolas" className="text-light fw-bold">Consolas</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=monitores" className="text-light fw-bold">Monitores</Nav.Link>
            <Nav.Link as={Link} to="/catcategoria?categoria=accesorios" className="text-light fw-bold">Accesorios</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigbar;