import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { userAuth } from "../context/AuthContext";

export const VerifyUser = () => {
  const { authUser } = userAuth();
  // console.log("authUser inside VerifyUser:", authUser);

  return authUser ? <Outlet /> : <Navigate to={"/login"} />;
};
