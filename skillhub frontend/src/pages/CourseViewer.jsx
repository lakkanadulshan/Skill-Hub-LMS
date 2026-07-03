import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../services/api.js";

export default function CourseViewer() {
  const { courseId } = useParams(); 
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 YouTube URL එකෙන් Video ID එක වෙන් කර නිවැරදි Embed URL එක සාදන සරල Function එකක්
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    
    // YouTube standard, share, සහ shorts ලින්ක්ස් ඔක්කොටම ගැලපෙන Regex එකක්
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`;
    }
    
    return url; // YouTube නොවෙයි නම් සාමාන්‍ය URL එකම රිටන් කරයි
  };

  // Lessons ටික Fetch කරගැනීම
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        
        // 🟢 Local storage එකෙන් දැනට ඉන්න user ගේ token එක කෙලින්ම ලබා ගැනීම
        const token = localStorage.getItem("token");
        
        // Backend එකේ getLessonByCourse API එකට request එක නිවැරදි headers සමඟ යවයි
        const res = await API.get(`/lessons/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const fetchedLessons = res.data.lessons || [];
        setLessons(fetchedLessons);
        
        if (fetchedLessons.length > 0) {
          setActiveLesson(fetchedLessons[0]);
        }
      } catch (err) {
        console.error("Error fetching course syllabus:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseContent();
  }, [courseId]);

  if (loading) {
    return <div className="text-center py-24 text-slate-500 text-sm">Loading your digital workspace...</div>;
  }

  return (
  <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

    {/* ================= Sidebar ================= */}
    <aside className="w-[340px] border-r border-white/10 bg-white/5 backdrop-blur-xl flex flex-col">

      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-sm"
        >
          ← Back
        </button>

        <h2 className="mt-5 text-2xl font-black">
          Course Curriculum
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          {lessons.length} Lessons Available
        </p>
      </div>

      {/* Lessons */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">

        {lessons.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No syllabus nodes seeded yet.
          </div>
        ) : (
          lessons.map((lesson, index) => {

            const isActive = activeLesson?._id === lesson._id;

            return (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`group relative w-full rounded-2xl p-4 border transition-all duration-300 text-left overflow-hidden ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 shadow-lg shadow-blue-600/20"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-800/70"
                }`}
              >

                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-full" />
                )}

                <div className="flex items-center justify-between mb-2">

                  <span className="text-[11px] uppercase tracking-widest text-slate-400">
                    Module {index + 1}
                  </span>

                  <span className="px-2 py-1 rounded-full bg-slate-800 text-[10px]">
                    {lesson.duration} min
                  </span>

                </div>

                <h3 className="font-bold text-white text-sm leading-6 line-clamp-2">
                  {lesson.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 truncate">
                  Click to watch lesson
                </p>

              </button>
            );
          })
        )}

      </div>

    </aside>

    {/* ================= Main ================= */}

    <main className="flex-1 overflow-y-auto">

      {activeLesson ? (

        <div className="max-w-7xl mx-auto px-10 py-8">

          {/* Video */}

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">

            <div className="aspect-video">

              {activeLesson.videoUrl?.includes("youtube.com") ||
              activeLesson.videoUrl?.includes("youtu.be") ? (

                <iframe
                  title={activeLesson.title}
                  src={getYouTubeEmbedUrl(activeLesson.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

              ) : (

                <video
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full"
                />

              )}

            </div>

          </div>

          {/* Title */}

          <div className="mt-8">

            <div className="flex items-center gap-3">

              <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold">
                Current Lesson
              </span>

              <span className="text-slate-500 text-sm">
                {activeLesson.duration} Minutes
              </span>

            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight">
              {activeLesson.title}
            </h1>

            <p className="mt-4 text-slate-400 max-w-4xl leading-8">
              {activeLesson.description}
            </p>

          </div>

          {/* Notes */}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

            <div className="border-b border-white/10 px-8 py-5 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg">
                📘
              </div>

              <div>

                <h3 className="font-bold text-lg">
                  Lecture Notes
                </h3>

                <p className="text-xs text-slate-400">
                  Read along with the lesson
                </p>

              </div>

            </div>

            <div className="p-8">

              <p className="whitespace-pre-wrap leading-9 text-slate-300">
                {activeLesson.content}
              </p>

            </div>

          </div>

        </div>

      ) : (

        <div className="h-full flex items-center justify-center">

          <div className="text-center">

            <div className="text-7xl mb-6">
              🎥
            </div>

            <h2 className="text-3xl font-bold mb-3">
              Ready to Learn?
            </h2>

            <p className="text-slate-400">
              Select a lesson from the left sidebar to start watching.
            </p>

          </div>

        </div>

      )}

    </main>

  </div>
    );
}