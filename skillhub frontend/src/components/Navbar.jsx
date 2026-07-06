import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast"; // Toast import කළා

export default function Navbar() {
  const navigate = useNavigate();
  
  // Logic (No changes to the core logic)
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleDashboardClick = () => {
    if (!user) {
      toast.error("Please login to access your dashboard", {
        icon: '🔒',
      });
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
      toast.error("Please login to view your profile");
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
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-lg border-b border-slate-200/50 h-20 flex items-center transition-all">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 group-hover:rotate-6 transition-all duration-300">
            <img src="/skillhub logo.png" alt="S" className="w-6 h-6 object-contain brightness-200" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            skillhub<span className="text-purple-600">.</span>
          </h1>
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex items-center gap-10 text-[15px] font-bold text-slate-600">
          <Link to="/" className="relative hover:text-purple-600 transition group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link to="/courses" className="flex items-center gap-1 hover:text-purple-600 transition group">
            Courses <ChevronDown size={14} className="opacity-40 group-hover:translate-y-0.5 transition-transform" />
          </Link>
          <Link to="/about" className="relative hover:text-purple-600 transition group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
          </Link>
          <button 
            onClick={handleDashboardClick} 
            className="hover:text-purple-600 transition font-bold"
          >
            Dashboard
          </button>
        </div>

        {/* Right Action Side */}
        <div className="flex items-center gap-6">
          {!user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="hidden sm:block text-[15px] font-extrabold text-slate-700 hover:text-purple-600 transition"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[15px] font-bold hover:bg-purple-600 transition-all shadow-md active:scale-95"
              >
                Get Started
              </Link>
            </div>
          ) : (
            /* Logged In User Section */
            <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Welcome back</p>
                <p className="text-sm text-slate-900 font-black">{user.firstName || "User"}</p>
              </div>
              <button 
                onClick={handleProfileClick} 
                className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm group relative"
              >
                {user.firstName ? (
                  <span className="text-purple-600 font-black text-lg">{user.firstName[0].toUpperCase()}</span>
                ) : (
                  <User size={20} className="text-slate-400 group-hover:text-purple-600 transition" />
                )}
                {/* Online Indicator */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}