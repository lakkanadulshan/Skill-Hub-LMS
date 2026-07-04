import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ChevronRight,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import homeImage from "../assets/home page .png";

function Home() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-white overflow-hidden flex items-center">
      {/* --- BACKGROUND DECORATION NODES --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl -z-10 opacity-70 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60 -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
          {/* --- LEFT CONTENT AREA --- */}
          <div className="flex flex-col text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-6">
              <span className="bg-purple-100/50 text-purple-700 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-purple-200 backdrop-blur-sm flex items-center gap-2">
                <Sparkles size={12} className="animate-pulse" /> SkillHub Ecosystem
              </span>
            </div> */}

            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight text-slate-900">
              Learn Without <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700">
                Limits.
              </span>
            </h1>

            <p className="mt-8 text-lg md:text-xl font-medium leading-relaxed text-slate-500 max-w-xl mx-auto lg:mx-0">
              Learn from expert instructors, explore high-quality courses, and
              build the skills you need to achieve your goals.all in one modern
              learning platform.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              <Link
                to="/register"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-10 py-5 text-base font-black text-white shadow-2xl shadow-purple-200 transition-all duration-300 hover:shadow-purple-300 hover:scale-105 active:scale-95"
              >
                Enroll Now{" "}
                <ChevronRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-white px-10 py-5 text-base font-black text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white active:scale-95 shadow-lg shadow-slate-100"
              >
                Get Started
              </Link>
            </div>

            {/* Micro Stats / Badges */}
            <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">10k+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Students
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">200+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Courses
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900">99%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Success
                </span>
              </div>
            </div>
          </div>

          {/* --- RIGHT IMAGE CONTAINER --- */}
          <div className="relative w-full flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            {/* Decorative Floating Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-600 rounded-[2rem] shadow-2xl z-20 flex items-center justify-center text-white rotate-12 animate-bounce duration-[3000ms]">
              <GraduationCap size={40} />
            </div>
            {/* <div className="absolute -bottom-10 -left-6 bg-white p-5 rounded-[2rem] shadow-2xl z-20 border border-slate-100 flex items-center gap-4 animate-pulse">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified</p>
                  <p className="text-sm font-black text-slate-900">Certificates</p>
               </div>
            </div> */}

            {/* Main Hero Image Wrapper */}
            <div className="relative w-full aspect-square md:aspect-auto p-4 bg-gradient-to-br from-slate-100 to-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-purple-100 group">
              <div className="absolute inset-0 bg-purple-600/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={homeImage}
                alt="SkillHub Classroom Workspace"
                className="w-full h-full object-cover rounded-[3rem] shadow-inner transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Play Button Overlay Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-purple-600 shadow-2xl transition-transform hover:scale-110 active:scale-95 border-4 border-purple-50">
                  <PlayCircle
                    size={40}
                    fill="currentColor"
                    className="text-purple-600"
                  />
                </button>
              </div>
            </div>

            {/* Final Background Blobs */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-100/50 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
