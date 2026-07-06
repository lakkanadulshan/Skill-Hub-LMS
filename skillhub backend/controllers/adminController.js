import User from "../models/user.js";
import Course from "../models/course.js";
import Contact from "../models/contact.js";

// Admin Stats
export const getAdminStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const instructors = await User.countDocuments({ role: "instructor" });
    const courses = await Course.countDocuments();
    const messages = await Contact.countDocuments();

    res.status(200).json({ success: true, stats: { students, instructors, courses, messages } });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Get All Users for Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Course Matrix for Admin (Populated)
export const getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Update Course Status (Approve/Reject)
export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ success: true, message: `Course identity marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role === "admin") return res.status(400).json({ message: "Cannot delete admin" });
  
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "User purged" });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; 

    if (!["student", "instructor"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role switch configuration." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Root administration privileges cannot be altered" });

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: `User role synchronized to ${role}` });
  } catch (error) {
    res.status(500).json({ message: "Error altering user role", error: error.message });
  }
};