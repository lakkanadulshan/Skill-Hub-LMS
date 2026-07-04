import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlayCircle, 
  LogOut, 
  ChevronRight, 
  User as UserIcon,
  Settings
} from "lucide-react";

import OverviewTab from "./OverviewTab";
import CoursesTab from "./CoursesTab";
import LessonsTab from "./LessonsTab";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  const handleViewLessons = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveTab("lessons");
  };
 
  useEffect(() => {
    if (!user || user.role !== "instructor") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to view the Instructor Dashboard!",
        confirmButtonColor: "#7c3aed",
      });
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again to continue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#94a3b8",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* ================= MODERN SIDEBAR ================= */}
      <aside className="w-72 bg-white flex flex-col justify-between border-r border-slate-100 shadow-[10px_0_40px_-15px_rgba(0,0,0,0.03)] relative z-50">
        <div>
          {/* Brand Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-100">
                <img src="/skillhub logo.png" alt="SkillHub" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                skillhub
              </span>
            </div>

            {/* User Profile Card Inside Sidebar */}
            <div className="mt-8 p-4 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-xs border-2 border-white">
                {user?.firstName?.charAt(0)?.toUpperCase() || "I"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest">
                  Instructor
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-2">
            {[
              { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
              { id: "courses", label: "My Courses", icon: <BookOpen size={18} /> },
              { id: "lessons", label: "Content Matrix", icon: <PlayCircle size={18} /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xl shadow-purple-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-purple-600"} transition-colors`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={14} strokeWidth={3} />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Modern Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "courses" && "Course Directory"}
              {activeTab === "lessons" && "Lesson Architect"}
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              LMS Management Portal
            </p>
          </div>

          {/* User Meta */}
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs font-bold text-slate-400">
                {user?.email}
              </p>
            </div>

            <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all">
              <UserIcon size={20} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "courses" && <CoursesTab onViewLessons={handleViewLessons} />}
            {activeTab === "lessons" && (
              <LessonsTab 
                courseId={selectedCourseId} 
                onBackToCourses={() => {
                  setSelectedCourseId(null);
                  setActiveTab("courses");
                }}
              />
            )}
          </div>
        </main>

      </div>
    </div>
  );
}