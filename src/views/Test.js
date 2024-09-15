import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Card,
  Alert,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import "../css/Test.css";
import SuccessModal from "../views/Success";
import WelcomeModal from "./WelcomeModal";

const Test = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [testDocId, setTestDocId] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const history = useHistory();

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(questionsData);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setCurrentUser({ id: user.uid, ...userDocSnap.data() });
        } else {
          console.log("No such user document!");
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResponseChange = (question, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [question]: value,
    }));
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleRandomize = () => {
    const currentQuestions = categories[currentCategoryIndex]?.questions || [];
    const randomResponses = {};
    currentQuestions.forEach((question) => {
      randomResponses[question] = Math.floor(Math.random() * 6) + 4;
    });
    setResponses((prevResponses) => ({
      ...prevResponses,
      ...randomResponses,
    }));
  };

  const saveResponses = async () => {
    const currentCategory = categories[currentCategoryIndex];
    const testRef = collection(db, "Tests");

    if (!testDocId) {
      const newTestDocRef = doc(testRef);
      setTestDocId(newTestDocRef.id);
      const categoryResponses = currentCategory.questions.map((question) => ({
        question,
        response: responses[question],
      }));

      const newCategoryData = {
        category: currentCategory.id,
        responses: categoryResponses,
      };

      await setDoc(newTestDocRef, {
        userId: currentUser.id,
        sharedState: false,
        testDate: new Date().toISOString(),
        categories: [newCategoryData],
      });
    } else {
      const testDocRef = doc(testRef, testDocId);
      const categoryResponses = currentCategory.questions.map((question) => ({
        question,
        response: responses[question],
      }));

      const newCategoryData = {
        category: currentCategory.id,
        responses: categoryResponses,
      };

      await updateDoc(testDocRef, {
        categories: arrayUnion(newCategoryData),
      });

      if (currentCategoryIndex === categories.length - 1) {
        const userTestRef = doc(collection(db, "UserTests"), testDocId);
        await setDoc(userTestRef, {
          userId: currentUser.id,
          sharedState: false,
          testDate: new Date().toISOString(),
          testId: testDocId,
          newTestSended: currentUser?.newTestSended,
        });

        // Mettre à jour la propriété newTestSended à null dans le document "users"
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, {
          newTestSended: null,
        });
      }
    }
  };

  const handleNext = () => {
    const currentQuestions = categories[currentCategoryIndex]?.questions || [];
    const allAnswered = currentQuestions.every(
      (q) => responses[q] && responses[q] >= 1 && responses[q] <= 9
    );

    if (!allAnswered) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);
    saveResponses();

    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      history.push("/user/test");
      setShowSuccessModal(true); // Show success modal
    }
  };

  const formatQuestion = (question) => {
    return question.charAt(0).toUpperCase() + question.slice(1).toLowerCase();
  };

  const currentCategory = categories[currentCategoryIndex];

  return (
    <Container fluid>
      {!currentUser?.newTestSended ? (
        <Col md="12">
          <Card style={{ borderRadius: "4px" }}>
            <Card.Body>
              <span>
                Votre coach va vous autoriser l'accès au questionnaire.
              </span>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        <Row className="justify-content-center mt-5">
          <Col md="10">
            <Card>
              <Card.Header>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "1rem", color: "#424242" }}>
                    <strong>1. Boutons de navigation ci-dessous</strong>
                  </div>
                </div>
                <Card.Title as="h4">
                  <strong>
                    {" "}
                    Page {currentCategoryIndex + 1} sur {categories.length}
                  </strong>
                </Card.Title>
                <Card.Title as="h4">
                  {currentCategory?.categorie || ""}
                </Card.Title>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#424242",
                    fontStyle: "italic",
                  }}>
                  (1 = faible à 9 = élevé)
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#424242",
                    fontStyle: "italic",
                    marginTop: "0.5rem",
                  }}>
                  <strong>Évaluez :</strong>
                </div>
              </Card.Header>
              <Card.Body>
                {showAlert && (
                  <Alert variant="danger">
                    Veuillez répondre à toutes les questions avant de continuer.
                  </Alert>
                )}
                {currentCategory ? (
                  currentCategory.questions.map((q, index) => (
                    <Form.Group key={index} className="mt-3">
                      <Form.Label>
                        <span style={{ fontWeight: "bold", color: "#424242" }}>
                          {index + 1}.
                        </span>
                        <span style={{ fontWeight: "600", color: "#424242" }}>
                          {" "}
                          {formatQuestion(q)}
                        </span>
                      </Form.Label>
                      <div className="radio-group">
                        {[...Array(9).keys()].map((i) => (
                          <span className="radio-container" key={i}>
                            <span className="radio-label">{i + 1}</span>
                            <input
                              type="radio"
                              className="custom-radio"
                              name={`question-${index}`}
                              value={i + 1}
                              checked={responses[q] === i + 1}
                              onChange={() => handleResponseChange(q, i + 1)}
                            />
                          </span>
                        ))}
                      </div>
                    </Form.Group>
                  ))
                ) : (
                  <p>Chargement des questions...</p>
                )}
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <div>
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    disabled={currentCategoryIndex === 0}>
                    Retour
                  </Button>
                </div>
                <div>
                  <Button style={{ color: "#fff" }} onClick={handleNext}>
                    {currentCategoryIndex === categories.length - 1
                      ? "Terminer"
                      : "Suivant"}
                  </Button>
                  <Button
                    variant="info"
                    onClick={handleRandomize}
                    className="ml-2">
                    Randomize
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}

      <WelcomeModal
        show={showWelcomeModal}
        onHide={() => setShowWelcomeModal(false)}
        userName={currentUser?.firstName || "Utilisateur"}
      />

      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
      />
    </Container>
  );
};

export default Test;
