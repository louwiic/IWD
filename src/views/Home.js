import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Form } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
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
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.slice(0, 5).map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesData = {};
        querySnapshot.docs.forEach((doc) => {
          companiesData[doc.id] = doc.data().companyName;
        });
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      }
    };

    fetchUsers();
    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
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
              <Card.Text className="kpi-circle">22</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Test en attente de complétion</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">4</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <span className="title-kpi">Test partagés</span>
          <Card style={cardBodyStyle} className="text-center center-content">
            <Card.Body className="body-card">
              <Card.Text className="kpi-circle">18</Card.Text>
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
                    marginLeft: "8px",
                    padding: "6px 12px",
                    color: "#CE9136",
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
                      <td className="text-center align-middle">
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
              <div className="result-link">
                <a href="#">Voir les résultat de Anthony D</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
