// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import { API } from "../../services/api.js";

// export default function CoursesTab({ onViewLessons }) {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [courseData, setCourseData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     price: 0,
//     duration: "",
//     level: "Beginner",
//     resourcesCount: 0,
//     hasCertificate: true,
//   });

//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");

//   const [learningPoints, setLearningPoints] = useState(["", ""]);

//   const fetchMyCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/courses/");
//       setCourses(res.data.courses || res.data || []);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyCourses();
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setThumbnailFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   // Dynamic Array Input Handlers
//   const handleLearningPointChange = (index, value) => {
//     const updatedPoints = [...learningPoints];
//     updatedPoints[index] = value;
//     setLearningPoints(updatedPoints);
//   };
//   const addLearningPointField = () =>
//     setLearningPoints([...learningPoints, ""]);
//   const removeLearningPointField = (index) => {
//     if (learningPoints.length > 1) {
//       setLearningPoints(learningPoints.filter((_, i) => i !== index));
//     }
//   };

//   const handleCreateCourse = async (e) => {
//     e.preventDefault();

//     if (!thumbnailFile) {
//       return Swal.fire(
//         "Warning",
//         "Please upload a course thumbnail image",
//         "warning",
//       );
//     }

//     try {
//       const formData = new FormData();

//       formData.append("title", courseData.title);
//       formData.append("description", courseData.description);
//       formData.append("category", courseData.category);
//       formData.append("price", courseData.price);
//       formData.append("duration", courseData.duration);
//       formData.append("level", courseData.level);
//       formData.append("resourcesCount", courseData.resourcesCount);
//       formData.append("hasCertificate", courseData.hasCertificate);

//       formData.append("thumbnail", thumbnailFile);

//       const validPoints = learningPoints.filter((point) => point.trim() !== "");
//       formData.append("whatYouWillLearn", JSON.stringify(validPoints));

//       await API.post("/courses/create", formData);

//       Swal.fire("Success", "Course created successfully!", "success");
//       setIsModalOpen(false);

//       // Reset All States
//       setCourseData({
//         title: "",
//         description: "",
//         category: "",
//         price: 0,
//         duration: "",
//         level: "Beginner",
//         resourcesCount: 0,
//         hasCertificate: true,
//       });
//       setThumbnailFile(null);
//       setImagePreview("");
//       setLearningPoints(["", ""]);

//       fetchMyCourses();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data?.message || "Failed to create course",
//         "error",
//       );
//     }
//   };


import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../services/api.js";
import { PencilLine, Trash2 } from "lucide-react";

export default function CoursesTab({ onViewLessons }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🟢 Course Edit සඳහා අලුත් States
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    duration: "",
    level: "Beginner",
    resourcesCount: 0,
    hasCertificate: true,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [learningPoints, setLearningPoints] = useState(["", ""]);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/courses/");
      setCourses(res.data.courses || res.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Dynamic Array Input Handlers
  const handleLearningPointChange = (index, value) => {
    const updatedPoints = [...learningPoints];
    updatedPoints[index] = value;
    setLearningPoints(updatedPoints);
  };
  const addLearningPointField = () =>
    setLearningPoints([...learningPoints, ""]);
  const removeLearningPointField = (index) => {
    if (learningPoints.length > 1) {
      setLearningPoints(learningPoints.filter((_, i) => i !== index));
    }
  };

  // 🟢 Handle Create OR Update Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Create වෙලාවට අනිවාර්යයෙන්ම thumbnail එකක් ඕනේ, හැබැයි Edit වෙලාවට optional
    if (!isEditing && !thumbnailFile) {
      return Swal.fire(
        "Warning",
        "Please upload a course thumbnail image",
        "warning",
      );
    }

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("price", courseData.price);
      formData.append("duration", courseData.duration);
      formData.append("level", courseData.level);
      formData.append("resourcesCount", courseData.resourcesCount);
      formData.append("hasCertificate", courseData.hasCertificate);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const validPoints = learningPoints.filter((point) => point.trim() !== "");
      formData.append("whatYouWillLearn", JSON.stringify(validPoints));

      if (isEditing) {
        // 🟢 UPDATE API CALL
        await API.put(`/courses/${editingCourseId}`, formData);
        Swal.fire("Success", "Course updated successfully!", "success");
      } else {
        // CREATE API CALL
        await API.post("/courses/create", formData);
        Swal.fire("Success", "Course created successfully!", "success");
      }

      closeModal();
      fetchMyCourses();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Operation failed",
        "error",
      );
    }
  };

  // 🟢 Course Delete Function
  const handleDeleteCourse = async (e, courseId) => {
    e.stopPropagation(); // Card එක ක්ලික් වෙලා Lessons tab එකට auto navigate වීම වළක්වයි!

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the course and all associated data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/courses/${courseId}`);
        Swal.fire("Deleted!", "Your course has been deleted.", "success");
        fetchMyCourses(); // List එක refresh කිරීම
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to delete course", "error");
      }
    }
  };

  // 🟢 Edit Modal එක පරණ Data වලින් පුරවා Open කරන Function එක
  const openEditModal = (e, course) => {
    e.stopPropagation(); // Next tab navigation වළක්වයි
    setIsEditing(true);
    setEditingCourseId(course._id);
    
    setCourseData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      duration: course.duration,
      level: course.level || "Beginner",
      resourcesCount: course.resourcesCount || 0,
      hasCertificate: course.hasCertificate ?? true,
    });

    // Cloudinary එකේ තියෙන පරණ thumbnail එක preview එකට දමයි
    setImagePreview(course.thumbnail || "");
    setThumbnailFile(null);

    // පරණ learning points තිබේ නම් ඒවා dynamic fields වලට පිරවීම, නැත්නම් හිස් fields 2ක් දීම
    if (course.whatYouWillLearn && course.whatYouWillLearn.length > 0) {
      setLearningPoints(course.whatYouWillLearn);
    } else {
      setLearningPoints(["", ""]);
    }

    setIsModalOpen(true);
  };

  // Modal එක වසන විට සියලුම States මුල සිට පිරිසිදු කිරීම
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingCourseId(null);
    setCourseData({
      title: "",
      description: "",
      category: "",
      price: 0,
      duration: "",
      level: "Beginner",
      resourcesCount: 0,
      hasCertificate: true,
    });
    setThumbnailFile(null);
    setImagePreview("");
    setLearningPoints(["", ""]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            My Course Directory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage and view your published curricula.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition shadow-md shadow-blue-600/10"
        >
          + Create New Course
        </button>
      </div>

      {/* Course Grid Layout */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Loading your courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-base font-bold text-slate-700">
            No Courses Created Yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Click the button above to launch your first course portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => onViewLessons && onViewLessons(course._id)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">📘</span>
                  )}
                  <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                    {course.category}
                  </span>

                  <div className="absolute left-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => openEditModal(event, course)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-lg shadow-slate-900/10 transition hover:bg-blue-50 hover:text-blue-700"
                      aria-label={`Edit course ${course.title}`}
                      title="Update course"
                    >
                      <PencilLine className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleDeleteCourse(event, course._id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-lg shadow-slate-900/10 transition hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Delete course ${course.title}`}
                      title="Delete course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md">
                      {course.level}
                    </span>
                    {course.hasCertificate && (
                      <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-md">
                        📜 Certificate
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base line-clamp-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  ⏱ {course.duration || "Self-paced"}
                </span>
                <span className="text-sm font-black text-blue-600">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE COURSE MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh] space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              Launch New Course
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Full Stack MERN Development"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Course Description
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Provide an engaging summary of the course..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Programming"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={courseData.category}
                    onChange={(e) =>
                      setCourseData({ ...courseData, category: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 3500"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 20 hours"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={courseData.duration}
                    onChange={(e) =>
                      setCourseData({ ...courseData, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={courseData.level}
                    onChange={(e) =>
                      setCourseData({ ...courseData, level: e.target.value })
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Resources Count
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 25"
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none"
                    value={courseData.resourcesCount}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        resourcesCount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* 🖼️ FILE UPLOAD INPUT FOR MULTER */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Course Thumbnail (Select File)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-slate-200 rounded-xl p-2 text-sm bg-slate-50 focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Array Inputs: What You Will Learn */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500">
                  What You Will Learn (Key Points)
                </label>
                {learningPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      placeholder={`e.g., Point ${index + 1}`}
                      className="flex-1 border border-slate-200 rounded-xl p-2.5 text-sm bg-slate-50 focus:outline-none"
                      value={point}
                      onChange={(e) =>
                        handleLearningPointChange(index, e.target.value)
                      }
                    />
                    {learningPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLearningPointField(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-xl text-xs"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLearningPointField}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  + Add Another Point
                </button>
              </div>

              {/* Checkbox for Certificate */}
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="hasCertificate"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  checked={courseData.hasCertificate}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      hasCertificate: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="hasCertificate"
                  className="text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Provide a Certificate upon Completion
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl py-3 transition"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
