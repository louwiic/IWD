import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import mongolfiere from "assets/img/mongolfiere.jpg";
import InsightsPage from "./InsightPage";
import SignUpForm from "./Register";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const LoginPage = ({ handleShowLogin, setShowRegisterForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      setToastVariant("success");
      setToastMessage("Connexion réussie !");
      setShowToast(true);
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 900); // Délai avant redirection pour montrer le toast
    } catch (error) {
      console.error("Error logging in:", error);
      setToastVariant("danger");
      setToastMessage("Nom d’utilisateur ou mot de passe incorrect");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Logique de récupération de mot de passe
  };

  return (
    <Container fluid className="d-flex align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={7} className="p-0">
          <div className="d-flex align-items-center justify-content-center h-100 bg-white">
            <img
              src={mongolfiere}
              alt="Hot air balloons"
              className="img-fluid"
              style={{ width: "100%", height: "100vh", objectFit: "cover" }}
            />
          </div>
        </Col>
        <Col
          md={5}
          className="d-flex align-items-center justify-content-center">
          <div className="w-75">
            <h1 style={{ fontWeight: "bold" }}>Bienvenue</h1>
            <p style={{ fontSize: 28 }}>Connectez-vous</p>
            <Form onSubmit={handleLogin} className="mt-5">
              <Form.Group>
                <Form.Label>Nom d’utilisateur</Form.Label>
                <Form.Control
                  placeholder="Nom d’utilisateur"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  placeholder="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button
                className="btn-fill pull-right mt-3"
                type="submit"
                style={{
                  backgroundColor: "#CE9136",
                  borderWidth: 0,
                }}
                disabled={isLoading}>
                {isLoading ? "Chargement..." : "Se connecter"}
              </Button>

              {/*  <Button variant="primary" type="submit" className="mt-4 w-100">
                Login
              </Button> */}
            </Form>
            {/*  <Button
              variant="link"
              className="mt-3"
              onClick={handleForgotPassword}
              style={{
                textDecoration: "none",
                padding: 0,
                color: "rgb(150, 75, 0)",
                borderWidth: 0,
              }}>
              Avez-vous perdu votre mot de passe ?
            </Button>
            <Button
              variant="link"
              className="mt-3"
              onClick={() => {
                handleShowLogin(false);
                setShowRegisterForm(false);
              }}
              style={{
                textDecoration: "none",
                padding: 0,
                color: "#007bff",
                borderWidth: 0,
              }}>
              Ou créer son compte
            </Button> */}
            <div className="mt-3 text-center mt-5">
              <a
                style={{
                  textDecoration: "none",
                  padding: 0,
                  color: "rgb(150, 75, 0)",
                  borderWidth: 0,
                  fontStyle: "italic",
                }}
                onClick={() => {
                  handleShowLogin(false);
                  setShowRegisterForm(false);
                }}>
                Vous n'avez pas de compte ? Créer son compte
              </a>
            </div>
          </div>
        </Col>
      </Row>

      {/* Toasts for error and success messages */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
        bg={toastVariant}>
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default LoginPage;
