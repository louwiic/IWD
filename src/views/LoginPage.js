import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../css/loginPage.css";

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

    /*  localStorage.setItem("authToken", "token");
    setToastVariant("success");
    setToastMessage("Connexion réussie !");
    setShowToast(true);
    setTimeout(() => {
      history.push("/admin/dashboard");
    }, 900);

    return; */

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
      }, 900);
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
    <Container fluid className="d-flex min-vh-100">
      <Row className="">
        <Col md={4} className="p-0">
          <div className="gradient-bg d-flex flex-column align-items-center justify-content-center">
            <img
              src={require("../assets/img/sphere.png")}
              alt="Logo"
              className="sphere"
            />
            <img
              src={require("../assets/img/logo_lts.png")}
              alt="Logo"
              className="logo"
            />
          </div>
        </Col>
        <Col
          md={8}
          className="d-flex align-items-center justify-content-center">
          <div className="w-75 login-form-container">
            <h1>Bienvenue</h1>
            <p className="info-text">Je n’ai pas encore de compte</p>
            <p className="subtext">
              Vous devez créer votre compte personnel à l’aide d’un login et
              d’un mot de passe de votre choix. Assurez-vous de sauvegarder vos
              identifiants pour pouvoir accéder à vos résultats à tout moment
            </p>
            <Button
              onClick={() => history.push("/signup")}
              className="btn-fill mt-3 login-button"
              type="submit"
              disabled={isLoading}>
              {isLoading ? "Chargement..." : "Créer un compte"}
            </Button>
            <div className="divider-container">
              <span className="divider-line"></span>
              <span className="divider-text">
                Vous avez déjà un compte ? Continuez avec votre email
              </span>
              <span className="divider-line"></span>
            </div>
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
                className="btn-fill mt-3   btn-primary-border"
                type="submit"
                disabled={isLoading}>
                {isLoading ? "Chargement..." : "Se connecter"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
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