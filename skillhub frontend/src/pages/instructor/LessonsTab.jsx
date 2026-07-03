import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../services/api.js";
import { PencilLine, Trash2 } from "lucide-react";

export default function LessonsTab({ courseId, onBackToCourses }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);

  // Form Field States
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    videoUrl: "",
  });

  // 1. Fetch Lessons for Selected Course
  const fetchLessons = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await API.get(`/lessons/course/${courseId}`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // 2. Submit Form (Handle Create OR Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!courseId) {
      return Swal.fire("Error", "No course selected context", "error");
    }

    try {
      const payload = {
        ...lessonData,
        course: courseId,
        duration: Number(lessonData.duration),
      };

      if (isEditing) {
        await API.put(`/lessons/${editingLessonId}`, payload);
        Swal.fire("Success", "Lesson updated successfully!", "success");
      } else {
        // CREATE LESSON
        await API.post("/lessons/create", payload);
        Swal.fire("Success", "Lesson added successfully!", "success");
      }

      closeModal();
      fetchLessons(); // Refresh List
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error",
      );
    }
  };

  // 🟢 3. Delete Lesson Function
  const handleDeleteLesson = async (lessonId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this lesson node!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/lessons/delete/${lessonId}`);
        Swal.fire("Deleted!", "Your lesson has been deleted.", "success");
        fetchLessons(); // Refresh List
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to delete lesson",
          "error",
        );
      }
    }
  };

  const openEditModal = (lesson) => {
    setIsEditing(true);
    setEditingLessonId(lesson._id);
    setLessonData({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingLessonId(null);
    setLessonData({
      title: "",
      description: "",
      content: "",
      duration: "",
      videoUrl: "",
    });
  };


  if (!courseId) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
        <div className="text-4xl mb-3">💡</div>
        <h3 className="text-base font-bold text-slate-700">
          No Course Selected
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto mb-4">
          Please go to "My Courses Portal" and click a course to manage its
          content curricula.
        </p>
        <button
          onClick={onBackToCourses}
          className="bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Go to Courses Portal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Directory */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourses}
            className="text-slate-400 hover:text-slate-700 text-sm bg-slate-100 p-2 rounded-xl transition"
          >
            ⬅
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Course Lessons</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Create, organize, and manage lessons for your courses.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsEditing(false);
            setLessonData({
              title: "",
              description: "",
              content: "",
              duration: "",
              videoUrl: "",
            });
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition shadow-md shadow-blue-600/10"
        >
          + Add New Lesson
        </button>
      </div>

      {/* Lesson List Display */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Loading syllabus matrix...
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-base font-bold text-slate-700">
            This Course Has No Lessons Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Click the button above to seed your first interactive lesson
            lecture.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson._id}
              className="group bg-white p-5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 shadow-sm hover:border-blue-200 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    Lesson {index + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    ⏱ {lesson.duration} Minutes
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-base">
                  {lesson.title}
                </h4>
                <p className="text-xs text-slate-400 max-w-2xl">
                  {lesson.description}
                </p>
                <div className="pt-2 flex gap-3 text-[11px] text-indigo-500 font-medium">
                  <span>
                    🔗 Video Link:{" "}
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-indigo-700"
                    >
                      {lesson.videoUrl}
                    </a>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-start gap-2 opacity-100 transition sm:opacity-70 sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => openEditModal(lesson)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700"
                  aria-label={`Edit lesson ${index + 1}`}
                  title="Update lesson"
                >
                  <PencilLine className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLesson(lesson._id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                  aria-label={`Delete lesson ${index + 1}`}
                  title="Delete lesson"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD LESSON MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              {isEditing ? "Update Syllabus Node" : "Append New Syllabus Node"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Introduction to React Hooks"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lessonData.title}
                  onChange={(e) =>
                    setLessonData({ ...lessonData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summarize the learning core of this module..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                  value={lessonData.description}
                  onChange={(e) =>
                    setLessonData({
                      ...lessonData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Detailed Content / Notes
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Write text lecture notes or course details here..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                  value={lessonData.content}
                  onChange={(e) =>
                    setLessonData({ ...lessonData, content: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 45"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={lessonData.duration}
                    onChange={(e) =>
                      setLessonData({ ...lessonData, duration: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Video Stream URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/... or Vimeo link"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={lessonData.videoUrl}
                    onChange={(e) =>
                      setLessonData({ ...lessonData, videoUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl py-3 transition"
                >
                  {isEditing ? "Update Lesson" : "Inject Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
