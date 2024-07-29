import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Form } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
const logo = require("../assets/sphera.png");
const user_iwd = require("../assets/img/user_iwd.png");
import "../css/userPage.css";

const cardBodyStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #CE9136",
  borderRadius: "10px",
};

const User = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const queryText = searchQuery.toLowerCase();
    try {
      const lastNameQuery = query(
        collection(db, "users"),
        where("lastName", ">=", queryText),
        where("lastName", "<=", queryText + "\uf8ff")
      );
      const firstNameQuery = query(
        collection(db, "users"),
        where("firstName", ">=", queryText),
        where("firstName", "<=", queryText + "\uf8ff")
      );
      const emailQuery = query(
        collection(db, "users"),
        where("email", ">=", queryText),
        where("email", "<=", queryText + "\uf8ff")
      );

      const [lastNameSnapshot, firstNameSnapshot, emailSnapshot] =
        await Promise.all([
          getDocs(lastNameQuery),
          getDocs(firstNameQuery),
          getDocs(emailQuery),
        ]);

      const lastNameResults = lastNameSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const firstNameResults = firstNameSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const emailResults = emailSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedResults = [
        ...lastNameResults,
        ...firstNameResults,
        ...emailResults,
      ].reduce((acc, user) => {
        if (!acc.find((u) => u.id === user.id)) {
          acc.push(user);
        }
        return acc;
      }, []);

      setFilteredUsers(combinedResults);
    } catch (error) {
      console.error("Error searching users: ", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    if (companyId) {
      history.push(`/admin/entreprise/users?companyId=${companyId}`);
    }
  };

  const handleUserClick = (userId) => {
    if (userId) {
      history.push(`/admin/results?userId=${userId}`);
    }
  };

  return (
    <Container>
      <Row className="my-4 align-items-center">
        <Col md={6} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <img
            src={logo}
            alt="Insights"
            className="img-fluid"
            style={{ height: 158 }}
          />
          <div>
            <h1 className="title">Utilisateurs</h1>
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
            style={{ display: "flex", flex: 1, alignItems: "center" }}
            onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Recherche"
              className="mr-sm-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "transparent",
                border: "1px solid transparent",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "8px",
              }}>
              <img
                src="path/to/search-icon.png"
                alt="Search"
                style={{ width: "20px", height: "20px" }}
              />
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
                    <th>Entreprise</th>
                    <th>Business unit</th>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Card.Link href="#" style={{ textDecoration: "underline" }}>
                  Voir plus
                </Card.Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default User;
