import Lesson from "../models/lesson.js";
import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";

// Create a new lesson
export const createLesson = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can create lessons",
      });
    }

    const { title, description, content, course, duration, videoUrl } =
      req.body;

    if (
      !title ||
      !description ||
      !content ||
      !course ||
      !duration ||
      !videoUrl
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: title, description, content, course, duration, videoUrl",
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

//Get Lessons by Course
export const getLessonByCourse = async (req, res) => {
  try {

    if (
      req.user.role !== "instructor" &&
      req.user.role !== "student"
    ) {
      return res.status(403).json({
        message: "Only instructors and students can view lessons",
      });
    }

    const { courseId } = req.params;

    const foundCourse = await Course.findById(courseId);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Only students need enrollment check
    if (req.user.role === "student") {

      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "Please enroll in this course first",
        });
      }
    }

    const lessons = await Lesson.find({
      course: courseId,
    }).sort({ createdAt: 1 });

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

//Update lesson
export const updateLesson = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can update lessons",
      });
    }

    const { lessonId } = req.params;
    const { title, description, content, duration, videoUrl } = req.body;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const foundCourse = await Course.findById(lesson.course);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update lessons in your own courses",
      });
    }

    // Partial update support
    lesson.title = title || lesson.title;
    lesson.description = description || lesson.description;
    lesson.content = content || lesson.content;
    lesson.duration = duration || lesson.duration;
    lesson.videoUrl = videoUrl || lesson.videoUrl;

    await lesson.save();

    res.status(200).json({
      message: "Lesson updated successfully",
      lesson,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating lesson",
      error: error.message,
    });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can delete lessons",
      });
    }

    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const foundCourse = await Course.findById(lesson.course);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete lessons in your own courses",
      });
    }

    await Lesson.findByIdAndDelete(lessonId);

    res.status(200).json({
      message: "Lesson deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting lesson",
      error: error.message,
    });
  }
};