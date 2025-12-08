// server/src/routes/eventRoutes.js
import express from "express";
import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  deleteEvent,
  updateEvent,
  registerForEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";  // <-- Cloudinary upload

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/past", getPastEvents);

// Register for event (student only but with token)
router.post("/:id/register", protect, registerForEvent);

// Admin Routes
router.post("/", protect, upload.single("image"), createEvent);
router.put("/:id", protect, upload.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
