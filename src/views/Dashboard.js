import React, { useEffect, useRef, useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
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
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
const logo = require("../assets/sphera.png");
const share = require("../assets/share.png");
const imprim = require("../assets/imprim.png");

var width = 300;
var height = 300;
ChartJS.register(LineElement, PointElement, Filler, Tooltip, Legend);
ChartJS.register(CustomRadarController, CustomRadialLinearScale);

function Dashboard() {
  const chartRef = useRef();
  const { chartData2 } = UseChartData2();
  const location = useLocation();
  const [userInfos, setUserInfos] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [shared, setShared] = useState(false);
  const { chartData, loading, testData } = UseChartData();
  const role = localStorage.getItem("role");
  const userIdStorage = localStorage.getItem("userIdStorage");

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

  const bg = [
    ...Array(6).fill("rgba(150, 50, 226, 0.3)"),
    ...Array(12).fill("rgba(135, 0, 0, 0.3)"),
    ...Array(9).fill("rgba(0, 38, 142,0.2)"),
    ...Array(8).fill("rgba(226, 50, 50,0.2)"),
    ...Array(9).fill("rgba(226, 168, 50,0.3)"),
    ...Array(9).fill("rgba(226, 220, 50,0.2)"),
    ...Array(9).fill("rgba(168, 220, 50,0.3)"),
    ...Array(16).fill("rgba(50, 226, 185,0.4)"),
    ...Array(7).fill("rgba(50, 220, 226,0.2)"),
  ];

  const createLabelFunction = (data) => {
    return function (context) {
      let label = "";
      const dataIndex = context?.dataIndex;
      label += context?.raw + " : ";

      const item = data.find((d) => d.label === context.label);
      if (item) {
        label += item.text;
      }

      return label;
    };
  };

  // Exemple d'utilisation
  const data = [
    {
      label: "Apprentissa",
      text: "La façon dont vous exploitez votre potentiel de leader",
    },
    {
      label: "Amitié",
      text: "La façon dont vous exploitez votre potentiel de leader",
    },
    {
      label: "Courage",
      text: "La façon dont vous exploitez votre potentiel de leader",
    },
    // Ajoutez d'autres objets {label, text} ici
  ];

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
          /* borderDash: [11, 10], */
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
            //family: "Open Sans",
            size: 10,
            weight: "600",
          },
          color: "#37474f",
          //backdropColor: bg,
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
      },
      area: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
      },
      tooltip: {
        callbacks: {
          label: createLabelFunction(data),
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

  if (loading || (loadingUser && !!!userInfos)) {
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

  if (!chartData) {
    return (
      <Container
        fluid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <span>
          {userInfos?.lastName} {userInfos?.firstName} n'a pas encore passé de
          test ou vos tests n'ont pas été partagés
        </span>
      </Container>
    );
  }

  const handleShare = async () => {
    const testId = testData[0].id;
    try {
      setShared(!shared);
      const docRef = doc(db, "UserTests", testId);
      await updateDoc(docRef, { sharedState: !shared });
      setToastVariant("success");
      setToastMessage("La sphére a bien été partagé");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <>
      <Container fluid>
        {role === "admin" && (
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              padding: 6,
              backgroundColor: shared ? "#b0c4b1" : "#f07167",
              marginBottom: 30,
              alignSelf: "flex-start",
            }}>
            <text style={{ color: "#fff", fontSize: 14 }}>
              {shared ? "Résultat partagé" : "Résultat non partagé"}
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
              {userInfos?.lastName} {userInfos?.firstName}
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
                variant="secondary"
                style={{
                  borderRadius: 15,
                }}>
                <img
                  onClick={handleShare}
                  src={share}
                  alt="Insights"
                  className="img-fluid"
                  style={{ height: 32 }}
                />
              </Button>
            </div>
          )}
          <Button
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
          <Col md="12">
            <Card style={{ borderRadius: "4px" }}>
              <Card.Body>
                <div
                  style={{
                    position: "relative",
                    height: 920,
                    width: 1024,
                  }}>
                  {/*  <div
                    style={{
                      position: "absolute",
                      top: 80,
                      left: 220,
                      height: 40,
                      width: 40,
                      backgroundColor: "pink",
                    }}></div>
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 400,
                      height: 40,
                      width: 40,
                      backgroundColor: "pink",
                    }}></div>
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 400,
                      height: 40,
                      width: 40,
                      backgroundColor: "pink",
                    }}></div> */}

                  <Chart type="radar" options={options} data={chartData} />
                </div>
              </Card.Body>
            </Card>
          </Col>
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
    </>
  );
}

export default Dashboard;
