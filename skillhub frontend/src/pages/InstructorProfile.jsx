import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../services/api";
import { 
  Camera, 
  LogOut, 
  Lock, 
  Mail, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  X, 
  Save,
  Activity,
  Award,
  BookOpen,
  Video,
  DollarSign,
  Users
} from "lucide-react";

export default function InstructorProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  // Instructor ට අදාළ organization field එක ඇතුළත් කළා
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    organization: user?.organization || "",
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Instructor Stats සඳහා state එක
  const [stats, setStats] = useState({ totalCourses: 0, totalLessons: 0, totalStudents: 0, totalEarnings: 0 });

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      organization: user?.organization || "",
      avatar: user?.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        // 1. Instructor Stats ලබා ගැනීම
        const resStats = await API.get("/courses/instructor/stats");
        if (resStats.data.success) {
          setStats(resStats.data.stats);
        }
        // 2. Profile Data ලබා ගැනීම
        const userRes = await API.get("/auth/profile");
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchInstructorData();
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
      const result = await Swal.fire({
        title: "Update Profile Picture?",
        text: "Do you want to save this new photo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        confirmButtonColor: "#7c3aed"
      });
      if (!result.isConfirmed) return;

      const data = new FormData();
      data.append("profilePicture", formData.avatarFile);
      const res = await API.put("/auth/profile-picture", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({ icon: "success", title: "Updated!", text: "Profile picture updated successfully" });
      const updatedUser = { ...user, avatar: res.data.avatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.response?.data?.message || err.message });
    }
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });

  const handlePasswordSubmit = async () => {
    if (isChangingPassword) return;
    try {
      setIsChangingPassword(true);
      await API.put("/auth/change-password", passData);
      Swal.fire("Success", "Password updated successfully!", "success");
      setIsPasswordModalOpen(false);
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      Swal.fire("Error", "Failed to update", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Instructor Stats Items
  const statItems = [
    { label: "Courses", value: stats.totalCourses, icon: <BookOpen size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Students", value: stats.totalStudents, icon: <Users size={20} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Earnings", value: `$${stats.totalEarnings}`, icon: <DollarSign size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* HERO SECTION */}
      <div className="h-80 bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        
        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white p-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  {formData.avatar || user?.avatar ? (
                    <img src={formData.avatar || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById("profilePicture").click()}
                  className="absolute -bottom-2 -right-2 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 text-purple-600 hover:bg-slate-100 transition-all"
                >
                  <Camera size={20} />
                </button>
                <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              {formData.avatarFile && (
                <button onClick={handleUpdatePicture} className="mt-6 px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg">
                  Save Photo
                </button>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left space-y-4">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-500 font-bold text-lg">{user?.email}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium text-sm">
                  Verified Instructor
                </span>
                <span className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-medium text-sm">
                  SkillHub Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {statItems.map((stat) => (
            <div key={stat.label} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                 <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>{stat.icon}</div>
                 <Award size={20} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-bold">{stat.label}</p>
              <h2 className="text-4xl font-black text-slate-900 mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-4 mt-12">
          {["overview", "security"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab ? "bg-purple-600 text-white shadow-xl" : "bg-white text-slate-600 shadow hover:bg-slate-100"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 mt-8 p-10">
          
          {activeTab === "overview" && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-50 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Information</h2>
                  <p className="text-slate-500 font-medium mt-1">Update your professional details.</p>
                </div>
                <button onClick={() => isEditing ? handleUpdate() : setIsEditing(true)} disabled={saving} className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isEditing ? "bg-emerald-600 text-white" : "bg-purple-600 text-white"} shadow-lg disabled:opacity-50`}>
                  {saving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {["firstName", "lastName", "email", "organization", "phone", "bio", "address"].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-medium text-slate-500 capitalize">{field}</label>
                    <input type={field === "email" ? "email" : "text"} disabled={!isEditing || field === "email"} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 transition-all disabled:bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Security Settings</h2>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-purple-600"><Lock size={24} /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Change Password</h3>
                    <p className="text-slate-500 text-sm font-medium">Update your account security credentials.</p>
                  </div>
                </div>
                <button onClick={() => setIsPasswordModalOpen(true)} className="px-8 py-3 rounded-xl bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition">Change</button>
              </div>
              {/* Logout & Delete (Student එකේ වගේමයි) */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600"><LogOut size={24} /></div>
                  <div><h3 className="text-lg font-black text-slate-900">Sign Out</h3><p className="text-slate-500 text-sm font-medium">Log out from your instructor session.</p></div>
                </div>
                <button onClick={handleLogout} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal - Student එකේ වගේමයි */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Change Password</h2>
            <div className="space-y-4">
              <input type="password" placeholder="Current Password" value={passData.currentPassword} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-600" onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })} />
              <input type="password" placeholder="New Password" value={passData.newPassword} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-purple-600" onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} />
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-4 font-black text-[11px] uppercase text-slate-500 hover:bg-slate-50 rounded-2xl transition">Cancel</button>
              <button onClick={handlePasswordSubmit} disabled={isChangingPassword} className="flex-1 bg-purple-600 text-white py-4 font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl hover:opacity-90 transition">
                {isChangingPassword ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}