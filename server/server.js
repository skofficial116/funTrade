import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";

import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import referralRouter from "./routes/referralRoutes.js";

const app = express();

// Connect MongoDB
await connectDB();

// Connect Cloudinary
await connectCloudinary();

const allowedOrigins = [
  "https://fun-trade-iota.vercel.app", // production frontend
  "http://localhost:5173"              // local dev
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ]
};

// Apply CORS + JSON + cookies
app.use(cors(corsOptions));  // already applied globally
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/referral", referralRouter);

// 404 fallback
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at PORT: ${PORT}`);
});
