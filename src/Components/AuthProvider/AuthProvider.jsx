
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // start as true

  // On first load, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false); // mark loading done
  }, []);

  // Keep userData in sync with localStorage
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userData]);

  const handleLogin = (userDataFromLogin) => {
    localStorage.setItem("userInfo", JSON.stringify(userDataFromLogin));
    localStorage.setItem("accessToken", userDataFromLogin.token);
    setUserData(userDataFromLogin);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    setUserData(null);
  };

  const authInfo = {
    userData,
    loading,
    setLoading,
    handleLogin,
    handleLogout,
    setUserData,
  };

  // Optional: show loader while rehydrating auth
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
