import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage එකෙන් User ගේ විස්තර ලබා ගන්න
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
      navigate("/login");
      return;
    }

    // Role එක අනුව නියමිත පිටුවට යොමු කරන්න
    if (user.role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  }, [navigate]);

  // පිටුව load වන අතරතුර පෙන්වන loading state එක
  return (
    <div className="min-h-screen flex justify-center items-center">
      <p>Loading your dashboard...</p>
    </div>
  );
}