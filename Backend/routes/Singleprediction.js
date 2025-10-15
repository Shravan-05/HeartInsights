const express = require("express");
const fetchUser = require("../Middleware/Fetchuser");
const SinglePredictionModel = require("../Models/SinglePredictionSchema");

const router = express.Router();

router.post("/save", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const predictionData = req.body; 
console.log(predictionData.riskLevel);
    if (!predictionData) {
      return res.status(400).json({ error: "Patient data is required" });
    }

    const patientId = predictionData.PatientId || "No";

 const singlePrediction = new SinglePredictionModel({
  userId: userId,
  PatientId: patientId,
  Age: predictionData.Age || null,
  Sex: predictionData.Sex || "Unknown",
  ChestPainType: predictionData.ChestPainType || "Unknown",
  RestingBP: predictionData.RestingBP || 0,
  Cholesterol: predictionData.Cholesterol || 0,
  FastingBS: predictionData.FastingBS || 0,
  RestingECG: predictionData.RestingECG || "Unknown",
  MaxHR: predictionData.MaxHR || 0,
  ExerciseAngina: predictionData.ExerciseAngina || "N",
  Oldpeak: predictionData.Oldpeak || 0,
  ST_Slope: predictionData.ST_Slope || "Unknown",
  Prediction: predictionData.Prediction || 0,
  RiskLevel: predictionData.riskLevel ||'medium',
  RiskScore: predictionData.RiskScore || 0,
  most_impacted_features_graph:predictionData.mostImpactedFeaturesGraph||"unknown"

});

    await singlePrediction.save();

    res.json({ message: "Single prediction saved successfully", data: singlePrediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/latest", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const latestPrediction = await SinglePredictionModel.findOne({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
console.log(latestPrediction);

    if (!latestPrediction) {
      return res.status(404).json({ message: "No single prediction found for this doctor" });
    }

    res.json(latestPrediction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const latestPrediction = await SinglePredictionModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!latestPrediction) {
      return res.status(404).json({ message: "No single prediction found for this doctor" });
    }
    console.log(latestPrediction);

    res.json(latestPrediction||[]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
