import React, { useState } from "react";
import {
  Sparkles,
  Target,
  Eye,
  Users,
  BookOpen,
  Award,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
  ShieldCheck,
  Globe,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";
import { API } from "../services/api.js";

export default function About() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/contact", formData);

      if (res.data.success) {
        Swal.fire({
          title: "Message Sent!",
          text: "Thank you for reaching out to SkillHub. Our team will contact you shortly.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      Swal.fire({
        title: "Oops!",
        text: err.response?.data?.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenOpenFaq(openFaq === index ? null : index);
  };

  const stats = [
    { label: "Active Students", value: "15K+", icon: <Users size={24} /> },
    { label: "Expert Mentors", value: "300+", icon: <Award size={24} /> },
    { label: "Total Courses", value: "850+", icon: <BookOpen size={24} /> },
    { label: "Success Rate", value: "99%", icon: <Target size={24} /> },
  ];

  const faqs = [
    {
      q: "How do I start a course?",
      a: "Simply register an account, browse our curriculum library, and click 'Enroll Now' on any course you like.",
    },
    {
      q: "Are the certificates verified?",
      a: "Yes, every certificate issued by SkillHub is globally recognized and can be verified via our blockchain network.",
    },
    {
      q: "Can I become an instructor?",
      a: "Absolutely! If you are an expert in your field, you can apply as an instructor through your dashboard settings.",
    },
    {
      q: "Do you offer corporate training?",
      a: "Yes, we provide specialized learning nodes for organizations to upskill their entire workforce.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- 1. PREMIUM HERO SECTION --- */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-gradient-to-b from-purple-50/50 to-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto text-center">
 

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
            Empowering the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Online Learning.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            SkillHub is a modern learning platform that helps students gain
            practical skills through engaging courses, expert guidance, and an
            interactive learning experience.
          </p>
        </div>
      </section>

      {/* --- 2. ABOUT / MISSION / VISION --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight">
                Our Identity
              </h2>
              <p className="text-slate-500 text-lg leading-9 font-medium">
                Since its launch, SkillHub has been committed to making quality
                education accessible, empowering learners to grow their
                knowledge and achieve their career goals.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-black text-purple-900">
                  Our Mission
                </h3>
                <p className="text-purple-700/70 text-sm font-bold leading-relaxed">
                  To make high-quality, industry-relevant education accessible
                  to everyone, everywhere.
                </p>
              </div>
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-black text-indigo-900">
                  Our Vision
                </h3>
                <p className="text-indigo-700/70 text-sm font-bold leading-relaxed">
                  To become the global gold standard for interactive and
                  certified digital learning platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-[4rem] overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80"
                alt="SkillHub Team"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

          </div>
        </div>
      </section>

      {/* --- 3. STATISTICS GRID --- */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto text-purple-400 shadow-2xl">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CONTACT & FORM SECTION --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-20">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-6">
                Let's Connect
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Have questions about our nodes or need administrative support?
                Our synchronization team is available 24/7 to assist your
                learning journey.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Email Network
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">
                    support@skillhub.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Voice Terminal
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">
                    +94 77 123 4567
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Global HQ
                  </p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">
                    Colombo, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.1)] border border-slate-50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Your Identity
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Subject Vector
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help you?"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Data Stream (Message)
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Describe your inquiry in detail..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white focus:border-purple-600 transition-all"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-purple-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-400"
                >
                  {loading ? "Processing..." : "Send Message"}
                  {!loading && (
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. FAQ SECTION --- */}
      <section className="py-24 bg-slate-50/50 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-tight">
              Frequently Asked Queries
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Knowledge Base Synchronization
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-8 text-left flex items-center justify-between group"
                >
                  <span
                    className={`text-lg font-black transition-colors ${openFaq === i ? "text-purple-600" : "text-slate-700 group-hover:text-purple-600"}`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-300 transition-transform duration-500 ${openFaq === i ? "rotate-180 text-purple-600" : ""}`}
                  />
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === i ? "max-h-40" : "max-h-0"}`}
                >
                  <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
