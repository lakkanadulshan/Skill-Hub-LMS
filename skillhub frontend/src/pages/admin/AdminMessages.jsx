import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { Mail, Trash2, Calendar, User, CheckCircle, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact/all"); 
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleToggleRead = async (id, isCurrentlyRead) => {
    try {
      const res = await API.put(`/contact/${id}/status`, { isRead: !isCurrentlyRead });
      if (res.data.success) {
        Swal.fire("Status Updated", "Ticket resolution status synchronized.", "success");
        fetchMessages();
      }
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Purge Support Ticket?",
      text: "This message will be permanently removed from system data logs.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/contact/${id}`);
        Swal.fire("Success", "Message purged from system.", "success");
        fetchMessages();
      } catch (err) {
        Swal.fire("Error", "Failed to delete message", "error");
      }
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Support Data...</div>;

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 gap-4">
          {messages.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active support tickets</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`bg-white p-8 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all group relative ${
                  msg.isRead ? "border-slate-100 opacity-75" : "border-purple-200 shadow-md shadow-purple-50"
                }`}
              >
                {/* New Ticket Indicator Badge */}
                {!msg.isRead && (
                  <span className="absolute top-0 left-8 -translate-y-1/2 bg-purple-600 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Action Required
                  </span>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner"><User size={20} /></div>
                      <div>
                         <h4 className="font-black text-slate-900 tracking-tight">{msg.name}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{msg.email}</p>
                      </div>
                   </div>
                   
                   {/* ACTION CONTROLS */}
                   <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">{msg.subject}</span>
                      
                      {/* Mark as Resolved Check Button */}
                      <button 
                        onClick={() => handleToggleRead(msg._id, msg.isRead)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                          msg.isRead 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-50 text-slate-400 border-slate-100 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={msg.isRead ? "Mark as Unresolved" : "Mark as Resolved"}
                      >
                        <CheckCircle size={16} />
                      </button>

                      {/* Delete Ticket Button */}
                      <button onClick={() => handleDelete(msg._id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                   </div>
                </div>
                
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed italic">
                   "{msg.message}"
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   <Calendar size={12} /> Received: {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}