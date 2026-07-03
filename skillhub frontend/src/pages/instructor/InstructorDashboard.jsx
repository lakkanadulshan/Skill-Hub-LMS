import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import OverviewTab from "./OverviewTab";
import CoursesTab from "./CoursesTab";
import LessonsTab from "./LessonsTab";

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  // 🟢 ක්ලික් කරන Course ID එක ගබඩා කරගන්නා අලුත් State එක
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  // 🟢 Course එකක් ක්ලික් කළ විට Lessons ටැබ් එකට Navigation එක සිදු කරන Function එක
  const handleViewLessons = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveTab("lessons"); // auto-navigate to next tab
  };
 
  useEffect(() => {
    if (!user || user.role !== "instructor") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to view the Instructor Dashboard!",
        confirmButtonColor: "#2563eb",
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
      confirmButtonText: "Logout",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* ================= PREMIUM SIDEBAR ================= */}
      <div className="w-64 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-900 shadow-2xl relative z-20">
        <div>
          {/* Brand Logo & Profile Identity */}
          <div className="p-6 border-b border-slate-900 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                SkillHub LMS
              </span>
              {/* <span className="text-[10px] px-2.5 py-0.5 bg-blue-500/10 text-blue-400 font-bold rounded-full border border-blue-500/20">
                PRO
              </span> */}
            </div>

            {/* Quick Instructor Banner inside Sidebar */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-xs">
                {user?.firstName?.charAt(0)?.toUpperCase() || "I"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  Instructor Panel
                </p>
              </div>
            </div>
          </div>

          {/* Modern Navigation Menus */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: "overview", label: "Overview" },
              { id: "courses", label: "My Courses Portal" },
              { id: "lessons", label: "Lessons & Content" },
              
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 relative group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  }`}
                >
                  {/* Left Active Glow Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-white rounded-r-full"></span>
                  )}
                  <span
                    className={`text-base transition-transform group-hover:scale-110 duration-300`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Action Footer */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm text-red-400/90 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <span className="text-base">🚪</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Glassmorphic Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
              {activeTab === "overview" && "Dashboard "}
              {activeTab === "courses" && "Course Management"}
              {activeTab === "lessons" && "Lessons Management"}
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Welcome back,{" "}
              <span className="text-slate-600 font-semibold">
                {user?.firstName}
              </span>
              ! Manage your courses and inspire learners every day.
            </p>
          </div>

          {/* Instructor Meta Display */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                {user?.email}
              </p>
            </div>

            {/* Avatar container matching profile design */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-md border border-slate-200/50 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Component Container */}
<main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-blue-50/30">
          <div className="max-w-7xl mx-auto transition-all duration-300 animate-fadeIn">
            {activeTab === "overview" && <OverviewTab />}
            
            {/* 🟢 CoursesTab එකට onViewLessons prop එක පාස් කළා */}
            {activeTab === "courses" && <CoursesTab onViewLessons={handleViewLessons} />}
            
            {/* 🟢 LessonsTab එකට courseId එක සහ back function එක පාස් කළා */}
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
