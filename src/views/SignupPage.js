import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";

const SignupPage = () => {
  const gradientStyle = {
    background: "linear-gradient(135deg, #7F151A, #CE9136)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  return (
    <Container fluid style={gradientStyle}>
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 0,
        }}>
        <div className="text-right">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot your user ID or password?</a>
          </p>
        </div>
      </div>
      <Row className="w-100 d-flex align-items-center justify-content-center">
        <Col className="d-flex align-items-center justify-content-center">
          <Card
            className="w-100 p-4"
            style={{ maxWidth: "500px", borderRadius: "10px" }}>
            <Card.Body>
              <h2 className="mb-4 text-center">Create an account</h2>
              <p className="text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                lobortis maximus.
              </p>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We will use your email as your user ID.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPhone" className="mt-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" placeholder="Enter phone number" />
                  <Form.Text className="text-muted">
                    We strongly recommend adding a phone number. This will help
                    verify your account and keep it safe.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control type="password" placeholder="Password" />
                    <InputGroup.Text>Hide</InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols.
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="mt-4 w-100"
                  style={{ borderRadius: 30 }}>
                  Sign in
                </Button>
              </Form>
              <div className="mt-3 text-center d-block d-md-none">
                <p>
                  Already have an account? <a href="/login">Log in</a>
                </p>
                <p>
                  <a href="/forgot-password">
                    Forgot your user ID or password?
                  </a>
                </p>
              </div>
              <div className="mt-3 text-center">
                By creating an account, you agree to the{" "}
                <a href="/terms">Terms of use</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
