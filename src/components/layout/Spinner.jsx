import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <span className="spinner-text">Tuksa</span>
      </div>
    </div>
  );
};

export default Spinner;