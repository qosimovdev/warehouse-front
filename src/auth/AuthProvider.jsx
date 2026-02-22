// AuthProvider.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    return token && stored ? JSON.parse(stored) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
