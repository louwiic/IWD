import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Stepper from "./Stepper";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { db } from "../../firebase/firebase";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    role: "",
    email: "",
    password: "",
    passwordConfirm: "",
    gender: "",
    partOfCompany: false,
    personalQuestionnaire: false,
    businessUnit: "",
    phone: "",
    phoneCode: "+33",
  });

  const handleNext = async () => {
    const currentStepFields = {
      0: [
        "firstName",
        "lastName",
        "birthDate",
        "gender",
        "email",
        "phone",
        "countryOfOrigin",
        "countryOfActivity",
      ],
      2: ["password", "passwordConfirm"],
    }[currentStep];

    if (currentStep === 0 && formData.email) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", formData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setErrors((prev) => ({
            ...prev,
            email: "Cet email est déjà utilisé. Veuillez en choisir un autre.",
          }));
          return;
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        setErrors((prev) => ({
          ...prev,
          email: "Une erreur est survenue lors de la vérification de l'email.",
        }));
        return;
      }
    }

    if (currentStep === 1) {
      const newStep2Errors = {};
      if (!formData["partOfCompany"] && !formData["personalQuestionnaire"]) {
        newStep2Errors.selection = "Vous devez sélectionner une des options.";
      }

      if (formData["partOfCompany"] && !formData["companyName"]) {
        newStep2Errors.companyName = "Le nom de l'entreprise est requis.";
      }

      if (Object.keys(newStep2Errors).length > 0) {
        setErrors(newStep2Errors);
        return; // Stopper ici si des erreurs sont trouvées
      }
    }

    if (!currentStepFields || currentStepFields.length === 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    const newErrors = {};
    currentStepFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Ce champ est requis.";
      }
    });

    if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis.";
      }

      if (!formData.passwordConfirm) {
        newErrors.passwordConfirm =
          "La confirmation du mot de passe est requise.";
      }

      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Les mots de passe ne correspondent pas.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    <Step1
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
    />,
    <Step2
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
    />,
    <Step3
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
    />,
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
        country = "",
        phoneCode,
        phone,
      } = formData;

      const auth = getAuth();

      const payload = {
        firstName,
        lastName,
        birthDate,
        email,
        company: companyId ?? "1x5OrUoXQToolZ98EjYP",
        businessUnit: businessUnit ?? "",
        personalQuestionnaire,
        country,
        countryOfOrigin: countryOfOrigin ?? "",
        countryOfActivity: countryOfActivity ?? "",
        phoneCode,
        phone,
        createdAt: new Date().toISOString(),
        role: "candidate",
      };

      /*       return console.log(" *** payload ***", JSON.stringify(payload, null, 2));
       */
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), payload);

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem("userIdStorage", user.uid);
        localStorage.setItem("role", userData.role);

        alert("Compte créé avec succès !");

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

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div style={gradientStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card
              className="p-4"
              style={{ maxHeight: "100vh", overflowY: "auto" }}>
              <div className="d-flex align-items-center mb-4">
                {currentStep === 0 && (
                  <Button
                    variant="link"
                    onClick={handleGoBack}
                    style={{ marginRight: "auto" }}>
                    Retour
                  </Button>
                )}
                <span className="text-center" style={{ fontSize: 20, flex: 1 }}>
                  Créer un compte
                </span>
              </div>
              <Stepper currentStep={currentStep} />
              {steps[currentStep]}
              <Row className="mt-4">
                {currentStep > 0 && (
                  <>
                    <Col xs={3}>
                      <Button
                        variant="secondary"
                        onClick={handlePrev}
                        style={{
                          width: "100%",
                          borderColor: "#ce9136",
                          color: "#ce9136",
                          fontFamily: "Montserrat",
                          fontWeight: "bolder",
                        }}>
                        Retour
                      </Button>
                    </Col>
                    {currentStep === steps.length - 1 ? (
                      <Col xs={8} className="offset-1">
                        <Button
                          className="btn-fill mt-3 btn-primary-border"
                          type="submit"
                          style={{ color: "#fff", width: "100%" }}
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
                          style={{ color: "#fff", width: "100%" }}>
                          Suivant
                        </Button>
                      </Col>
                    )}
                  </>
                )}
                {currentStep === 0 && (
                  <Col xs={12}>
                    <Button
                      style={{ color: "#fff", width: "100%" }}
                      onClick={handleNext}>
                      Suivant
                    </Button>
                  </Col>
                )}
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
