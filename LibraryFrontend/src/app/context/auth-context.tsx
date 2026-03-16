import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { apiFetch } from "@/app/api/client";

export type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextType {
  token: string | null;
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    desiredRole: "user" | "admin"
  ) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthResponse = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  token: string;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const user: AuthUser = { id: res.id, email: res.email, name: res.name, role: res.role };
      setToken(res.token);
      setCurrentUser(user);
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Login failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    desiredRole: "user" | "admin"
  ): Promise<AuthResult> => {
    try {
      const res = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, desiredRole }),
      });
      const user: AuthUser = { id: res.id, email: res.email, name: res.name, role: res.role };
      setToken(res.token);
      setCurrentUser(user);
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Registration failed" };
    }
  };

  const value = useMemo(
    () => ({ token, currentUser, login, logout, register }),
    [token, currentUser]
  );

  return (
    <AuthContext.Provider value={value}>
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
