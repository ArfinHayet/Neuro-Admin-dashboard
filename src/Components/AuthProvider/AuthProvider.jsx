/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */

import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuthenticateUser } from "../../api/user";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);


  const getUser = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (token) {
      const data = await getAuthenticateUser(token);
      console.log("provider", data);
      setUserData(data);
    } else {
      handleLogout();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      getUser();
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
    toast.success("Logged out successfully");
  };

  // Context Data
  const authInfo = {
    userData,
    loading,
    setLoading,
    handleLogout,
    setUserData,
    
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;