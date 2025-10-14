import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole?: "admin" | "customer";
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("user");

  if (!token || !user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== requiredRole) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}
