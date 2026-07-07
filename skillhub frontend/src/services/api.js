import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://skill-hub-lms-backend.onrender.com/api";

export const publicAPI = axios.create({ baseURL });

export const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});