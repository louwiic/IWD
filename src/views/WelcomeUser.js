import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const WelcomeUser = () => {
  const history = useHistory();

  const handleViewResults = () => {
    history.push("/user/home");
  };

  const handleTakeTest = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const userId = localStorage.getItem("userIdStorage");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const userData = {
        email: currentUser.email,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
      };

      //enregistrer les infos user dans le document notifications avec un status "pending"
      const docRef = doc(collection(db, "notifications"), userId);
      await setDoc(docRef, {
        userId: userId,
        email: currentUser.email,
        firstName: firstName,
        lastName: lastName,
        status: "pending",
      });
      history.push("/user/test");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center mt-5">
        <Col md="8">
          <Card>
            <Card.Body className="text-center">
              <h3 className="mb-4">Que voulez-vous faire aujourd'hui ?</h3>
              <div className="d-grid gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleViewResults}
                  className="text-white">
                  Voir mes résultats
                </Button>
                <div
                  style={{
                    margin: "20px 0",
                  }}
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleTakeTest}
                  className="text-white">
                  Passer un nouveau test
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomeUser;
