import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../css/graphnavbar.css';
import { ActiveMeasProperties } from '../../models/properties';

interface IGraphNavbar {
  selectedMeasurements: ActiveMeasProperties[];
  // setShownGraphMeasurementGraph: any;
}


const GraphNavbar: FC<IGraphNavbar> = ({ selectedMeasurements }) => {


  return (
    <Navbar variant='dark' expand="lg" className='navbar' onSelect={(selectedKey) => alert(`This feature is under development`)}>
      <Container>
        {/* <Navbar.Brand href="#home">Currently shown road measurements: </Navbar.Brand> */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">

            {selectedMeasurements.map(({ name }: ActiveMeasProperties) =>
              <Nav.Link>{name}</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default GraphNavbar;