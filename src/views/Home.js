import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Form } from "react-bootstrap";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
const logo = require("../assets/sphera.png");
const book = require("../assets/img/note.png");
const user_iwd = require("../assets/img/user_iwd.png");
const checked = require("../assets/img/checked.png");
import "../css/home.css";

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
  const [nbShared, setNbShared] = useState(0);
  const [userPassedTest, setUserPassedTest] = useState(0);
  const [newTestSendedCount, setNewTestSendedCount] = useState(0);
  const [todayTestUser, setTodayTestUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Étape 1: Récupérer tous les utilisateurs
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Étape 2: Récupérer toutes les entreprises
        const companiesSnapshot = await getDocs(collection(db, "companies"));
        const companiesData = {};
        companiesSnapshot.docs.forEach((doc) => {
          companiesData[doc.id] = doc.data().companyName;
        });

        // Étape 3: Récupérer tous les `UserTests` partagés
        const sharedTestsQuery = query(
          collection(db, "UserTests"),
          where("sharedState", "==", true)
        );
        const sharedTestsSnapshot = await getDocs(sharedTestsQuery);
        const sharedTestsCount = sharedTestsSnapshot.size;

        // Étape 4: Compter le nombre d'utilisateurs ayant passé un test
        const userIdsInTests = sharedTestsSnapshot.docs.map(
          (doc) => doc.data().userId
        );
        const usersWhoPassedTests = usersData.filter(
          (user) => !userIdsInTests.includes(user.id)
        ).length;

        // Étape 5: Récupérer le test le plus récent d'aujourd'hui
        const today = new Date().toISOString().split("T")[0]; // Récupère la date du jour au format 'YYYY-MM-DD'
        const todayTestsQuery = query(
          collection(db, "UserTests"),
          where("testDate", ">=", `${today}T00:00:00.000Z`),
          where("testDate", "<=", `${today}T23:59:59.999Z`),
          orderBy("testDate", "desc"),
          limit(1) // Limiter à un seul document, le plus récent
        );
        const todayTestSnapshot = await getDocs(todayTestsQuery);

        let todayTestUser = null;
        if (!todayTestSnapshot.empty) {
          const todayTest = todayTestSnapshot.docs[0].data();
          todayTestUser = usersData.find(
            (user) => user.id === todayTest.userId
          );
        }

        // Étape 6: Compter le nombre de nouveaux tests envoyés
        const newTestSendedCount = usersData.reduce((count, user) => {
          if (user.newTestSended !== null && user.newTestSended !== undefined) {
            return count + 1;
          }
          return count;
        }, 0);

        // Mettre à jour les états
        setUsers(usersData);
        setFilteredUsers(usersData.slice(0, 5));
        setCompanies(companiesData);
        setNbShared(sharedTestsCount);
        setUserPassedTest(usersWhoPassedTests);
        setTodayTestUser(todayTestUser); // Assurez-vous d'avoir un état pour `todayTestUser`
        setNewTestSendedCount(newTestSendedCount); // Assurez-vous d'avoir un état pour `newTestSendedCount`
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchDashboardData();
  }, []);

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

  const handleUserClick = (userId?) => {
    let id = userId ?? todayTestUser?.id;
    if (id) {
      history.push(`/admin/results?userId=${id}`);
    }
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
          <span className="title-kpi">Tests envoyés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">{newTestSendedCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Tests passés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">{userPassedTest}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Tests partagés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">{nbShared}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Row className="ml-1 mt-4 align-items-center">
            <img src={book} alt="book" className="icon" />
            <div>
              <span className="title-kpi">
                Derniers tests réalisés cette{" "}
                <span style={{ color: "#CE9136" }}>semaine</span>
              </span>
            </div>
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
                    <th>Login</th>
                    <th>Email</th>
                    <th>Dernière sphère</th>
                    <th>Entreprise</th>
                    <th>Business unit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td
                        className="text-center align-middle"
                        onClick={() => handleUserClick(user.id)}>
                        <img src={user_iwd} alt="user_iwd" className="icon" />
                      </td>
                      <td>{`${user.lastName} ${user.firstName}`}</td>
                      <td>{user.login}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td
                        className="bold-brown"
                        onClick={() => handleCompanyClick(user.company)}
                        style={{
                          cursor: "pointer",
                          color:
                            user.company !== "Inconnu" ? "#CE9136" : "inherit",
                        }}>
                        {companies[user.company] || "Inconnu"}
                      </td>
                      <td>{user.businessUnit}</td>
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
                  <h1 className="title">Test terminé aujourd'hui</h1>
                </Card.Text>
              </div>
              {todayTestUser ? (
                <div className="result-link">
                  <a
                    onClick={handleUserClick}
                    href="#">{`Voir les résultat de ${todayTestUser.firstName} ${todayTestUser.lastName}`}</a>
                </div>
              ) : (
                <div className="result-link">
                  <p>{`Aucun test passé`}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
