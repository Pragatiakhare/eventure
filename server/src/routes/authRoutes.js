// server/src/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);

export default router;
