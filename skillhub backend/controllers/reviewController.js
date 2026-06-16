import reviewModel from "../models/review.js";
import Course from "../models/course.js";

// Create a new review
export const createReview = async (req, res) => {
  try {

    //check user logged in and is student
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can create reviews" });
    }
    
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create the review
    const newReview = new reviewModel({
      student: req.user._id,
      course: courseId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
