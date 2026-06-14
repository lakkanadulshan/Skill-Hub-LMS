import { createLesson } from "../controllers/lessonController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new lesson
router.post("/", protect, createLesson);

export default router;