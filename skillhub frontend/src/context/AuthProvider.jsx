import { useState } from "react";
import { API } from "../services/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    

    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });

  const login = async (data) => {
 
    const userData = data.user || data; 
    const tokenData = data.token;

    setUser(userData);
    setToken(tokenData);

    if (tokenData) localStorage.setItem("token", tokenData);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));

    if (tokenData) {
      try {
        const response = await API.get("/auth/profile");
        const profileData = response.data?.user || response.data;

        if (profileData) {
          const mergedUser = { ...userData, ...profileData };
          setUser(mergedUser);
          localStorage.setItem("user", JSON.stringify(mergedUser));
        }
      } catch (error) {
        console.error("Error refreshing user profile after login", error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}