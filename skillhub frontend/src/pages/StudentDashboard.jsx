import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api";
import Swal from "sweetalert2";
import { 
  BookOpen, 
  Search, 
  Clock, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  PlayCircle,
  AlertCircle
} from "lucide-react";

export default function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await API.get("/courses/enrolled");
        const courses = response.data.courses || response.data;
        setEnrolledCourses(courses);
        setFilteredCourses(courses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    const filtered = enrolledCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredCourses(filtered);
  }, [searchTerm, enrolledCourses]);

  const handleUnenroll = async (courseId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to unenroll from this course node?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, unenroll",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post(`/enrollments/${courseId}/unenroll`);
      const updatedCourses = enrolledCourses.filter(
        (course) => course._id !== courseId,
      );
      setEnrolledCourses(updatedCourses);
      setFilteredCourses(updatedCourses);

      Swal.fire({
        title: "Unenrolled!",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });
    } catch (err) {
      Swal.fire({
        title: "Oops!",
        text: err.response?.data?.message || "Failed to unenroll.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* --- PREMIUM DASHBOARD HERO --- */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white pt-20 pb-28 px-6 overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-400/20 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles size={14} className="text-purple-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Student Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Welcome back, <br />
              <span className="text-purple-200">{user?.firstName || "Learner"}</span>
            </h1>
            <p className="mt-6 text-indigo-100 text-lg font-medium opacity-90 max-w-lg">
              Synchronize with your learning nodes and continue your professional development journey.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-5 rounded-[2rem] text-center shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Enrolled</p>
                <h3 className="text-3xl font-black">{enrolledCourses.length}</h3>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-4">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search your library..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-purple-600 outline-none transition-all"
              />
           </div>
           <Link to="/courses" className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-[2rem] hover:bg-black transition-all shadow-lg shrink-0">
              Explore More
           </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-[2rem] text-center mb-10 flex items-center justify-center gap-3 font-bold">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Courses Display */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📚</div>
            <h3 className="text-2xl font-black text-slate-900">No active enrollments found</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto mb-8">Ready to start? Discover expert-led courses in our global directory.</p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-100 hover:opacity-90 transition active:scale-95"
            >
              Browse Library <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
              >
                {/* Thumbnail Area */}
                <div className="h-56 bg-slate-100 relative overflow-hidden">
                  <img
                    src={course.thumbnail || "https://placehold.co/600x400?text=SkillHub+Node"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-purple-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-white">
                      {course.category || "General"}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200">
                          {course.instructor?.firstName?.charAt(0) || "I"}
                       </div>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          By {course.instructor?.firstName} {course.instructor?.lastName}
                       </p>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-slate-50">
                    <button
                      onClick={() => navigate(`/course-viewer/${course._id}`)}
                      className="group/btn w-full bg-slate-900 hover:bg-purple-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                      Continue Learning <PlayCircle size={16} fill="white" className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => handleUnenroll(course._id)}
                      className="flex items-center justify-center gap-2 w-full py-3 text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] transition group/un"
                    >
                      <LogOut size={14} className="group-hover/un:-translate-x-1 transition-transform" /> Unenroll Node
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}