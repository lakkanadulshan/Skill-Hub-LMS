import React, { useState, useEffect } from "react";
import { API } from "../services/api.js";
import CourseCard from "../components/CourseCard";
import { Sparkles, BookOpen, Search, Filter } from "lucide-react";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses/");
        setCourses(response.data.courses || response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-6 border border-purple-100 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">Expert-Led Learning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Transform your career with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              skillhub
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Master in-demand skills with our comprehensive curriculum matrix. 
            Designed for professional growth and industry excellence.
          </p>

          {/* Search Bar - Visual Only (Logic is not changed as per request) */}
          <div className="mt-12 max-w-xl mx-auto relative group animate-in fade-in zoom-in duration-700 delay-200">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400 group-focus-within:text-purple-600 transition-colors" />
             </div>
             <input 
                type="text" 
                placeholder="Search for courses, skills or modules..." 
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600 transition-all shadow-sm"
             />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Divider / Info */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                  <BookOpen size={20} />
               </div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Available Directory</h2>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase tracking-widest">
               <span className="text-purple-600">{courses.length}</span> Courses Found
            </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-3xl text-center mb-12 font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-6">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">Syncing Library Nodes...</p>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="text-6xl mb-6">📂</div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">
              Library is Empty
            </h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">
              We are currently orchestrating new modules. Please synchronize later.
            </p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {courses.map((course, index) => (
              <div key={course._id} className="animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}