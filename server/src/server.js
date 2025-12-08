// server/src/server.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { scheduleReminders } from "./scheduler/reminderScheduler.js";

dotenv.config();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start reminder cron job (24hr before event)
    scheduleReminders();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error", err);
    process.exit(1);
  });
