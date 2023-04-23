import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  if (token) {
    if (isAdmin == 1) {
      return children ? children : <Outlet />;
    } else {
      return <Navigate to="/" replace />;
    }
  } else return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
