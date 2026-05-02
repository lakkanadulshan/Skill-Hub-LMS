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