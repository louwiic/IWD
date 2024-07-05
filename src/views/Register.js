import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Toast,
} from "react-bootstrap";
import { auth, db } from "../firebase/firebase"; // Assurez-vous d'importer Firebase ici
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpForm = ({ setShowLoginForm, setShowRegisterForm }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const history = useHistory();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true); // Activer l'état de chargement

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      await setDoc(doc(db, "users", user.uid), {
        email,
        firstName,
        lastName,
        role: "candidate",
        createdAt: new Date(),
      });

      setToastVariant("success");
      setToastMessage("Votre compte a bien été créé");
      setShowToast(true);
      setTimeout(() => {
        history.push("/admin/dashboard");
      }, 2000); // Délai avant redirection pour montrer le toast
    } catch (error) {
      console.error("Error signing up: ", error);
      setToastVariant("danger");
      setToastMessage("Une erreur est survenue, veuillez réessayer plus tard");
      setShowToast(true);
    } finally {
      setIsLoading(false); // Désactiver l'état de chargement
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Le nom d'utilisateur est requis";
    if (!firstName) newErrors.firstName = "Le prénom est requis";
    if (!lastName) newErrors.lastName = "Le nom est requis";
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (!confirmPassword)
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    return newErrors;
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (errors[fieldName]) {
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: null }));
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center mt-5">
        <Col md="6">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Inscription</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSignUp}>
                <Form.Group>
                  <label>Adresse e-mail</label>
                  <Form.Control
                    placeholder="Adresse e-mail"
                    type="text"
                    value={email}
                    onChange={handleInputChange(setEmail, "email")}
                  />
                  {errors.email && (
                    <div style={{ color: "red" }}>{errors.email}</div>
                  )}
                </Form.Group>
                <Form.Group>
                  <label>Prénom</label>
                  <Form.Control
                    placeholder="Prénom"
                    type="text"
                    value={firstName}
                    onChange={handleInputChange(setFirstName, "firstName")}
                  />
                  {errors.firstName && (
                    <div style={{ color: "red" }}>{errors.firstName}</div>
                  )}
                </Form.Group>
                <Form.Group>
                  <label>Nom</label>
                  <Form.Control
                    placeholder="Nom"
                    type="text"
                    value={lastName}
                    onChange={handleInputChange(setLastName, "lastName")}
                  />
                  {errors.lastName && (
                    <div style={{ color: "red" }}>{errors.lastName}</div>
                  )}
                </Form.Group>
                <Form.Group>
                  <label>Nouveau mot de passe</label>
                  <Form.Control
                    placeholder="Nouveau mot de passe"
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword, "password")}
                  />
                  <small style={{ color: "#888" }}>
                    Le mot de passe doit contenir au moins 6 caractères
                  </small>
                  {errors.password && (
                    <div style={{ color: "red" }}>{errors.password}</div>
                  )}
                </Form.Group>
                <Form.Group>
                  <label>Confirmer mot de passe</label>
                  <Form.Control
                    placeholder="Confirmer mot de passe"
                    type="password"
                    value={confirmPassword}
                    onChange={handleInputChange(
                      setConfirmPassword,
                      "confirmPassword"
                    )}
                  />
                  {errors.confirmPassword && (
                    <div style={{ color: "red" }}>{errors.confirmPassword}</div>
                  )}
                </Form.Group>
                <div>
                  <Button
                    className="btn-fill pull-right mt-3"
                    type="submit"
                    variant="info"
                    disabled={isLoading}>
                    {isLoading ? "Chargement..." : "S'inscrire"}
                  </Button>
                </div>

                <div className="clearfix"></div>
              </Form>
            </Card.Body>
            <Card.Footer>
              <Button
                variant="link"
                className="mt-3"
                onClick={() => {
                  setShowLoginForm(false);
                  setShowRegisterForm(false);
                }}
                style={{
                  textDecoration: "none",
                  padding: 0,
                  color: "#007bff",
                  borderWidth: 0,
                }}>
                J'ai déjà un compte
              </Button>
            </Card.Footer>
          </Card>
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

export default SignUpForm;
