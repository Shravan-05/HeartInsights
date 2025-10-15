
const mongoose = require("mongoose");

const bulkPredictionModel = new mongoose.Schema({
  DoctorId: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  high: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  low: { type: Number, default: 0 },
  predictions: [
    {
      patientId: String,
      result: String,
      riskLevel: String,
    },
  ],
  uploadedAt: { type: Date, default: Date.now },
});

const BulkPredictionModel = mongoose.model("BulkPredictionModel", bulkPredictionModel);

module.exports = BulkPredictionModel;
