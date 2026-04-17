import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()

app.use("/api/admin" , adminRoutes)
app.use("/api/auth" , authRoutes)
app.use("/api/task" ,taskRoutes )

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
   console.log(`Uploads folder: ${path.join(__dirname, "uploads")}`);
});