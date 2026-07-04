import React, { useState, useEffect } from "react";
import { API } from "../../services/api.js";
import { Mail, Trash2, Calendar, User, MessageSquare, ArrowUpRight } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact/all"); // Backend එකේ හදපු route එක
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/contact/${id}`);
      Swal.fire("Success", "Message purged.", "success");
      fetchMessages();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
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
              <div key={msg._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner"><User size={20} /></div>
                      <div>
                         <h4 className="font-black text-slate-900 tracking-tight">{msg.name}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{msg.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">{msg.subject}</span>
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