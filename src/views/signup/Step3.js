import React, { useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

const Step3 = ({ formData, setFormData, handleNext, handlePrev }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="password">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}>
                <i
                  className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="passwordConfirm">
            <Form.Label>Confirmez le mot de passe</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez le mot de passe"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
              <InputGroup.Text
                onClick={toggleConfirmPasswordVisibility}
                style={{ cursor: "pointer" }}>
                <i
                  className={`fa ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <p style={{ fontStyle: "italic", color: "#666" }}>
            Assurez-vous de sauvegarder vos identifiants pour accéder à votre
            sphère après avoir reçu le feedback de votre coach.
          </p>
        </Col>
      </Row>
    </Form>
  );
};

export default Step3;