import Lesson from "../models/lesson.js";
import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";

import { uploadRawFromBuffer } from "../config/cloudinary.js";

// Create a new lesson
export const createLesson = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can create lessons",
      });
    }

    const {
      title,
      description,
      content,
      course,
      duration,
      videoUrl,
      assetUrl, // Drive link
    } = req.body;

    if (!title || !description || !content || !course || !duration || !videoUrl) {
      return res.status(400).json({
        message: "Please provide all required fields: title, description, content, course, duration, videoUrl",
      });
    }

    const foundCourse = await Course.findById(course);
    if (!foundCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only add lessons to your own courses",
      });
    }

    let lessonResources = [];

    if (assetUrl) {
      lessonResources.push({
        name: "Reference Link",
        url: assetUrl,
        type: "link"
      });
    }

    if (req.file) {
    
      const cloudinaryResult = await uploadRawFromBuffer(req.file.buffer, req.file.originalname);
      
      lessonResources.push({
        name: req.file.originalname || "PDF Material",
        url: cloudinaryResult.secure_url,
        type: "file"
      });
    }

    const newLesson = await Lesson.create({
      title,
      description,
      content,
      course,
      duration: Number(duration),
      videoUrl,
      resources: lessonResources,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson: newLesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating lesson",
      error: error.message,
    });
  }
};

// Get Lessons by Course
export const getLessonByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Lessons retrieved successfully",
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while retrieving lessons",
      error: error.message,
    });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can update lessons" });
    }

    const { lessonId } = req.params;
    const { title, description, content, duration, videoUrl, assetUrl } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Update fields
    lesson.title = title || lesson.title;
    lesson.description = description || lesson.description;
    lesson.content = content || lesson.content;
    lesson.duration = duration ? Number(duration) : lesson.duration;
    lesson.videoUrl = videoUrl || lesson.videoUrl;

    // Update resources logic
    let updatedResources = [];
    if (assetUrl) {
      updatedResources.push({ name: "Reference Link", url: assetUrl, type: "link" });
    }
    
    if (req.file) {
      const cloudinaryResult = await uploadRawFromBuffer(req.file.buffer, req.file.originalname);
      updatedResources.push({ 
        name: req.file.originalname || "PDF Material", 
        url: cloudinaryResult.secure_url, 
        type: "file" 
      });
    }

    if (updatedResources.length > 0) {
      lesson.resources = updatedResources;
    }

    await lesson.save();

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating lesson", error: error.message });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await Lesson.findByIdAndDelete(lessonId);
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lesson", error: error.message });
  }
};