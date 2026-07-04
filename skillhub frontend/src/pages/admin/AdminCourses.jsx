import React from "react";
import { BookOpen, AlertCircle } from "lucide-react";

export default function AdminCourses() {
  return (
    <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
        <BookOpen size={36} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Course Moderation Node</h3>
      <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
        The centralized course control matrix is currently under synchronization. Complete moderation tools will be available in the next cycle.
      </p>
      <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
         <AlertCircle size={14} /> Status: Initializing Development
      </div>
    </div>
  );
}