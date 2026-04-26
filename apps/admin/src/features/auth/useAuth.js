import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, getProfileApi } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin-token"));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getProfileApi(token);
      setProfile(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    const res = await loginApi(credentials);
    localStorage.setItem("admin-token", res.token);
    setToken(res.token);
  }

  function logout() {
    localStorage.removeItem("admin-token");
    setToken(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, profile, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}