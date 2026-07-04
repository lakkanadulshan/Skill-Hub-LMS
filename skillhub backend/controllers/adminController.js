import User from "../models/user.js";
import Course from "../models/course.js";
import Contact from "../models/contact.js";

export const getAdminStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: "student" });
    const instructorCount = await User.countDocuments({ role: "instructor" });
    const courseCount = await Course.countDocuments();
    const contactCount = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        students: studentCount,
        instructors: instructorCount,
        courses: courseCount,
        messages: contactCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") return res.status(400).json({ message: "Cannot delete an admin" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};