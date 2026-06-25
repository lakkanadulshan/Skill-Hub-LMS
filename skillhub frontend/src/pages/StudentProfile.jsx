import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../services/api";

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({ enrolled: 0, completed: 0, active: 0 });

  // BACKEND එකෙන් දත්ත ගෙන ඒම
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // const { data } = await API.get("/auth/profile-stats");
        const response = await API.get("/auth/profile-stats");
        console.log("Backend response data:", response.data);
        setStats({
          enrolled: response.data.enrolledCount || 0,
          completed: response.data.completedCount || 0,
          active: response.data.activeCount || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again to continue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await API.put("/auth/profile", formData);
      localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
      setIsEditing(false);
      Swal.fire("Success", "Profile updated successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const statItems = [
    { label: "Enrolled", value: stats.enrolled },
    { label: "Done", value: stats.completed },
    { label: "Active", value: stats.active },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="h-56 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      <div className="max-w-6xl mx-auto px-6 -mt-20">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.name}
              </h1>
              <p className="text-slate-500">{user?.email}</p>
              {/* Badge */}
              <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Active Student
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid with Hover effect */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-slate-500 text-sm">{stat.label}</h3>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs with new Active State */}
        <div className="flex flex-wrap gap-3 mt-8">
          {["overview", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mt-6">
          {activeTab === "overview" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <button
                  onClick={() =>
                    isEditing ? handleUpdate() : setIsEditing(true)
                  }
                  disabled={saving}
                  className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-black transition disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Edit Profile"}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {["name", "email", "phone", "address"].map((field) => (
                  <div key={field}>
                    <label className="text-sm text-slate-400 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      disabled={!isEditing || field === "email"}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      className="w-full mt-1 p-3 border rounded-xl disabled:bg-slate-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Security Settings
                </h2>
                <p className="text-slate-500 mt-1">
                  Manage your account security and preferences
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-blue-300 transition">
                  <div>
                    <h3 className="font-semibold text-slate-800">Password</h3>
                    <p className="text-sm text-slate-500">
                      Update your account password
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:border-red-300 transition">
                  <div>
                    <h3 className="font-semibold text-slate-800">Logout</h3>
                    <p className="text-sm text-slate-500">
                      Sign out from your account
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-red-100 bg-red-50 rounded-2xl">
                  <div>
                    <h3 className="font-semibold text-red-600">
                      Delete Account
                    </h3>
                    <p className="text-sm text-slate-500">
                      Permanently remove your account
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      Swal.fire(
                        "Warning",
                        "Delete action requires admin approval.",
                        "warning",
                      )
                    }
                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
