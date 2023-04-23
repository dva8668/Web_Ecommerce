import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import DefaultUser from "./DefaultUser";
import { AuthContext } from "../../../contexts/authContext";

const UserOrder = () => {
  const { authState } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (authState.isAuthenticated || token) {
    return (
      <DefaultUser>
        <h2>{JSON.stringify(authState.username)}</h2>
      </DefaultUser>
    );
  } else return <Navigate to="/login" replace />;
};

export default UserOrder;
