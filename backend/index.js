// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import adminRoutes from "./routes/adminRoutes.js";
// import connectDB from "./config/database.js";
// import authRoutes from "./routes/authRoutes.js";
// import taskRoutes from "./routes/tasks.js";

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// app.use(express.json());
// app.use(cors());

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// connectDB()

// app.use("/api/admin" , adminRoutes)
// app.use("/api/auth" , authRoutes)
// app.use("/api/task" ,taskRoutes )

// app.get("/", (req, res) => {
//   res.send("Backend is running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//    console.log(`Uploads folder: ${path.join(__dirname, "uploads")}`);
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import { initSocket } from "./utils/socket.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/tasks.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import SubscriptionPlan from "./models/SubscriptionPlan.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ✅ Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS - Fixed (remove app.options line)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Static files
const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Test route
app.get("/", (_req, res) => {
  res.json({ message: "Backend is running...", status: "ok" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${_req.method} ${_req.url} not found`
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads folder: ${uploadDir}`);
  await connectDB();
  // Seed default plans on first run
  const count = await SubscriptionPlan.countDocuments();
  if (count === 0) {
    await SubscriptionPlan.insertMany([
      { name: 'Basic',    months: 6,  price: 999,  description: '6 months access', features: ['Task Management', 'Department Access', 'Email Support'] },
      { name: 'Standard', months: 12, price: 1799, description: '1 year access',   features: ['Task Management', 'Department Access', 'Priority Support', 'Reports'] },
      { name: 'Pro',      months: 24, price: 2999, description: '2 years access',  features: ['Task Management', 'Department Access', 'Priority Support', 'Reports', 'Custom Branding'] },
    ]);
    console.log('✅ Default subscription plans seeded');
  }
});

const io = initSocket(server);
app.set('io', io);