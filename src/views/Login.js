import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import InsightsPage from "./InsightPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterFrom, setShowRegisterForm] = useState(false);

  useEffect(() => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
  }, []);
  return (
    <>
      {/* <LoginForm /> */}
      <Row className="justify-content-center">
        {true ? (
          <LoginPage
            handleShowLogin={(state) => setShowLoginForm(state)}
            setShowRegisterForm={(state) => setShowRegisterForm(state)}
          />
        ) : showRegisterFrom ? (
          <SignupPage
            setShowLoginForm={setShowLoginForm}
            setShowRegisterForm={setShowRegisterForm}
          />
        ) : (
          <InsightsPage
            showLoginForm={showLoginForm}
            showRegisterFrom={showRegisterFrom}
            setShowLoginForm={setShowLoginForm}
            setShowRegisterForm={setShowRegisterForm}
          />
        )}
        {/* <Col md="6">
          <Card>
            <Card.Header>
              <Card.Title as="h4 ">Bonjour !</Card.Title>
              <Card.Text as="h4">
                Pour commencer, cliquez sur le bouton "Login" en haut à droite
                de l'écran. Après avoir commencé, ne vous arrêtez pas avant
                d'avoir terminé. Vous devez créer votre compte personnel à
                l'aide d'un login et d'un mot de passe de votre choix.
                Assurez-vous de sauvegarder votre login et votre mot de passe
                pour pouvoir accéder à vos résultats à tout
              </Card.Text>
            </Card.Header>
            <Card.Body></Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </Col> */}
      </Row>
    </>
  );
};

export default Login;
