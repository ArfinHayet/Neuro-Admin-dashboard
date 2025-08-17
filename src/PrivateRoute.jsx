import { useContext } from "react";
import { AuthContext } from "./Components/AuthProvider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./Components/utils/token";

const PrivateRoute = ({ children }) => {
  const { userData, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <>Loading!!!</>;
  }

  // //////console.log("users", user);

  if (isAuthenticated()) {
    if (userData) {
      return children;
    }
  }

  return <Navigate state={location.pathname} to="/login"></Navigate>;
};

export default PrivateRoute;