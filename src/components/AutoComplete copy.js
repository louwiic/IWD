import React, { useState } from "react";

const Autocomplete = ({ suggestions, placeholder = "Type to search..." }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const userInput = e.target.value;
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setInputValue(e.target.value);
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleClick = (suggestion) => {
    setInputValue(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const styles = {
    autocomplete: {
      position: "relative",
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#212529",
      backgroundColor: "#fff",
      backgroundClip: "padding-box",
      border: "1px solid #ced4da",
      borderRadius: "0.25rem",
      transition:
        "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    },
    suggestionsList: {
      position: "absolute",
      top: "100%",
      left: "0",
      width: "100%",
      border: "1px solid #ced4da",
      borderTop: "none",
      backgroundColor: "#fff",
      maxHeight: "150px",
      overflowY: "auto",
      zIndex: 10,
      listStyleType: "none",
      padding: 0,
      margin: 0,
    },
    suggestion: {
      padding: "8px",
      cursor: "pointer",
    },
    suggestionHover: {
      backgroundColor: "#f0f0f0",
    },
  };

  return (
    <div style={styles.autocomplete}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={styles.input}
      />
      {showSuggestions && inputValue && (
        <ul style={styles.suggestionsList}>
          {filteredSuggestions.length ? (
            filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                style={styles.suggestion}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    styles.suggestionHover.backgroundColor)
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "")}
                onClick={() => handleClick(suggestion)}>
                {suggestion}
              </li>
            ))
          ) : (
            <li style={styles.suggestion}>No suggestions available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
