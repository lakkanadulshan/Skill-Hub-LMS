import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  if (!course) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      
      {/* 1. Course Image Section */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || "https://via.placeholder.com/400x250?text=Course+Image"} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Badge - Glassmorphism touch */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm border border-white/50">
            {course.category || "General"}
          </span>
        </div>
      </div>

      {/* 2. Course Details Content */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Instructor Info */}
        {course.instructor?.name && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">
                    {course.instructor.name.charAt(0)}
                </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              {course.instructor.name}
            </p>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {/* Price & Action Section */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          
          {/* Price - Added a placeholder price style if needed later */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Price</span>
            <span className="text-lg font-black text-slate-900 leading-none">
              {course.price > 0 ? `$${course.price}` : "FREE"}
            </span>
          </div>
  
          {/* View Button */}
          <Link 
            to={`/courses/${course._id}`} 
            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-blue-200 active:scale-95"
          >
            Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
    </div>
  );
}