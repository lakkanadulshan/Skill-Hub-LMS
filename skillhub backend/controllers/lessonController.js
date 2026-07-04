// import Lesson from "../models/lesson.js";
// import Course from "../models/course.js";
// import Enrollment from "../models/enrollment.js";
// import cloudinary from "../config/cloudinary.js" 
// import { v2 } from "cloudinary";

// // Create a new lesson
// export const createLesson = async (req, res) => {
//   try {
//     if (req.user.role !== "instructor") {
//       return res.status(403).json({
//         message: "Only instructors can create lessons",
//       });
//     }

//     const {
//       title,
//       description,
//       content,
//       course,
//       duration,
//       videoUrl,
//       assetUrl, // Google Drive Link එක මෙතනින් එනවා
//     } = req.body;

//     if (
//       !title ||
//       !description ||
//       !content ||
//       !course ||
//       !duration ||
//       !videoUrl
//     ) {
//       return res.status(400).json({
//         message:
//           "Please provide all required fields: title, description, content, course, duration, videoUrl",
//       });
//     }

//     const foundCourse = await Course.findById(course);
//     if (!foundCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     if (foundCourse.instructor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You can only add lessons to your own courses",
//       });
//     }

//     // 🟢 🛠️ Real-world LMS Resources Combination Logic
//     let driveLink = assetUrl || "";
//     let fileUploadedUrl = "";

//     // PC එකෙන් PDF එකක් ආවොත් කෙලින්ම Cloudinary යවා එහි URL එක ගනී
//     if (req.file) {
//   // Cloudinary වෙනුවට ඔයාගේම local server එකේ uploads/materials/ ෆෝල්ඩරයට ලින්ක් එක සකසයි
//   fileUploadedUrl = `${req.protocol}://${req.get("host")}/uploads/materials/${req.file.filename}`;
// }

//     // 🟢 Drive ලින්ක් එකයි, Cloudinary PDF එකයි දෙකම තිබේ නම් separator එකක් සමඟ එකතු කර සේව් කරයි
//     let combinedAssetUrl = "";
//     if (driveLink && fileUploadedUrl) {
//       combinedAssetUrl = `${driveLink}|||${fileUploadedUrl}`;
//     } else {
//       combinedAssetUrl = driveLink || fileUploadedUrl || "";
//     }

//     const newLesson = await Lesson.create({
//       title,
//       description,
//       content,
//       course,
//       duration: Number(duration),
//       videoUrl,
//       assetUrl: combinedAssetUrl, // 🟢 ඒකාබද්ධ කළ අවසාන Resources ලින්ක් එක
//     });

//     res.status(201).json({
//       message: "Lesson created successfully",
//       lesson: newLesson,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating lesson",
//       error: error.message,
//     });
//   }
// };

// // Get Lessons by Course
// export const getLessonByCourse = async (req, res) => {
//   try {
//     if (req.user.role !== "instructor" && req.user.role !== "student") {
//       return res.status(403).json({
//         message: "Only instructors and students can view lessons",
//       });
//     }

//     const { courseId } = req.params;
//     const foundCourse = await Course.findById(courseId);

//     if (!foundCourse) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }

//     if (req.user.role === "student") {
//       const enrollment = await Enrollment.findOne({
//         student: req.user._id,
//         course: courseId,
//       });

//       if (!enrollment) {
//         return res.status(403).json({
//           message: "Please enroll in this course first",
//         });
//       }
//     }

//     const lessons = await Lesson.find({
//       course: courseId,
//     }).sort({ createdAt: 1 });

//     res.status(200).json({
//       message: "Lessons retrieved successfully",
//       lessons,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error while retrieving lessons",
//       error: error.message,
//     });
//   }
// };

// // Update lesson
// export const updateLesson = async (req, res) => {
//   try {
//     if (req.user.role !== "instructor") {
//       return res.status(403).json({
//         message: "Only instructors can update lessons",
//       });
//     }

//     const { lessonId } = req.params;
//     const { title, description, content, duration, videoUrl, assetUrl } = req.body;

//     const lesson = await Lesson.findById(lessonId);
//     if (!lesson) {
//       return res.status(404).json({ message: "Lesson not found" });
//     }

//     const foundCourse = await Course.findById(lesson.course);
//     if (!foundCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     if (foundCourse.instructor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You can only update lessons in your own courses",
//       });
//     }

//     // 🟢 Update කිරීමේදීද ලොජික් එක පිරිසිදුව ක්‍රියාත්මක වේ
//     let driveLink = assetUrl !== undefined ? assetUrl : "";
//     let fileUploadedUrl = "";

//    if (req.file) {
//   fileUploadedUrl = `${req.protocol}://${req.get("host")}/uploads/materials/${req.file.filename}`;
//   lesson.assetUrl = driveLink ? `${driveLink}|||${fileUploadedUrl}` : fileUploadedUrl;
// } else if (assetUrl !== undefined) {
//   lesson.assetUrl = assetUrl;
// }

//     // දත්ත තිබේ නම් ඒවා ඒකාබද්ධ කරයි, නැතහොත් තනි ලින්ක් එකක් සේව් කරයි
//     if (fileUploadedUrl) {
//       lesson.assetUrl = driveLink ? `${driveLink}|||${fileUploadedUrl}` : fileUploadedUrl;
//     } else if (assetUrl !== undefined) {
//       lesson.assetUrl = assetUrl;
//     }

//     lesson.title = title || lesson.title;
//     lesson.description = description || lesson.description;
//     lesson.content = content || lesson.content;
//     lesson.duration = duration ? Number(duration) : lesson.duration;
//     lesson.videoUrl = videoUrl || lesson.videoUrl;

//     await lesson.save();

//     res.status(200).json({
//       message: "Lesson updated successfully",
//       lesson,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating lesson",
//       error: error.message,
//     });
//   }
// };

// // Delete lesson
// export const deleteLesson = async (req, res) => {
//   try {
//     if (req.user.role !== "instructor") {
//       return res.status(403).json({
//         message: "Only instructors can delete lessons",
//       });
//     }

//     const { lessonId } = req.params;
//     const lesson = await Lesson.findById(lessonId);

//     if (!lesson) {
//       return res.status(404).json({
//         message: "Lesson not found",
//       });
//     }

//     const foundCourse = await Course.findById(lesson.course);
//     if (!foundCourse) {
//       return res.status(404).json({
//         message: "Course not found",
//       });
//     }

//     if (foundCourse.instructor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         message: "You can only delete lessons in your own courses",
//       });
//     }

//     await Lesson.findByIdAndDelete(lessonId);

//     res.status(200).json({
//       message: "Lesson deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting lesson",
//       error: error.message,
//     });
//   }
// };
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

    // 🟢 Resources array එක මෙතන හදනවා
    let lessonResources = [];

    // Google Drive / Web Link එකක් තිබේ නම්
    if (assetUrl) {
      lessonResources.push({
        name: "Reference Link",
        url: assetUrl,
        type: "link"
      });
    }

    // PC එකෙන් PDF එකක් upload කරා නම්
    if (req.file) {
      const fileUploadedUrl = `${req.protocol}://${req.get("host")}/uploads/materials/${req.file.filename}`;
      lessonResources.push({
        name: "PDF Material",
        url: fileUploadedUrl,
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
      resources: lessonResources, // 🟢 Schema එකේ තියෙන array එකට data දානවා
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
    
    // මෙතනදී සරලව lessons ටික අරගෙන එනවා
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
      const fileUploadedUrl = `${req.protocol}://${req.get("host")}/uploads/materials/${req.file.filename}`;
      updatedResources.push({ name: "PDF Material", url: fileUploadedUrl, type: "file" });
    }

    // ලින්ක් එකක් හෝ ෆයිල් එකක් අලුතෙන් ආවා නම් පමණක් resources update කරන්න
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