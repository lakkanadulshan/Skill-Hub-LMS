import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../services/api.js";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Clock, 
  ChevronRight,
  MonitorPlay
} from "lucide-react";

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  // 🟢 Tab Control State එක
  const [activeTab, setActiveTab] = useState("notes"); 

  const progressStorageKey = courseId
    ? `skillhub-course-progress:${courseId}`
    : null;

  const getCachedProgress = () => {
    if (!progressStorageKey) return null;
    try {
      const rawValue = localStorage.getItem(progressStorageKey);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch {
      return null;
    }
  };

  const saveProgressSnapshot = (nextCompletedLessons) => {
    const uniqueCompletedLessons = Array.from(new Set(nextCompletedLessons));
    const nextProgress =
      lessons.length > 0
        ? Math.round((uniqueCompletedLessons.length / lessons.length) * 100)
        : 0;

    setCompletedLessons(uniqueCompletedLessons);
    setProgress(nextProgress);

    if (progressStorageKey) {
      localStorage.setItem(
        progressStorageKey,
        JSON.stringify({
          completedLessons: uniqueCompletedLessons,
          progress: nextProgress,
        }),
      );
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`;
    }
    return url;
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const cachedProgress = getCachedProgress();

        const [lessonsResult, progressResult] = await Promise.allSettled([
          API.get(`/lessons/course/${courseId}`),
          API.get(`/enrollments/${courseId}/progress`),
        ]);

        if (lessonsResult.status !== "fulfilled") {
          throw lessonsResult.reason;
        }

        const fetchedLessons = lessonsResult.value.data.lessons || [];
        setLessons(fetchedLessons);

        if (fetchedLessons.length > 0) {
          setActiveLesson(fetchedLessons[0]);
        }

        const serverProgress =
          progressResult.status === "fulfilled"
            ? progressResult.value.data
            : null;

        const storedCompletedLessons = Array.isArray(
          cachedProgress?.completedLessons,
        )
          ? cachedProgress.completedLessons
          : [];
        const serverCompletedLessons = Array.isArray(
          serverProgress?.completedLessons,
        )
          ? serverProgress.completedLessons
          : [];

        const nextCompletedLessons =
          storedCompletedLessons.length > 0
            ? storedCompletedLessons
            : serverCompletedLessons;

        if (nextCompletedLessons.length > 0) {
          const nextProgress =
            fetchedLessons.length > 0
              ? Math.round(
                  (nextCompletedLessons.length / fetchedLessons.length) * 100,
                )
              : Number(
                  cachedProgress?.progress || serverProgress?.progress || 0,
                );

          setCompletedLessons(nextCompletedLessons);
          setProgress(nextProgress);
        } else {
          setCompletedLessons([]);
          setProgress(
            Number(serverProgress?.progress || cachedProgress?.progress || 0),
          );
        }
      } catch (err) {
        console.error("Error fetching course syllabus:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    setActiveTab("notes");
  }, [activeLesson]);

  const handleToggleComplete = async (e, lessonId) => {
    e.stopPropagation();
    try {
      const isCurrentlyCompleted = completedLessons.includes(lessonId);
      const nextCompletedLessons = isCurrentlyCompleted
        ? completedLessons.filter((id) => id !== lessonId)
        : [...completedLessons, lessonId];

      saveProgressSnapshot(nextCompletedLessons);

      const res = await API.put(`/enrollments/${courseId}/progress`, {
        courseId,
        lessonId,
        completed: !isCurrentlyCompleted,
      });

      if (res.data.success) {
        setCompletedLessons(res.data.completedLessons || nextCompletedLessons);
        setProgress(res.data.progress);
        
        if (res.data.progress === 100) {
          Swal.fire({
            title: "Congratulations! 🎉",
            text: "You have completed the full course curriculum.",
            icon: "success",
            confirmButtonColor: "#7c3aed"
          });
        }
      }
    } catch (err) {
      console.error("Failed to update checklist:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Synchronizing workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-[380px] border-r border-slate-100 bg-white flex flex-col shadow-[10px_0_40px_-15px_rgba(0,0,0,0.03)] z-50">
        
        {/* Sidebar Header */}
        <div className="p-8 border-b border-slate-50 space-y-6">
          <button 
            onClick={() => navigate("/student-dashboard")} 
            className="group flex items-center gap-2 text-slate-400 hover:text-purple-600 font-black text-[11px] uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Exit Classroom
          </button>
          
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Curriculum</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Course Module Navigator</p>
          </div>

          {/* Progress Section */}
          <div className="space-y-2.5 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>COURSE PROGRESS</span>
              <span className="text-purple-600 font-black">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Lessons List View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {lessons.map((lesson, index) => {
            const isActive = activeLesson?._id === lesson._id;
            const isCompleted = completedLessons.includes(lesson._id);
            return (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full rounded-[1.8rem] p-5 border transition-all duration-300 text-left flex items-start justify-between gap-4 group ${
                  isActive 
                    ? "border-purple-600 bg-purple-50 shadow-lg shadow-purple-100" 
                    : "border-slate-50 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {index + 1}
                     </span>
                     <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase">
                        <Clock size={10} /> {lesson.duration}m
                     </span>
                  </div>
                  <h3 className={`font-black text-sm leading-tight transition-colors ${isActive ? 'text-purple-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {lesson.title}
                  </h3>
                </div>

                <div className="shrink-0 pt-1">
                   <div 
                    onClick={(e) => handleToggleComplete(e, lesson._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-200 hover:border-purple-300'
                    }`}
                   >
                     {isCompleted && <CheckCircle2 size={14} strokeWidth={3} />}
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto bg-white">
        {activeLesson ? (
          <div className="max-w-6xl mx-auto px-10 py-12 animate-in fade-in duration-700">
            
            {/* Video Container */}
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-black shadow-2xl shadow-slate-200 relative aspect-video">
              {activeLesson.videoUrl?.includes("youtube.com") || activeLesson.videoUrl?.includes("youtu.be") ? (
                <iframe 
                  title={activeLesson.title} 
                  src={getYouTubeEmbedUrl(activeLesson.videoUrl)} 
                  className="w-full h-full" 
                  allowFullScreen 
                />
              ) : (
                <video src={activeLesson.videoUrl} controls className="w-full h-full" />
              )}
            </div>

            {/* Title & Metadata */}
            <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] border border-purple-100">
                    Live Stream Available
                  </span>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <MonitorPlay size={14} /> Module Detail
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeLesson.title}
                </h1>
              </div>
              <div className="shrink-0 bg-slate-50 px-6 py-4 rounded-[1.8rem] border border-slate-100 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
                    <Clock size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-black text-slate-900">{activeLesson.duration} Minutes</p>
                 </div>
              </div>
            </div>

            <p className="mt-8 text-slate-500 text-lg leading-relaxed font-medium max-w-4xl">
              {activeLesson.description}
            </p>

            {/* TABS VIEW */}
            <div className="mt-16 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
              
              {/* Tab Header Selector */}
              <div className="border-b border-slate-50 px-10 flex gap-10 bg-slate-50/30">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`py-6 font-black text-[11px] uppercase tracking-[0.2em] transition relative ${
                    activeTab === "notes" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📘 Lecture Notes
                  {activeTab === "notes" && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-full" />}
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`py-6 font-black text-[11px] uppercase tracking-[0.2em] transition relative ${
                    activeTab === "resources" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📦 Course Resources
                  {activeTab === "resources" && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                </button>
              </div>

              {/* Tab Content Rendering Area */}
              <div className="p-10">
                {activeTab === "notes" ? (
                  <div className="whitespace-pre-wrap leading-[2.2] text-slate-600 text-lg font-medium">
                    {activeLesson.content || "No textual notes loaded for this module node."}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Available Materials</h4>
                      <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{activeLesson.resources?.length || 0} Assets Found</span>
                    </div>
                    
                    {(!activeLesson.resources || activeLesson.resources.length === 0) ? (
                      <div className="py-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                         <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No resources linked yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeLesson.resources.map((res, idx) => (
                          <div key={idx} className="flex items-center justify-between p-5 rounded-[1.8rem] border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg transition group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl transition group-hover:bg-indigo-50">
                                {res.type === "link" ? "🔗" : "📄"}
                              </div>
                              <div className="truncate">
                                <h5 className="text-sm font-black text-slate-900 truncate tracking-tight">{res.name}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                   {res.type === "link" ? <BookOpen size={10} /> : <FileText size={10} />} External Asset
                                </p>
                              </div>
                            </div>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-5 py-2.5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                                res.type === "link" 
                                  ? "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white shadow-sm shadow-purple-100" 
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm shadow-emerald-100"
                              }`}
                            >
                              {res.type === "link" ? "Open Node ↗" : "Download Node 📥"}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-10">
            <div className="animate-in zoom-in duration-1000">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
                 <PlayCircle size={48} className="text-purple-600" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ready to Master this Module?</h2>
              <p className="text-slate-400 mt-4 text-lg font-medium max-w-sm mx-auto">
                Select a learning node from the curriculum sidebar to begin your journey.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
