// UserNavbar.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import routes from "routes.js";

const UserNavbar = ({ onLogout }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        {/* <Navbar.Brand href="#home">Bonjour</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {routes.map((prop, key) => {
              if (prop.layout === "/user") {
                return (
                  <Nav.Link as={Link} to={prop.layout + prop.path} key={key}>
                    {prop.name}
                  </Nav.Link>
                );
              }
              return null;
            })}
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link onClick={onLogout}>Se déconnecter</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
