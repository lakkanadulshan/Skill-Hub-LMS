import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  
  // Logic (No changes here)
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleDashboardClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "instructor") {
      navigate("/instructor-profile");
    } else if (user.role === "admin") {
      navigate("/admin-profile");
    } else {
      navigate("/student-profile");
    }
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:rotate-3 transition-transform duration-300">
            <img src="/skillhub logo.png" alt="SkillHub" className="w-6 h-6 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-900 group-hover:text-purple-600 transition">
            skillhub
          </h1>
        </Link>

        {/* Menu Links - Litmos Modern Style */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
          <Link to="/" className="hover:text-purple-600 transition">
            Home
          </Link>
          <Link to="/courses" className="hover:text-purple-600 transition flex items-center gap-1">
            Courses <ChevronDown size={14} className="opacity-40" />
          </Link>
          <Link to="/about" className="hover:text-purple-600 transition">
            About
          </Link>
          <button 
            onClick={handleDashboardClick} 
            className="hover:text-purple-600 transition"
          >
            Dashboard
          </button>
          {/* <Link to="/about" className="hover:text-purple-600 transition">
            About
          </Link> */}
        </div>

        {/* Right Action Side */}
        <div className="flex items-center gap-5">
          {!user ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="hidden sm:block text-[15px] font-bold text-slate-700 hover:text-purple-600 transition px-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-7 py-2.5 rounded-full bg-purple-600 text-white text-[15px] font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-100 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          ) : (
            /* Logged In User Section */
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right leading-none">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Welcome</p>
                <p className="text-sm text-slate-800 font-bold">{user.firstName || "User"}</p>
              </div>
              <button 
                onClick={handleProfileClick} 
                className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm group"
              >
                {user.firstName ? (
                  <span className="text-purple-600 font-black text-base">{user.firstName[0].toUpperCase()}</span>
                ) : (
                  <User size={20} className="text-slate-400 group-hover:text-purple-600 transition" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}