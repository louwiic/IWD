import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
const logo = require("../assets/sphera.png");
const user_iwd = require("../assets/img/user_iwd.png");
import "../css/userPage.css";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
const remove_icon = require("../assets/remove.png");

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const history = useHistory();

  /*   const updateFirestoreWithCategories = async () => {
    // Les catégories avec leurs questions
    const categories = [
      {
        id: "yz0kVA4XJ1Ivd1eFmIHZ", // Firestore document ID for "Confiance"
        categorie: "Confiance",
        questions: [
          "Exprimez-vous clairement aux autres votre confiance ?",
          "Démontrez-vous ouvertement aux autres votre confiance par vos actions / comportements ?",
          "Partagez-vous ouvertement les informations avec toutes les parties concernées ?",
          "Déléguez-vous de manière intentionnelle de l'autorité et du pouvoir à autrui",
          "Établissez-vous et maintenez-vous vos limites ?",
          "Tenez-vous toujours parole (promesses, accords) et walk the talk ?",
          "Reconnaissez-vous rapidement vos erreurs (sans forcément vous excuser) ?",
          "Appliquez-vous les comportements que vous attendez d’autrui ?",
          "Pensez-vous que les autres vous font confiance ?",
        ],
      },
      {
        id: "yyZWreYDX93rPRnjIkwh", // Replace with the actual Firestore document ID for "Résilience"
        categorie: "Résilience",
        questions: [
          "Connaissance de vos atouts personnels et/ou professionnels",
          "Conscience de vos défis personnels",
          "Engagement à agir en fonction de votre moi authentique.",
          "Capacité à identifier l’origine de votre stress quand vous y êtes confronté.",
          "Adaptabilité en cas de changements soudains",
          "Capacité à rebondir à partir d'expériences plutôt négatives",
          "Le degré cohérence entre la personne que vous êtes et la manière dont vous agissez",
          "Capacité de collaborer de manière intentionnelle",
          "Aptitude à prendre soin de vous pour maintenir votre résilience",
          "Estimation de la qualité de votre réseau de soutien personnel (famille et/ou amis).",
        ],
      },
      {
        id: "4jx2EMzabASVxfbKBKxQ", // Replace with the actual Firestore document ID
        categorie: "Votre Leadership Aujourd’hui",
        questions: [
          "Vous, en tant que leader",
          "Votre compréhension des qualités requises pour être un bon leader",
          "Vos efforts continus pour développer les compétences et les capacités nécessaires pour être un bon leader",
          "La façon dont vous exploitez votre potentiel de leader",
          "Votre satisfaction par rapport à vos réalisations professionnelles",
          "Votre volonté de développer vos capacités professionnelles",
        ],
      },
      {
        id: "Kn1O3C6oUTXlgyWn5utY", // Replace with the actual Firestore document ID
        categorie: "Vos valeurs",
        questions: [
          "Indépendance",
          "Défi",
          "Créativité",
          "Instruction-Savoir",
          "Plaisir",
          "Responsabilité (prise de)",
          "Coopération",
          "Accomplissement",
          "Reconnaissance",
          "Richesse",
          "Courage",
          "Tranquillité",
        ],
      },
      {
        id: "M1zQrDhFj0LYbyYVCs1H", // Replace with the actual Firestore document ID
        categorie: "État d’esprit",
        questions: [
          "Passion pour les nouvelles idées",
          "Votre propension à agir",
          "Capacité à atteindre vos objectifs",
          "Acceptation du risque pour l’atteinte du résultat",
          "Besoin de réussir à haut niveau",
          "Capacité à apprécier les situations complexes dans leur contexte",
          "Désir d’avoir un impact sur votre environnement ?",
          "Utilisation de l'intelligence émotionnelle lors vos prises de décision",
          "Discipline au suivi pour atteindre le résultat ?",
        ],
      },
      {
        id: "PC6KaYF98rIsfNwH2FTC", // Replace with the actual Firestore document ID
        categorie: "Dans le futur",
        questions: [
          "Votre volonté de vous développer en tant que leader",
          "La clarté de vision de votre avenir",
          "Votre capacité à adapter (remettre en question) votre point de vue si nécessaire",
          "Votre capacité à gérer l’ambiguïté",
          "Votre niveau de curiosité face à l'inconnu",
          "Votre désir d’avoir une contribution sociétale (Pro Bono, ONG, charité)",
          "Votre capacité à l’amélioration de vos pratiques, développement du network, réparation des torts et amélioration des relations",
          "Votre capacité à faire face à l’incertitude",
        ],
      },
      {
        id: "rYbeaMIQuKar27QYsXVG", // Replace with the actual Firestore document ID
        categorie: "Conflit",
        questions: [
          "Êtes-vous confronté quelque fois à des situations difficiles et/ou conflictuelles ?",
          "Utilisez-vous quelque fois l’humour, ou le cynisme dans vos interactions",
          "Avez-vous la capacité à rester optimiste en situation dégradée",
          "Voyez-vous le conflit comme une opportunité ?",
          "Analysez-vous votre rôle dans le conflit ?",
          "Utilisez-vous des solutions innovantes ou créative pour résoudre les conflits ?",
          "Partagez-vous vos émotions pendant un conflit ?",
          "Répondez-vous de manière appropriée aux émotions des autres ?",
          "Souhaitez-vous rendre la pareille à autrui si on vous blesse ou fait du tort ?",
          "Trouvez-vous des solutions satisfaisantes pour tous ?",
        ],
      },
      {
        id: "u18ckyczskXpvLmQ9wCV", // Replace with the actual Firestore document ID
        categorie: "Communication",
        questions: [
          "Atteignez-vous vos objectifs de lors de vos communications orales ?",
          "Écoutez-vous attentivement l’autre pour comprendre ce qu’il/elle dit",
          "Avez-vous tendance à déjà préparer une réponse lorsque quelqu’un vous parle ?",
          "Posez-vous des questions ouvertes pour mieux comprendre ?",
          "Communiquez-vous oralement sur les détails d'une situation ?",
          "Demandez-vous régulièrement du feedback ?",
          "Partagez-vous honnêtement votre ressenti d’une situation ?",
          "Communiquez-vous clairement, par écrit ce que vous voulez dire ?",
          "Gérez-vous efficacement votre stress, anxiété ou colère lors d’une conversation difficile ?",
        ],
      },
      {
        id: "wClgeAd1l2hqzfw5l4aV", // Replace with the actual Firestore document ID
        categorie: "Vous-même, aujourd’hui",
        questions: [
          "Votre bien-être physique",
          "Votre bien-être mental/émotionnel",
          "Votre bien-être spirituel - le but ou le sens de votre vie",
          "La qualité du regard et de l’émotion que vous portez et ressentez sur vous-même.",
          "Le sentiment vécu de paix intérieure.",
          "Le sentiment d'épanouissement que vous ressentez",
          "Toute anxiété que vous éprouvez",
          "La qualité de l’image que vous pensez que les autres ont de vous",
          "Toute négativité que vous ressentez",
          "Le degré d’adversité que vous avez rencontré dans votre vie",
          "Toute tendance à ruminer les problèmes",
          "Vous, par rapport à la personne que vous souhaiteriez être",
          "Votre cohérence dans la prise de décisions personnelles",
          "La qualité de votre vie privée",
          "Vos efforts pour atteindre une complétude personnelle",
          "Votre adaptabilité aux nouvelles technologies",
        ],
      },
    ];

    try {
      for (const category of categories) {
        const categoryDocRef = doc(db, "questions", category.id); // Update "yourCollectionName" with your actual collection name

        await updateDoc(categoryDocRef, {
          categorie: category.categorie,
          questions: category.questions,
        });

        console.log(`Document ${category.id} updated successfully.`);
      }
    } catch (error) {
      console.error("Error updating documents: ", error);
    }
  };

  // Use this in a useEffect in your component
  useEffect(() => {
    updateFirestoreWithCategories();
  }, []);
 */

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

    const queryText = searchQuery; // searchQuery.toLowerCase();

    try {
      // Requêtes de recherche insensibles à la casse
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
        console.error("Error deleting user: ", error);
      }
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
              className=""
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
              {/*  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Card.Link href="#" style={{ textDecoration: "underline" }}>
                  Pagination ici ..
                </Card.Link>
              </div> */}
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

export default User;
