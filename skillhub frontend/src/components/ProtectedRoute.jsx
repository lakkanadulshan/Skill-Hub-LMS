import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return user.role === "instructor" 
      ? <Navigate to="/instructor-dashboard" replace /> 
      : <Navigate to="/student-dashboard" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return user.role === "instructor"
      ? <Navigate to="/instructor-profile" replace />
      : <Navigate to="/student-profile" replace />;
  }

  return children;
}