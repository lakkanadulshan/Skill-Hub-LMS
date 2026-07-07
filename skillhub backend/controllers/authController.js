// controllers/authController.js
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import nodemailer from "nodemailer";
import Enrollment from "../models/enrollment.js";
import multer from "../middleware/multer.js";
import cloudinary, { uploadFromBuffer } from "../config/cloudinary.js";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// controllers/authController.js
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, organization, email, password, role } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = await User.create({
      firstName,
      lastName,
      organization,
      email,
      password: hashedPassword,
      role: role || "student",
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendEmail(
      email,
      "SkillHub Verification OTP",
      `Hi ${firstName}, your verification OTP is: ${otp}.`,
    );

    res.status(201).json({
      message: "Registration successful.",
      userId: user._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Deny login if the account is not verified via OTP
      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Account not verified. Please verify your OTP." });
      }

      // Return user details and JWT token upon successful login
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        phone: user.phone,
        address: user.address ?? "",
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token: generateToken(user._id),
      });
    } else {
      // Return error for invalid credentials
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Handle login errors
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const { tokens } = await client.getToken({
      code: token,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "postmessage",
    });

    // console.log("TOKENS:", tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "User";
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Not Provided";

      user = await User.create({
        firstName,
        lastName,
        email,
        role: "student",
        password: hashedPassword,
      });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName || name.split(" ")[0],
      lastName: user.lastName || name.split(" ").slice(1).join(" ") || " ",
      email: user.email,
      address: user.address ?? "",
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    }

    console.log("MESSAGE:", error.message);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp, type } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches and not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.json({
        message: "Account verified successfully! You can now login.",
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

//forgot password send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(
      email,
      "SkillHub Password Reset OTP",
      `Hi ${user.firstName}, your password reset OTP is: ${otp}.`,
    );

    res.status(200).json({ message: "OTP sent to email", userId: user._id });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(500)
      .json({ message: "Password reset failed", error: error.message });
  }
};

//get profile stats
export const getProfileStats = async (req, res) => {
  try {
    // 👈 🎯 ආරක්ෂිත පියවර: req.user එකක් නැතිනම් (තාම login/verify වී නැතිනම්) crash නොවී 401 error එකක් දෙයි.
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized dashboard access" });
    }

    const studentId = req.user.id;
    // console.log("Requesting user ID:", req.user?.id);

    // 1. Enrolled Courses
    const enrolledCount = await Enrollment.countDocuments({
      student: studentId,
    });

    // 2. Completed Courses
    const completedCount = await Enrollment.countDocuments({
      student: studentId,
      status: "completed",
    });

    // 3. Active Courses
    const activeCount = await Enrollment.countDocuments({
      student: studentId,
      status: "in-progress",
    });

    res.status(200).json({
      enrolledCount,
      completedCount,
      activeCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};


// Update Profile Picture
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 STEP 1: store old avatar first
    const oldAvatar = user.avatar;

    // 🔥 STEP 2: upload new image
    const result = await uploadFromBuffer(req.file.buffer);

    // 🔥 STEP 3: update DB ONCE
    user.avatar = result.secure_url;
    await user.save();

    // 🔥 STEP 4: delete old image (after save is fine)
    if (oldAvatar) {
      try {
        const parts = oldAvatar.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = `profile_pictures/${fileName.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Old image delete failed:", err.message);
      }
    }

    res.json({
      message: "Profile picture updated",
      avatar: user.avatar,
    });
  } catch (error) {
    console.log("🔥 PROFILE PICTURE ERROR:", error);

    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address ?? "",
      organization: user.organization,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName, phone, address, organization, bio, email } =
      req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (address !== undefined) {
      user.address = address;
    }
    user.organization = organization || user.organization;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address ?? "",
      organization: updatedUser.organization,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "No password found for this account",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      message: "Password change failed",
      error: error.message,
    });
  }
};