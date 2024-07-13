import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/connectDB";
import authRoutes from "./routes/auth.routes";

import "dotenv/config";

const PORT = process.env.PORT;

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
