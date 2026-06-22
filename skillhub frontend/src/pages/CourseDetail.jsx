import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await API.get(`/courses/${id}`);
        setCourse(response.data.course || response.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details. It might have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-bold text-slate-500">Loading awesome content...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center max-w-md border border-red-100">
          <p className="text-lg font-semibold mb-4">{error || "Course not found"}</p>
          <Link to="/courses" className="text-blue-600 hover:underline font-medium">
            &larr; Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const instructorName = typeof course.instructor === 'string' 
    ? course.instructor 
    : course.instructor?.name || 'Expert Instructor';

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Dark Hero Section (Top) */}
      <div className="bg-slate-900 text-white py-12 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 text-sm font-semibold text-blue-400 mb-2">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>›</span>
              <span>{course.category || "General"}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed line-clamp-3">
              {course.description}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white/10">
                {instructorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-400">Created by</p>
                <p className="text-base font-bold text-slate-100">{instructorName}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Content & Floating Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        
        <div className="lg:col-span-2 order-2 lg:order-1">
          
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-green-500">✔️</span>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Description</h2>
            <div className="prose max-w-none text-slate-600 text-lg leading-relaxed whitespace-pre-line">
              {course.description}
            </div>
          </div>

        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden lg:-mt-56 sticky top-8 z-10">
            
            <div className="h-60 bg-slate-200 relative">
              <img 
                src={course.thumbnail || "https://placehold.co/800x600/cbd5e1/475569?text=Course+Image"} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="text-3xl font-extrabold text-slate-900 mb-6">
                {course.price && course.price > 0 ? `$${course.price}` : "Free"}
              </div>
              
              <button className="w-full py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all mb-6">
                Enroll Now
              </button>

              <div className="space-y-4 text-sm font-medium text-slate-600">
                <p className="font-bold text-slate-900 mb-2">This course includes:</p>
                
                {course.duration && (
                  <div className="flex items-center gap-3">
                    <span>📺</span> {course.duration} on-demand video
                  </div>
                )}
                
                {course.resourcesCount > 0 && (
                  <div className="flex items-center gap-3">
                    <span>📄</span> {course.resourcesCount} downloadable resources
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <span>♾️</span> Full lifetime access
                </div>
                
                {course.hasCertificate && (
                  <div className="flex items-center gap-3">
                    <span>🏆</span> Certificate of completion
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link to="/courses" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  &larr; Back to all courses
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
      
    </div>
  );
}