import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Form, Button, Toast } from "react-bootstrap";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useHistory } from "react-router-dom";
import "../css/loginPage.css";

const ForgotPwd = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const history = useHistory();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    auth.languageCode = "fr";

    try {
      await sendPasswordResetEmail(auth, email);
      setToastVariant("success");
      setToastMessage(
        "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte email."
      );
      setShowToast(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de réinitialisation:",
        error
      );
      setToastVariant("danger");
      setToastMessage(
        "Erreur lors de l'envoi de l'email de réinitialisation. Veuillez vérifier votre email."
      );
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 no-scroll">
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
      <Col md={8} className="d-flex align-items-center justify-content-center">
        <div className="w-75 login-form-container">
          <h1>Réinitialiser le Mot de Passe</h1>
          <p className="info-text">
            Veuillez saisir votre adresse email pour recevoir un lien de
            réinitialisation de votre mot de passe.
          </p>
          <Form onSubmit={handleForgotPassword} className="mt-5">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                placeholder="Entrez votre email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </Form.Group>
            <Button
              className="btn-fill mt-3 btn-primary-border"
              type="submit"
              disabled={isSubmitting || !email}>
              {isSubmitting ? "Envoi..." : "Envoyer la Demande"}
            </Button>
          </Form>
          {/* Message de confirmation */}
          {isSubmitting === false && toastVariant === "success" && (
            <div className="mt-3 text-center">
              <p>
                Veuillez vérifier votre boîte email pour réinitialiser votre mot
                de passe.
              </p>
            </div>
          )}
          {/* Bouton de retour à la page de connexion */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => history.push("/login")}
              className="btn-return">
              Retourner à la page de connexion
            </Button>
          </div>
        </div>
      </Col>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
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
    </div>
  );
};

export default ForgotPwd;
