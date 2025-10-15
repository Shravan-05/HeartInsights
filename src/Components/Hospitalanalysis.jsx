import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "../STYLE/Hospitalanalysis.css";
import { useContext } from "react";
import Heartpredictcontext from "../Context/hearpredictcontext";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Hospitalanalysis = () => {
  const [summary, setSummary] = useState({ high: 0, medium: 0, low: 0 });
const context=useContext(Heartpredictcontext);
  const {  authToken} = context;
  useEffect(() => {
    const fetchLatestRecord = async () => {
      try {
          const response = await fetch("http://localhost:5000/api/bulk/latest", {
        method: "GET",
        headers: {
          "auth-token": authToken,
        },
      });
        const data = await response.json();
        if (data.error) {
          console.error(data.error);
        } else {
          setSummary({
            high: data.high || 0,
            medium: data.medium || 0,
            low: data.low || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch latest record:", err);
      }
    };

    fetchLatestRecord();
  }, []);

console.log(summary);

if (summary.high === 0 && summary.medium === 0 && summary.low === 0)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          backgroundColor: "rgb(252, 252, 250)",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "40px",
          gap: "20px",
          textAlign: "center",
        }}
      >
                <h1 id="hdheader">Bulk Prediction Recenet Summary</h1>

        <img
          src="https://cdnl.iconscout.com/lottie/premium/thumb/heartbeat-animation-download-in-lottie-json-gif-static-svg-file-formats--heartrate-ecg-rate-cardiology-pack-healthcare-medical-animations-4584160.gif"
          alt="Heartbeat Animation"
          style={{ width: "300px", height: "300px", objectFit: "contain" }}
        />
        <p style={{ fontSize: "1.5rem", color: "#555", fontWeight: "500" }}>
          No latest prediction available
        </p>
      </div>
    );


  const totalPatients = summary.high + summary.medium + summary.low;

  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Heart Disease Risk",
        data: [summary.low, summary.medium, summary.high],
        backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } },
      },
      datalabels: {
        color: "#fff",
        formatter: (value) => `${value} Patients`,
        font: { weight: "bold", size: 14 },
      },
    },
  };

  return (
    <div id="hdb">
      <div id="hdbheader">
        <h1>Recent Prediction Summary</h1>
      </div>

      <div id="hdb1">
        <div className="hdbcards danger">
          <h2>High Risk</h2>
          <p>{summary.high} Patients</p>
        </div>

        <div className="hdbcards warning">
          <h2>Medium Risk</h2>
          <p>{summary.medium} Patients</p>
        </div>

        <div className="hdbcards success">
          <h2>Low Risk</h2>
          <p>{summary.low} Patients</p>
        </div>

        <div className="hdbcards blue">
          <h2>Total Patients</h2>
          <p>{totalPatients} Patients</p>
        </div>
      </div>

      <div id="chartContainer">
        <Pie data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default Hospitalanalysis;
