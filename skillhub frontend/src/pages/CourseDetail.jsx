
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        console.error(err);
        setError("Failed to load course details. It might have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await API.post(`/courses/${id}/enroll`);
      // navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white shadow-lg border rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            {error || "Course not found"}
          </h2>
          <Link
            to="/courses"
            className="inline-block px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Back to Courses
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
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Link to="/courses" className="text-sm opacity-80 hover:opacity-100">
            ← Back to Courses
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
            {course.title}
          </h1>

          <p className="mt-4 text-blue-100 max-w-3xl">
            {course.description}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {instructorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-blue-100">Instructor</p>
              <p className="font-semibold">{instructorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-12">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {course.whatYouWillLearn?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>

              <div className="grid md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Course Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1">

          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden sticky top-6">

            <img
              src={
                course.thumbnail ||
                "https://placehold.co/800x600"
              }
              alt={course.title}
              className="h-52 w-full object-cover"
            />

            <div className="p-6 space-y-4">

              <div className="text-3xl font-bold text-blue-600">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </div>

              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
              </button>

              <div className="text-sm text-slate-600 space-y-2 pt-2">

                {course.duration && (
                  <p>📺 {course.duration} video content</p>
                )}

                {course.resourcesCount > 0 && (
                  <p>📄 {course.resourcesCount} resources</p>
                )}

                <p>♾️ Lifetime access</p>

                {course.hasCertificate && (
                  <p>🏆 Certificate included</p>
                )}

              </div>

              <Link
                to="/courses"
                className="block text-center text-blue-600 hover:underline pt-3"
              >
                ← Browse more courses
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}