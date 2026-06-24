import React, { useState } from "react";
import {publicAPI} from "../services/api";
import Swal from "sweetalert2";

export default function VerifyOTPModal({ isOpen, userId, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await publicAPI.post("/auth/verify-otp", { userId, otp });
      
      await Swal.fire({
        title: "Success!",
        text: "Account verified! You can now login.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });
      
      onVerified(); 
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-3xl w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Enter OTP</h2>
        <input 
          type="text" maxLength="6" className="w-full p-4 border rounded-xl text-center text-2xl"
          onChange={(e) => setOtp(e.target.value)} placeholder="000000" required
        />
        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl">
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}