import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function PrivateRoute({ children }) {
  if (!isLoggedIn()) {
    const service = window.location.pathname.split("/").pop();
    return <Navigate to={`/auth?service=${service}`} replace />;
  }

  return children;
}
