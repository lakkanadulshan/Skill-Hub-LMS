import course from "../models/course.js";

/*APIs to build:
Create course (Instructor only)
Get all courses
Get single course
Update course
Delete course*/

// Create a new course
// Create Course Controller

export const createCourse = async (req, res) => {
  try {
    // Check role from logged-in user (NOT from body)
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can create courses",
      });
    }

    // Default to an empty object if req.body is undefined
    const { title, description, category, thumbnail } = req.body || {};

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Please provide title, description, and category",
      });
    }

    // Set instructor automatically from logged-in user
    const newCourse = await course.create({
      title,
      description,
      category,
      thumbnail,
      instructor: req.user._id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

//Get all courses

export const getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res.status(403).json({
        message: "Only instructors and students can view courses",
      });
    }
    const courses = await course.find().populate("instructor", "name email");
    res.status(200).json({
      message: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving courses",
      error: error.message,
    });
  }
};

// Get single course
export const getCourseById = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res.status(403).json({
        message: "Only instructors and students can view courses",
      });
    }
    const courseId = req.params.id;
    const courseData = await course
      .findById(courseId)
      .populate("instructor", "name email");
    if (!courseData) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    res.status(200).json({
      message: "Course retrieved successfully",
      course: courseData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving course",
      error: error.message,
    });
  }
};

//update course

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const foundCourse = await course.findById(courseId);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can update courses",
      });
    }
    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own courses",
      });
    }
    foundCourse.title = req.body.title || foundCourse.title;

    foundCourse.description = req.body.description || foundCourse.description;

    foundCourse.category = req.body.category || foundCourse.category;

    foundCourse.thumbnail = req.body.thumbnail || foundCourse.thumbnail;

    await foundCourse.save();
    res.status(200).json({
      message: "Course updated successfully",
      course: foundCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

//Delete Course

export const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can delete courses",
      });
    } else {
      console.log("User role is instructor, proceeding with delete");
    }

    if (!courseId) {
      return res.json({
        message: "Course ID is required",
      });
    }
    const foundCourse = await course.findById(courseId);
    if (!foundCourse) {
      return res.json({ message: "Course not found" });
    } else {
      console.log("Course found:", foundCourse);
    }
    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own courses",
      });
    }

    await foundCourse.deleteOne();
    res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};
