import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  // Add state to control modal visibility globally
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    setUser(data);
    setShowAuthModal(false); // Close modal on success
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await api.post("/auth/signup", { name, email, password });
    setUser(data);
    setShowAuthModal(false); // Close modal on success
    return data;
  };

  const requestOtp = (phone) => api.post("/auth/otp/request", { phone });
  
  const verifyOtp = async (phone, code) => {
    const data = await api.post("/auth/otp/verify", { phone, code });
    setUser(data);
    setShowAuthModal(false); // Close modal on success
    return data;
  };

  const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
  const resetPassword = (token, newPassword) => api.post("/auth/reset-password", { token, newPassword });
  
  const logout = async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        ready, 
        showAuthModal, 
        setShowAuthModal, 
        login, 
        signup, 
        requestOtp, 
        verifyOtp, 
        forgotPassword, 
        resetPassword, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);