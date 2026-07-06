import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API } from "../../services/api";
import { 
  Camera, 
  LogOut, 
  Lock, 
  Mail, 
  Edit3, 
  ShieldCheck, 
  X, 
  Save,
  ShieldAlert
} from "lucide-react";

export default function AdminProfile() {
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
    avatar: user?.avatar || "",
    avatarFile: null, // 🟢 Initialize clear state
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      avatarFile: null,
    });
  }, [user]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userRes = await API.get("/auth/profile");
        setUser(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again to continue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#94a3b8",
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
      const res = await API.put("/auth/profile", formData);
      const updatedUserData = res.data.user || { ...user, ...formData };
      
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      setIsEditing(false);
      Swal.fire("Success", "Admin profile updated successfully!", "success");
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
        title: "Update Admin Photo?",
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

      Swal.fire({ icon: "success", title: "Updated!", text: "Photo updated successfully" });
      
      const updatedUser = { ...user, avatar: res.data.avatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // 🟢 Optimization: Upload එකෙන් පස්සේ avatarFile එක null කරලා බටන් එක අයින් කරනවා
      setFormData(prev => ({ ...prev, avatarFile: null }));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.response?.data?.message || err.message });
    }
  };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "" });

  const handlePasswordSubmit = async () => {
    if (isChangingPassword) return;
    const payload = {
      currentPassword: passData.currentPassword.trim(),
      newPassword: passData.newPassword.trim(),
    };
    if (!payload.currentPassword || !payload.newPassword) {
      Swal.fire("Warning", "Please fill all password fields", "warning");
      return;
    }
    try {
      setIsChangingPassword(true);
      await API.put("/auth/change-password", payload);
      Swal.fire("Success", "Password updated successfully!", "success");
      setIsPasswordModalOpen(false);
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      
      {/* HERO SECTION */}
      <div className="h-80 bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        
        {/* PROFILE IDENTITY CARD */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200 border border-white p-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative">
                  {formData.avatar || user?.avatar ? (
                    <img src={formData.avatar || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-5xl font-black">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></div>
                </div>
                <button
                  onClick={() => document.getElementById("profilePicture").click()}
                  className="absolute -bottom-2 -right-2 bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
                >
                  <Camera size={20} />
                </button>
                <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              {formData.avatarFile && (
                <button onClick={handleUpdatePicture} className="mt-6 px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-100">
                  Save Photo
                </button>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">
                 <ShieldCheck size={14} className="text-purple-600" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">Verified System Admin</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-slate-400 font-bold text-lg flex items-center justify-center lg:justify-start gap-2">
                <Mail size={18} className="text-slate-300" /> {user?.email}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                <span className="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg">Root Access Active</span>
                <span className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest border border-indigo-100">SkillHub Core</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS Selector */}
        <div className="flex gap-4 mt-12 w-fit mx-auto lg:mx-0">
          {["overview", "security"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab ? "bg-purple-600 text-white shadow-xl shadow-purple-200" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"}`}>
              {tab === "overview" ? "Identity" : "Security"}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 mt-8 p-10">
          
          {/* OVERVIEW SECTION */}
          {activeTab === "overview" && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-50 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Root Metadata</h2>
                  <p className="text-slate-400 font-medium mt-1">Update administrator identity details.</p>
                </div>
                <button onClick={() => isEditing ? handleUpdate() : setIsEditing(true)} disabled={saving} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${isEditing ? "bg-emerald-600 text-white" : "bg-purple-600 text-white"} shadow-lg disabled:opacity-50`}>
                  {saving ? "Saving..." : isEditing ? <><Save size={16} /> Commit Changes</> : <><Edit3 size={16} /> Edit Profile</>}
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {["firstName", "lastName", "email", "phone", "bio", "address"].map((field) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field}</label>
                    <input type={field === "email" ? "email" : "text"} disabled={!isEditing || field === "email"} value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-purple-600 transition-all disabled:opacity-60" placeholder={`Enter root ${field}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Shield</h2>
                <p className="text-slate-400 font-medium mt-1">Manage system administrator access.</p>
              </div>

              {/* Password Card */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:border-purple-200 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-purple-600 group-hover:shadow-lg transition-all"><Lock size={24} /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Synchronize Password</h3>
                    <p className="text-slate-400 text-sm font-medium">Update your root access credentials.</p>
                  </div>
                </div>
                <button onClick={() => setIsPasswordModalOpen(true)} className="px-8 py-3 rounded-xl bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition shadow-lg shadow-purple-100">Change</button>
              </div>

              {/* Logout Card */}
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 group-hover:shadow-lg transition-all"><LogOut size={24} /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Session Termination</h3>
                    <p className="text-slate-400 text-sm font-medium">Sign out from the administrator node.</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="px-8 py-3 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-100">Logout</button>
              </div>

              {/* Purge Card */}
              <div className="bg-rose-50/50 p-8 rounded-[2rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white hover:border-rose-300 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 group-hover:shadow-lg transition-all"><ShieldAlert size={24} /></div>
                  <div>
                    <h3 className="text-lg font-black text-rose-600 tracking-tight">Purge Presence</h3>
                    <p className="text-rose-400/70 text-sm font-medium">Emergency removal of administrator identity.</p>
                  </div>
                </div>
                <button onClick={() => Swal.fire("Verification Required", "Purge requests require admin override.", "info")} className="px-8 py-3 rounded-xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-100">Purge</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Modify Key</h2>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Secret</label>
                <input type="password" placeholder="••••••••" value={passData.currentPassword} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all" onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Root Secret</label>
                <input type="password" placeholder="••••••••" value={passData.newPassword} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all" onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-4 font-black text-[11px] uppercase text-slate-500 hover:bg-slate-50 rounded-2xl transition tracking-widest">Cancel</button>
              <button onClick={handlePasswordSubmit} disabled={isChangingPassword} className="flex-1 bg-purple-600 text-white py-4 font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-100 hover:opacity-90 transition active:scale-95">
                {isChangingPassword ? "Saving..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}