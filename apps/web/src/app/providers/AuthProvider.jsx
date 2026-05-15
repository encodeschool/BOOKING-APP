import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const authApi = axios.create({
  baseURL: API_BASE_URL,
});

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("client-token"));
  const [role, setRole] = useState(localStorage.getItem("user-role"));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile when token changes
  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [token]);

  const loadProfile = async () => {
    try {
      const response = await authApi.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      if (response.data.role) {
        localStorage.setItem("user-role", response.data.role);
        setRole(response.data.role);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      // If token is invalid, clear it
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const register = async (email, password, fullName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/api/auth/register", {
        email,
        password,
      });
      localStorage.setItem("client-token", response.data.token);
      setToken(response.data.token);
      // Update user profile with fullName
      if (fullName) {
        await authApi.put(
          "/api/users/me",
          { fullName },
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("client-token", response.data.token);
      setToken(response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/api/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Password reset request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/api/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authApi.put("/api/users/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      await authApi.delete("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
    } catch (err) {
      console.error("Failed to delete account:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("client-token");
    localStorage.removeItem("user-role");
    setToken(null);
    setRole(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        profile,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        deleteAccount,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
