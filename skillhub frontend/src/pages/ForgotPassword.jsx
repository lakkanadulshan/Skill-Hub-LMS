import React, { useState } from "react";
import {publicAPI} from "../services/api";
import Swal from "sweetalert2";
import VerifyOTPModal from "../components/VerifyOTPModal";

export default function ForgotPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the email to the backend to initiate the forgot password process
      const res = await publicAPI.post("/auth/forgot-password", { email });
      setUserId(res.data.userId); //userId come from backend response
      setIsModalOpen(true); // Open the modal after successful response
    } catch (err) {
      Swal.fire("Error", "Email not found!", "error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        <p className="text-slate-500 mb-6">
          Enter your email to receive an OTP.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
            Send OTP
          </button>
        </form>
      </div>

      <VerifyOTPModal
        isOpen={isModalOpen}
        userId={userId}
        onClose={() => setIsModalOpen(false)}
        onVerified={() => window.location.assign("/reset-password/" + userId)} // Verify වුණාම Reset page එකට යන්න
      />
    </div>
  );
}
