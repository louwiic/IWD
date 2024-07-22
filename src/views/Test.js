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
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import "../css/Test.css";

const Test = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
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

  const handleNext = async () => {
    const currentQuestions = categories[currentCategoryIndex]?.questions || [];
    const allAnswered = currentQuestions.every(
      (q) => responses[q] && responses[q] >= 1 && responses[q] <= 9
    );

    if (!allAnswered) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    await saveResponses();

    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const saveResponses = async () => {
    const currentCategory = categories[currentCategoryIndex];
    const testUserRef = collection(db, "test_user");
    const testRef = collection(db, "Tests");

    // Vérifiez si le document Tests existe pour l'utilisateur lors de la première question
    if (currentCategoryIndex === 0) {
      const testDocRef = doc(testRef, currentUser.uid);
      const testDoc = await getDoc(testDocRef);

      if (!testDoc.exists()) {
        await setDoc(testDocRef, {
          userId: currentUser.uid,
          sharedState: false,
          testDate: new Date().toISOString(),
        });
      }
    }

    const categoryResponses = currentCategory.questions.map((question) => ({
      question,
      response: responses[question],
    }));

    const testUserDocRef = doc(
      testUserRef,
      `${currentUser.uid}_${currentCategoryIndex}`
    );
    await setDoc(testUserDocRef, {
      userId: currentUser.uid,
      questionIndex: currentCategoryIndex,
      category: currentCategory.id,
      responses: categoryResponses,
    });
  };

  const formatQuestion = (question) => {
    return question.charAt(0).toUpperCase() + question.slice(1).toLowerCase();
  };

  const currentCategory = categories[currentCategoryIndex];

  return (
    <Container fluid>
      <Row className="justify-content-center mt-5">
        <Col md="8">
          <Card>
            <Card.Header>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "1rem", color: "#424242" }}>
                  <strong>1. Boutons de navigation ci-dessous</strong>
                </div>
              </div>
              <Card.Title as="h4">
                Page {currentCategoryIndex + 1} de {categories.length}
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
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentCategoryIndex === categories.length - 1}>
                  Suivant
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Test;
