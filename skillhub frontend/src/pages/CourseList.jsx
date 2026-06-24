import React, { useState, useEffect } from "react";
import {API} from "../services/api";
import CourseCard from "../components/CourseCard";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses");

        console.log(response.data);

        setCourses(response.data.courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Modernized Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Build Skills for the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}
              Future
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium">
            Learn from experienced instructors, earn valuable knowledge, and
            stay ahead in a rapidly changing world.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center mb-8 font-semibold">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-xl font-bold text-slate-400 animate-pulse">
              Loading courses...
            </div>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              No Courses Available
            </h2>
            <p className="text-lg text-slate-500">
              We are currently adding new courses. Please check back soon!
            </p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
