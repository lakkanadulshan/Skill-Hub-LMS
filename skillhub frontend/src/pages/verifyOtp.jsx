import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Register Page එකෙන් එන userId එක මෙතනින් ගන්නවා
  const userId = location.state?.userId;

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("/auth/verify-otp", { userId, otp });
      Swal.fire("Success!", "Account verified! You can now login.", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Verify Account</h2>
        <p className="text-sm text-center text-slate-500">Enter the 6-digit code sent to your email.</p>
        
        <input 
          type="text" 
          maxLength="6" 
          placeholder="Enter OTP" 
          className="w-full p-4 text-center text-2xl tracking-widest rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setOtp(e.target.value)}
          required 
        />

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}