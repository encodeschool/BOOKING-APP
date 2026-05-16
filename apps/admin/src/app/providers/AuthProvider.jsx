import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, getProfileApi } from "@/lib/api/auth.api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("admin-token"));
  const [role, setRole] = useState(localStorage.getItem("user-role"));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    if (!token) {
      return;
    }
    try {
      const data = await getProfileApi(token);
      setProfile(data);
      if (data.role) {
        localStorage.setItem("user-role", data.role);
        setRole(data.role);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [token]);

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await loginApi(data);
      localStorage.setItem("admin-token", res.token);
      setToken(res.token);
      // Profile will be loaded in useEffect
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("user-role");
    setToken(null);
    setRole(null);
    setProfile(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, role, profile, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}