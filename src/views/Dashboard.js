import React, { useEffect, useRef, useState } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useReactToPrint } from "react-to-print";
const logo = require("../assets/sphera.png");
const share = require("../assets/share.png");
const imprim = require("../assets/imprim.png");
import "./Dashboard.css";

ChartJS.register(LineElement, PointElement, Filler, Tooltip, Legend);
ChartJS.register(CustomRadarController, CustomRadialLinearScale);
const RadarLabel = ({ top, left, right, bottom, labelText }) => (
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
      color: "#000",
    }}>
    {labelText}
  </div>
);

const DashboardForward = React.forwardRef((props, ref) => {
  const {
    handlePrint, // Ajout de la prop handlePrint
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
  const { chartData, loading, testData, setDate, testDates } = UseChartData();
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

  useEffect(() => {
    if (testData?.length > 0 && !selectedDate) {
      setSelectedDate(testData[0]?.testDate);
      setDate(testData[0]?.testDate);
    }
  }, [testData]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setDate(newDate);
  };

  const filteredChartData = testData?.find(
    (test) => test.testDate === selectedDate
  );

  const createLabelFunction = (data) => {
    return function (context) {
      let label = "";
      const dataIndex = context?.dataIndex;
      label += context?.raw + " : ";

      const item = data?.find((d) => d.label === context.label);
      if (item) {
        label += item.text;
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
          label: createLabelFunction(filteredChartData),
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
    <div className="print-container" ref={ref}>
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

        <Col md={12} style={{ marginBottom: 20 }}>
          <Form.Select
            aria-label="Sélectionnez la date du test"
            onChange={handleDateChange}
            value={selectedDate}>
            {testDates?.map((date, index) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Row>
          <Col md="12">
            <Card style={{ borderRadius: "4px" }}>
              <Card.Body>
                <div
                  style={{
                    position: "relative",
                    width: 924,
                    height: 1080,
                    paddingTop: 120,
                  }}>
                  {!chartData || !filteredChartData ? (
                    <span>
                      {userInfos?.lastName} {userInfos?.firstName} n'a pas
                      encore passé de test ou vos tests n'ont pas été partagés
                    </span>
                  ) : (
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
                    </div>
                  )}
                  <RadarLabel top="340px" left="20px" labelText="Vous-même" />
                  <RadarLabel
                    top="130px"
                    left="320px"
                    labelText="Dans le futur"
                  />
                  <RadarLabel
                    top="120px"
                    right="230px"
                    labelText="Vous aujourd'hui"
                  />
                  <RadarLabel
                    top="300px"
                    right="-60px"
                    labelText="Vos valeurs"
                  />
                  <RadarLabel
                    bottom="410px"
                    right="-100px"
                    labelText="Etat d'esprit"
                  />
                  <RadarLabel
                    bottom="160px"
                    right="-70px"
                    labelText="Communication"
                  />
                  <RadarLabel
                    bottom="300px"
                    left="30px"
                    labelText="Résilience"
                  />
                  <RadarLabel
                    bottom="50px"
                    right="150px"
                    labelText="Confiance"
                  />
                  <RadarLabel bottom="60px" left="280px" labelText="Conflit" />
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
    </div>
  );
});

const Dashboard = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <DashboardForward ref={componentRef} handlePrint={handlePrint} />
    </div>
  );
};

export default Dashboard;
