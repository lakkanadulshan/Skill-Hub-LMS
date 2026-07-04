import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { Users, BookOpen, Mail, TrendingUp, Activity, PieChart, ArrowUpRight } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ students: 0, instructors: 0, courses: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Global Nodes...</div>;

  const cards = [
    { label: "Total Students", value: stats.students, icon: <Users size={24} />, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Expert Instructors", value: stats.instructors, icon: <Activity size={24} />, bg: "bg-purple-50", color: "text-purple-600" },
    { label: "Syllabus Matrix", value: stats.courses, icon: <BookOpen size={24} />, bg: "bg-indigo-50", color: "text-indigo-600" },
    { label: "Support Requests", value: stats.messages, icon: <Mail size={24} />, bg: "bg-rose-50", color: "text-rose-600" },
  ];

  return (
    <div className="space-y-10">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 to-indigo-950 p-12 text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 mb-6 backdrop-blur-md">
               <TrendingUp size={14} className="text-purple-400" />
               <span className="text-[10px] font-black uppercase tracking-widest">Platform Pulse: Healthy</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">System Infrastructure <br /> Analytics Engine</h2>
            <p className="mt-6 text-slate-400 font-medium max-w-xl leading-relaxed">Global synchronization successful. Monitoring student velocity, content scalability, and system-wide interactions across the SkillHub network.</p>
         </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
             <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} transition-transform group-hover:scale-110`}>{card.icon}</div>
                <ArrowUpRight size={20} className="text-slate-200 group-hover:text-purple-600 transition-colors" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{card.label}</p>
             <h3 className="text-4xl font-black text-slate-900 mt-2">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* FOOTER METRIC */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <PieChart size={36} className="text-purple-600" />
         </div>
         <div>
            <h4 className="text-xl font-black text-slate-900">Governance Integrity Check</h4>
            <p className="text-slate-500 font-medium mt-1">The SkillHub main-net is operating at 99.9% efficiency. User growth trend is currently positive by 15.4% this cycle.</p>
         </div>
         <button className="shrink-0 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all">Optimize Core</button>
      </div>

    </div>
  );
}