import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            <img src="/public/skillhub logo.png" alt="SkillHub Logo" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              SkillHub
            </h1>
            <p className="text-xs text-slate-500 -mt-1">
              {/* Learn • Grow • Succeed */}
            </p>
          </div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-700">

          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/courses"
            className="hover:text-blue-600 transition"
          >
            Courses
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600 transition"
          >
            Contact
          </Link>

          <Link
            to="/about"
            className="hover:text-blue-600 transition"
          >
            About
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="px-5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
          >
            Get Started
          </Link>

          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100 transition"
          >
            👤
          </Link>

        </div>
      </div>
    </nav>
  );
}