import express from "express";
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, getEnrolledCourses, enrollInCourse } from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createCourse);
router.get("/", protect, getAllCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);
router.post("/:id/enroll", protect, enrollInCourse);
// router.post("/:id/unenroll", protect, unenrollCourse);

export default router;