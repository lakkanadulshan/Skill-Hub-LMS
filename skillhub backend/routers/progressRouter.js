import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { markLessonAsCompleted, getCourseProgressForStudent } from "../controllers/progressController.js";

const router = express.Router();

// Mark a lesson as completed (Student only)
router.post("/:lessonId/complete", protect, markLessonAsCompleted);

// Get progress of a course for a student
router.get("/course/:courseId", protect, getCourseProgressForStudent);

export default router;