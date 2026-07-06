import express from "express";
import { getAdminStats, getAllUsers, deleteUser, getAllCoursesForAdmin, updateCourseStatus, updateUserRole } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);
router.get("/users", protect, admin, getAllUsers);
router.delete("/user/:id", protect, admin, deleteUser);
router.get("/courses", protect, admin, getAllCoursesForAdmin); 
router.put("/courses/:id/status", protect, admin, updateCourseStatus); 
router.put("/user/:id/role", protect, admin, updateUserRole); 

export default router;