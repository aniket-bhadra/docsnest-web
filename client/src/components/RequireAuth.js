import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
//   console.log(location);
  if (!user) {
    return <Navigate to="/" state={{ path: location.pathname }} />;
  }

  return children;
};

export default RequireAuth;
