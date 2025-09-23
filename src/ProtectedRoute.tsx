import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("auth_token"); // just a check
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
