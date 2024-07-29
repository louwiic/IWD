import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import "../css/signupPage.css";
import Autocomplete from "components/AutoComplete";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const CustomSwitch = ({
  onCompanyChange,
  company,
  businessUnit,
  onBusinessUnitChange,
  suggestions,
}) => {
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <>
      <div className="switch-container">
        <div className={`switch ${isOn ? "on" : "off"}`} onClick={toggleSwitch}>
          <div className="switch-handle"></div>
        </div>
        <span className="switch-label">
          {"Je fais partie d’une entreprise"}
        </span>
      </div>
      <div style={{ marginTop: 30 }}>
        {isOn && (
          <>
            <Form.Group controlId="companyName">
              <Form.Label>Taper le nom de votre entreprise</Form.Label>
              <Autocomplete
                suggestions={suggestions}
                placeholder={" Ex: SNCF "}
                onSelection={onCompanyChange}
              />
            </Form.Group>
            <Form.Group controlId="businessUnit">
              <Form.Label>Business Unit</Form.Label>
              <Form.Control
                type="text"
                placeholder="Business Unit"
                value={businessUnit}
                onChange={(e) => onBusinessUnitChange(e.target.value)}
              />
            </Form.Group>
          </>
        )}
      </div>
    </>
  );
};

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    company: "",
    companyId: "", // ID de l'entreprise sélectionnée
    country: "", // Pays
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState([]);
  const history = useHistory();

  const gradientStyle = {
    background: "linear-gradient(135deg, #7F151A, #CE9136)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().companyName,
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCompanyChange = (value) => {
    console.log(" *** value ***", value);
    const selectedCompany = companies.find((company) => company.name === value);
    setFormData((prevData) => ({
      ...prevData,
      company: value,
      companyId: selectedCompany ? selectedCompany.id : "",
    }));
  };

  const handleBusinessUnitChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      businessUnit: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Prénom est requis";
    if (!formData.lastName) newErrors.lastName = "Nom est requis";
    if (!formData.birthDate)
      newErrors.birthDate = "Date de naissance est requise";
    if (!formData.email) newErrors.email = "Email est requis";
    if (!formData.password) newErrors.password = "Mot de passe est requis";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.country) newErrors.country = "Pays est requis";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const {
          email,
          password,
          firstName,
          lastName,
          birthDate,
          companyId,
          businessUnit,
          country,
        } = formData;

        const auth = getAuth();

        const payload = {
          firstName,
          lastName,
          birthDate,
          email,
          company: companyId,
          businessUnit: businessUnit ?? "",
          country,
          createdAt: new Date().toISOString(),
          role: "user",
        };

        setIsLoading(true);
        // Créer l'utilisateur avec Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Ajouter des informations utilisateur dans Firestore
        await setDoc(doc(db, "users", user.uid), payload);

        // Rediriger ou afficher un message de succès
        alert("Compte créé avec succès !");
        // navigation.navigate("SomeSuccessPage"); // Redirigez vers une page de succès ou d'accueil
      } catch (error) {
        console.error("Error creating account:", error.message);

        if (error.code === "auth/email-already-in-use") {
          alert(
            "Cet email est déjà utilisé. Veuillez utiliser un autre email."
          );
        } else {
          alert(`Erreur lors de la création du compte: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    history.push("/login");
  };

  return (
    <Container
      fluid
      className="d-flex scrollable-form-container"
      style={gradientStyle}>
      <Row className="w-100 d-flex align-items-center justify-content-center flex-fill">
        <Col className="d-flex align-items-center justify-content-center">
          <Card
            className="w-100 p-4"
            style={{ maxWidth: "500px", borderRadius: "10px" }}>
            <Card.Body>
              <div
                variant="secondary"
                onClick={handleBack}
                className="mb-3"
                style={{ cursor: "pointer" }}>
                <i className="fa fa-hand-pointer-o" aria-hidden="true"></i>{" "}
                &larr; Retour
              </div>
              <h2 className="mb-4 text-center info-text">Créer un compte</h2>
              <p className="text-center subtext">
                Créer votre compte personnel à l’aide d’un login et d’un mot de
                passe de votre choix.
              </p>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={handleChange}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="birthDate">
                  <Form.Label>Date de naissance</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    isInvalid={!!errors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="jean.dupont@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="country">
                  <Form.Label>Pays</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="France"
                    value={formData.country}
                    onChange={handleChange}
                    isInvalid={!!errors.country}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="customSwitch">
                  <CustomSwitch
                    onCompanyChange={handleCompanyChange}
                    onBusinessUnitChange={handleBusinessUnitChange}
                    company={formData.company}
                    businessUnit={formData.businessUnit}
                    suggestions={companies.map((company) => company.name)}
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}>
                      {showPassword ? (
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                      ) : (
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      )}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mt-3">
                  <Form.Label>Confirmer le mot de passe</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmer le mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}>
                      {showPassword ? (
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                      ) : (
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      )}
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  className="btn-fill mt-3 btn-primary-border"
                  type="submit"
                  disabled={isLoading}>
                  {isLoading ? "Chargement..." : "Enregistrer"}
                </Button>
              </Form>
              <div className="mt-3 text-center d-block d-md-none">
                <p>
                  Already have an account? <a href="/login">Log in</a>
                </p>
                <p>
                  <a href="/forgot-password">
                    Forgot your user ID or password?
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
