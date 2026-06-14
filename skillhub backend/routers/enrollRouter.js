import express from "express";
import { enrollInCourse, getMyCourses, getStudentsOfCourse, updateProgress } from "../controllers/enrollController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enroll in a course
router.post("/enroll", protect, enrollInCourse);

// Get My Courses
router.get("/my-courses", protect, getMyCourses);

// Get Students of Course
router.get("/course/:courseId/students", protect, getStudentsOfCourse);

// Update Progress
router.put("/:courseId/progress", protect, updateProgress);

export default router;