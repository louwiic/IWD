import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Stepper from "./Stepper";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { db } from "../../firebase/firebase";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const history = useHistory();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    role: "",
    email: "",
    password: "",
    gender: "",
    partOfCompany: false,
    personalQuestionnaire: false,
    businessUnit: "",
    phone: "",
    phoneCode: "+33",
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    <Step1 formData={formData} setFormData={setFormData} />,
    <Step2 formData={formData} setFormData={setFormData} />,
    <Step3 formData={formData} setFormData={setFormData} />,
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        birthDate,
        companyId,
        businessUnit,
        personalQuestionnaire,
        countryOfOrigin,
        countryOfActivity,
        country = "", // Assurez-vous que `country` n'est pas undefined
        phoneCode,
        phone,
      } = formData;

      const auth = getAuth();

      const payload = {
        firstName,
        lastName,
        birthDate,
        email,
        company: companyId ?? "", // Utilisez une chaîne vide si `companyId` est undefined
        businessUnit: businessUnit ?? "",
        personalQuestionnaire,
        country, // `country` ne sera jamais undefined ici
        countryOfOrigin: countryOfOrigin ?? "",
        countryOfActivity: countryOfActivity ?? "",
        phoneCode,
        phone,
        createdAt: new Date().toISOString(),
        role: "candidate",
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

      // Obtenir le token de l'utilisateur
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      // Récupérer les données utilisateur
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userIdStorage", user.uid);
        localStorage.setItem("role", userData.role);

        alert("Compte créé avec succès !");

        // Redirection en fonction du rôle
        if (userData.role !== "admin") {
          history.push("/user/test/");
        } else {
          history.push("/admin/home");
        }
      }
    } catch (error) {
      console.error("Error creating account:", error.message);

      if (error.code === "auth/email-already-in-use") {
        alert("Cet email est déjà utilisé. Veuillez utiliser un autre email.");
      } else {
        alert(`Erreur lors de la création du compte: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={gradientStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4">
              <span className="text-center mb-4" style={{ fontSize: 20 }}>
                Créer un compte
              </span>
              <Stepper currentStep={currentStep} />
              {steps[currentStep]}
              <Row className="mt-4">
                {currentStep > 0 && (
                  <>
                    <Col xs={3}>
                      <Button
                        variant="secondary"
                        onClick={handlePrev}
                        style={{ width: "100%" }}>
                        Précédent
                      </Button>
                    </Col>
                    {currentStep == steps.length - 1 ? (
                      <Col xs={8} className="offset-1">
                        {/*  <Button
                          variant="success"
                          onClick={handleSubmit}
                          style={{ width: "100%" }}>
                          Soumettre
                        </Button> */}
                        <Button
                          className="btn-fill mt-3 btn-primary-border"
                          type="submit"
                          onClick={handleSubmit}
                          disabled={loading}>
                          {loading ? "Chargement..." : "Enregistrer"}
                        </Button>
                      </Col>
                    ) : (
                      <Col xs={8} className="offset-1">
                        <Button
                          variant="primary"
                          onClick={handleNext}
                          style={{ width: "100%" }}>
                          Suivant
                        </Button>
                      </Col>
                    )}
                  </>
                )}
                {currentStep === 0 && (
                  <Col xs={12}>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      style={{ width: "100%" }}>
                      Suivant
                    </Button>
                  </Col>
                )}
                {/*    {currentStep === steps.length - 1 && (
                  <Col xs={12}>
                    <Button
                      variant="success"
                      onClick={() => console.log(" *** formData ***", formData)}
                      style={{ width: "100%" }}>
                      Soumettre
                    </Button>
                  </Col>
                )} */}
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MultiStepForm;

const gradientStyle = {
  background: "linear-gradient(135deg, #7F151A, #CE9136)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
};
