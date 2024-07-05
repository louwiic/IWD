import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../css/insightPage.css";

const InsightsPage = ({
  setShowLoginForm,
  setShowRegisterForm,
  showLoginForm,
  showRegisterFrom,
}) => {
  return (
    <div className="insights-page">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-section">
            <h3 className="display-4 title">Bonjour !</h3>
            <h3 className="">
              Pour commencer, cliquez sur le bouton{" "}
              <span className="highlight">Se connecter</span>.
            </h3>
            <p className="lead">
              <span className="infoWarn">
                Après avoir commencé, ne vous arrêtez pas avant d'avoir terminé.
              </span>
              Vous devez créer votre compte personnel à l'aide d'un login et
              d'un mot de passe de votre choix. Assurez-vous de sauvegarder
              votre login et votre mot de passe pour pouvoir accéder à vos
              résultats à tout moment.
            </p>
            <Row className="stats">
              <Button
                onClick={() => {
                  setShowRegisterForm(false);
                  setShowLoginForm(true);
                }}
                className="btn-fill pull-right mt-3"
                type="submit"
                style={{
                  backgroundColor: "#CE9136",
                  borderWidth: 0,
                }}>
                Se connecter
              </Button>

              <Button
                onClick={() => {
                  setShowRegisterForm(true);
                  setShowLoginForm(false);
                }}
                style={{
                  backgroundColor: "#CE9136",
                  borderWidth: 0,
                }}
                className="btn-fill pull-right mt-3"
                type="submit"
                variant="info">
                Créer un nouveau compte
              </Button>
            </Row>
          </Col>
          <Col md={6} className="image-section">
            <div className="overlay"></div>
            {/* <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64"> */}
            <img
              src={require("../assets/logo_IWD.png")} // Remplacez par l'URL de votre image
              alt="Insights"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InsightsPage;
