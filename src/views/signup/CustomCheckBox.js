import React from "react";
import "./CustomCheckbox.css";

const CustomCheckbox = ({ label, id, value, checked, onChange }) => {
  return (
    <div className="custom-checkbox">
      <input
        type="radio"
        id={id}
        name="gender"
        value={value}
        checked={checked}
        onChange={onChange}
        className="custom-checkbox-input"
      />
      <label htmlFor={id} className="custom-checkbox-label">
        <span className={`checkmark ${checked ? "checked" : ""}`}>
          {checked && <i className="fas fa-check"></i>}
        </span>
        {label}
      </label>
    </div>
  );
};

export default CustomCheckbox;
