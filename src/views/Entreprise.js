import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Importez useHistory
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
  Button,
  Toast,
} from "react-bootstrap";
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import "../css/EntreprisePage.css";

const logo = require("../assets/sphera.png");
const entreprise_icon = require("../assets/icon_entreprise_marron.png");
const remove_icon = require("../assets/remove.png");

const CustomSwitch = ({ companyId, isActive, showNotification }) => {
  const [isOn, setIsOn] = useState(isActive);

  const toggleSwitch = async () => {
    setIsOn(!isOn);
    try {
      await updateDoc(doc(db, "companies", companyId), { isActive: !isOn });
      showNotification(
        "Statut de l'entreprise mis à jour avec succès !",
        "success"
      );
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de l'entreprise :",
        error.message
      );
      showNotification(
        `Erreur lors de la mise à jour du statut de l'entreprise : ${error.message}`,
        "danger"
      );
    }
  };

  return (
    <div className="switch-container">
      <div className={`switch ${isOn ? "on" : "off"}`} onClick={toggleSwitch}>
        <div className="switch-handle"></div>
      </div>
    </div>
  );
};

const Entreprise = () => {
  const history = useHistory(); // Initialisez useHistory
  const [formData, setFormData] = useState({ companyName: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const companyQuerySnapshot = await getDocs(collection(db, "companies"));
      const companyList = companyQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Récupération du nombre de participants pour chaque entreprise
      const updatedCompanyList = await Promise.all(
        companyList.map(async (company) => {
          const participantsSnapshot = await getDocs(
            query(collection(db, "users"), where("company", "==", company.id))
          );
          return {
            ...company,
            participants: participantsSnapshot.size,
          };
        })
      );

      setCompanies(updatedCompanyList);
      setFilteredCompanies(updatedCompanyList);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des entreprises :",
        error.message
      );
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.companyName) {
      formErrors.companyName = "Le nom de l'entreprise est requis";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const { companyName } = formData;

        const payload = {
          companyName,
          createdAt: new Date().toISOString(),
          isActive: true,
          participants: 0,
        };

        setIsLoading(true);
        // Ajouter l'entreprise dans Firestore
        const newCompanyRef = doc(collection(db, "companies"));
        await setDoc(newCompanyRef, payload);

        // Afficher un message de succès via le toast
        showNotification("Entreprise créée avec succès !", "success");
        setFormData({ companyName: "" });
        fetchCompanies(); // Rafraîchir la liste des entreprises
      } catch (error) {
        console.error(
          "Erreur lors de la création de l'entreprise :",
          error.message
        );
        showNotification(
          `Erreur lors de la création de l'entreprise : ${error.message}`,
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "companies", selectedCompany.id));
      showNotification("Entreprise supprimée avec succès !", "success");
      fetchCompanies();
      setShowDeleteModal(false);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'entreprise :",
        error.message
      );
      showNotification(
        `Erreur lors de la suppression de l'entreprise : ${error.message}`,
        "danger"
      );
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const queryText = searchQuery.toUpperCase(); // Convertir la requête de recherche en majuscules

    try {
      // Requête pour rechercher par companyName
      const companyNameQuery = query(
        collection(db, "companies"),
        where("companyName", ">=", queryText),
        where("companyName", "<=", queryText + "\uf8ff")
      );

      // Obtenir les résultats
      const companySnapshot = await getDocs(companyNameQuery);

      const companyResults = companySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Mise à jour du nombre de participants pour les résultats filtrés
      const updatedCompanyResults = await Promise.all(
        companyResults.map(async (company) => {
          const participantsSnapshot = await getDocs(
            query(collection(db, "users"), where("company", "==", company.id))
          );
          return {
            ...company,
            participants: participantsSnapshot.size,
          };
        })
      );

      setFilteredCompanies(updatedCompanyResults);
    } catch (error) {
      console.error(
        "Erreur lors de la recherche des entreprises :",
        error.message
      );
    }
  };

  // Fonction pour vérifier la validité de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString();
  };

  // Fonction pour gérer le clic sur l'icône de l'entreprise
  const handleIconClick = (companyId) => {
    history.push(`/admin/entreprise/users?companyId=${companyId}`);
  };

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

      <Row className="my-4 align-items-center">
        <Col md={6} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <img
            src={logo}
            alt="Insights"
            className="img-fluid"
            style={{ height: 158 }}
          />
          <div>
            <h1 className="title">Entreprise</h1>
            <span className="subtitle">
              Liste des entreprises des utilisateurs
            </span>
          </div>
        </Col>
        <Col
          md={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}>
          <Form
            inline
            onSubmit={handleSearch}
            style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <Form.Control
              type="text"
              placeholder="Recherche"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              style={{
                backgroundColor: "rgba(206, 145, 54, 0.36)",
                border: "none",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#CE9136",
                height: "40px",
                width: "40px",
                alignSelf: "flex-end",
                marginLeft: 6,
              }}>
              <i
                className="fa fa-search"
                aria-hidden="true"
                style={{ fontSize: 20 }}></i>
            </button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Row className="mt-4 align-items-center">
            <Col>
              <span className="title-kpi">
                Liste des entreprises{" "}
                <span style={{ color: "#CE9136" }}>existantes</span>
              </span>
            </Col>
          </Row>
          <Card className="card">
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Date de création</th>
                    <th>Actif</th>
                    <th>Nombre de participants</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td className="text-center align-middle">
                        <span
                          className="img-content"
                          onClick={() => handleIconClick(company.id)} // Ajoutez l'événement de clic
                          style={{
                            cursor: "pointer",
                            padding: "5px",
                            borderRadius: "5px",
                          }}>
                          <img
                            src={entreprise_icon}
                            alt="entreprise_icon"
                            className="icon"
                          />
                        </span>
                      </td>
                      <td>{company.companyName}</td>
                      <td>{formatDate(company.createdAt)}</td>
                      <td>
                        <CustomSwitch
                          companyId={company.id}
                          isActive={company.isActive}
                          showNotification={showNotification}
                        />
                      </td>
                      <td className="bold-brown">{company.participants}</td>
                      <td>
                        <span
                          onClick={() => handleDelete(company)}
                          className="img-content"
                          style={{
                            cursor: "pointer",
                            padding: "5px",
                            borderRadius: "5px",
                          }}>
                          <img
                            src={remove_icon}
                            alt="remove_icon"
                            className="icon"
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Form
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
        }}
        onSubmit={handleSubmit}>
        <Form.Group controlId="formCompanyName">
          <Form.Label
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              fontFamily: "Poppins",
            }}>
            Ajouter une <span style={{ color: "#CE9136" }}>entreprise</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom de l'entreprise"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            style={{
              marginBottom: "10px",
              borderColor: "#CE9136",
              fontFamily: "Poppins",
            }}
          />
          {errors.companyName && (
            <Form.Text
              className="text-danger"
              style={{ fontSize: "14px", fontFamily: "Poppins" }}>
              {errors.companyName}
            </Form.Text>
          )}
          <Form.Text
            className=""
            style={{
              fontSize: "14px",
              color: "#151515",
              fontFamily: "Poppins",
              fontStyle: "italic",
              display: "flex",
            }}>
            Créer une nouvelle société pour permettre aux candidats de la
            sélectionner lors de leur inscription.
          </Form.Text>
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="primary"
            type="submit"
            style={{
              backgroundColor: "#CE9136",
              borderColor: "#CE9136",
              color: "#fff",
              fontFamily: "Poppins",
            }}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </Form>

      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDelete}
        companyName={selectedCompany?.companyName}
      />
    </Container>
  );
};

export default Entreprise;
