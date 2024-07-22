import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";

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
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
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

const Autocomplete = ({ suggestions, placeholder, onSelection }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    if (userInput === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [userInput]);

  const handleChange = (e) => {
    const userInput = e.target.value;
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setUserInput(userInput);
    setFilteredSuggestions(filteredSuggestions);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const handleClick = (e) => {
    setFilteredSuggestions([]);
    setUserInput(e.currentTarget.innerText);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    onSelection(e.currentTarget.innerText);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // enter key
      setUserInput(filteredSuggestions[activeSuggestionIndex]);
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
      onSelection(filteredSuggestions[activeSuggestionIndex]);
    } else if (e.keyCode === 38) {
      // up arrow key
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.keyCode === 40) {
      // down arrow key
      if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          let className;
          if (index === activeSuggestionIndex) {
            className = "suggestion-active";
          }
          return (
            <li
              className={className}
              style={styles.suggestion}
              key={suggestion}
              onClick={handleClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions">
        <em>Aucune suggestion, continuez de taper</em>
      </div>
    );
  };

  return (
    <div style={styles.autocomplete}>
      <FormControl
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={userInput}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby="basic-addon2"
        style={styles.input}
      />
      {showSuggestions && userInput && <SuggestionsListComponent />}
    </div>
  );
};

export default Autocomplete;
