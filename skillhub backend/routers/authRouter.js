import express from "express";
import { registerUser, loginUser, googleLogin, verifyOTP, forgotPassword, resetPassword, getProfileStats } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/profile-stats", protect, getProfileStats);

export default router;