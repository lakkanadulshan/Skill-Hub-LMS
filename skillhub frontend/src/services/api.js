import axios from "axios";

// 1. Base URL එක එකම තැනක තියාගන්න
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3020/api";

// 2. Public API එක (Token අවශ්‍ය නැති තැන් වලට - Login, Register, Forgot Password)
export const publicAPI = axios.create({ baseURL });

// 3. Protected API එක (Token අවශ්‍ය තැන් වලට - Dashboard, Profile)
export const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});