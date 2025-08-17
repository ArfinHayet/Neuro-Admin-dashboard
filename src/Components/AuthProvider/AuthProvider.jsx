/* eslint-disable react-refresh/only-export-components */
import { createContext,useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
 const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

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