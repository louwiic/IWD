import React from "react";
import { Modal, Button } from "react-bootstrap";
//const modal_img = require("../assets/modal_img.png");
const modal_img = require("../assets/sun.png");
/* import "./WelcomeModal.css";
 */
const WelcomeModal = ({ show, onHide, userName }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="welcome-modal"
      contentClassName="full-height-modal">
      <Modal.Body style={{ padding: "0", display: "flex" }}>
        <div style={{ flex: 0.4, position: "relative" }}>
          <img
            src={modal_img}
            alt="Welcome"
            style={{
              height: "100%",
              width: "75%",
              objectFit: "cover",
              borderTopLeftRadius: "0.3rem",
              borderBottomLeftRadius: "0.3rem",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: "60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "auto", // Ajout du défilement interne si nécessaire
          }}>
          <h1 style={{ color: "#333", fontWeight: "bold", fontSize: "2.5rem" }}>
            Bonjour {userName} !
          </h1>
          <p
            style={{ color: "#555", fontSize: "1.3rem", marginBottom: "20px" }}>
            Lancez-vous et ne vous arrêtez que lorsque vous avez complété le
            questionnaire.
          </p>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.3rem",
              marginBottom: "20px",
            }}>
            Rappel :
          </p>
          <p
            style={{ color: "#555", fontSize: "1.3rem", marginBottom: "20px" }}>
            Gardez bien votre identifiant et votre mot de passe pour accéder à
            vos résultats une fois la restitution effectuée avec votre coach.
          </p>
          <p
            style={{ color: "#555", fontSize: "1.3rem", marginBottom: "30px" }}>
            Pour commencer, cliquez sur "J'ai compris".
          </p>
          <Button
            style={{ color: "#fff", padding: "10px 20px" }}
            onClick={onHide}>
            J'ai compris
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WelcomeModal;
