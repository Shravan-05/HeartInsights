import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../STYLE/SinglePredictionOutput.css";

const SinglePredictionOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="result-container">
        <p className="result-text">
          No result found. Please make a prediction first.
        </p>
        <button
          onClick={() => navigate("/Prediction")}
          className="result-button"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h2 className="result-title">Prediction Result</h2>

      {/* ✅ Show Patient ID only if available */}
      {result.patientId && (
        <p className="result-text">
          <span>Patient ID:</span> {result.patientId}
        </p>
      )}

      <p className="result-text">
        <span>Prediction:</span>{" "}
        {result.prediction === 1 ? (
          <span className="high-risk">High Risk</span>
        ) : (
          <span className="low-risk">Low Risk</span>
        )}
      </p>

      <p className="result-text">
        <span>Risk Score:</span> {result.riskScore}%
      </p>

      <p className="result-text">
        <span>Suggestion:</span> {result.suggestion}
      </p>

      {result.mostImpactedFeaturesGraph && (
        <div className="graph-section">
          <h3 className="graph-title">Most Impacted Features</h3>
          <img
            src={`data:image/png;base64,${result.mostImpactedFeaturesGraph}`}
            alt="Impact Graph"
            className="graph-img"
          />
        </div>
      )}

      <button onClick={() => navigate("/Prediction")} className="result-button">
        Predict Again
      </button>
    </div>
  );
};

export default SinglePredictionOutput;
