import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import CustomCheckbox from "./CustomCheckBox"; // Assurez-vous d'importer votre checkbox personnalisée

const Step1 = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="firstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="lastName">
            <Form.Label>Nom de famille</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre nom de famille"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="birthDate">
            <Form.Label>Date de naissance</Form.Label>
            <Form.Control
              type="date"
              placeholder="JJ-MM-AAAA"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Label>Genre</Form.Label>
          <Row className="mb-3">
            <Col>
              <Row className="mb-3">
                <Col md={4}>
                  <CustomCheckbox
                    label="Féminin"
                    id="gender1"
                    value="feminin"
                    checked={formData.gender === "feminin"}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={4}>
                  <CustomCheckbox
                    label="Masculin"
                    id="gender2"
                    value="masculin"
                    checked={formData.gender === "masculin"}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <CustomCheckbox
                label="Autre"
                id="gender3"
                value="autre"
                checked={formData.gender === "autre"}
                onChange={handleChange}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="phone">
            <Form.Label>Numéro de téléphone</Form.Label>
            <InputGroup>
              <Form.Select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                aria-label="Sélectionner l'indicatif"
                style={{
                  maxWidth: "90px",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                  borderRight: "none",
                  display: "flex",
                  alignItems: "center",
                }}>
                <option value="+33">+33</option>
                <option value="+32">+32</option>
                <option value="+41">+41</option>
                <option value="+44">+44</option>
                {/* Ajouter d'autres options ici */}
              </Form.Select>
              <Form.Control
                type="text"
                placeholder="Entrez votre numéro de téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="countryOfOrigin">
            <Form.Label>Pays d'origine</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre pays d'origine"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="countryOfActivity">
            <Form.Label>Pays d'activité</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre pays d'activité"
              name="countryOfActivity"
              value={formData.countryOfActivity}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Step1;
