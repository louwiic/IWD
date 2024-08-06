import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const modalTopStyle = {
  marginTop: "10%",
};

const ConfirmDeleteModal = ({
  show,
  handleClose,
  handleConfirm,
  companyName,
  title,
}) => {
  return (
    <Modal show={show} onHide={handleClose} style={modalTopStyle}>
      <Modal.Header>
        <Modal.Title>
          {title || "Supprimer définitivement cette entreprise ?"}
        </Modal.Title>
        <i
          className="fa fa-times"
          aria-hidden="true"
          onClick={handleClose}
          style={{
            cursor: "pointer",
            marginLeft: "auto",
            fontSize: "1.5rem",
          }}></i>
      </Modal.Header>
      <Modal.Body>
        <div>
          <strong>{companyName}</strong>
          <p>Cette action est définitive et ne peut pas être annulée.</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
