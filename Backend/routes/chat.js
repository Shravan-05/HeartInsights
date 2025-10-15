const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const router = express.Router();

console.log("API Key:", process.env.GOOGLE_GENAI_API_KEY ? "Loaded ✅" : "Missing ❌");


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

router.post("/chatbot", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
You are a helpful AI assistant specialized in heart health. 
Give **short, clear, and practical advice** related to:
- Heart disease symptoms
- Prevention tips
- Healthy lifestyle and fitness
Keep your response concise (1-2 sentences max).
User asked: "${message}"
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const reply = response.text();

    console.log("AI reply:", reply);
    res.json({ reply });
    
  } catch (err) {
    console.error("GenAI Error:", err);
    res.status(500).json({ reply: "An error occurred while communicating with the AI." });
  }
});

module.exports = router;

