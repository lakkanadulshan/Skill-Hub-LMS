import Course from "../models/course.js";
import Lesson from "../models/lesson.js";

// 1. Create Course
export const createCourse = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can create courses",
      });
    }

    const thumbnail = req.file?.path;
    if (!thumbnail) {
      return res.status(400).json({
        message: "Please upload a course thumbnail image",
      });
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
    } = req.body || {};

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Please provide title, description, and category",
      });
    }

    let parsedWhatYouWillLearn = [];
    if (req.body.whatYouWillLearn) {
      try {
        parsedWhatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      } catch {
        parsedWhatYouWillLearn = [];
      }
    }

    // 🟢 Capital C වලින් නිවැරදිව සකසා ඇත
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
    });

    return res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating course",
      error: error.message,
    });
  }
};

// 2. Get all courses
export const getAllCourses = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res.status(403).json({
        message: "Only instructors and students can view courses",
      });
    }
    // 🟢 course.find() -> Course.find() ලෙස නිවැරදි කර ඇත
    const courses = await Course.find().populate("instructor", "name email");
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

// 3. Get single course
export const getCourseById = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res.status(403).json({
        message: "Only instructors and students can view courses",
      });
    }
    const courseId = req.params.id;
    // 🟢 course.findById() -> Course.findById() ලෙස නිවැරදි කර ඇත
    const courseData = await Course.findById(courseId).populate("instructor", "name email");
    
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

// 4. Update course
// export const updateCourse = async (req, res) => {
//   try {
//     const courseId = req.params.id;
    
//     // 🟢 course.findById() -> Course.findById() ලෙස නිවැරදි කර ඇත
//     const foundCourse = await Course.findById(courseId); 

//     if (!foundCourse) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }

//     if (req.user.role !== "instructor") {
//       return res.status(403).json({
//         message: "Only instructors can update courses",
//       });
//     }

//     if (foundCourse.instructor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You can only update your own courses",
//       });
//     }

//     foundCourse.title = req.body.title ?? foundCourse.title;
//     foundCourse.description = req.body.description ?? foundCourse.description;
//     foundCourse.category = req.body.category ?? foundCourse.category;
//     foundCourse.thumbnail = req.body.thumbnail ?? foundCourse.thumbnail;
    
//     foundCourse.price = req.body.price ?? foundCourse.price;
//     foundCourse.duration = req.body.duration ?? foundCourse.duration;
//     foundCourse.level = req.body.level ?? foundCourse.level;
//     foundCourse.whatYouWillLearn = req.body.whatYouWillLearn ?? foundCourse.whatYouWillLearn;
//     foundCourse.resourcesCount = req.body.resourcesCount ?? foundCourse.resourcesCount;
//     foundCourse.hasCertificate = req.body.hasCertificate ?? foundCourse.hasCertificate;

//     await foundCourse.save();
    
//     res.status(200).json({
//       message: "Course updated successfully",
//       course: foundCourse,
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating course",
//       error: error.message,
//     });
//   }
// };
// update course
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // 🟢 1. Capital C සහිත නිවැරදි Model එක පාවිච්චි කිරීම
    const foundCourse = await Course.findById(courseId); 

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

    // 🟢 2. Image එකක් අලුතින් ආවා නම් පමණක් එය යාවත්කාලීන කිරීම (Multer path)
    if (req.file && req.file.path) {
      foundCourse.thumbnail = req.file.path;
    }

    // 🟢 3. Frontend එකෙන් Stringify කරලා එවන JSON එක ආරක්ෂිතව Parse කිරීම
    if (req.body.whatYouWillLearn) {
      try {
        foundCourse.whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      } catch (e) {
        // යම් හෙයකින් parse කරගන්න බැරි වුණොත් දැනට තියෙන ඒවාම තබා ගනී
        console.error("Error parsing whatYouWillLearn in update:", e);
      }
    }

    // අනෙකුත් Fields යාවත්කාලීන කිරීම
    foundCourse.title = req.body.title ?? foundCourse.title;
    foundCourse.description = req.body.description ?? foundCourse.description;
    foundCourse.category = req.body.category ?? foundCourse.category;
    foundCourse.price = req.body.price ? Number(req.body.price) : foundCourse.price;
    foundCourse.duration = req.body.duration ?? foundCourse.duration;
    foundCourse.level = req.body.level ?? foundCourse.level;
    foundCourse.resourcesCount = req.body.resourcesCount ? Number(req.body.resourcesCount) : foundCourse.resourcesCount;
    foundCourse.hasCertificate = req.body.hasCertificate === "true" || req.body.hasCertificate === true;

    // Save Changes
    const updatedCourse = await foundCourse.save();
    
    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};

// 5. Delete Course
export const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        message: "Only instructors can delete courses",
      });
    }

    if (!courseId) {
      return res.json({
        message: "Course ID is required",
      });
    }
    
    // 🟢 course.findById() -> Course.findById() ලෙස නිවැරදි කර ඇත
    const foundCourse = await Course.findById(courseId);
    if (!foundCourse) {
      return res.json({ message: "Course not found" });
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

// 6. Get Enrolled Courses for a Student
export const getEnrolledCourses = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can view enrolled courses",
      });
    }

    // 🟢 course.find() -> Course.find() ලෙස නිවැරදි කර ඇත
    const enrolledCourses = await Course.find({ students: req.user._id }).populate("instructor", "name email");

    res.status(200).json({
      message: "Enrolled courses retrieved successfully",
      courses: enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving enrolled courses",
      error: error.message,
    });
  }
};

// 7. Enroll in a Course
export const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can enroll in courses",
      });
    }

    const courseId = req.params.id;
    
    // 🟢 course.findById() -> Course.findById() ලෙස නිවැරදි කර ඇත
    const foundCourse = await Course.findById(courseId);

    if (!foundCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (foundCourse.students.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already enrolled in this course",
      });
    }

    foundCourse.students.push(req.user._id);
    await foundCourse.save();

    res.status(200).json({
      message: "Enrolled in course successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error enrolling in course",
      error: error.message,
    });
  }
};


export const getInstructorStats = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const instructorId = req.user._id;

    // 1. Instructor ට අදාළ මුළු කෝස් ගණන
    const totalCourses = await Course.countDocuments({ instructor: instructorId });

    // 2. Instructor ගේ කෝස් සියල්ලේම ID ලැයිස්තුව ලබා ගැනීම
    const myCourses = await Course.find({ instructor: instructorId }).select("_id students");
    const myCourseIds = myCourses.map(c => c._id);

    // 3. ඒ කෝස් වලට අදාළ මුළු ලේසන්ස් ගණන
    const totalLessons = await Lesson.countDocuments({ course: { $in: myCourseIds } });

    // 4. ඒ කෝස් වලට රෙජිස්ටර් වී සිටින මුළු සිසුන් ගණන (Unique students count)
    const studentsSet = new Set();
    myCourses.forEach(c => {
      if (c.students) {
        c.students.forEach(sId => studentsSet.add(sId.toString()));
      }
    });
    const totalStudents = studentsSet.size;

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalLessons,
        totalStudents,
        totalEarnings: totalCourses * 150 // දැනට rough revenue එකක් පෙන්වීමට
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching instructor stats",
      error: error.message
    });
  }
};