import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const SuccessModal = ({ show, onHide }) => {
  const history = useHistory();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
        history.push("/user/home");
      }, 3000); // Redirection après 3 secondes

      return () => clearTimeout(timer);
    }
  }, [show, onHide, history]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Questionnaire terminé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Merci d'avoir répondu à ce questionnaire. Vos résultats vous seront
          prochainement débrifé avec votre coach
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            onHide();
            history.push("/user/test");
          }}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
