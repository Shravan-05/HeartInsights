const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const BulkPredictionModel = require("../Models/BulkPredictionModel");
const fetchUser = require("../Middleware/Fetchuser");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const REPORTS_DIR = path.join(__dirname, "../reports");
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR);

router.use("/reports", express.static(REPORTS_DIR));


router.post("/upload", fetchUser, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const doctorId = req.user.id;

    if (!file) return res.status(400).json({ error: "No CSV file uploaded" });
    if (!doctorId) return res.status(400).json({ error: "DoctorId is required" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path), file.originalname);

    const pythonResponse = await axios.post(
      "http://127.0.0.1:5000/predict/batch",
      formData,
      { headers: formData.getHeaders() }
    );

    const data = pythonResponse.data;
    if (data.error) return res.status(500).json({ error: data.error });

    const pdfBuffer = Buffer.from(data.pdfBase64, "base64");
    const timestamp = Date.now();
    const pdfFilename = `report_${timestamp}.pdf`;
    const pdfPath = path.join(REPORTS_DIR, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log("PDF exists:", fs.existsSync(pdfPath), pdfPath);


    const bulkReport = new BulkPredictionModel({
      DoctorId: doctorId,
      pdfUrl: `/reports/${pdfFilename}`, 
      high: data.summary?.high_risk || 0,
      medium: data.summary?.medium_risk || 0,
      low: data.summary?.low_risk || 0,
      predictions: data.patients || [],
    });

    await bulkReport.save();

    fs.unlinkSync(file.path);

    res.json({
      message: "Batch prediction saved successfully",
      pdfUrl: `/reports/${pdfFilename}`,
      high: data.summary?.high_risk || 0,
      medium: data.summary?.medium_risk || 0,
      low: data.summary?.low_risk || 0,
      predictions: data.patients || [],
    });
  } catch (err) {
    console.error("❌ Bulk Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



router.get("/latest", fetchUser, async (req, res) => {
  try {
    const doctorId = req.user.id;
    if (!doctorId) return res.status(400).json({ error: "DoctorId is required" });

    const latestRecord = await BulkPredictionModel.findOne({ DoctorId: doctorId })
      .sort({ uploadedAt: -1 })
      .lean();

    if (!latestRecord) {
      return res.status(404).json({ message: "No records found for this doctor." });
    }

    res.json({
      doctorId: latestRecord.DoctorId,
      pdfUrl: latestRecord.pdfUrl,
      high: latestRecord.high || 0,
      medium: latestRecord.medium || 0, 
      low: latestRecord.low || 0,
      predictions: latestRecord.predictions || [],
      uploadedAt: latestRecord.uploadedAt,
    });
  } catch (err) {
    console.error("❌ Fetch Latest Error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/history", fetchUser, async (req, res) => {
  try {
    const doctorId = req.user.id;
    if (!doctorId) return res.status(400).json({ error: "DoctorId is required" });

    const records = await BulkPredictionModel.find({ DoctorId: doctorId })
      .sort({ uploadedAt: -1 })
      .lean();

    res.json(records || []);
  } catch (err) {
    console.error("❌ Fetch Bulk History Error:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;

