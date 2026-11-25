
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyticsRouter from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Conversational Data Analyst API is running!"
  });
});

app.use("/api/analytics", analyticsRouter);

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
