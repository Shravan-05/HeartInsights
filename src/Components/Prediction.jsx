import React, { useState, useRef } from "react";
import "../STYLE/Prediction.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Heartpredictcontext from "../Context/hearpredictcontext";
import Inputinfo from "./Inputinfo";

const Prediction = (props) => {
  const [activeTab, setActiveTab] = useState("single");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
const context=useContext(Heartpredictcontext);
  const fileInputRef = useRef(null);
  const {  authToken} = context;

  const [formData, setFormData] = useState({
    patientId: "",
    age: "",
    sex: "",
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBS: "",
    restingECG: "",
    maxHR: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "Flat",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.age || formData.age <= 0) return "Age is required";
    if (!formData.sex) return "Sex is required";
    if (!formData.chestPainType) return "Chest Pain Type is required";
    if (!formData.restingBP) return "Resting Blood Pressure is required";
    if (!formData.cholesterol) return "Cholesterol is required";
    if (!formData.fastingBS) return "Fasting Blood Sugar is required";
    if (!formData.restingECG) return "Resting ECG Result is required";
    if (!formData.maxHR) return "Maximum Heart Rate is required";
    if (!formData.exerciseAngina) return "Exercise Induced Angina is required";
    if (formData.oldpeak === "" || formData.oldpeak === null)
      return "Oldpeak value is required";
    return null;
  };

 
const handleSinglePrediction = async () => {
  const error = validateForm();
  if (error) {
    props.setpopupfun({ msg: error, type: "danger" });
    return;
  }

  const payload = {
  PatientID: formData.patientId || null,
  Age: formData.age,
  Sex: formData.sex === "Male" ? "M" : "F",

  ChestPainType:
    formData.chestPainType === "Chest pain during exercise"
      ? "TA"
      : formData.chestPainType === "Unusual chest pain"
      ? "ATA"
      : formData.chestPainType === "Pain not related to heart"
      ? "NAP"
      : "ASY",

  RestingBP: formData.restingBP,
  Cholesterol: formData.cholesterol,
  FastingBS: formData.fastingBS === "Yes" ? 1 : 0,

  RestingECG:
    formData.restingECG === "Normal"
      ? "Normal"
      : formData.restingECG === "Minor problem in ECG"
      ? "ST"
      : "LVH",

  MaxHR: formData.maxHR,
  ExerciseAngina: formData.exerciseAngina === "Yes" ? "Y" : "N",
  Oldpeak: formData.oldpeak,

  ST_Slope:
    formData.stSlope === "Up"
      ? "Up"
      : formData.stSlope === "Flat"
      ? "Flat"
      : "Down",
};


  try {
    const response = await fetch("http://127.0.0.1:5000/predict/single", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),

    });
        const result = await response.json();
        const combinedData = { ...payload, ...result };
const response1 = await fetch("http://localhost:5000/api/single/save", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // ✅ must specify JSON
    "auth-token": authToken,
  },
  body: JSON.stringify(combinedData), // ✅ convert object to JSON string
});

    navigate("/SinglePredictionOutput", { state: { result } });
    console.log("combineddata:",combinedData);

    if (!response.ok) {
      throw new Error(result.error || "An error occurred on the server.");
    }

    props.setpopupfun({
      msg: `Prediction: ${result.suggestion}. Risk score: ${result.riskScore}%`,
      type: "success",
    });
  } catch (err) {
    console.error("API call failed:", err);
    props.setpopupfun({ msg: err.message, type: "danger" });
  }
};

// Batch CSV upload
// Batch CSV upload
const processCSV = async (file) => {
  if (!file) return;

  setIsProcessing(true);
  setProgress(0);

  const uploadData = new FormData();
  uploadData.append("file", file);

  // Simulate progress
  let simulatedProgress = 0;
  const interval = setInterval(() => {
    simulatedProgress += Math.random() * 5;
    if (simulatedProgress >= 95) simulatedProgress = 95;
    setProgress(Math.floor(simulatedProgress));
  }, 200);

  try {
    const response = await fetch("http://localhost:5000/api/bulk/upload", {
      method: "POST",
      headers: {
        "auth-token": authToken,
      },
      body: uploadData,
    });

    clearInterval(interval);
    setIsProcessing(false);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    console.log("Batch upload response:", data);

if (data.pdfUrl) {
  const url = `http://localhost:5000${data.pdfUrl}`;
  // Open the PDF in a new tab
  const newWindow = window.open(url, "_blank");

  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    // Popup blocked
    alert("Please allow popups for this site to view the report.");
  }
}


    props.setpopupfun({
      msg: `Batch processing complete. Your report is downloading.`,
      type: "success",
    });

    console.log("High Risk:", data.high);
    console.log("Medium Risk:", data.medium);
    console.log("Low Risk:", data.low);

  } catch (err) {
    clearInterval(interval);
    setProgress(0);
    console.error("Batch upload failed:", err);
    props.setpopupfun({ msg: err.message, type: "danger" });
  } finally {
    setIsProcessing(false);
  }
};

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processCSV(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processCSV(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
    <div id="predictionmain">
      <h2>Heart Disease Risk Assessment</h2>
      <p className="subtitle">
        Enter your health information to get an AI-powered prediction of your
        cardiovascular risk
      </p>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "single" ? "active" : ""}`}
          onClick={() => setActiveTab("single")}
        >
          🔴 Single Prediction
        </button>

        {(context.role=='doctor')&&
        <button
          className={`tab-btn ${activeTab === "batch" ? "active" : ""}`}
          onClick={() => setActiveTab("batch")}
        >
          📂 Batch Upload
        </button>
}
      </div>
{(context.role == 'Patient' || context.role == 'doctor') && (
  <>
    {/* Single Prediction */}
    {activeTab === "single" && (
      <div id="single" className="form-card active">
        <div className="form-grid">
          <div className="form-group">
            <label>Patient ID (Optional)</label>
            <input
              type="text"
              name="patientId"
              placeholder="Enter patient ID"
              value={formData.patientId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              Age <span>*</span>
            </label>
           <input
  type="number"
  name="age"
  placeholder="Enter your age"
  value={formData.age}
  onChange={handleChange}
  min={1}
  max={100}
/>
 {formData.age && (formData.age < 1 || formData.age > 100) && (
    <span className="error-text">Age must be between 1 and 100</span>
  )}

          </div>
          <div className="form-group">
            <label>
              Gender <span>*</span>
            </label>
            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Choose gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Chest Pain <span>*</span>
            </label>
            <select
              name="chestPainType"
              value={formData.chestPainType}
              onChange={handleChange}
            >
              <option value="">Select type of pain</option>
              <option>Chest pain during exercise</option>
              <option>Unusual chest pain</option>
              <option>Pain not related to heart</option>
              <option>No chest pain</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Blood Pressure (while resting) <span>*</span>
            </label>
            <input
              type="number"
              name="restingBP"
              placeholder="e.g., 120"
              value={formData.restingBP}
              onChange={handleChange}
            />
             {formData.restingBP &&
    (formData.restingBP < 50 || formData.restingBP > 250) && (
      <span className="error-text">
        Blood Pressure must be between 50 and 250
      </span>
    )}
          </div>
          <div className="form-group">
            <label>
              Cholesterol Level <span>*</span>
            </label>
            <input
              type="number"
              name="cholesterol"
              placeholder="e.g., 200"
              value={formData.cholesterol}
              onChange={handleChange}
            />
             {formData.cholesterol &&
    (formData.cholesterol < 100 || formData.cholesterol > 600) && (
      <span className="error-text">
        Cholesterol must be between 100 and 600
      </span>
    )}
          </div>
          <div className="form-group">
            <label>
              High Sugar (above 120 mg/dl) <span>*</span>
            </label>
            <select
              name="fastingBS"
              value={formData.fastingBS}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              ECG Test Result <span>*</span>
            </label>
            <select
              name="restingECG"
              value={formData.restingECG}
              onChange={handleChange}
            >
              <option value="">Select result</option>
              <option>Normal</option>
              <option>Minor problem in ECG</option>
              <option>Thick heart walls (ECG change)</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Highest Heart Rate (while exercising) <span>*</span>
            </label>
            <input
              type="number"
              name="maxHR"
              placeholder="e.g., 150"
              value={formData.maxHR}
              onChange={handleChange}
            />
            {formData.maxHR && (formData.maxHR < 60 || formData.maxHR > 220) && (
    <span className="error-text">
      Heart Rate must be between 60 and 220
    </span>
  )}
          </div>
          <div className="form-group">
            <label>
              Chest Pain During Exercise <span>*</span>
            </label>
            <select
              name="exerciseAngina"
              value={formData.exerciseAngina}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              ST Depression (change in ECG) <span>*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              placeholder="e.g., 1.0"
              value={formData.oldpeak}
              onChange={handleChange}
            />
             {formData.oldpeak && (formData.oldpeak < 0 || formData.oldpeak > 10) && (
    <span className="error-text">
      ST Depression must be between 0 and 10
    </span>
  )}
          </div>
        </div>

        <div className="prediction-footer">
          <div className="disclaimer">
            <span>!</span> <strong>Important:</strong> This tool is for
            educational purposes only. Always consult with your healthcare
            provider.
          </div>
          <button className="btn-primary" onClick={handleSinglePrediction}>
            Predict Risk
          </button>
        </div>
      </div>
    )}
  </>
)}


  { context.role=="doctor"&&
  <>
      {/* Batch Upload */}
      {activeTab === "batch" && (
        <div id="batch" className="form-card active batch-upload-card">
          <h3>Upload CSV File for Batch Predictions</h3>
          <p>
            Upload a CSV file containing multiple patient records for batch
            processing
          </p>

          <label
            className={`upload-box ${dragActive ? "drag-active" : ""}`}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            <strong>Click to upload or drag & drop</strong>
            <p>CSV files only</p>
          </label>

          {isProcessing && (
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          )}

          <div className="csv-requirements">
            <h4>CSV Format Requirements:</h4>
            <ul>
              <li>patientId</li>
              <li>age</li>
              <li>sex</li>
              <li>chestPainType</li>
              <li>restingBP</li>
              <li>cholesterol</li>
              <li>fastingBS</li>
              <li>restingECG</li>
              <li>maxHR</li>
              <li>exerciseAngina</li>
              <li>oldpeak</li>
              <li>stSlope</li>
            </ul>
          </div>
        </div>
      )}
      </>
    }
      <div id="ts">
        <h2>Technical Specifications</h2>
        <p className="subtitle">
          Detailed requirements and capabilities for batch processing
        </p>

        <div className="specs-container">
          <div className="specscard">
            <h3>Supported File Formats</h3>

            <ul>
              <li>CSV files (.csv)</li>

              <li>UTF-8 encoding</li>

              <li>Comma-separated values</li>

              <li>Headers required</li>
            </ul>
          </div>

          <div className="specscard">
            <h3>Required Columns</h3>

            <ul>
              <li>age</li>

              <li>gender</li>

              <li>chestPainType</li>

              <li>restingBP</li>

              <li>cholesterol</li>

              <li>fastingBS</li>

              <li>restingECG</li>

              <li>maxHeartRate</li>

              <li>exerciseAngina</li>
            </ul>
          </div>

          <div className="specscard">
            <h3>Processing Capabilities</h3>

            <ul>
              <li>Up to 10,000 records</li>

              <li>Real-time progress tracking</li>

              <li>Error handling</li>

              <li>Export results</li>
            </ul>
          </div>

          <div className="specscard">
            <h3>Output Features</h3>

            <ul>
              <li>Risk percentage</li>

              <li>Risk level classification</li>

              <li>Confidence scoring</li>

              <li>Batch statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Inputinfo/>
    </>
  );
};

export default Prediction;
