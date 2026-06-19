import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import loginImage from "../assets/login page image.png";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  // 1. All hooks and states must be inside the component
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Standard Email/Password Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (login) login(response.data);
        
        // 👇 Role එක පරික්ෂා කර අදාළ Dashboard එකට යැවීම
        if (response.data.role === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/dashboard"); 
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. Google Login Success Handler
  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      console.log("Google Response:", tokenResponse); // ටෙස්ට් කරලා බලන්න code එක එනවාද කියලා

      const res = await API.post("/auth/google-login", {
        token: tokenResponse.code, // 'access_token' වෙනුවට දැන් මෙතනට එන්නේ 'code' එක
      });

      if (res.data) {
        login(res.data); 
        console.log("Google Login Successful!");
        
        // 👇 Google Login එකෙන් පසුවත් Role එක පරික්ෂා කර අදාළ Dashboard එකට යැවීම
        if (res.data.role === "instructor") {
          navigate("/instructor-dashboard");
        } else {
          navigate("/dashboard"); 
        }
      }
    } catch (err) {
      console.error("Backend Google Login Failed:", err);
    }
  };

  // 4. useGoogleLogin Hook 
  const googleLoginTrigger = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.error("Google Login Failed at Frontend"),
    flow: "auth-code", 
  });



  return (
    <main className="grid min-h-screen bg-white font-['Trebuchet_MS',Arial,sans-serif] md:grid-cols-2">
      {/* Left Section: Illustration & Branding */}
      <section className="flex flex-col items-center justify-center bg-[#edf5fc] px-8 py-12 text-center md:px-12">
        <div className="mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-extrabold tracking-tight text-slate-950">
              SkillHub
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            Online Learning Management System
          </h1>
          <p className="mt-2 text-base font-medium text-slate-500">
            Let's learn something new today!
          </p>
        </div>

        <div className="flex w-full justify-center py-6 md:py-8">
          <img
            src={loginImage}
            alt="Online learning illustration"
            className="max-h-[42vh] w-full max-w-xl object-contain"
          />
        </div>
      </section>

      {/* Right Section: Clean Login Form */}
      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
        <div className="w-full max-w-md rounded-xl border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/60">
          <div className="mb-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950">
              Login!
            </h2>
            <p className="mt-3 text-base font-medium text-slate-500">
              Nice to see you! Please log in with your account.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Form wrapper එක onSubmit={handleLogin} ලෙස නිවැරදි කර ඇත */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-bold text-slate-700"
              >
                Email address
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-0 px-4 text-base font-medium text-slate-800 outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-bold text-slate-700"
              >
                Password
              </label>
              <div className="flex h-12 overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-0 px-4 text-base font-medium text-slate-800 outline-none placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="flex w-12 items-center justify-center text-slate-300 transition hover:text-blue-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12s3-5.25 8.25-5.25S20.25 12 20.25 12s-3 5.25-8.25 5.25S3.75 12 3.75 12Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14.25A2.25 2.25 0 1 0 12 9.75a2.25 2.25 0 0 0 0 4.5Z"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Your password must be 8 characters at least
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 py-1 text-sm">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-md bg-blue-600 px-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-semibold text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button

            type="button"
              onClick={() => googleLoginTrigger()} // Google Login trigger function
            className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm font-medium text-slate-400">
            New to SkillHub?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 transition hover:text-blue-700"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
