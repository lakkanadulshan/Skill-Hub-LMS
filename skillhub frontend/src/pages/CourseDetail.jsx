import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; 
import API from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); //

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false); 

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

  // 👇 Enroll වෙන Function එක 
  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      // Backend එකට Request එක යවනවා
      await API.post(`/courses/${id}/enroll`);
      
      // navigate("/dashboard"); 
    } catch (err) {
      console.error("Enrollment failed:", err);
      
      alert(err.response?.data?.message || "Failed to enroll. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-bold text-slate-500">
            Loading awesome content...
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-md border border-red-100 shadow-sm">
          <p className="text-lg font-semibold mb-4">
            {error || "Course not found"}
          </p>

          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const instructorName =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.name || "Expert Instructor";

  return (
    <div className="min-h-screen bg-slate-50 pt-8 lg:pt-10">

      {/* Hero Section */}
      <div
        className="
        bg-gradient-to-r
        from-indigo-600
        via-blue-600
        to-cyan-500
        text-white
        py-12
        lg:py-20
        px-6
        relative
        overflow-hidden
      "
      >
        {/* Decorative Shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/5 rounded-full"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">

          <div className="lg:col-span-2 space-y-6">

            <div className="flex items-center gap-3 text-sm font-semibold text-blue-100">
              <Link
                to="/courses"
                className="hover:text-white transition-colors"
              >
                Courses
              </Link>

              <span>›</span>

              <span>{course.category || "General"}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {course.title}
            </h1>

            <p className="text-lg text-blue-100 max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-4 pt-4">

              <div
                className="
                w-14
                h-14
                rounded-full
                bg-white/20
                backdrop-blur
                flex
                items-center
                justify-center
                font-bold
                text-xl
                shadow-lg
                border
                border-white/20
              "
              >
                {instructorName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Created by
                </p>

                <p className="text-lg font-bold">
                  {instructorName}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Content */}
        <div className="lg:col-span-2 order-2 lg:order-1">

          {/* What You'll Learn */}
          {course.whatYouWillLearn &&
            course.whatYouWillLearn.length > 0 && (
              <div
                className="
                bg-white
                rounded-3xl
                p-8
                border
                border-blue-100
                shadow-sm
                mb-10
              "
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  What You'll Learn
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {course.whatYouWillLearn.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="
                        w-6
                        h-6
                        rounded-full
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-bold
                        shrink-0
                        mt-0.5
                      "
                      >
                        ✓
                      </div>

                      <span className="text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            )}

          {/* Description */}
          <div
            className="
            bg-white
            rounded-3xl
            border
            border-slate-100
            p-8
            shadow-sm
          "
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Course Description
            </h2>

            <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
              {course.description}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2">

          <div
            className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-slate-100
            overflow-hidden
            lg:-mt-56
            sticky
            top-8
            z-10
            hover:shadow-2xl
            transition-all
            duration-300
          "
          >

            {/* Thumbnail */}
            <div className="h-60 bg-slate-200 overflow-hidden">
              <img
                src={
                  course.thumbnail ||
                  "https://placehold.co/800x600/cbd5e1/475569?text=Course+Image"
                }
                alt={course.title}
                className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-500
                hover:scale-105
              "
              />
            </div>

            {/* Card Content */}
            <div className="p-8">

              <div className="text-4xl font-extrabold text-blue-600 mb-6">
                {course.price && course.price > 0
                  ? `$${course.price}`
                  : "Free"}
              </div>

              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="
                w-full
                py-4
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                text-lg
                font-bold
                rounded-xl
                shadow-lg
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                mb-6
                disabled:opacity-70
                disabled:cursor-not-allowed
                flex
                justify-center
                items-center
              "
              >
                {isEnrolling ? (
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Enroll Now"
                )}
              </button>

              <div className="space-y-4 text-sm font-medium text-slate-600">

                <p className="font-bold text-slate-900 mb-3">
                  This course includes:
                </p>

                {course.duration && (
                  <div className="flex items-center gap-3">
                    <span>📺</span>
                    <span>{course.duration} on-demand video</span>
                  </div>
                )}

                {course.resourcesCount > 0 && (
                  <div className="flex items-center gap-3">
                    <span>📄</span>
                    <span>
                      {course.resourcesCount} downloadable resources
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span>♾️</span>
                  <span>Full lifetime access</span>
                </div>

                {course.hasCertificate && (
                  <div className="flex items-center gap-3">
                    <span>🏆</span>
                    <span>Certificate of completion</span>
                  </div>
                )}

              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link
                  to="/courses"
                  className="
                  text-blue-600
                  hover:text-indigo-700
                  font-semibold
                  transition-colors
                "
                >
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