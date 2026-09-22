import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "user" | "admin" | null;

interface AuthContextType {
  isAuthenticated: boolean;
  role: Role;
  username: string | null;
  login: (username: string, password?: string, isAdmin?: boolean) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  requireAuth: (callback: () => void) => void; // Helper to run action if logged in, else redirect
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Load session on mount
    const sessionStr = localStorage.getItem("app_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setIsAuthenticated(true);
        setRole(session.role);
        setUsername(session.username);
      } catch (e) {
        localStorage.removeItem("app_session");
      }
    }
  }, []);

  const login = (emailInput: string, passwordInput?: string, isAdmin: boolean = false) => {
    // Auto-detect admin by credentials (hidden from user)
    if (emailInput === "admin@gmail.com" && passwordInput === "admin1234") {
      setIsAuthenticated(true);
      setRole("admin");
      setUsername("Administrator");
      localStorage.setItem("app_session", JSON.stringify({ role: "admin", username: "Administrator" }));
      return true;
    }

    // Regular user login
    const usersStr = localStorage.getItem("app_users") || "[]";
    const users = JSON.parse(usersStr);
    const user = users.find((u: any) => u.email === emailInput && u.password === passwordInput);
    
    if (user) {
      setIsAuthenticated(true);
      setRole("user");
      setUsername(user.name || user.email);
      localStorage.setItem("app_session", JSON.stringify({ role: "user", username: user.name || user.email }));
      return true;
    }
    return false;
  };

  const register = (nameInput: string, emailInput: string, passwordInput?: string) => {
    const usersStr = localStorage.getItem("app_users") || "[]";
    const users = JSON.parse(usersStr);
    
    // Check if email already registered
    if (users.find((u: any) => u.email === emailInput)) {
      return false; // Email already taken
    }
    
    users.push({ name: nameInput, email: emailInput, password: passwordInput });
    localStorage.setItem("app_users", JSON.stringify(users));
    
    // Auto login after register
    setIsAuthenticated(true);
    setRole("user");
    setUsername(nameInput);
    localStorage.setItem("app_session", JSON.stringify({ role: "user", username: nameInput }));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
    localStorage.removeItem("app_session");
  };

  // Helper function to be used in components
  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      // Dispatch custom event to tell UI to redirect
      window.dispatchEvent(new CustomEvent("trigger-login-redirect"));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, username, login, register, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
