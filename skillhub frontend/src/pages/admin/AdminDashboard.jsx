import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/api.js";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Mail, 
  LogOut, 
  ChevronRight, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminCourses from "./AdminCourses";
import AdminMessages from "./AdminMessages";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      Swal.fire({ icon: "error", title: "Unauthorized", text: "Admin access required!" });
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Admin Session?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sign Out",
      confirmButtonColor: "#7c3aed",
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "users", label: "User Control", icon: <Users size={18} /> },
    { id: "courses", label: "Course Matrix", icon: <BookOpen size={18} /> },
    { id: "messages", label: "Support Desk", icon: <Mail size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* --- 🟢 SIDEBAR (FIXED CSS CLASSES) --- */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">skillhub</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-purple-50 rounded-[2rem] border border-purple-100 flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">A</div>
               <div className="overflow-hidden">
                  <p className="text-sm font-black text-slate-900 truncate">Platform Admin</p>
                  <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest leading-none">System Root</p>
               </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                  activeTab === item.id ? "bg-purple-600 text-white shadow-xl shadow-purple-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-purple-600"}`}>{item.icon}</span>
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight size={14} strokeWidth={3} />}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-50">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
              {/* 🟢 ඩෙස්ක්ටොප්/මොබයිල් හැම එකකදීම වැඩ කරන මෙනු බටන් එක */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Control</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Platform Governance Module</p>
              </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 px-6 py-2.5 bg-slate-50 rounded-full border border-slate-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Secure</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
             {activeTab === "overview" && <AdminOverview setIsSidebarOpen={setIsSidebarOpen} />}
             {activeTab === "users" && <AdminUsers />}
             {activeTab === "courses" && <AdminCourses />}
             {activeTab === "messages" && <AdminMessages />}
          </div>
        </main>
      </div>
    </div>
  );
}