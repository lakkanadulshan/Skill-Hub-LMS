import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {publicAPI} from "../services/api";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const { userId } = useParams(); // URL එකෙන් userId එක ගන්නවා
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    
    console.log("Sending data:", { userId, newPassword }); 

    try {
      const res = await publicAPI.post("/auth/reset-password", { 
        userId, 
        newPassword 
      });
      Swal.fire("Success", "Password updated successfully!", "success");
      navigate("/login");
    } catch (err) {

      console.error("Reset Error:", err.response?.data);
      Swal.fire("Error", err.response?.data?.message || "Could not reset password", "error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Set New Password</h2>
        <input 
          type="password" 
          placeholder="New Password" 
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">
          Update Password
        </button>
      </form>
    </div>
  );
}