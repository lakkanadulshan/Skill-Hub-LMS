/*Enroll in Course
Get My Courses
Get Students of Course
Update Progress*/

import Enrollment from "../models/enrollment.js";
import Course from "../models/course.js";
import User from "../models/user.js";

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  
  try {
    const { courseId } = req.body; 

    // 1. Get User from req.user (provided by authMiddleware)
    const studentId = req.user._id;
    console.log("Student ID:", studentId);

    // 2. Check Role = student?
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can enroll in courses." });
    }

    // 3. Check Course Exists?
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // 4. Already Enrolled?
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    // 5. Create Enrollment
    const newEnrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });
    await newEnrollment.save();
    console.log("Enrollment saved successfully!");

    // Add student to the course's students array
    course.students.push(studentId);
    await course.save();

    // Add course to the user's enrolledCourses array
    req.user.enrolledCourses.push(courseId);
    await req.user.save();

    res.status(201).json({
      message: "Successfully enrolled in the course",
      enrollment: newEnrollment
    });

  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Server error during enrollment" });
  }
};

// Get My Courses
export const getMyCourses = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can view their courses." });
    }
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course");
    const courses = enrollments.map(enrollment => enrollment.course);
    res.status(200).json({
        message: "My courses retrieved successfully",
        courses
    });
  }
    catch (error) { 
        console.error("Error retrieving my courses:", error);
        res.status(500).json({ message: "Server error while retrieving my courses" });
    }   
};

// Get Students of Course
export const getStudentsOfCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Check Role = instructor?
    if (!req.user || req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied. Only instructors can view students." });
    }

    // 2. Check Course Exists?
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // 3. Check Course Owner?
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You are not the instructor of this course." });
    }

    // 4. Get Students (from Enrollments with progress or from course.students)
    const enrollments = await Enrollment.find({ course: courseId }).populate("student", "name email avatar");

    res.status(200).json({
      message: "Students retrieved successfully",
      enrollments
    });

  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).json({ message: "Server error while retrieving students" });
  }
};

// Update Progress
export const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    // 1. Check if user is a student
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can update progress." });
    }

    // 2. Validate progress value
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Please provide a valid progress value between 0 and 100." });
    }

    // 3. Find Enrollment
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found for this course." });
    }

    // 4. Update the progress
    enrollment.progress = progress;
    if (progress >= 100) {
        enrollment.completed = true;
    } else {
        enrollment.completed = false; // In case progress is reverted below 100
    }

    await enrollment.save();

    res.status(200).json({
      message: "Progress updated successfully",
      enrollment
    });

  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error while updating progress" });
  }
};

//Unenroll from a Course 
export const unenrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOneAndDelete({ student: userId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // 2. Course එකේ students array එකෙන් ඉවත් කරන්න
    await Course.findByIdAndUpdate(courseId, {
      $pull: { students: userId }
    });

    // 3. User ගේ enrolledCourses array එකෙන් ඉවත් කරන්න
    await User.findByIdAndUpdate(userId, {
      $pull: { enrolledCourses: courseId }
    });

    res.status(200).json({
      success: true,
      message: "Successfully unenrolled from the course"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error unenrolling from course",
      error: error.message
    });
  }
};