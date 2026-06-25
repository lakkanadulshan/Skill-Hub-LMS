import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api";
import Swal from "sweetalert2";

export default function StudentDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await API.get("/courses/enrolled");
        const courses = response.data.courses || response.data;
        setEnrolledCourses(courses);
        setFilteredCourses(courses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setError("Failed to load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    const filtered = enrolledCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, enrolledCourses]);

  const handleUnenroll = async (courseId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to unenroll from this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, unenroll",
      width: "22em",
      padding: "1.5em",
      customClass: { title: "text-xl font-bold", popup: "rounded-2xl" },
    });

    if (!result.isConfirmed) return;

    try {
      await API.post(`/enrollments/${courseId}/unenroll`);
      const updatedCourses = enrolledCourses.filter(
        (course) => course._id !== courseId
      );
      setEnrolledCourses(updatedCourses);
      setFilteredCourses(updatedCourses);

      Swal.fire({
        title: "Unenrolled!",
        icon: "success",
        confirmButtonColor: "#3b82f6",
        width: "20em",
        padding: "1.5em",
      });
    } catch (err) {
      Swal.fire({
        title: "Oops!",
        text: err.response?.data?.message || "Failed to unenroll.",
        icon: "error",
        confirmButtonColor: "#3b82f6",
        width: "20em",
        padding: "1.5em",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Student Dashboard
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Learner"}
            </h1>
            <p className="text-blue-100 text-lg">
              Ready to continue your learning journey today?
            </p>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">
              No enrolled courses yet
            </h3>
            <Link
              to="/courses"
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-slate-200 relative">
                  <img
                    src={
                      course.thumbnail ||
                      "https://placehold.co/600x400?text=Course"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Course";
                    }}
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {course.category || "Course"}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      By {course.instructor?.name || "Expert"}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      to={`/courses/${course._id}`}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center transition"
                    >
                      Continue Learning →
                    </Link>
                    <button
                      onClick={() => handleUnenroll(course._id)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl text-sm transition"
                    >
                      Unenroll from Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}