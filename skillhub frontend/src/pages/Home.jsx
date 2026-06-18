import { Link } from "react-router-dom";
import homeImage from "../assets/home page .png";

function Home() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-white px-6 py-16 font-sans sm:px-12 lg:px-20 flex items-center justify-center">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-16">
        
        {/* Left Side: Content Area */}
        <div className="flex flex-col justify-center w-full">
          
          <p className="mb-4 text-sm font-bold tracking-wider text-blue-600 uppercase">
            SkillHub Learning Platform
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Online Learning Management System{" "}
            <span className="block text-blue-600 mt-2">for Your Future</span>
          </h1>

          <p className="mt-6 text-base md:text-lg font-normal leading-relaxed text-slate-500 max-w-xl">
            Learn new skills, manage your courses, track progress, and stay connected with
            instructors through one simple LMS workspace.
          </p>

          <div className="mt-10 flex flex-row items-center gap-5">
            <Link
              to="/register"
              className="inline-flex h-12.5 items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Enroll Now
            </Link>
            <Link
              to="/login"
              className="inline-flex h-12.5 items-center justify-center rounded-lg border-2 border-blue-600 bg-white px-8 py-3.5 text-base font-bold text-blue-600 transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Login
            </Link>
          </div>

        </div>

        {/* Right Side: Image Display Container */}
        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm">
            <img
              src={homeImage}
              alt="Students collaborating through SkillHub"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>

      </div>
    </main>
  );
}

export default Home;