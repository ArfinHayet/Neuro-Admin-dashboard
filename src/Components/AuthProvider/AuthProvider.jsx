/* eslint-disable react-refresh/only-export-components */
import { createContext,useEffect,useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
 const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("333", userData?.name)

    useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    setUserData(null);
  };


  useEffect(() => {
    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
    }
  }, [userData]);

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