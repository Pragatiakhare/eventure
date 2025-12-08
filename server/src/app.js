// server/src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (Optional) If you ever serve static frontend from here, you can use:
// app.use(express.static(path.join(__dirname, "..", "client")));

// Routes
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/auth", authRoutes);

export default app;
