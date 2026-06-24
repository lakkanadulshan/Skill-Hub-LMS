import React, { useState } from "react";
import { Link } from "react-router-dom";
import {publicAPI} from "../services/api";
import Swal from "sweetalert2";
import VerifyOTPModal from "../components/VerifyOTPModal";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match!", "error");
    }

    try {
      const response = await publicAPI.post("/auth/register", formData);

      setUserId(response.data.userId);
      setIsModalOpen(true);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Registration failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 lg:p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl min-h-[700px] flex">
        
        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 relative">
          <img
            src="/register image.png"
            alt="Register"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/20"></div>

          <div className="absolute bottom-12 left-10 text-white max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Learn Without Limits
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Build new skills, earn certifications, and advance your career through interactive learning.

            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                SkillHub LMS
              </h2>
              <p className="text-sm text-slate-500">
                Learn • Grow • Succeed
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Join SkillHub
            </h2>

            <p className="text-slate-500">
              Create your account and start learning today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="First Name"
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
              />

              <input
                placeholder="Last Name"
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
              />
            </div>

            {/* Organization */}
            <input
              placeholder="Organization / Department"
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  organization: e.target.value,
                })
              }
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full p-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                required
                className="w-full p-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition active:scale-[0.98] shadow-lg shadow-blue-200"
            >
              Create Account
            </button>

            {/* Login */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <VerifyOTPModal
        isOpen={isModalOpen}
        userId={userId}
        onClose={() => setIsModalOpen(false)}
        onVerified={() => window.location.assign("/login")}
      />
    </div>
  );
}