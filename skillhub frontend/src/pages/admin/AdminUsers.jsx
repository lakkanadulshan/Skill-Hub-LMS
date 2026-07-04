import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { Trash2, UserCog, Mail, Shield, User } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Remove User?",
      text: "This action cannot be undone!",
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

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing User Directory...</div>;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
         <h3 className="text-xl font-black text-slate-900 tracking-tight">Global User Directory</h3>
         <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{users.length} Total Nodes</span>
      </div>
      <div className="overflow-x-auto">
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
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold border border-purple-100">
  {user.firstName ? user.firstName[0] : "U"} 
</div>                    <span className="font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">{user.email}</td>
                <td className="px-8 py-5">
                   <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : user.role === 'instructor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {user.role}
                   </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => handleDelete(user._id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}