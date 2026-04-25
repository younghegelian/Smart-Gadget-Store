// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

type User = { email?: string; [k: string]: any } | null;

type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requireAuth: (callback: () => void, redirectTo?: string) => void;
  // Expose intendedPath only if you need it elsewhere
  intendedPath: string | null;
  setIntendedPath: (p: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  const isLoggedIn = Boolean(localStorage.getItem("token") && user);

  const login = async (email: string, password: string) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      // Adjust destructuring if your API uses a different shape
      const { token, user: userFromServer } = res.data;

      if (!token) return false;

      localStorage.setItem("token", token);
      const finalUser = userFromServer ?? { email };
      localStorage.setItem("user", JSON.stringify(finalUser));
      setUser(finalUser);

      // Redirect to intendedPath (if set) or to home
      const to = intendedPath ?? "/";
      setIntendedPath(null);
      navigate(to);

      return true;
    } catch (err: any) {
      console.error("Login failed:", err?.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  /**
   * requireAuth: programmatic guard for button-level flows
   * - if logged in -> runs callback immediately
   * - otherwise saves redirect target and navigates to /login
   */
  const requireAuth = (callback: () => void, redirectTo?: string) => {
    if (isLoggedIn) {
      callback();
      return;
    }
    const target = redirectTo ?? window.location.pathname + window.location.search;
    setIntendedPath(target);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        requireAuth,
        intendedPath,
        setIntendedPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
