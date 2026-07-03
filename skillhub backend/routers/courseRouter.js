import express from "express";
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, getEnrolledCourses, enrollInCourse, getInstructorStats } from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";
import courseUpload from "../middleware/courseMulter.js";
const router = express.Router();

router.post("/create", protect, courseUpload.single("thumbnail"), createCourse);
router.get("/", protect, getAllCourses);
router.get("/enrolled", protect, getEnrolledCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, courseUpload.single("thumbnail"), updateCourse);
router.delete("/:id", protect, deleteCourse);
router.post("/:id/enroll", protect, enrollInCourse);
// router.post("/:id/unenroll", protect, unenrollCourse);
router.get("/instructor/stats", protect, getInstructorStats);

export default router;