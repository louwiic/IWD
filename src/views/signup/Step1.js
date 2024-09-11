import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import CustomCheckbox from "./CustomCheckBox";

const Step1 = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Met à jour les données du formulaire
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Invalide l'erreur si le champ est rempli
    if (value) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  return (
    <Form>
      <Row className="mb-3" style={{ marginTop: 56 }}>
        <Col md={6}>
          <Form.Group controlId="firstName">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Prénom
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="lastName">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Nom de famille
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre nom de famille"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="birthDate">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Date de naissance
            </Form.Label>
            <Form.Control
              type="date"
              placeholder="JJ-MM-AAAA"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              isInvalid={!!errors.birthDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthDate}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Label
            style={{
              fontWeight: "bolder",
              color: "#000",
              fontFamily: "Montserrat",
            }}>
            Genre
          </Form.Label>
          <Row>
            <Col>
              <Row className="mb-1">
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
              <div style={{ marginTop: "4px" }}>
                <CustomCheckbox
                  label="Autre"
                  id="gender3"
                  value="autre"
                  checked={formData.gender === "autre"}
                  onChange={handleChange}
                />
              </div>
            </Col>
          </Row>
          {errors.gender && (
            <div className="text-danger mt-1">{errors.gender}</div>
          )}
        </Col>
      </Row>

      <Row className="">
        <Col md={12}>
          <Form.Group controlId="email">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group controlId="phone">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Numéro de téléphone
            </Form.Label>
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
              </Form.Select>
              <Form.Control
                type="text"
                placeholder="Entrez votre numéro de téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                style={{
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  display: "flex",
                  alignItems: "center",
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="countryOfOrigin">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Pays d'origine
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre pays d'origine"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              isInvalid={!!errors.countryOfOrigin}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfOrigin}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="countryOfActivity">
            <Form.Label
              style={{
                fontWeight: "bolder",
                color: "#000",
                fontFamily: "Montserrat",
              }}>
              Pays d'activité
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre pays d'activité"
              name="countryOfActivity"
              value={formData.countryOfActivity}
              onChange={handleChange}
              isInvalid={!!errors.countryOfActivity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfActivity}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Step1;
