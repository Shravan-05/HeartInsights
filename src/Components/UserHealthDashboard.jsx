import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import ProgressBar from "@ramonak/react-progress-bar";
import * as Homeassests from "../assets/Images";
import "../STYLE/UserHealthDashboard.css";
import { useContext } from "react";
import Heartpredictcontext from "../Context/hearpredictcontext";
const Overallhealthanalysis = () => {
  const [data, setData] = useState(null);
const context=useContext(Heartpredictcontext);
  const {  authToken} = context;
  useEffect(() => {
    Aos.init({ duration: 1200, once: true });

    fetch("http://localhost:5000/api/single/latest", {
  headers: { "auth-token": authToken },
})
  .then(res => res.json())
  .then(latest => {
    if (latest.message) {
      setData(null); 
    } else {
      setData(latest); 
    }
  })
  .catch(err => setData(null));

  }, []);
  console.log(data);
  if (!data)
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
                <h1 id="hdheader">Single Prediction Recenet Summary</h1>

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

  // Parameters for progress bars
  const parameters = {
    restbps: data.RestingBP,
    chol: data.Cholesterol,
    heartrate: data.MaxHR,
    exang: data.ExerciseAngina,
    stdep: parseFloat(data.Oldpeak),
  };

  // Health status logic
  const healthinfo = {
    restbps:
      parameters.restbps < 120
        ? { status: "Low", per: 30, color: "#4caf50" }
        : parameters.restbps < 140
        ? { status: "Medium", per: 60, color: "#ff9800" }
        : { status: "High", per: 90, color: "#f44336" },

    chol:
      parameters.chol < 200
        ? { status: "Low", per: 30, color: "#4caf50" }
        : parameters.chol < 240
        ? { status: "Medium", per: 60, color: "#ff9800" }
        : { status: "High", per: 90, color: "#f44336" },

    heartrate:
      parameters.heartrate >= 150
        ? { status: "Low", per: 30, color: "#4caf50" }
        : parameters.heartrate >= 130
        ? { status: "Medium", per: 60, color: "#ff9800" }
        : { status: "High", per: 90, color: "#f44336" },

    exang:
      parameters.exang === "N" || parameters.exang === "0" || parameters.exang === 0
        ? { status: "Low", per: 30, color: "#4caf50" }
        : { status: "High", per: 90, color: "#f44336" },

    stdep:
      parameters.stdep < 1.0
        ? { status: "Low", per: 30, color: "#4caf50" }
        : parameters.stdep <= 2.0
        ? { status: "Medium", per: 60, color: "#ff9800" }
        : { status: "High", per: 90, color: "#f44336" },
  };

  // Prepare cards
  const healthCards = [
    { name: "Heart Rate", value: parameters.heartrate + " bpm", info: healthinfo.heartrate, icon: Homeassests.heartrate },
    { name: "Cholesterol", value: parameters.chol + " mg/dL", info: healthinfo.chol, icon: Homeassests.cholestral },
    { name: "Blood Pressure", value: parameters.restbps + " mm Hg", info: healthinfo.restbps, icon: Homeassests.bp },
    { name: "ST Depression", value: parameters.stdep, info: healthinfo.stdep, icon: Homeassests.STDepression },
  ];

  const statusPriority = { High: 1, Medium: 2, Low: 3 };
  healthCards.sort((a, b) => statusPriority[a.info.status] - statusPriority[b.info.status]);

  return (
    <div id="hd">
      <div id="hd1">
        <h1 id="hdheader">Real-Time Health Dashboard</h1>
        <p id="hdinfo">
          Monitor your cardiovascular health metrics in real-time with AI-powered insights
        </p>
      </div>

      <div id="hd2">
        {healthCards.map((card, index) => (
          <div
            className="hdcard modern-card"
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            key={index}
          >
            <div className="hdtop">
              <div className="hdtop1">
                <img src={card.icon} alt={card.name} />
                <p>{card.name}</p>
              </div>
              <div className="hadtop2">
                <p style={{ color: card.info.color }}>{card.info.status}</p>
              </div>
            </div>
            <div className="percentage">
              <p>{card.value}</p>
            </div>
            <div className="bar">
              <ProgressBar
                completed={card.info.per}
                bgColor={card.info.color}
                animateOnRender={true}
                height="30px"
                baseBgColor="#e0e0e0"
                labelColor="#000"
                transitionDuration="1s"
                isLabelVisible={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overallhealthanalysis;
