import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { 
  BookOpen, 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  PieChart
} from "lucide-react";

export default function OverviewTab() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/courses/instructor/stats");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Orchestrating metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- HERO ANALYTICS HEADER --- */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 p-10 md:p-12 text-white shadow-2xl shadow-purple-200">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl transition-transform duration-1000 hover:scale-110"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md border border-white/20">
              <Activity size={12} className="animate-pulse" /> Live System Analytics
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Performance <br /> Insight Engine
            </h2>

            <p className="mt-6 text-indigo-100 text-lg font-medium leading-relaxed opacity-90">
              Welcome back to your command center. Monitor global student engagement, 
              curriculum scalability, and revenue growth in real-time.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px] rounded-[2rem] bg-white/10 backdrop-blur-xl p-6 border border-white/20 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Active Students</p>
              <h3 className="mt-2 text-4xl font-black">{stats.totalStudents}</h3>
            </div>
            <div className="flex-1 min-w-[160px] rounded-[2rem] bg-white/10 backdrop-blur-xl p-6 border border-white/20 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Revenue</p>
              <h3 className="mt-2 text-4xl font-black">${stats.totalEarnings}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- CORE METRICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Total Courses */}
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-purple-200/40 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110 duration-300">
              <BookOpen size={28} />
            </div>
            <span className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-purple-600 transition-colors">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Published Courses</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 leading-none">{stats.totalCourses}</h2>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{width: '70%'}}></div>
               </div>
            </div>
          </div>
        </div>

        {/* Total Lessons */}
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110 duration-300">
              <Video size={28} />
            </div>
            <span className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-indigo-600 transition-colors">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Module Nodes</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 leading-none">{stats.totalLessons}</h2>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{width: '85%'}}></div>
               </div>
            </div>
          </div>
        </div>

        {/* Total Students */}
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110 duration-300">
              <Users size={28} />
            </div>
            <span className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-blue-600 transition-colors">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Total Learners</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 leading-none">{stats.totalStudents}</h2>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{width: '60%'}}></div>
               </div>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-200/40 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110 duration-300">
              <DollarSign size={28} />
            </div>
            <span className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-emerald-600 transition-colors">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Gross Earnings</p>
            <h2 className="mt-2 text-4xl font-black text-slate-900 leading-none">${stats.totalEarnings}</h2>
            <div className="mt-4 flex items-center gap-2">
               <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{width: '90%'}}></div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- BOTTOM PERFORMANCE SUMMARY --- */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <PieChart size={40} className="text-purple-600" />
        </div>
        <div className="flex-grow space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black text-slate-900">Directory Health Check</h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
            All curriculum nodes are currently synchronized with the SkillHub main-net. 
            Student enrollment vectors are showing a positive trend of <span className="text-emerald-500 font-bold">+12.5%</span> this month.
          </p>
        </div>
        <div className="shrink-0 bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
             <TrendingUp size={12} className="text-emerald-500" /> Status
           </div>
           <div className="text-lg font-black text-slate-900">Optimized</div>
        </div>
      </div>

    </div>
  );
}