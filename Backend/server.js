// import "dotenv/config";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const response = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents: "What is the diffrence between MERN stack and DSA",
// });

// console.log(response.text);


import express from "express";
import "dotenv/config";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/test", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.send(response.text);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
