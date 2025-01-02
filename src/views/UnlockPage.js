import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  color: white;
`;

function UnlockPage() {
  const [message, setMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const uid = searchParams.get("idUser");

      if (!uid) {
        setMessage("ID utilisateur non trouvé dans l'URL.");
        return;
      }

      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setMessage("Utilisateur non trouvé.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setMessage("Erreur lors de la récupération des données utilisateur.");
      }
    };

    fetchUserData();
  }, [location]);

  //http://localhost:3000/unlock?idUser=33uytShXJcc3h7oiGoIVwpKN18G2

  const handleUnlock = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const uid = searchParams.get("idUser");

      if (!uid) {
        setMessage("ID utilisateur non trouvé dans l'URL.");
        return;
      }

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setMessage("Utilisateur non trouvé.");
        return;
      }

      const userData = userSnap.data();

      // Vérification si un test est déjà en cours
      if (!!userData?.testInProgress) {
        const confirmTest = window.confirm(
          "Un test est déjà en cours. Voulez-vous vraiment envoyer un nouveau test ?"
        );

        if (!confirmTest) {
          return;
        }
      }

      // Condition existante pour newTestSended
      if (userData.newTestSended) {
        const confirmUpdate = window.confirm(
          "Un test a déjà été envoyé. En cliquant sur 'Oui', cela modifiera la date d'envoi du test précédent. Voulez-vous continuer ?"
        );

        if (!confirmUpdate) {
          return;
        }
      }

      await updateDoc(userRef, {
        newTestSended: new Date().toISOString(),
      });

      setIsUnlocked(true);
      setMessage("Le test a bien été mis à jour et envoyé.");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du document utilisateur : ",
        error
      );
      setMessage("Une erreur est survenue lors du déverrouillage du test.");
    }
  };

  return (
    <StyledContainer>
      <h1 className="mb-4">Débloquer un questionnaire</h1>
      {userData && (
        <h4 className="text-center mb-4 font-weight-bold">
          Pour {userData.firstName} {userData.lastName}
        </h4>
      )}

      <StyledButton
        variant="primary"
        onClick={handleUnlock}
        disabled={isUnlocked}>
        {isUnlocked ? "Questionnaire débloqué" : "Débloquer"}
      </StyledButton>
      {message && <p className="mt-3 text-center">{message}</p>}
    </StyledContainer>
  );
}

export default UnlockPage;
