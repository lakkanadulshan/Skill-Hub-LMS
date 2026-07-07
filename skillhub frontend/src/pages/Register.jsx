import React, { useState } from "react";
import { Link } from "react-router-dom";
import { publicAPI } from "../services/api";
import Swal from "sweetalert2";
import VerifyOTPModal from "../components/VerifyOTPModal";
import { Eye, EyeOff, Sparkles, UserPlus, ArrowRight } from "lucide-react";

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
      
      if (response.status === 201 && response.data?.userId) {
        setUserId(response.data.userId);
        setIsModalOpen(true);
        Swal.fire("Success", "Registration successful. Please verify OTP!", "success");
      } else {
        Swal.fire("Error", response.data?.message || "Registration failed", "error");
      }

    } catch (err) {
      // Axios Error Handling
      const errorMsg = err.response?.data?.message || err.message || "Registration failed";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  return (
    <div className="h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 opacity-60"></div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] overflow-hidden w-full max-w-5xl h-auto max-h-[90vh] flex relative z-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        {/* --- LEFT SIDE: Clean White Visual Area --- */}
        <div className="hidden lg:flex w-[42%] bg-white flex-col items-center justify-center p-12 border-r border-slate-50 relative">
          <div className="relative z-10 text-center">
            {/* <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-6 border border-purple-100">
               <Sparkles size={14} className="text-purple-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">Join SkillHub</span>
            </div> */}

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">
              Start Your <br />
              <span className="text-purple-600">Learning Node.</span>
            </h1>
            
            <p className="mt-4 text-slate-400 font-medium text-sm leading-relaxed">
              Build industrial skills and earn global certifications through interactive modules.
            </p>
          </div>

          <div className="mt-8 w-full max-w-[280px] drop-shadow-xl">
            <img
              src="/register image.png"
              alt="Register Visual"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-8 text-center">
             <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">SkillHub Enterprise v2.0</p>
          </div>
        </div>

        {/* --- RIGHT SIDE: Compact Form --- */}
        <div className="w-full lg:w-[58%] p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Enter your details to synchronize with the ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input
                  placeholder="John" required
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all"
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input
                  placeholder="Doe" required
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all"
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email" placeholder="john@example.com" required
                className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} placeholder="••••••••" required
                    className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 transition-all"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-purple-600 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" required
                    className="w-full p-3.5 pr-11 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 transition-all"
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-purple-600 transition">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="group w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              Get Started Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Login Link */}
            <p className="text-center text-xs font-bold text-slate-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
                Login here
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