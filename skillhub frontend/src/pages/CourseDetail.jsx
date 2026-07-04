import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../services/api.js";
import Swal from "sweetalert2";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  Infinity as InfinityIcon, 
  PlayCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await API.get(`courses/${id}`);
        setCourse(response.data.course || response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details. It might have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await API.post(`/enrollments/enroll`, { courseId: id });

      await Swal.fire({
        title: "Success!",
        text: "Successfully enrolled in the course",
        icon: "success",
        confirmButtonColor: "#7c3aed",
        width: "22em",
      });

      navigate("/student-dashboard");
    } catch (err) {
      Swal.fire({
        title: "Oops!",
        text: err.response?.data?.message || "Failed to enroll.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold text-sm uppercase tracking-widest">Synchronizing syllabus...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center max-w-md shadow-xl">
          <div className="text-5xl mb-6">🔍</div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">{error || "Course not found"}</h2>
          <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-black transition shadow-lg">
            <ArrowLeft size={18} /> Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const instructorFirstName = course.instructor?.firstName || "";
  const instructorLastName = course.instructor?.lastName || "";
  const fullInstructorName = (instructorFirstName || instructorLastName) 
    ? `${instructorFirstName} ${instructorLastName}` 
    : "Expert Instructor";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 text-white pt-12 pb-24 px-6 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-400/20 blur-3xl rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-purple-100 hover:text-white transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Curriculum
          </Link>

          <div className="mt-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-[0.2em]">
                   {course.category || "Interactive Module"}
                </span>
                <span className="flex items-center gap-1.5 text-purple-100 text-xs font-bold">
                   <Clock size={14} /> {course.duration || "Self-paced"}
                </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="mt-6 text-purple-100 text-lg md:text-xl font-medium leading-relaxed max-w-3xl opacity-90">
              {course.description}
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center font-black text-xl shadow-lg">
                {fullInstructorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] text-purple-200 font-black uppercase tracking-widest mb-0.5">Lead Instructor</p>
                <p className="text-xl font-bold">{fullInstructorName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 px-6 -mt-12 relative z-20">
        
        {/* LEFT COLUMN: Course Details */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* What You'll Learn Section */}
          {course.whatYouWillLearn?.length > 0 && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                   <ShieldCheck size={24} />
                </div>
                Learning Outcomes
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="mt-1 shrink-0">
                       <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-slate-600 font-semibold leading-relaxed group-hover:text-slate-900 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-black mb-6">Course Architect's Notes</h2>
            <p className="text-slate-500 leading-9 whitespace-pre-line text-lg font-medium">
              {course.description}
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Purchase Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-purple-200/40 overflow-hidden sticky top-8 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={course.thumbnail || "https://placehold.co/800x600"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer">
                 <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-purple-600 shadow-xl transition-transform group-hover:scale-110">
                    <PlayCircle size={32} strokeWidth={2.5} />
                 </div>
              </div>
            </div>

            <div className="p-10 space-y-8">
              {/* Price Display */}
              <div className="flex items-baseline gap-3">
                 <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {course.price > 0 ? `$${course.price}` : "Free"}
                 </span>
                 {course.price > 0 && <span className="text-slate-400 text-lg font-bold line-through">$99.99</span>}
              </div>

              {/* Action Button */}
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-60 shadow-xl shadow-purple-100 flex items-center justify-center gap-2"
              >
                {isEnrolling ? "Processing..." : "Start Learning Now"}
                {!isEnrolling && <ChevronRight size={20} strokeWidth={3} />}
              </button>

              {/* Course Perks */}
              <div className="space-y-5 pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Curriculum Highlights</p>
                <div className="grid gap-4 text-sm text-slate-600 font-bold">
                  <div className="flex items-center gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><PlayCircle size={18} /></div>
                    {course.duration || "Self-paced"} HD Content
                  </div>
                  {course.resourcesCount > 0 && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><FileText size={18} /></div>
                      {course.resourcesCount} Downloadable Nodes
                    </div>
                  )}
                  <div className="flex items-center gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><InfinityIcon size={18} /></div>
                    Lifetime Access Grant
                  </div>
                  {course.hasCertificate && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><Award size={18} /></div>
                      Verified Certification
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Support Link */}
              <Link
                to="/courses"
                className="block text-center text-slate-400 hover:text-purple-600 font-black text-[11px] uppercase tracking-widest pt-4 transition-colors"
              >
                Explore More Learning Paths
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}