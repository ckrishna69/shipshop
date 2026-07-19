import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => setUser(await api.post("/auth/login", { email, password }));
  const signup = async (name, email, password) => setUser(await api.post("/auth/signup", { name, email, password }));
  const requestOtp = (phone) => api.post("/auth/otp/request", { phone });
  const verifyOtp = async (phone, code) => setUser(await api.post("/auth/otp/verify", { phone, code }));
  const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
  const resetPassword = (token, newPassword) => api.post("/auth/reset-password", { token, newPassword });
  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, requestOtp, verifyOtp, forgotPassword, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
