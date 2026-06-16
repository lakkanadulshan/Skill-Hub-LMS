import progress from "../models/progress.js";
import Lesson from "../models/lesson.js";
import Course from "../models/course.js";
import Enrollment from "../models/enrollment.js";

// Mark a lesson as completed (Student only)



export const markLessonAsCompleted = async (req, res) => {
  try {
    if (req.user == null) {
      return res.json({
        message: "Please login to mark Lessons as completed",
      });
    }
    // Only students can mark lessons as completed
    if (req.user.role !== "student") {
      return res.json({
        message: "Only students can mark Lessons as completed",
      });
    }
    const { lessonId } = req.params;

    //check if lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    //check user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Please enroll in this course first",
      });
    }
    //check if progress already exists
    let progressRecord = await progress.findOne({
      student: req.user._id,
      course: lesson.course,
      lesson: lessonId,
    });
    if (progressRecord) {
      if (progressRecord.completed) {
        return res.json({ message: "Lesson already marked as completed" });
      }
      progressRecord.completed = true;
      progressRecord.completedAt = Date.now();
      await progressRecord.save();
    } else {
      progressRecord = new progress({
        student: req.user._id,
        course: lesson.course,
        lesson: lessonId,
        completed: true,
        completedAt: Date.now(),
      });
      await progressRecord.save();
    }
    res.json({ message: "Lesson marked as completed" });
  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Progress of a Course (Student only)
export const getCourseProgressForStudent =async (req, res) => {
    try{
        if (req.user == null) {
            return res.json({
                message: "Please login to view course progress",
            });
        }
        // Only students can view course progress
        if(req.user.role !== "student"){
            return res.json({
                message: "Only students can view course progress",
            });
        }
        const { courseId } = req.params;

        //check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        //check user is enrolled in the course
        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: courseId,
        });
        if (!enrollment) {
            return res.status(403).json({
                message: "Please enroll in this course first",
            });
        }
        //get all lessons of the course
        const lessons = await Lesson.find({ course: courseId });
        const totalLessons = lessons.length;

        //get completed lessons count
        const completedLessons = await progress.countDocuments({
            student: req.user._id,
            course: courseId,
            completed: true,
        });
        const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
        res.json({
            courseId,
            progress: progressPercentage,
            totalLessons,
            completedLessons,
        });
    }catch(error){
        console.error("Error getting course progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};
