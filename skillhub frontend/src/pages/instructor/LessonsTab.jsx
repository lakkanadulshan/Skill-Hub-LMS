import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API } from "../../services/api.js";
import { PencilLine, Trash2, ArrowLeft, Plus, Play, FileText, Link as LinkIcon, Clock, X, Upload } from "lucide-react";

export default function LessonsTab({ courseId, onBackToCourses }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    videoUrl: "",
    assetUrl: "",
  });

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return Swal.fire("Error", "No course selected", "error");

    try {
      const formData = new FormData();
      formData.append("title", lessonData.title);
      formData.append("description", lessonData.description);
      formData.append("content", lessonData.content);
      formData.append("duration", Number(lessonData.duration));
      formData.append("videoUrl", lessonData.videoUrl);
      formData.append("course", courseId);
      formData.append("assetUrl", lessonData.assetUrl);

      if (selectedFile) formData.append("pdfFile", selectedFile);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await API.put(`/lessons/update/${editingLessonId}`, formData, config);
        Swal.fire("Success", "Lesson updated successfully!", "success");
      } else {
        await API.post("/lessons/create", formData, config);
        Swal.fire("Success", "Lesson added successfully!", "success");
      }

      closeModal();
      fetchLessons();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this lesson!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/lessons/delete/${lessonId}`);
        Swal.fire("Deleted!", "Your lesson has been deleted.", "success");
        fetchLessons();
      } catch (err) {
        Swal.fire("Error", "Failed to delete lesson", "error");
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
      assetUrl: lesson.assetUrl || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingLessonId(null);
    setSelectedFile(null);
    setLessonData({ title: "", description: "", content: "", duration: "", videoUrl: "", assetUrl: "" });
  };

  if (!courseId) {
    return (
      <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center shadow-sm">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
           <Play size={30} className="text-purple-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-800">No Course Selected</h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto mb-8 font-medium">Please select a curriculum from the portal to manage its interactive modules.</p>
        <button onClick={onBackToCourses} className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl hover:bg-black transition-all">
          Go to Courses Portal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBackToCourses} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all border border-slate-100">
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lesson Architect</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Course Syllabus Matrix</p>
          </div>
        </div>

        <button
          onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95 flex items-center gap-2 text-sm shadow-lg shadow-purple-100"
        >
          <Plus size={18} strokeWidth={3} /> Add Module
        </button>
      </div>

      {/* --- LESSON LIST --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
           <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-slate-400 font-bold text-sm">Mapping course nodes...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🎬</div>
          <h3 className="text-xl font-black text-slate-800">Start Building Your Syllabus</h3>
          <p className="text-slate-500 mt-2 font-medium">Add your first lecture, video, or resource to this course.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={lesson._id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-purple-50 text-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-100">
                    Module {index + 1}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    <Clock size={12} /> {lesson.duration} Mins
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">{lesson.title}</h4>
                <p className="text-slate-400 text-sm font-medium line-clamp-1">{lesson.description}</p>
                
                {/* Resources Indicator */}
                <div className="flex flex-wrap gap-2 pt-1">
                   {lesson.videoUrl && <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-md font-bold border border-slate-100 flex items-center gap-1.5"><Play size={10} /> Video</span>}
                   {lesson.assetUrl && <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-md font-bold border border-slate-100 flex items-center gap-1.5"><LinkIcon size={10} /> Drive Link</span>}
                   {(lesson.pdfUrl || lesson.pdfFile) && <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-1 rounded-md font-bold border border-slate-100 flex items-center gap-1.5"><FileText size={10} /> PDF</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <button
                  onClick={() => openEditModal(lesson)}
                  className="flex-1 md:w-12 md:h-12 py-3 md:py-0 rounded-2xl bg-slate-50 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all shadow-sm font-bold text-sm md:text-base"
                >
                  <PencilLine size={18} /> <span className="md:hidden ml-2">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteLesson(lesson._id)}
                  className="flex-1 md:w-12 md:h-12 py-3 md:py-0 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm font-bold text-sm md:text-base"
                >
                  <Trash2 size={18} /> <span className="md:hidden ml-2">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- LESSON MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                 {isEditing ? "Update Module" : "Inject Module Node"}
               </h3>
               <button onClick={closeModal} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Module Identity</label>
                  <input
                    type="text" required placeholder="Introduction to React"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-500 transition-all"
                    value={lessonData.title}
                    onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Brief Abstract</label>
                  <input
                    type="text" required placeholder="Core concepts of this lesson..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-500 transition-all"
                    value={lessonData.description}
                    onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lecture Script / Notes</label>
                  <textarea
                    rows="4" required placeholder="Detailed lesson content..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-500 transition-all"
                    value={lessonData.content}
                    onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                  <input
                    type="number" required min="1"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={lessonData.duration}
                    onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Video Stream URL</label>
                  <input
                    type="url" required placeholder="YouTube or Vimeo Link"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-500"
                    value={lessonData.videoUrl}
                    onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">External Resource Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input
                    type="url" placeholder="Google Drive Link"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-purple-500"
                    value={lessonData.assetUrl}
                    onChange={(e) => setLessonData({ ...lessonData, assetUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Document Attachment</label>
                 <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                       <Upload size={24} />
                    </div>
                    <div className="flex-grow">
                       <p className="text-xs font-bold text-slate-500 mb-2">Upload PDF lecture material</p>
                       <input type="file" accept="application/pdf" className="text-xs font-bold text-purple-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-purple-100 file:text-purple-700 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])} />
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition">
                  Dismiss
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-100 hover:opacity-90 transition active:scale-95">
                  {isEditing ? "Update Module" : "Inject Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}