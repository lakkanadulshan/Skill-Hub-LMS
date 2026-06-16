import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createReview } from "../controllers/reviewController.js";

const router = express.Router();

// Create a review for a course
router.post("/courses/:courseId", protect, createReview);

export default router;
