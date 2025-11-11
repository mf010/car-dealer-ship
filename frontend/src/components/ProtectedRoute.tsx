import { Navigate } from "react-router-dom";
import { authServices } from "../services/authServices";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = authServices.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/rakan-bayan/login" replace />;
  }

  return <>{children}</>;
}
