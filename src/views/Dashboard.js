import React, { useRef } from "react";
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

var width = 300;
var height = 300;
ChartJS.register(LineElement, PointElement, Filler, Tooltip, Legend);
ChartJS.register(CustomRadarController, CustomRadialLinearScale);

function Dashboard() {
  const chartRef = useRef();
  const { chartData } = UseChartData();
  const { chartData2 } = UseChartData2();

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
  const options = {
    scales: {
      r: {
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
          label: function (context) {
            let label = "";
            const dataIndex = context?.dataIndex;
            label += context?.raw + " : ";
            if (context.label === "Apprentissa") {
              label += `La façon dont vous exploitez votre potentiel de leader`;
            }
            if (context.label === "Amitié") {
              label += `La façon dont vous exploitez votre potentiel de leader`;
            }
            return label;
          },
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
  const options2 = {
    scales: {
      r: {
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
        /* angle: 115,
        suggestedMin: 0,
        suggestedMax: 100, */
        pointLabels: {
          padding: 40,
          font: {
            //family: "Open Sans",
            size: 12,
            weight: "600",
          },
          color: "#37474f",
          backdropColor: bg,
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
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = "";
            const dataIndex = context?.dataIndex;
            label += context?.raw + " : ";
            if (context.label === "Apprentissa") {
              label += `La façon dont vous exploitez votre potentiel de leader`;
            }
            if (context.label === "Amitié") {
              label += `La façon dont vous exploitez votre potentiel de leader`;
            }
            return label;
          },
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

  if (chartData) {
  } else {
    return <></>;
  }

  return (
    <>
      <Container fluid>
        {/*  <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Number</p>
                      <Card.Title as="h4">150GB</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <Card.Title as="h4">$ 1,345</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <Card.Title as="h4">23</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last hour
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Followers</p>
                      <Card.Title as="h4">+45K</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row> */}
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Batonnet Loïc</Card.Title>
                <p className="card-category">24 Hours performance</p>
              </Card.Header>
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
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">2017 Sales</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>
                {/*   <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        [
                          542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756,
                          895,
                        ],
                        [
                          412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636,
                          695,
                        ],
                      ],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div> */}
              </Card.Body>
              <Card.Footer>
                {/* <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Tesla Model S <i className="fas fa-circle text-danger"></i>
                  BMW 5 Series
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                {/* <Card.Title as="h4">Tasks</Card.Title>
                <p className="card-category">Backend development</p> */}
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  {/* <Table>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-488980961">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="TooltopStrap-506045838">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="TooltopStrap-537440761">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-21130535">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Flooded: One year later, assessing what was lost and
                          what was found when a ravaging rain swept through
                          metro Detroit
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-577232198">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-773861645">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Create 4 Invisible User Experiences you Never Knew
                          About
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-422471719">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-829164576">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Read "Following makes Medium better"</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-160575228">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-922981635">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                disabled
                                type="checkbox"></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Unfollow 5 enemies from twitter</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-938342127">
                                Edit Task..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <TooltopStrap id="tooltip-119603706">
                                Remove..
                              </TooltopStrap>
                            }>
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger">
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </Table> */}
                </div>
              </Card.Body>
              <Card.Footer>
                {/*   <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
