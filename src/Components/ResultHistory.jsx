import React, { useEffect, useState, useContext } from "react";
import '../STYLE/ResultHistory.css';
import { Download } from 'lucide-react';
import Heartpredictcontext from "../Context/hearpredictcontext";

export default function ResultHistory() {
  const { authToken } = useContext(Heartpredictcontext);
  const [singleHistory, setSingleHistory] = useState([]);
  const [bulkHistory, setBulkHistory] = useState([]);
const [modalOpen, setModalOpen] = useState(false);
const [modalImage, setModalImage] = useState("");
const openModal = (imgSrc) => {
  setModalImage(imgSrc);
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
  setModalImage("");
};

  useEffect(() => {
    const fetchSingleHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/single/history", {
          headers: { "auth-token": authToken }
        });
        const data = await res.json();
        if (!data.error) 
          {setSingleHistory(Array.isArray(data) ? data : [data]);
                      console.log("history array",data);
          }
      } catch (err) {
        console.error("Failed to fetch single prediction history:", err);
      }
    };

    const fetchBulkHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bulk/history", {
          headers: { "auth-token": authToken }
        });
        const data = await res.json();
        if (!data.error) {
          const bulkArray = Array.isArray(data) ? data : [data];
          setBulkHistory(bulkArray);
        }
      } catch (err) {
        console.error("Failed to fetch bulk prediction history:", err);
      }
    };

    fetchSingleHistory();
    fetchBulkHistory();
  }, [authToken]);

  return (
    <div className="history-container">
      {/* --- Single Prediction History --- */}
      <div className="history-section">
        <h2>Single Prediction History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Date</th>
              <th>Risk</th>
              <th>Graph</th>
            </tr>
          </thead>
          <tbody>
            {singleHistory.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>No records found</td>
              </tr>
            ) : (
              singleHistory.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.PatientId || "N/A"}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td className={item.RiskLevel=="High"?"high":"low"}>
                    {item.RiskLevel}
                  </td>
                  <td>
                    {item.most_impacted_features_graph ? (
                      <img src={`data:image/png;base64,${item.most_impacted_features_graph}`} alt="Feature Impact" width={120}
                       style={{ cursor: "pointer" }}
  onClick={() => openModal(`data:image/png;base64,${item.most_impacted_features_graph}`)}
                      />
                    ) : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Bulk Prediction History --- */}
      <div className="history-section">
        <h2>Bulk Prediction History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>File Name</th>
              <th>Total Records</th>
              <th>Predicted Positive</th>
              <th>Predicted Negative</th>
              <th>Date</th>
              <th>Download PDF</th>
            </tr>
          </thead>
          <tbody>
            {bulkHistory.length===0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>No records found</td>
              </tr>
            ) : (
              bulkHistory.map((item, idx) => {
                const totalRecords = item.high + item.medium + item.low;
                const predictedPositive = item.high + item.medium;
                const predictedNegative = item.low;

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.fileName || `Report ${idx + 1}`}</td>
                    <td>{totalRecords}</td>
                    <td>{predictedPositive}</td>
                    <td>{predictedNegative}</td>
                    <td>{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <a
                        href={`http://localhost:5000${item.pdfUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        <Download size={16} /> Download
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
       {modalOpen && (
      <div className="modal-overlay" onClick={closeModal}>
        <img className="modal-image" src={modalImage} alt="Full View" />
      </div>
    )}
    </div>
  );
}
