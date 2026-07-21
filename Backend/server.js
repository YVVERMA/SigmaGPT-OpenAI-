import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// app.post("/test", async (req, res) => {
//   try { 
//     const { message } = req.body;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: message,
//     });

//     res.send(response.text);

//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err.message);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);  
    console.log("✅ Connected to Database!");
  } catch (err) {
    console.error("❌ Failed to connect with Database");
    console.error(err);
    process.exit(1); 
  } 
};
 