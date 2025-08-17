/* eslint-disable react-refresh/only-export-components */
import { createContext,useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
 const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("userData");

     if (token && user) {
      setUserData(JSON.parse(user));
    }
    setLoading(false); 
  }, []);

  console.log("333", userData?.name)

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setUserData(null);
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