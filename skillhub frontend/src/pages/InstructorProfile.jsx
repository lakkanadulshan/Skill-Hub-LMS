import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function InstructorProfile() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-slate-900">Instructor Profile</h1>
      <p className="text-slate-600 mt-2">Welcome to your profile page!</p>
      <p className="text-slate-600 mt-2">Here you can view and update your information:</p>
    </div>
  );
}