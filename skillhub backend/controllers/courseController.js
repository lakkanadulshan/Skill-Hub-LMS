import Course from "../models/course.js";
import Lesson from "../models/lesson.js";

// 1. Create Course (Instructor Only)
export const createCourse = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors can create courses" });
    }

    const thumbnail = req.file?.path;
    if (!thumbnail) {
      return res.status(400).json({ message: "Please upload a course thumbnail image" });
    }

    const {
      title,
      description,
      category,
      price,
      duration,
      level,
      resourcesCount,
      hasCertificate,
    } = req.body;

    let parsedWhatYouWillLearn = [];
    if (req.body.whatYouWillLearn) {
      try {
        parsedWhatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      } catch (e) {
        parsedWhatYouWillLearn = [];
      }
    }

    const newCourse = await Course.create({
      title,
      description,
      category,
      thumbnail,
      price: Number(price) || 0,
      duration: duration || "Self-paced",
      level: level || "All Levels",
      resourcesCount: Number(resourcesCount) || 0,
      hasCertificate: hasCertificate === "true" || hasCertificate === true,
      whatYouWillLearn: parsedWhatYouWillLearn,
      instructor: req.user._id, 
      status: "pending", 
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully. Waiting for Admin approval.",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// 2. Get all courses (Public/Student View)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" })
      .populate("instructor", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving courses",
      error: error.message,
    });
  }
};

// 3. Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = await Course.findById(courseId)
      .populate("instructor", "firstName lastName email");
    
    if (!courseData) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course: courseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving course",
      error: error.message,
    });
  }
};

// 4. Update course (Instructor Only)
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const foundCourse = await Course.findById(courseId); 

    if (!foundCourse) return res.status(404).json({ message: "Course not found" });

    if (foundCourse.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own courses" });
    }

    if (req.file && req.file.path) foundCourse.thumbnail = req.file.path;

    if (req.body.whatYouWillLearn) {
      try {
        foundCourse.whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      } catch (e) { console.error(e); }
    }

    foundCourse.title = req.body.title ?? foundCourse.title;
    foundCourse.description = req.body.description ?? foundCourse.description;
    foundCourse.category = req.body.category ?? foundCourse.category;
    foundCourse.price = req.body.price ? Number(req.body.price) : foundCourse.price;
    foundCourse.duration = req.body.duration ?? foundCourse.duration;
    foundCourse.level = req.body.level ?? foundCourse.level;
    foundCourse.resourcesCount = req.body.resourcesCount ? Number(req.body.resourcesCount) : foundCourse.resourcesCount;
    foundCourse.hasCertificate = req.body.hasCertificate === "true" || req.body.hasCertificate === true;

    if (foundCourse.status === "approved" || foundCourse.status === "rejected") {
      foundCourse.status = "pending"; 
    }

    const updatedCourse = await foundCourse.save();
    res.status(200).json({ success: true, message: "Course updated successfully. Sent for admin review.", course: updatedCourse });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating course", error: error.message });
  }
};

// 5. Delete Course (Instructor Only)
export const deleteCourse = async (req, res) => {
  try {
    const foundCourse = await Course.findById(req.params.id);
    if (!foundCourse) return res.status(404).json({ message: "Course not found" });
    
    if (foundCourse.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting course", error: error.message });
  }
};

// 6. Get Enrolled Courses for a Student
export const getEnrolledCourses = async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ students: req.user._id })
      .populate("instructor", "firstName lastName email");

    res.status(200).json({
      success: true,
      courses: enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching enrolled courses", error: error.message });
  }
};

// 7. Enroll in a Course
export const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const foundCourse = await Course.findById(courseId);

    if (!foundCourse) return res.status(404).json({ message: "Course not found" });
    if (foundCourse.status !== "approved") return res.status(403).json({ message: "This course is not yet available for enrollment" });

    if (foundCourse.students.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    foundCourse.students.push(req.user._id);
    await foundCourse.save();

    res.status(200).json({ success: true, message: "Enrolled in course successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error enrolling", error: error.message });
  }
};

// 8. Instructor Stats
export const getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const totalCourses = await Course.countDocuments({ instructor: instructorId });
    const myCourses = await Course.find({ instructor: instructorId }).select("_id students");
    const myCourseIds = myCourses.map(c => c._id);
    const totalLessons = await Lesson.countDocuments({ course: { $in: myCourseIds } });

    const studentsSet = new Set();
    myCourses.forEach(c => {
      if (c.students) c.students.forEach(sId => studentsSet.add(sId.toString()));
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalLessons,
        totalStudents: studentsSet.size,
        totalEarnings: totalCourses * 150 // Sample logic
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
  }
};

// 9. Get all courses created by a specific Instructor (Pending, Approved, Rejected )
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving instructor courses",
      error: error.message,
    });
  }
};