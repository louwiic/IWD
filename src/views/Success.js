import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SuccessModal = ({ show, onHide }) => {
  const history = useHistory();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
        history.push("/user");
      }, 3000); // Redirection après 3 secondes

      return () => clearTimeout(timer);
    }
  }, [show, onHide, history]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Questionnaire terminé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Le questionnaire a été terminé avec succès. Vous allez être redirigé
          vers votre page utilisateur.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            onHide();
            history.push("/user");
          }}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
