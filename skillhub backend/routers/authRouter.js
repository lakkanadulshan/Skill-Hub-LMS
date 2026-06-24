import express from "express";
import { registerUser, loginUser, googleLogin, verifyOTP, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;