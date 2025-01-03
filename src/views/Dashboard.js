import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip as TooltopStrap,
  Toast,
  Spinner,
} from "react-bootstrap";
import { Chart, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import UseChartData from "data/dataSet";
import UseChartData2 from "data/dataSet2";
import CustomRadarController from "components/CustomRadarController";
import CustomRadialLinearScale from "components/CustomRadialLinearScale";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useReactToPrint } from "react-to-print";
const logo = require("../assets/sphera.png");
const share = require("../assets/share.png");
const imprim = require("../assets/imprim.png");
import "./Dashboard.css";
import ActivityTimeline from "./ActivityTimeline";

ChartJS.register(LineElement, PointElement, Filler, Tooltip, Legend);
ChartJS.register(CustomRadarController, CustomRadialLinearScale);

export function formatFirestoreDate(createdAt) {
  // Convertir le timestamp Firestore en millisecondes
  const date = new Date(
    createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
  );

  // Formater la date en DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatISODate(dateString) {
  // Convertir la chaîne de caractères en un objet Date
  const date = new Date(dateString);

  // Formater la date en DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatName(firstName, lastName) {
  // Capitaliser la première lettre du prénom et du nom
  const formattedLastName =
    lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  const formattedFirstNameInitial = firstName.charAt(0).toUpperCase();

  // Combiner les deux pour obtenir le format souhaité
  return `${formattedLastName}.${formattedFirstNameInitial}`;
}

const RadarLabel = ({ top, left, right, bottom, labelText, colorText }) => (
  <div
    style={{
      position: "absolute",
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      fontWeight: "bold",
      fontSize: "14px",
      padding: "4px",
      borderRadius: "4px",
      whiteSpace: "nowrap",
      textAlign: "center",
      color: colorText ?? "#000",
    }}>
    {labelText}
  </div>
);

const DashboardForward = React.forwardRef((props, ref) => {
  const {
    handlePrint,
    isPrinting, // Ajoutez cette prop
  } = props;

  const chartRef = useRef();
  const { chartData2 } = UseChartData2();
  const location = useLocation();
  const [userInfos, setUserInfos] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [shared, setShared] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);
  const [shareInfos, setShareInfos] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const { chartData, loading, testData, setDate, setDate2, testDates } =
    UseChartData();
  const role = localStorage.getItem("role");
  const userIdStorage = localStorage.getItem("userIdStorage");

  const activities = useMemo(
    () => {
      if (!!!userInfos) return [];
      return [
        {
          icon: "share",
          text: `Résultats partagés à ${formatName(
            userInfos?.lastName,
            userInfos?.firstName
          )}`,
          date: testData?.[0]?.sharedDate
            ? formatFirestoreDate(testData?.[0]?.sharedDate)
            : "-",
        },
        {
          icon: "check",
          text: `${formatName(
            userInfos?.lastName,
            userInfos?.firstName
          )} a terminé le test`,
          date: !selectedDate ? "-" : formatISODate(selectedDate),
        },
        {
          icon: "calendar",
          text: `Création du compte ${formatName(
            userInfos?.lastName,
            userInfos?.firstName
          )}`,
          date: formatISODate(userInfos?.createdAt),
        },
      ];
    },
    [userInfos, testData?.[0]],
    shared
  );

  const fetchUser = async (idUser) => {
    setLoadingUser(true);
    try {
      const userDoc = await getDoc(doc(db, "users", idUser));
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        setUserInfos(userData);
      } else {
        console.error("No such user!");
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    setShared(testData?.[0]?.sharedState);
  }, [testData?.[0]?.sharedState]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idUser = params.get("userId");
    if (idUser) {
      fetchUser(idUser);
    } else {
      fetchUser(userIdStorage);
    }
  }, [location]);

  useEffect(() => {
    if (testData?.length > 0 && !selectedDate) {
      setSelectedDate(testData[0]?.testDate);
      handleCheckTestIsAlreadyShared(testData[0]?.testDate);
      setDate(testData[0]?.testDate);
    }
  }, [testData]);

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setDate(newDate);
    handleCheckTestIsAlreadyShared(newDate);
  };

  const handleCheckTestIsAlreadyShared = async (newDate: string) => {
    const formattedDate = new Date(newDate).toISOString();

    try {
      const testCollection = collection(db, "UserTests");
      // Requête pour vérifier la date et l'état de partage
      const q = query(
        testCollection,
        where("testDate", "==", formattedDate),
        where("sharedState", "==", false) // Assurez-vous que `sharedState` est le champ correct pour l'état de partage
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let string = `Envoyer les résultats du questionnaire du ${formatISODate(
          newDate
        )}`;
        return setShareInfos(string);
      }
      setShareInfos("Ne plus envoyer les résultats");
    } catch (error) {
      console.error("Error checking tests:", error);
    }
  };

  const handleDateChange2 = (e) => {
    const newDate = e.target.value;
    setSelectedDate2(newDate);
    setDate2(newDate);
  };

  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ordre: doc.data().ordre || 0, // Ajouter un ordre par défaut
        ...doc.data(),
      }));
      console.log("questionsData", questionsData);
      // Trier les catégories par ordre
      const sortedQuestions = questionsData.sort((a, b) => a.ordre - b.ordre);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const filteredChartData = testData?.find(
    (test) => test.testDate === selectedDate
  );

  const createLabelFunction = (data) => {
    return function (context) {
      let label = "";
      const dataIndex = context?.dataIndex;
      label += context?.raw + " : ";

      // Accéder aux questions depuis data.datasets[0].questions
      const questions = data?.datasets?.[0]?.questions;
      if (Array.isArray(questions) && questions.length > dataIndex) {
        // Utiliser directement l'index pour accéder à la question
        label += questions[dataIndex];
      } else {
        label += "Données non disponibles";
      }

      return label;
    };
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 9,
        type: "derivedRadialLinearScale",
        ticks: {
          display: false,
        },
        angleLines: {
          display: true,
          borderDashOffset: 5,
          lineWidth: 1,
        },
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        gridLines: {
          color: ["red", "orange"],
        },
        pointLabels: {
          padding: 10,
          font: {
            size: 10,
            weight: "600",
          },
          color: "#37474f",
          backdropPadding: 2,
          borderRadius: 4,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 10,
        borderJoinStyle: "round",
        borderCapStyle: "round",
      },
      point: {
        pointStyle: "circle",
        borderColor: "rgba(255,255,255,0.1)",
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "left",
        labels: {
          padding: 20, // Ajoute un padding de 20 pixels autour des éléments de la légende
          usePointStyle: true, // Utiliser les styles de point dans la légende
        },
      },
      area: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
      },
      tooltip: {
        callbacks: {
          label: createLabelFunction(chartData || []),
        },
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
      },
    },
  };

  if (loading || loadingUser) {
    return (
      <Container
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <span>Chargement...</span>
      </Container>
    );
  }

  const handleShare = async () => {
    const testId = testData[0].id;
    try {
      const newSharedState = !shared;
      setShared(newSharedState);
      const docRef = doc(db, "UserTests", testId);
      // Mettre à jour le document avec le nouvel état partagé et la date de partage
      await updateDoc(docRef, {
        sharedState: newSharedState,
        sharedDate: newSharedState ? serverTimestamp() : null, // Si partagé, mettre la date actuelle, sinon la supprimer
      });

      setToastVariant("success");
      setToastMessage("Les résultats ont bien été partagée");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleSendTest = async () => {
    try {
      if (!!userInfos?.newTestSended) {
        const confirmUpdate = window.confirm(
          "Un test a déjà été envoyé. En cliquant sur 'Oui', cela modifiera la date d'envoi du test précédent. Voulez-vous continuer ?"
        );

        if (!confirmUpdate) {
          return; // Si l'utilisateur clique sur "Non", on arrête l'exécution de la fonction
        }
      }

      const userRef = doc(db, "users", userInfos.id);
      await updateDoc(userRef, {
        newTestSended: new Date().toISOString(),
      });

      setUnlocked(true);
      setToastVariant("success");
      setToastMessage("Le test a bien été mis à jour et envoyé.");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating document in users: ", error);
      // Optionnel : Gérer l'erreur (affichage d'un message d'erreur, etc.)
    }
  };

  return (
    <div className="print-container" ref={ref}>
      <Container fluid>
        {role === "admin" && (
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              padding: 6,
              backgroundColor:
                unlocked || userInfos?.newTestSended ? "#4CAF50" : "#f07167", // Changement de couleur ici
              marginBottom: 30,
              alignSelf: "flex-start",
            }}>
            <text style={{ color: "#fff", fontSize: 14 }}>
              {unlocked || userInfos?.newTestSended
                ? `Questionnaire débloqué`
                : "Questionnaire non débloqué"}
            </text>
          </div>
        )}
        <Col
          md={12}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
          }}>
          <img
            src={logo}
            alt="Insights"
            className="img-fluid"
            style={{ height: "158px" }}
          />
          <div style={{ flex: 1 }}>
            <h1 className="title">
              {userInfos?.firstName} {userInfos?.lastName}
            </h1>
            <span className="subtitle">Sphère représentant vos résultats</span>
          </div>
          {role === "admin" && (
            <div
              style={{
                display: "flex",
                gap: 10,
              }}>
              <Button
                onClick={handleShare}
                variant="secondary"
                style={{
                  borderRadius: 15,
                }}>
                {shareInfos && !shared && (
                  <span style={{ marginRight: 20 }}>{shareInfos}</span>
                )}
                {shared && (
                  <span style={{ marginRight: 20 }}>Résultat envoyé</span>
                )}
                {/*   <img
                  src={share}
                  alt="Insights"
                  className="img-fluid"
                  style={{ height: 32 }}
                /> */}
              </Button>
              <Button
                variant="secondary"
                onClick={handleSendTest}
                style={{
                  borderRadius: 15,
                  borderColor: "#ce9136",
                  color: "#ce9136",
                  fontFamily: "Montserrat",
                }}>
                {unlocked || userInfos?.newTestSended
                  ? `Questionnaire débloqué`
                  : "Débloquer un nouveau questionnaire"}
              </Button>
            </div>
          )}
          <Button
            onClick={handlePrint}
            variant="secondary"
            style={{
              borderRadius: 15,
            }}>
            <img
              src={imprim}
              alt="Insights"
              className="img-fluid"
              style={{ height: 32 }}
            />
          </Button>
        </Col>
        <Row>
          {role === "admin" && (
            <Col md={4} style={{ marginBottom: 20 }}>
              <Button
                variant="secondary"
                onClick={handleSendTest}
                style={{
                  width: "100%",
                  borderColor: "#ce9136",
                  color: "#ce9136",
                  fontFamily: "Montserrat",
                }}>
                {userInfos?.newTestSended
                  ? `Test envoyé le ${formatISODate(userInfos?.newTestSended)}`
                  : "Débloquer le questionnaire"}
              </Button>
            </Col>
          )}
          {/* */}
          {testDates?.length > 0 && (
            <Col md={4} style={{ marginBottom: 20 }}>
              <Form.Select
                style={{
                  height: 42,
                  borderColor: "#ce9136",
                  color: "#ce9136",
                  borderWidth: 2,
                  borderRadius: 4,
                }}
                aria-label="Sélectionnez la date du test "
                onChange={handleDateChange}
                value={selectedDate}>
                {testDates
                  ?.sort((a, b) => new Date(b) - new Date(a))
                  .map((date, index) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
              </Form.Select>
            </Col>
          )}
        </Row>
        <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <span>Dernière sphère:</span>
          <span>
            {testDates?.length > 0
              ? new Date(
                Math.max(...testDates.map((date) => new Date(date)))
              ).toLocaleDateString()
              : "-"}
          </span>
        </div>
        <Row>
          {!chartData || !filteredChartData ? (
            <Col md="12">
              <Card style={{ borderRadius: "4px" }}>
                <Card.Body>
                  <span>
                    Vos résultats ne sont pas encore disponibles.
                  </span>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <Col md="12">
              <Card
                style={{
                  borderRadius: "4px",
                  ...(isPrinting
                    ? {}
                    : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }),
                }}>
                <Card.Body>
                  <div
                    style={{
                      position: "relative",
                      width: 924,
                      height: 1080,
                      paddingTop: 120,

                      // Utilisez une condition pour appliquer ces styles seulement quand on n'imprime pas
                      ...(isPrinting ? {} : {}),
                    }}>
                    <div>
                      <Chart
                        type="radar"
                        options={options}
                        data={
                          filteredChartData
                            ? chartData
                            : { labels: [], datasets: [] }
                        }
                      />
                      <RadarLabel
                        top="340px"
                        left="20px"
                        labelText="Vous-même"
                        colorText={"rgba(50, 226, 185,1)"}
                      />
                      <RadarLabel
                        top="130px"
                        left="320px"
                        labelText="Dans le futur"
                        colorText={"rgba(83, 109, 254, 1)"}
                      />
                      <RadarLabel
                        top="120px"
                        right="230px"
                        labelText="Vous aujourd'hui"
                        colorText={"rgba(150, 50, 226, 1)"}
                      />
                      <RadarLabel
                        top="300px"
                        right="-60px"
                        labelText="Vos valeurs"
                        colorText={"rgba(135, 0, 0, 1)"}
                      />
                      <RadarLabel
                        bottom="450px"
                        right="-120px"
                        labelText="Etat d'esprit"
                        colorText={"rgba(0, 38, 142, 1)"}
                      />
                      <RadarLabel
                        bottom="210px"
                        right="-90px"
                        labelText="Communication"
                        colorText={"rgba(226, 50, 50, 1)"}
                      />
                      <RadarLabel
                        bottom="300px"
                        left="30px"
                        labelText="Résilience"
                        colorText={"rgba(168, 220, 50, 1)"}
                      />
                      <RadarLabel
                        bottom="50px"
                        right="150px"
                        labelText="Confiance"
                        colorText={"rgba(226, 168, 50, 1)"}
                      />
                      <RadarLabel
                        bottom="60px"
                        left="280px"
                        labelText="Conflit"
                        colorText={"rgba(226, 220, 50, 1)"}
                      />
                    </div>
                  </div>
                </Card.Body>
                {role === "admin" && (
                  <div style={{ alignSelf: "stretch" }}>
                    <ActivityTimeline activities={activities} />
                  </div>
                )}
              </Card>
            </Col>
          )}
        </Row>
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
      </Container>
    </div>
  );
});

const Dashboard = () => {
  const componentRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          resolve();
        }, 1300); // Réduit à 1300 ms
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  return (
    <div>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}>
          <Spinner animation="border" variant="light" />
        </div>
      )}
      <DashboardForward
        ref={componentRef}
        handlePrint={handlePrint}
        isPrinting={isPrinting}
      />
    </div>
  );
};

export default Dashboard;
