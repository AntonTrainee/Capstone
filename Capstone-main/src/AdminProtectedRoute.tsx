import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user");

  let userRole = null;
  try {
    const user = userData ? JSON.parse(userData) : null;
    userRole = user?.role;
  } catch (err) {
    console.error("Error parsing user data:", err);
  }

  console.log("Token:", token);
  console.log("User Role:", userRole);

  if (!token) return <Navigate to="/login" replace />;
  if (userRole !== "admin") return <Navigate to="/customerdashb" replace />;

  return <Outlet />;
};

export default AdminProtectedRoute;
