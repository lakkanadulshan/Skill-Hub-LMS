import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function InstructorProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again to continue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-50 shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500">{user?.email}</p>
              <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                Instructor
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6">Instructor Dashboard Controls</h2>
          <div className="grid md:grid-cols-2 gap-6">
             {/* මෙතැනට ඔබට Instructor ට අදාළ සේවාවන් එකතු කළ හැක */}
             <div className="p-6 border rounded-2xl">
                <h3 className="font-bold">My Courses</h3>
                <p className="text-slate-500 text-sm mt-1">Manage your created courses here.</p>
             </div>
             <div className="p-6 border rounded-2xl">
                <h3 className="font-bold">Students Enrolled</h3>
                <p className="text-slate-500 text-sm mt-1">View student progress and feedback.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}