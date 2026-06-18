import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#2563eb] text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-bold tracking-tight">
        SkillHub
      </Link>

      {/* Nav Items & Shortcuts */}
      <div className="flex items-center gap-6 text-sm font-semibold">
        <Link to="/" className="hover:text-blue-100 transition">Home</Link>
        <Link to="/contact" className="hover:text-blue-100 transition">Contact</Link>
        <Link to="/login" className="hover:text-blue-100 transition">Login</Link>
        <Link to="/register" className="hover:text-blue-100 transition">Register</Link>

        {/* Profile Shortcut Icon */}
        <Link 
          to="/dashboard" 
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition border border-white/40"
          aria-label="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}