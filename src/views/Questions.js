import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Card,
  Toast,
} from "react-bootstrap";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
const style_pen = require("../assets/style_pen.png");
const logo = require("../assets/sphera.png");

import "../css/QuestionsPage.css"; // Assurez-vous d'ajouter le CSS pour le style

const Questions = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [responses, setResponses] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

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
  }, []);

  const handleResponseChange = (questionIndex, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionIndex]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSave = async () => {
    if (!selectedCategory) return;

    const currentCategory = categories.find(
      (cat) => cat.categorie === selectedCategory
    );
    const updatedQuestions = currentCategory.questions.map(
      (question, index) => {
        return responses[index] !== undefined ? responses[index] : question;
      }
    );

    try {
      const categoryDoc = doc(db, "questions", currentCategory.id);
      await updateDoc(categoryDoc, {
        questions: updatedQuestions,
      });
      showNotification("Questions mises à jour avec succès !", "success");
      fetchQuestions(); // Rafraîchir les questions après mise à jour
    } catch (error) {
      console.error("Error updating questions: ", error);
      showNotification(
        "Erreur lors de la mise à jour des questions.",
        "danger"
      );
    }
  };

  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const formatQuestion = (question) => {
    return question.charAt(0).toUpperCase() + question.slice(1).toLowerCase();
  };

  const currentCategory = categories.find(
    (cat) => cat.categorie === selectedCategory
  );

  return (
    <Container>
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
      <Col md={6} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <img
          src={logo}
          alt="Insights"
          className="img-fluid"
          style={{ height: 158 }}
        />
        <div>
          <h1 className="title">Utilisateurs</h1>
          <span className="subtitle">Ajouter ou modifier des questions</span>
        </div>
      </Col>
      <Row className="mt-4">
        <Col>
          <Col className="mt-4 align-items-center">
            <span className="title-kpi">
              Liste des <span style={{ color: "#CE9136" }}>questions</span>
            </span>
            <p>
              Attention vous ne pouvez pas ajouter plus de 60 questions max.
            </p>
          </Col>

          <Col md="12">
            <Form.Group controlId="categorySelect card">
              <Form.Control
                as="select"
                onChange={handleCategoryChange}
                value={selectedCategory}>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.categorie}>
                    {category.categorie}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Card className="card">
              <Card.Body>
                {currentCategory ? (
                  <div>
                    <h5
                      className="mb-4"
                      style={{
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: "1.2rem",
                      }}>
                      {currentCategory.categorie}
                    </h5>
                    {currentCategory.questions.map((q, index) => (
                      <Form.Group
                        key={index}
                        className="mt-3 d-flex align-items-center">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#424242",
                            marginRight: "10px",
                          }}>
                          {index + 1}.
                        </span>
                        <Form.Control
                          type="text"
                          defaultValue={q}
                          onChange={(e) =>
                            handleResponseChange(index, e.target.value)
                          }
                          style={{ flex: 1 }}
                        />
                        <span style={{ marginLeft: "10px" }}>
                          <img
                            src={style_pen}
                            alt="Edit Icon"
                            className="icon"
                          />
                        </span>
                      </Form.Group>
                    ))}
                    <div className="d-flex justify-content-end mt-4">
                      <Button variant="primary" onClick={handleSave}>
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p>Sélectionnez une catégorie pour afficher les questions</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default Questions;
