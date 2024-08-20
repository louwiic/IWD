import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import CustomCheckbox from "./CustomCheckBox";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Assurez-vous que le chemin vers firebase est correct
import Autocomplete from "components/AutoComplete";

const Step2 = ({ formData, setFormData }) => {
  const [isPartOfCompany, setIsPartOfCompany] = useState(false);
  const [isPersonalQuestionnaire, setIsPersonalQuestionnaire] = useState(false);
  const [companies, setCompanies] = useState([]); // Liste des entreprises

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "companies"));
        const companiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().companyName,
        }));
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      }
    };

    fetchCompanies();
  }, []);

  const handlePartOfCompanyChange = () => {
    setIsPartOfCompany(true);
    setIsPersonalQuestionnaire(false);
    setFormData((prevData) => ({
      ...prevData,
      partOfCompany: true,
      personalQuestionnaire: false,
    }));
  };

  const handlePersonalQuestionnaireChange = () => {
    setIsPartOfCompany(false);
    setIsPersonalQuestionnaire(true);
    setFormData((prevData) => ({
      ...prevData,
      partOfCompany: false,
      personalQuestionnaire: true,
    }));
  };

  const handleCompanySelection = (value) => {
    const selectedCompany = companies.find((company) => company.name === value);
    console.log(" *** selectedCompany ***", selectedCompany);
    setFormData((prevData) => ({
      ...prevData,
      companyName: value,
      companyId: selectedCompany ? selectedCompany.id : "",
    }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group
            controlId="partOfCompany"
            className="d-flex align-items-center">
            <CustomCheckbox
              label="Je fais partie d'une entreprise"
              id="partOfCompany"
              name="partOfCompany"
              value="partOfCompany"
              checked={isPartOfCompany}
              onChange={handlePartOfCompanyChange}
            />
          </Form.Group>
          <Form.Group
            controlId="personalQuestionnaire"
            className="d-flex align-items-center">
            <CustomCheckbox
              label="Je passe le questionnaire à titre personnel"
              id="personalQuestionnaire"
              name="personalQuestionnaire"
              value="personalQuestionnaire"
              checked={isPersonalQuestionnaire}
              onChange={handlePersonalQuestionnaireChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {isPartOfCompany && (
        <>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="companyName">
                <Form.Label>Tapez le nom de votre entreprise</Form.Label>
                <Autocomplete
                  suggestions={companies.map((company) => company.name)}
                  placeholder={"Ex: SNCF"}
                  onSelection={handleCompanySelection}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <Form.Group controlId="businessUnit">
                <Form.Label>Business Unit</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Business Unit"
                  name="businessUnit"
                  value={formData.businessUnit}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      businessUnit: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
    </Form>
  );
};

export default Step2;
