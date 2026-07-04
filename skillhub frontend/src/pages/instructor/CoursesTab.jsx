import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../services/api.js";
import { PencilLine, Trash2, Plus, BookOpen, Clock, Award, Layers, Image as ImageIcon, X } from "lucide-react";

export default function CoursesTab({ onViewLessons }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Course Edit States
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

  const handleLearningPointChange = (index, value) => {
    const updatedPoints = [...learningPoints];
    updatedPoints[index] = value;
    setLearningPoints(updatedPoints);
  };
  const addLearningPointField = () => setLearningPoints([...learningPoints, ""]);
  const removeLearningPointField = (index) => {
    if (learningPoints.length > 1) {
      setLearningPoints(learningPoints.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !thumbnailFile) {
      return Swal.fire("Warning", "Please upload a course thumbnail image", "warning");
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

      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      const validPoints = learningPoints.filter((point) => point.trim() !== "");
      formData.append("whatYouWillLearn", JSON.stringify(validPoints));

      if (isEditing) {
        await API.put(`/courses/${editingCourseId}`, formData);
        Swal.fire("Success", "Course updated successfully!", "success");
      } else {
        await API.post("/courses/create", formData);
        Swal.fire("Success", "Course created successfully!", "success");
      }

      closeModal();
      fetchMyCourses();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteCourse = async (e, courseId) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the course!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/courses/${courseId}`);
        Swal.fire("Deleted!", "Your course has been deleted.", "success");
        fetchMyCourses();
      } catch (err) {
        Swal.fire("Error", "Failed to delete course", "error");
      }
    }
  };

  const openEditModal = (e, course) => {
    e.stopPropagation();
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
    setImagePreview(course.thumbnail || "");
    setThumbnailFile(null);
    setLearningPoints(course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : ["", ""]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingCourseId(null);
    setCourseData({ title: "", description: "", category: "", price: 0, duration: "", level: "Beginner", resourcesCount: 0, hasCertificate: true });
    setThumbnailFile(null);
    setImagePreview("");
    setLearningPoints(["", ""]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Curriculum</h2>
          <p className="text-slate-500 font-medium mt-1">Design and manage your global learning experiences.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 shadow-lg shadow-purple-100"
        >
          <Plus size={20} strokeWidth={3} /> Create Course
        </button>
      </div>

      {/* --- GRID LAYOUT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
           <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-400 font-bold text-sm">Synchronizing your directory...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">Your library is empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Start your journey by creating your first interactive course module.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => onViewLessons && onViewLessons(course._id)}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 flex flex-col cursor-pointer"
            >
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <img
                  src={course.thumbnail || "https://placehold.co/600x400"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   <span className="bg-white/90 backdrop-blur-md text-purple-700 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-white uppercase tracking-widest">
                    {course.category}
                  </span>
                </div>

                {/* Edit/Delete Actions Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0 transition-transform">
                  <button
                    onClick={(e) => openEditModal(e, course)}
                    className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-xl hover:bg-purple-600 hover:text-white transition-all"
                  >
                    <PencilLine size={18} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCourse(e, course._id)}
                    className="w-10 h-10 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-xl hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-8 flex-grow space-y-4">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    <Layers size={10} /> {course.level}
                  </span>
                  {course.hasCertificate && (
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      <Award size={10} /> Certificate
                    </span>
                  )}
                </div>
                <h4 className="font-black text-slate-900 text-xl leading-tight group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h4>
                <p className="text-slate-400 text-sm line-clamp-2 font-medium">
                  {course.description}
                </p>
              </div>

              <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Clock size={14} /> {course.duration || "Self-paced"}
                </div>
                <span className="text-2xl font-black text-slate-900">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CREATE / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                 {isEditing ? "Update Curriculum" : "New Learning Path"}
               </h3>
               <button onClick={closeModal} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Title & Desc */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course Identity</label>
                  <input
                    type="text" required placeholder="e.g. Mastering UX Design"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-purple-500 outline-none transition-all"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Executive Summary</label>
                  <textarea
                    rows="3" required placeholder="What makes this course unique?"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-purple-500 outline-none transition-all"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Multi-column Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                   <input
                    type="text" required placeholder="Design"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (USD)</label>
                   <input
                    type="number" required min="0"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <input
                    type="text" required placeholder="10h 30m"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={courseData.duration}
                    onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Expertise</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500 appearance-none"
                    value={courseData.level}
                    onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resources</label>
                  <input
                    type="number" required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={courseData.resourcesCount}
                    onChange={(e) => setCourseData({ ...courseData, resourcesCount: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Visual Branding</label>
                 <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                       {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-200" size={30} />}
                    </div>
                    <div className="flex-grow">
                       <p className="text-xs font-bold text-slate-500 mb-2">Upload high-res thumbnail (16:9)</p>
                       <input type="file" accept="image/*" className="text-xs font-bold text-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-purple-100 file:text-purple-700 cursor-pointer" onChange={handleFileChange} />
                    </div>
                 </div>
              </div>

              {/* Dynamic Points */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Learning Outcomes</label>
                <div className="space-y-3">
                  {learningPoints.map((point, index) => (
                    <div key={index} className="flex gap-3 items-center group">
                      <input
                        type="text" required placeholder={`Key takeaway ${index + 1}`}
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                        value={point}
                        onChange={(e) => handleLearningPointChange(index, e.target.value)}
                      />
                      {learningPoints.length > 1 && (
                        <button type="button" onClick={() => removeLearningPointField(index)} className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addLearningPointField} className="text-xs font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 ml-1">
                  + Add Outcome Node
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 hover:opacity-90 transition active:scale-95"
                >
                  {isEditing ? "Update Curriculum" : "Launch Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}