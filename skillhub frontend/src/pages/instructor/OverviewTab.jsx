import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";

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
    return <div className="text-center py-12 text-slate-500 text-sm">Orchestrating metrics workspace...</div>;
  }

return (
  <div className="space-y-8">

    {/* Header */}
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-900 p-8 text-white">
      <div className="absolute -top-10 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider backdrop-blur-md">
            ● LIVE DASHBOARD
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-black">
            Instructor Analytics
          </h2>

          <p className="mt-3 max-w-xl text-sm text-slate-300 leading-7">
            Monitor your learning platform performance, student engagement,
            published content and revenue from one centralized workspace.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/10 backdrop-blur-md px-5 py-4 border border-white/10">
            <p className="text-xs uppercase text-slate-300">Courses</p>
            <h3 className="text-3xl font-black">{stats.totalCourses}</h3>
          </div>

          <div className="rounded-2xl bg-white/10 backdrop-blur-md px-5 py-4 border border-white/10">
            <p className="text-xs uppercase text-slate-300">Students</p>
            <h3 className="text-3xl font-black">{stats.totalStudents}</h3>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <div className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Total Courses
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              {stats.totalCourses}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Published courses
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
            📚
          </div>
        </div>

        {/* <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
        </div> */}
      </div>

      <div className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Total Lessons
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              {stats.totalLessons}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Learning modules
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
            🎥
          </div>
        </div>

        {/* <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
        </div> */}
      </div>

      <div className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Students
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              {stats.totalStudents}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Active enrollments
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
            👨‍🎓
          </div>
        </div>

        {/* <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-5/6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div> */}
      </div>

      <div className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Earnings
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              ${stats.totalEarnings}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Total revenue
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
            💰
          </div>
        </div>

        {/* <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
        </div> */}
      </div>

    </div>

    {/* Bottom Panel */}

    {/* <div className="grid lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Performance Overview
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Your dashboard is connected with real-time instructor statistics.
              Every published course, lesson, enrollment and revenue update
              appears automatically here.
            </p>
          </div>

          <div className="text-6xl">
            📈
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs text-slate-500">Courses</p>
            <h4 className="text-2xl font-black mt-2">{stats.totalCourses}</h4>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs text-slate-500">Lessons</p>
            <h4 className="text-2xl font-black mt-2">{stats.totalLessons}</h4>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs text-slate-500">Students</p>
            <h4 className="text-2xl font-black mt-2">{stats.totalStudents}</h4>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs text-slate-500">Revenue</p>
            <h4 className="text-2xl font-black mt-2">${stats.totalEarnings}</h4>
          </div>

        </div>

      </div>



    </div> */}

  </div>
)}