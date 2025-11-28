import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserProfile {
  userId: string;
  name: string;
  collegeId: string;
  branch: string;
  mobileNumber: string;
  address: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userId: string, password: string) => Promise<boolean>;
  register: (profile: UserProfile, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (userId: string, password: string): Promise<boolean> => {
    // Mock login - in real app, validate credentials
    // For demo, accept any non-empty credentials
    if (userId && password) {
      const mockUser: UserProfile = {
        userId,
        name: "Demo Student",
        collegeId: "iit-delhi",
        branch: "CSE",
        mobileNumber: "9876543210",
        address: "New Delhi",
      };
      setUser(mockUser);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const register = async (
    profile: UserProfile,
    password: string
  ): Promise<boolean> => {
    // Mock registration - in real app, save to database
    if (profile.userId && password) {
      setUser(profile);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
