import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { Trash2, UserCog, Mail, Shield, User, Filter, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, student, instructor, admin

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      Swal.fire("Error", "Failed to access user directory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, currentRole, name) => {
    if (currentRole === "admin") {
      return Swal.fire("Action Blocked", "System root administrators cannot be demoted.", "warning");
    }

    const nextRole = currentRole === "student" ? "instructor" : "student";

    const result = await Swal.fire({
      title: "Modify Access Level?",
      text: `Do you want to change ${name}'s role from "${currentRole}" to "${nextRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      confirmButtonText: "Yes, Update Role",
    });

    if (result.isConfirmed) {
      try {
        const res = await API.put(`/admin/user/${id}/role`, { role: nextRole });
        if (res.data.success) {
          Swal.fire("Success!", "User access level synchronized.", "success");
          fetchUsers();
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to update role", "error");
      }
    }
  };

  const handleDelete = async (id, role) => {
    if (role === "admin") {
      return Swal.fire("Action Denied", "Cannot purge root admin node.", "error");
    }

    const result = await Swal.fire({
      title: "Remove User?",
      text: "This action cannot be undone! The user will lose access to the ecosystem.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Delete Node"
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/admin/user/${id}`);
        Swal.fire("Deleted!", "User removed from ecosystem.", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  // Roles අනුව Filter කිරීමේ Logic එක
  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing User Directory...</div>;

  return (
    <div className="space-y-6">
      {/* ROLE FILTER TABS */}
      <div className="flex gap-3 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {[
          { id: "all", label: "All Nodes" },
          { id: "student", label: "Students" },
          { id: "instructor", label: "Instructors" },
          { id: "admin", label: "Admins" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* USER DIRECTORY TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
           <h3 className="text-xl font-black text-slate-900 tracking-tight">Global User Directory</h3>
           <span className="px-4 py-1.5 bg-purple-50 rounded-full text-[10px] font-black text-purple-600 uppercase tracking-widest">
             {filteredUsers.length} Segmented Nodes
           </span>
        </div>
        
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <AlertCircle size={36} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No user nodes found in this sector</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Identity Node</th>
                  <th className="px-8 py-5">Network Email</th>
                  <th className="px-8 py-5">Access Level</th>
                  <th className="px-8 py-5">Registration</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100 shadow-inner">
                          {user.firstName ? user.firstName[0].toUpperCase() : "U"} 
                        </div>
                        <span className="font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{user.email}</td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                         user.role === 'admin' 
                           ? 'bg-rose-50 text-rose-600 border-rose-100' 
                           : user.role === 'instructor' 
                           ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                           : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                          {user.role}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Role Switcher Button */}
                        {user.role !== "admin" && (
                          <button 
                            onClick={() => handleRoleChange(user._id, user.role, `${user.firstName} ${user.lastName}`)}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-purple-50 hover:text-purple-600 border border-slate-100 transition-all"
                            title="Switch User Role"
                          >
                            <UserCog size={16} />
                          </button>
                        )}
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(user._id, user.role)} 
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-100 transition-all"
                          title="Purge User Node"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}