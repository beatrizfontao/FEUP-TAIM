import '../styles/App.css';
import logo from "../assets/sunscope.png";
import { Row, Col, Button } from 'react-bootstrap';

const Header = ({ onToggleOptions }) => {
  return (
    <Row className="align-items-center bg-light p-2">
      <Col className="d-flex justify-content-left align-items-center">
        <img 
          src={logo}
          height="40px"
          className="d-flex align-top ms-1 mt-1 mb-1" // Right margin for spacing
          alt="SunScope logo"
        />
      </Col>
      <Col xs="auto" className="text-end">
        <Button variant="outline-secondary" onClick={onToggleOptions}>
          ☰
        </Button>
      </Col>
    </Row>
  );
};

export default Header;
