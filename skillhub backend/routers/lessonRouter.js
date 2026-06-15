import { createLesson, getLessonByCourse, updateLesson, deleteLesson } from "../controllers/lessonController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new lesson
router.post("/", protect, createLesson);

// Get Lessons by Course
router.get("/course/:courseId", protect, getLessonByCourse);

// Update lesson
router.put("/:lessonId", protect, updateLesson);

// Delete lesson
router.delete("/:lessonId", protect, deleteLesson);

export default router;