// UserNavbar.js
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import routes from "routes.js";

// Styles
const styles = {
  customNavbar: {
    backgroundColor: "#CE9136",
  },
  navLinkIcon: {
    height: "26px",
    marginRight: "10px",
  },
  navLink: {
    color: "#fff",
    display: "flex",
    alignItems: "center",
    marginLeft: "20px",
  },
  logo: {
    height: "40px",
    marginRight: "40px",
  },
};

const UserNavbar = ({}) => {
  const history = useHistory();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userIdStorage");
    history.push("/login");
  };

  return (
    <Navbar style={styles.customNavbar} expand="lg">
      <Container fluid style={{ padding: 0, paddingLeft: 20 }}>
        <img
          src={require("../../assets/img/logo_lts.png")}
          alt="Logo"
          className="logo"
          style={{ height: 80, width: "auto", marginRight: "40px" }}
        />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {routes.map((prop, key) => {
              if (prop.layout === "/user" && prop?.display) {
                return (
                  <Nav.Link
                    as={Link}
                    to={prop.layout + prop.path}
                    key={key}
                    style={styles.navLink}>
                    {prop.icon && (
                      <img
                        src={prop.icon}
                        alt={prop.name}
                        style={styles.navLinkIcon}
                      />
                    )}
                    {prop.name}
                  </Nav.Link>
                );
              }
              return null;
            })}
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link onClick={handleLogout} style={{ color: "#fff" }}>
              Se déconnecter
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
