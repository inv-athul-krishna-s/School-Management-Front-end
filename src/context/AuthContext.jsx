// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Restore session on reload (per tab via sessionStorage)
  useEffect(() => {
    const activeRole = sessionStorage.getItem("activeRole");
    if (!activeRole) return;

    const storedToken = sessionStorage.getItem(`${activeRole}_token`);
    const storedUser = sessionStorage.getItem(`${activeRole}_user`);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login
  async function login(username, password) {
    try {
      const res = await axios.post("/token/", { username, password });
      const { access, refresh, role } = res.data;

      const decoded = jwtDecode(access);
      const userId = decoded.user_id;
      const userData = { id: userId, username, role };

      // Store per-role tokens in sessionStorage (per tab!)
      sessionStorage.setItem(`${role}_token`, access);
      sessionStorage.setItem(`${role}_refresh`, refresh);
      sessionStorage.setItem(`${role}_user`, JSON.stringify(userData));

      // Set active role for this tab
      sessionStorage.setItem("activeRole", role);

      setToken(access);
      setUser(userData);

      navigate(`/${role}/dashboard`);
    } catch (err) {
      throw err;
    }
  }

  //  Switch active role (inside same tab)
  function switchRole(role) {
    const storedToken = sessionStorage.getItem(`${role}_token`);
    const storedUser = sessionStorage.getItem(`${role}_user`);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      sessionStorage.setItem("activeRole", role);
      navigate(`/${role}/dashboard`);
    } else {
      console.warn(`No session found for role: ${role}`);
    }
  }

  // Logout
  function logout(role = null) {
    if (role) {
      // Logout only selected role
      sessionStorage.removeItem(`${role}_token`);
      sessionStorage.removeItem(`${role}_refresh`);
      sessionStorage.removeItem(`${role}_user`);

      if (sessionStorage.getItem("activeRole") === role) {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem("activeRole");
      }
    } else {
      // Full logout (all roles, this tab only)
      sessionStorage.clear();
      setUser(null);
      setToken(null);
    }
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
