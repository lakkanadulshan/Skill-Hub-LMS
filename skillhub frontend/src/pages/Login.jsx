import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { publicAPI } from "../services/api";
import loginImage from "../assets/login page image.png";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff, LogIn, Sparkles, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await publicAPI.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (login) await login(response.data);
        if (response.data.role === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await publicAPI.post("/auth/google-login", {
        token: tokenResponse.code,
      });
      if (res.data) {
        login(res.data);
        if (res.data.role === "instructor") {
          navigate("/instructor-dashboard");
        } else if (res.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }
    } catch (err) {
      console.error("Backend Google Login Failed:", err);
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.error("Google Login Failed at Frontend"),
    flow: "auth-code",
  });

  return (
    <main className="grid min-h-screen bg-white md:grid-cols-2 font-sans overflow-hidden">
      
      {/* --- LEFT SECTION: Branding & Visuals --- */}
      <section className="relative hidden md:flex flex-col items-center justify-center bg-[#f8fafc] px-12 py-16 overflow-hidden border-r border-slate-100">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 opacity-60"></div>

        <div className="relative z-10 w-full max-w-lg text-center">
          {/* <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SkillHub Learning Net</span>
          </div> */}

          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Learning Path.</span>
          </h1>
          <p className="mt-6 text-slate-400 text-lg font-medium leading-relaxed max-w-sm mx-auto">
            Access your courses, track your progress, and master new skills daily.
          </p>

          <div className="mt-12 flex justify-center drop-shadow-2xl animate-in zoom-in duration-1000">
            <img
              src={loginImage}
              alt="Digital Learning"
              className="max-h-[38vh] w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* --- RIGHT SECTION: Login Form --- */}
      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-slate-400 font-medium">
              Please enter your credentials to access your workspace.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600 flex items-center gap-3 animate-in shake duration-500">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                 Email
              </label>
              <input
                id="email" type="email" placeholder="name@company.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                 Password
              </label>
              <div className="relative group">
                <input
                  id="password" type={showPassword ? "text" : "password"}
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-600/5 transition-all"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-purple-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-slate-200 text-purple-600 focus:ring-purple-500 transition cursor-pointer" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition">Keep me logged in</span>
              </label>
              <button type="button" onClick={() => navigate("/forgot-password")} className="text-xs font-black text-purple-600 uppercase tracking-widest hover:text-purple-700 transition">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit" disabled={loading}
              className="group relative w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? "Authenticating..." : (
                <> Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-50" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or synchronized with</span>
            <div className="h-px flex-1 bg-slate-50" />
          </div>

          <button
            type="button" onClick={() => googleLoginTrigger()}
            className="flex w-full items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
            </svg>
            Continue with Google 
          </button>

          <p className="mt-10 text-center text-sm font-bold text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 underline underline-offset-4">
              Join SkillHub Node
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}