import React, { useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import CustomCheckbox from "./CustomCheckBox";

const phoneCodes = [
  { value: "+1", label: "+1" },
  { value: "+30", label: "+30" }, // Grèce
  { value: "+31", label: "+31" }, // Pays-Bas
  { value: "+32", label: "+32" }, // Belgique
  { value: "+33", label: "+33" }, // France
  { value: "+34", label: "+34" }, // Espagne
  { value: "+35", label: "+35" }, // Malte
  { value: "+351", label: "+351" }, // Portugal
  { value: "+352", label: "+352" }, // Luxembourg
  { value: "+353", label: "+353" }, // Irlande
  { value: "+354", label: "+354" }, // Islande
  { value: "+355", label: "+355" }, // Albanie
  { value: "+356", label: "+356" }, // Malte
  { value: "+357", label: "+357" }, // Chypre
  { value: "+358", label: "+358" }, // Finlande
  { value: "+359", label: "+359" }, // Bulgarie
  { value: "+36", label: "+36" }, // Hongrie
  { value: "+370", label: "+370" }, // Lituanie
  { value: "+371", label: "+371" }, // Lettonie
  { value: "+372", label: "+372" }, // Estonie
  { value: "+373", label: "+373" }, // Moldavie
  { value: "+375", label: "+375" }, // Biélorussie
  { value: "+377", label: "+377" }, // Monaco
  { value: "+378", label: "+378" }, // Saint-Marin
  { value: "+379", label: "+379" }, // Vatican
  { value: "+380", label: "+380" }, // Ukraine
  { value: "+381", label: "+381" }, // Serbie
  { value: "+382", label: "+382" }, // Monténégro
  { value: "+385", label: "+385" }, // Croatie
  { value: "+386", label: "+386" }, // Slovénie
  { value: "+387", label: "+387" }, // Bosnie-Herzégovine
  { value: "+389", label: "+389" }, // Macédoine du Nord
  { value: "+39", label: "+39" }, // Italie
  { value: "+40", label: "+40" }, // Roumanie
  { value: "+41", label: "+41" }, // Suisse
  { value: "+420", label: "+420" }, // République tchèque
  { value: "+421", label: "+421" }, // Slovaquie
  { value: "+423", label: "+423" }, // Liechtenstein
  { value: "+43", label: "+43" }, // Autriche
  { value: "+44", label: "+44" }, // Royaume-Uni
  { value: "+45", label: "+45" }, // Danemark
  { value: "+46", label: "+46" }, // Suède
  { value: "+47", label: "+47" }, // Norvège
  { value: "+48", label: "+48" }, // Pologne
  { value: "+49", label: "+49" }, // Allemagne
  { value: "+262", label: "+262" }, // La Réunion, Mayotte
  { value: "+508", label: "+508" }, // Saint-Pierre-et-Miquelon
  { value: "+590", label: "+590" }, // Guadeloupe, Saint-Barthélemy, Saint-Martin
  { value: "+594", label: "+594" }, // Guyane française
  { value: "+596", label: "+596" }, // Martinique
  { value: "+687", label: "+687" }, // Nouvelle-Calédonie
  { value: "+689", label: "+689" }, // Polynésie française
  { value: "+681", label: "+681" }, // Wallis-et-Futuna
  { value: "+262", label: "+262" }, // Mayotte
];

const Step1 = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Vérifie si le champ est un champ de texte qui doit être en majuscules
    const newValue =
      name === "firstName" ||
      name === "lastName" ||
      name === "countryOfOrigin" ||
      name === "countryOfActivity" // Ajout de countryOfActivity
        ? value.toUpperCase()
        : value;

    // Met à jour les données du formulaire
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));

    // Invalide l'erreur si le champ est rempli
    if (newValue) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }

    // Validation des champs obligatoires
    if (
      name === "firstName" ||
      name === "lastName" ||
      name === "countryOfOrigin"
    ) {
      if (!newValue) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${
            name === "firstName"
              ? "Prénom"
              : name === "lastName"
              ? "Nom de famille"
              : "Pays d'origine"
          } est requis.`,
        }));
      }
    }
  };

  // Ajout de la validation initiale pour les champs requis
  useEffect(() => {
    if (!formData.firstName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "Prénom est requis.",
      }));
    }
    if (!formData.lastName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Nom de famille est requis.",
      }));
    }
    if (!formData.countryOfOrigin) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        countryOfOrigin: "Pays d'origine est requis.",
      }));
    }
  }, [formData]);

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
              onChange={handleChange} // Utilisation directe de handleChange
              isInvalid={!!errors.firstName}
              onFocus={() =>
                setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }))
              } // Réinitialise l'erreur au focus
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
              onChange={handleChange} // Utilisation directe de handleChange
              isInvalid={!!errors.lastName}
              onFocus={() =>
                setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }))
              } // Réinitialise l'erreur au focus
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
              onChange={handleChange} // Utilisation directe de handleChange sans modification
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
                {phoneCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
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
              onChange={handleChange} // Utilisation directe de handleChange
              isInvalid={!!errors.countryOfOrigin}
              onFocus={() =>
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  countryOfOrigin: "",
                }))
              } // Réinitialise l'erreur au focus
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
