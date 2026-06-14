import Lesson from "../models/lesson.js";
import Course from "../models/course.js";

// Create a new lesson
export const createLesson = async (req, res) => {
  try {

    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can create lessons",
      });
    }

    const { title, description, content, course, duration, videoUrl } = req.body;

    if (!title || !description || !content || !course || !duration || !videoUrl) {
      return res.status(400).json({
        message: "Please provide all required fields: title, description, content, course, duration, videoUrl",
      });
    }

    const foundCourse = await Course.findById(course);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only course owner can add lessons
    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only add lessons to your own courses",
      });
    }

    const newLesson = await Lesson.create({
      title,
      description,
      content,
      course,
      duration,
      videoUrl,
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