import express from "express";
import { registerUser, loginUser, 
  googleLogin, verifyOTP, 
  forgotPassword, resetPassword, 
  getProfileStats, updateProfilePicture, 
  getProfile, updateProfile,
  changePassword
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/profile-stats", protect, getProfileStats);
// profile picture upload
router.put(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePicture
);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;