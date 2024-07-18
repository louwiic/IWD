import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Form } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLocation, useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
import "../css/userPage.css";
const logo = require("../assets/sphera.png");

const cardBodyStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #CE9136",
  borderRadius: "10px",
};

const EntrepriseUser = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [companyName, setCompanyName] = useState("");

  const location = useLocation();
  const history = useHistory();
  const companyId = new URLSearchParams(location.search).get("companyId");

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const companyDoc = await getDocs(
          query(collection(db, "companies"), where("__name__", "==", companyId))
        );
        if (!companyDoc.empty) {
          setCompanyName(companyDoc.docs[0].data().companyName);
        }
      } catch (error) {
        console.error("Error fetching company name: ", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("company", "==", companyId)
        );
        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchCompanyName();
    fetchUsers();
  }, [companyId]);

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

  return (
    <Container>
      <Row>
        <Col md={1} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <i
            className="fa fa-arrow-left"
            aria-hidden="true"
            style={{ cursor: "pointer", fontSize: 24 }}
            onClick={() => history.goBack()}></i>
        </Col>
      </Row>
      <Row className="my-4 align-items-center mt-5">
        <Col md={5} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <img
            src={logo}
            alt="Insights"
            className="img-fluid"
            style={{ height: 158 }}
          />
          <div>
            <h1 className="title">
              Entreprise <span style={{ color: "#CE9136" }}>{companyName}</span>
            </h1>
            <span className="subtitle">
              Accéder aux résultats des utilisateurs
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
            style={{ display: "flex", flex: 1 }}
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
                style={{ fontSize: 22, color: "#CE9136" }}></i>
            </button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Row className="mt-4 align-items-center">
            <Col>
              <span className="title-kpi">
                Sélectionnez un{" "}
                <span style={{ color: "#CE9136" }}>utilisateur</span>
              </span>
            </Col>
          </Row>
          <Card className="card">
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Select user</th>
                    <th>Nom / Prénom</th>
                    <th>Email</th>
                    <th>Dernière sphère</th>
                    <th>Business unit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="text-center align-middle">
                        <i className="fa fa-user" aria-hidden="true"></i>
                      </td>
                      <td>{`${user.lastName} ${user.firstName}`}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>{user.businessUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EntrepriseUser;
