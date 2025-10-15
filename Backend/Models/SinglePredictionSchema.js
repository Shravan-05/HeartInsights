const mongoose = require("mongoose");

const SinglePredictionSchema = new mongoose.Schema(
  {
    userId:{type:String},
    PatientId: { type: String, required: true },
    Age: Number,
    Sex: String,
    ChestPainType: String,
    RestingBP: Number,
    Cholesterol: Number,
    FastingBS: Number,
    RestingECG: String,
    MaxHR: Number,
    ExerciseAngina: String,
    Oldpeak: Number,
    ST_Slope: String,
    Prediction: Number,
    RiskLevel: String,
    RiskScore: Number,
    most_impacted_features_graph:String
  },
  { timestamps: true }
);

module.exports = mongoose.model("SinglePrediction", SinglePredictionSchema);
