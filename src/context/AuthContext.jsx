import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("staynest_token"));
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await API.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await API.post("/auth/login", { username, password });
      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem("staynest_token", userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid username or password",
      };
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await API.post("/auth/signup", { username, password });
      if (response.data.success) {
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem("staynest_token", userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Signup failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed. Try a different username.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("staynest_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
