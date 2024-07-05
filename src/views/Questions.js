import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Row, Col, Form, Card } from "react-bootstrap";

import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const Questions = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsData = querySnapshot.docs.map((doc) => doc.data());
      setCategories(questionsData);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleResponseChange = (question, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [question]: value,
    }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
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
                {/*  <div style={{ fontSize: "0.9rem", color: "#424242" }}>
                  <strong> Retour ; Suivant</strong>
                </div> */}
              </div>
              <Card.Title as="h4">
                Page {currentCategoryIndex + 1} de {categories.length}
              </Card.Title>
              <div style={{ fontSize: "1.1rem", color: "#424242" }}>
                <strong>
                  {currentCategory
                    ? currentCategory.categorie
                    : "Chargement..."}
                </strong>
              </div>
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
                    <div>
                      {[...Array(9).keys()].map((i) => (
                        <span className="mt-3" style={{ marginTop: 30 }}>
                          <span style={{ color: "0.9em" }}>{i + 1} </span>
                          <Form.Check
                            inline
                            /*  label={i + 1} */
                            type="radio"
                            key={i}
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

export default Questions;
