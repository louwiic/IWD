import React from "react";
import { Modal, Button } from "react-bootstrap";
//const modal_img = require("../assets/modal_img.png");
const modal_img = require("../assets/sun.png");
/* import "./WelcomeModal.css";
 */
const WelcomeModal = ({ show, onHide, userName }) => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="welcome-modal"
      contentClassName="full-height-modal">
      <Modal.Body style={{ padding: "0", display: "flex", }}>
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
            style={{ color: "#555", fontSize: "1.3rem", marginBottom: "20px" }}>
            <span style={{ fontWeight: "bold" }}>Rappel : </span>
            Gardez bien votre identifiant et votre mot de passe pour accéder à
            vos résultats une fois la restitution effectuée avec votre coach.
          </p>
          <p
            style={{ color: "#555", fontSize: "1.3rem", marginBottom: "30px" }}>
            Pour commencer, cliquez sur "J'ai compris".
          </p>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#555", fontSize: "1rem", marginBottom: "15px" }}>
              En répondant à nos questionnaires d'évaluation en ligne, vous consentez au traitement de vos données personnelles nous permettant de produire une synthèse qui vous sera remise sous forme de profil individuel (rapport pdf) et commentée à titre exclusif et prioritaire par un Praticien agréé par IWD Europe. Vos données sont collectées, traitées et sauvegardées par IWD Europe et ne sont transmises à aucune autre personne (physique ou morale), autre que vous-même et le Praticien agréé chargé d'interpréter et de commenter ces données directement à votre intention. Toute donnée personnelle est considérée comme une information confidentielle et, à ce titre, protégée et conservée par nos soins pour restitution à partir de nos bases de données (dans la limite de 3 ans, sauf demande écrite de suppression de votre part), en conformité avec les dispositions de la législation européenne N° 2016/679 (RGPD).
            </p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  accentColor: "#8B4513"
                }}
              />
              <span style={{ color: "#555", fontSize: "1.1rem" }}>
                J'accepte les conditions ci-dessus
              </span>
            </label>
          </div>
          <Button
            style={{
              color: "#fff",
              padding: "10px 20px",
              opacity: isChecked ? 1 : 0.5
            }}
            onClick={onHide}
            disabled={!isChecked}>
            J'accepte et j'ai compris
          </Button>

        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WelcomeModal;
