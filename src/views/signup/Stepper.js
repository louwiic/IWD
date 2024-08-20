import React from "react";
import "./Stepper.css";

const Stepper = ({ currentStep }) => {
  const steps = ["Coordonnées", "Entreprise", "Connexion"];

  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`step ${index <= currentStep ? "completed" : ""}`}>
              <div
                className={`circle ${
                  index <= currentStep ? "circle-completed" : "circle-pending"
                }`}>
                {index <= currentStep ? (
                  <i className="nc-icon nc-check-2" />
                ) : (
                  <i className="nc-icon nc-check-2" />
                )}
              </div>
              <div className="label">{step}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`bar ${index < currentStep ? "filled" : ""}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
