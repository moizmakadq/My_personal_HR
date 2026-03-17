import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ allow, children }) {
  const { initialized, isAuthenticated, role } = useAuth();
  if (!initialized) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}
