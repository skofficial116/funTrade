import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);

  const getToken = () => localStorage.getItem("token");

  //fetch all courses

  const fetchUserData = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.log("No token available for fetching user data");
        return;
      }

      console.log("Fetching user data with token:", token.substring(0, 20) + "...");
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      if (data.success) {
        console.log("User data fetched successfully");
        setUserData(data.user);
      } else {
        console.log("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error.response?.status, error.response?.data?.message || error.message);
      // Don't recursively call initSession to avoid infinite loops
      if (error.response?.status === 401) {
        console.log("Token appears to be invalid, clearing it");
        localStorage.removeItem("token");
        setUserData(null);
      }
    }
  };

  const initSession = async () => {
    console.log("Initializing session...");
    let token = getToken();
    
    if (!token) {
      console.log("No token found, trying to refresh...");
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.success) {
          console.log("Token refreshed successfully");
          localStorage.setItem("token", data.token);
          token = data.token;
        }
      } catch (error) {
        console.log("No valid session, redirecting to signin");
        // Only redirect if we're not already on signin/signup pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
          navigate("/signin");
        }
        return;
      }
    } else {
      console.log("Token found in localStorage");
    }
    
    // Only fetch user data if we have a token and no user data yet
    if (token && !userData) {
      console.log("Fetching user data during session init...");
      await fetchUserData();
    } else if (userData) {
      console.log("User data already exists, skipping fetch");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log("Logout error:", error);
    }
    localStorage.removeItem("token"); // remove old access token
    setUserData(null);
    navigate("/signin");
  };

  useEffect(() => {
    // Only initialize session on mount, don't fetch user data separately
    initSession();
  }, []);
  const value = {
    currency,
    navigate,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchUserData,
    logout,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
