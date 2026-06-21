import React from "react";
import { Link } from "react-router-dom";

// course කියන object එක (props විදිහට) මේකට එනවා
export default function CourseCard({ course }) {
  if (!course) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100 flex flex-col h-full">
      
      {/* 1. Course Image */}
      <div className="relative h-48 w-full bg-slate-200">
        <img
          src={course.thumbnail || "https://via.placeholder.com/400x250?text=Course+Image"} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          {course.category || "General"}
        </span>
      </div>

      {/* 2. Course Details */}
      <div className="p-5 flex flex-col flex-grow">
        
 
        {course.instructor?.name && (
          <p className="text-sm text-slate-500 font-medium mb-1">
            By {course.instructor.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
  
          {/* View Button */}
          <Link 
            to={`/courses/${course._id}`} 
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
      
    </div>
  );
}