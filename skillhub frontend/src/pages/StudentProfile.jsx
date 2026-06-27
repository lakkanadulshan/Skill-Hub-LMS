import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../services/api";

export default function StudentProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState({ enrolled: 0, completed: 0, active: 0 });
  
  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    avatar: user?.avatar,
  }));
}, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/auth/profile-stats");
        console.log("Backend response data:", response.data);
        setStats({
          enrolled: response.data.enrolledCount || 0,
          completed: response.data.completedCount || 0,
          active: response.data.activeCount || 0,
        });
        // 🔥 ADD THIS (IMPORTANT)
        const userRes = await API.get("/auth/profile");
        console.log("USER FROM BACKEND:", userRes.data); // 👈 මෙතන
        // use your real endpoint
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
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

  // ================= IMAGE SELECT =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
        avatarFile: file,
      }));
    }
  };

  const handleUpdatePicture = async () => {
    try {
      if (!formData.avatarFile) {
        Swal.fire("Warning", "Please select an image first!", "warning");
        return;
      }

      // 🔥 CONFIRM POPUP
      const result = await Swal.fire({
        title: "Update Profile Picture?",
        text: "Do you want to save this new photo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      // 🔥 API CALL
      const data = new FormData();
      data.append("profilePicture", formData.avatarFile);

      const res = await API.put("/auth/profile-picture", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 🔥 SUCCESS POPUP
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Profile picture updated successfully",
      });
      const updatedUser = {
        ...user,
        avatar: res.data.avatar, // backend response new image URL
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      console.log(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pb-12">
      {/* Hero Section */}
      <div className="h-72 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-28 relative z-10">
        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative">
                {/* Profile Picture */}
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  {formData.avatar || user?.avatar ? (
                    <img
                      src={formData.avatar || user?.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Green status */}
                <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-green-500 border-4 border-white"></span>

                {/* Edit Button */}
                <button
                  className="absolute bottom-1 left-24 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-100 transition-all"
                  onClick={() =>
                    document.getElementById("profilePicture").click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Save Photo Button */}
              <button
                onClick={handleUpdatePicture}
                className="mt-4 px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Save Photo
              </button>
            </div>
            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-slate-900">
                {user?.name}
              </h1>

              <p className="text-slate-500 mt-2">{user?.email}</p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-5">
                <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm">
                  Active Student
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                  SkillHub Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-slate-500 text-sm">{stat.label}</h3>

              <p className="text-4xl font-bold text-slate-900 mt-3">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ================= TABS ================= */}

        <div className="flex flex-wrap gap-4 mt-10">
          {["overview", "security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl"
                  : "bg-white text-slate-600 shadow hover:bg-slate-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 mt-8 p-8">
          {/* ================= OVERVIEW ================= */}

          {activeTab === "overview" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Update your personal details.
                  </p>
                </div>

                <button
                  onClick={() =>
                    isEditing ? handleUpdate() : setIsEditing(true)
                  }
                  disabled={saving}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Edit Profile"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-7">
                {[
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "bio",
                  "address",
                ].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-medium text-slate-500 capitalize">
                      {field}
                    </label>

                    <input
                      type={field === "email" ? "email" : "text"}
                      disabled={!isEditing || field === "email"}
                      value={formData[field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-slate-100 transition-all"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ================= SECURITY ================= */}

          {activeTab === "security" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Security Settings
                </h2>

                <p className="text-slate-500 mt-2">
                  Manage your account security and privacy.
                </p>
              </div>

              <div className="space-y-5">
                {/* Password */}

                <div className="rounded-2xl border border-slate-200 p-6 hover:border-blue-300 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">Password</h3>

                      <p className="text-slate-500 text-sm mt-1">
                        Update your account password.
                      </p>
                    </div>

                    <button className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                      Change
                    </button>
                  </div>
                </div>

                {/* Logout */}

                <div className="rounded-2xl border border-slate-200 p-6 hover:border-red-300 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">Logout</h3>

                      <p className="text-slate-500 text-sm mt-1">
                        Sign out from your account.
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Delete */}

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-red-600">Delete Account</h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Permanently remove your account.
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
                      className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
