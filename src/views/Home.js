import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
const logo = require("../assets/sphera.png");
const book = require("../assets/img/note.png");
const user_iwd = require("../assets/img/user_iwd.png");
const checked = require("../assets/img/checked.png");
import "../css/home.css";
const remove_icon = require("../assets/remove.png");
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const cardBodyStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #CE9136",
  borderRadius: "10px",
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newTestSendedCount, setNewTestSendedCount] = useState(0);
  const [lastMonthTestUser, setLastMonthTestUser] = useState(null);
  const [testsEnvoyesDernierMois, setTestsEnvoyesDernierMois] = useState(0);
  const [nouveauxInscrits, setNouveauxInscrits] = useState(0);
  const [testsPartages, setTestsPartages] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Modifier la date pour 30 jours au lieu de 7
        const dateIlYa30Jours = new Date();
        dateIlYa30Jours.setDate(dateIlYa30Jours.getDate() - 30);

        // Modifier la requête pour utiliser dateIlYa30Jours
        const usersQuery = query(
          collection(db, "users"),
          where("createdAt", ">=", dateIlYa30Jours.toISOString())
        );
        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Récupérer les entreprises
        const companiesSnapshot = await getDocs(collection(db, "companies"));
        const companiesData = {};
        companiesSnapshot.docs.forEach((doc) => {
          companiesData[doc.id] = doc.data().companyName;
        });

        setUsers(usersData);
        setFilteredUsers(usersData.slice(0, 5));
        setCompanies(companiesData);

        // Calculer le nombre de nouveaux inscrits des 30 derniers jours
        const nombreNouveauxInscrits = usersData.length;

        // Récupérer les tests envoyés des 30 derniers jours
        const testsQuery = query(
          collection(db, "UserTests"),
          where("newTestSended", ">=", dateIlYa30Jours.toISOString())
        );
        const testsSnapshot = await getDocs(testsQuery);
        const nombreTestsEnvoyes = testsSnapshot.size;

        // Étape 4: Compter le nombre d'utilisateurs ayant passé un test
        const userIdsInTests = [];
        const usersWhoPassedTests = usersData.filter(
          (user) => !userIdsInTests.includes(user.id)
        ).length;

        // Étape 5: Récupérer les tests partagés des 30 derniers jours
        const testsPartagesQuery = query(
          collection(db, "UserTests"),
          where("sharedDate", ">=", dateIlYa30Jours.toISOString()),
          orderBy("sharedDate", "desc"),
          limit(1)
        );
        const lastSharedTestSnapshot = await getDocs(testsPartagesQuery);

        let lastMonthTestUser = null;
        if (!lastSharedTestSnapshot.empty) {
          const lastSharedTest = lastSharedTestSnapshot.docs[0].data();
          lastMonthTestUser = usersData.find(
            (user) => user.id === lastSharedTest.userId
          );
        }

        // Étape 6: Compter le nombre de nouveaux tests envoyés
        const newTestSendedCount = usersData.reduce((count, user) => {
          if (user.newTestSended !== null && user.newTestSended !== undefined) {
            return count + 1;
          }
          return count;
        }, 0);

        // Modifier la requête pour filtrer par sharedDate
        const allTestsPartagesQuery = query(
          collection(db, "UserTests"),
          where("sharedState", "==", true),
          where("sharedDate", ">=", Timestamp.fromDate(dateIlYa30Jours))
        );
        const testsPartagesSnapshot = await getDocs(allTestsPartagesQuery);
        const nombreTestsPartages = testsPartagesSnapshot.size;

        // Mettre à jour les états
        setUsers(usersData);
        setFilteredUsers(usersData.slice(0, 5));
        setCompanies(companiesData);
        setLastMonthTestUser(lastMonthTestUser);
        setNewTestSendedCount(newTestSendedCount);
        setTestsEnvoyesDernierMois(nombreTestsEnvoyes);
        setNouveauxInscrits(nombreNouveauxInscrits);
        setTestsPartages(nombreTestsPartages);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchDashboardData();
  }, [sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredUsers(users.slice(0, 5));
      return;
    }
    const queryText = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.lastName.toLowerCase().includes(queryText) ||
        user.firstName.toLowerCase().includes(queryText) ||
        user.email.toLowerCase().includes(queryText)
    );
    setFilteredUsers(filtered);
  };

  const handleCompanyClick = (companyId) => {
    history.push(`/admin/entreprise/users?companyId=${companyId}`);
  };

  const handleUserClick = (userId) => {
    console.log("userId", userId);
    console.log("lastMonthTestUser", lastMonthTestUser);
    let id = lastMonthTestUser?.id || userId;
    if (id) {
      history.push(`/admin/results?userId=${id}`);
    }
  };

  const handleDeleteUser = (userId) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteDoc(doc(db, "users", selectedUser));
        setUsers(users.filter((user) => user.id !== selectedUser));
        setFilteredUsers(
          filteredUsers.filter((user) => user.id !== selectedUser)
        );
        setShowDeleteModal(false);
        setSelectedUser(null);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'utilisateur : ",
          error
        );
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  return (
    <Container>
      <Row className="my-4 align-items-center">
        <Col md={2}>
          <img src={logo} alt="Insights" className="img-fluid" />
        </Col>
        <Col md={10}>
          <h1 className="title">Tableau de bord</h1>
          <p>30 derniers jours</p>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={4}>
          <span className="title-kpi">Nouveaux inscrits</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">{nouveauxInscrits}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Tests envoyés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">
                {testsEnvoyesDernierMois}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Tests partagés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">{testsPartages}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Row className="ml-1 mt-4 align-items-center">
            <Col>
              <img src={book} alt="book" className="icon" />
              <span className="title-kpi">
                Dernières inscriptions réalisées cette{" "}
                <span style={{ color: "#CE9136" }}>semaine</span>
              </span>
            </Col>
            <Col xs="auto">
              <Button variant="link" onClick={toggleSortOrder}>
                {sortOrder === "desc"
                  ? "Plus récent d'abord"
                  : "Plus ancien d'abord"}
              </Button>
            </Col>
          </Row>
          <Card className="card">
            <Card.Body>
              <Form
                inline
                style={{ display: "flex", flex: 1, marginBottom: "20px" }}
                onSubmit={handleSearch}>
                <Form.Control
                  type="text"
                  placeholder="Recherche"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button
                  type="submit"
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
              <Table hover>
                <thead>
                  <tr>
                    <th>Select user</th>
                    <th>Nom / Prénom</th>
                    <th>Email</th>
                    <th>Date d'inscription</th>
                    <th>Entreprise</th>
                    <th>Business unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td
                        className="text-center align-middle"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleUserClick(user.id)}>
                        <span className="img-conent">
                          <img src={user_iwd} alt="user_iwd" className="icon" />
                        </span>
                      </td>
                      <td>{`${user.lastName} ${user.firstName}`}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td
                        className="bold-brown"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCompanyClick(user.company)}>
                        {companies[user.company] || "Inconnu"}
                      </td>
                      <td>{user.businessUnit}</td>
                      <td>
                        <span
                          onClick={() => handleDeleteUser(user.id)}
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Card.Link
                  href="/admin/users"
                  style={{ textDecoration: "underline" }}>
                  Voir plus
                </Card.Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="">
        <Col>
          <Card style={cardBodyStyle} className="text-center p-5">
            <Card.Body>
              <div className="completed-test">
                <img
                  src={checked}
                  alt="check icon"
                  className="icon"
                  style={{ height: 45 }}
                />
                <Card.Text>
                  <h4 className="title">Dernier test partagé</h4>
                </Card.Text>
              </div>
              {lastMonthTestUser ? (
                <div className="result-link">
                  <a
                    onClick={handleUserClick}
                    href="#">{`Voir les résultats de ${lastMonthTestUser.firstName} ${lastMonthTestUser.lastName}`}</a>
                </div>
              ) : (
                <div className="result-link">
                  <p>{`Aucun test passé ce mois-ci`}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDelete}
        title={"Supprimer définitivement cette utilisateur ?"}
        companyName={""}
      />
    </Container>
  );
};

export default Dashboard;
