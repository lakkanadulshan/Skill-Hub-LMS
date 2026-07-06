import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  User as UserIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast"; 

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("all");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/courses"); 
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to sync course matrix"); // Toast message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to change this course status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "approved" ? "#8b5cf6" : "#f43f5e",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: `Yes, ${newStatus}`,
      borderRadius: '20px'
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading(`Updating to ${newStatus}...`);
      try {
        await API.put(`/admin/courses/${id}/status`, { status: newStatus });
        toast.success(`Course ${newStatus} successfully!`, { id: loadingToast });
        fetchCourses();
      } catch (err) {
        toast.error("Failed to update status", { id: loadingToast });
      }
    }
  };

  const filteredCourses =
    activeStatus === "all"
      ? courses
      : courses.filter((c) => c.status === activeStatus);

   return (
    <div className="space-y-8 p-2">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Course Matrix</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Management Portal</p>
          </div>
        </div>

        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                activeStatus === status
                  ? "bg-white text-purple-600 shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- COURSES TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        {loading ? (
          <div className="py-32 text-center">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                  <th className="px-10 py-6">Course Information</th>
                  <th className="px-10 py-6">Instructor</th>
                  <th className="px-10 py-6">Pricing</th>
                  <th className="px-10 py-6">Moderation</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-7">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-base leading-none mb-2 group-hover:text-purple-600 transition-colors">
                            {course.title}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-tighter w-fit">
                            {course.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-xs border border-slate-200 shadow-sm">
                            {course.instructor?.firstName?.charAt(0) || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700">
                              {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "Unknown"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic text-purple-500/70">Verified Lead</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <span className={`text-sm font-black ${course.price === 0 ? "text-emerald-500" : "text-slate-900"}`}>
                          {course.price === 0 ? "FREE" : `$${course.price}`}
                        </span>
                      </td>
                      <td className="px-10 py-7">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                          course.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          course.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                             course.status === "approved" ? "bg-emerald-500" :
                             course.status === "pending" ? "bg-amber-500" : "bg-rose-500"
                          }`}></span>
                          {course.status || "pending"}
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        {course.status === "pending" ? (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleStatusChange(course._id, "approved")}
                              className="group/btn w-10 h-10 rounded-2xl bg-white border border-emerald-100 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300"
                              title="Approve Course"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(course._id, "rejected")}
                              className="group/btn w-10 h-10 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-100 transition-all duration-300"
                              title="Reject Course"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-slate-300">
                             <Clock size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center">
                      <div className="max-w-xs mx-auto">
                         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Filter className="text-slate-300" size={24} />
                         </div>
                         <p className="text-slate-900 font-black text-sm uppercase tracking-tight">No Results Found</p>
                         <p className="text-slate-400 text-xs mt-1 font-medium">We couldn't find any courses matching your current filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}