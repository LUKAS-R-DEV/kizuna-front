import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getRoles } from "@/lib/auth";
import { hasAnyRole } from "@/lib/roles";

interface RoleProtectedRouteProps {
  children: ReactNode;
  roles: string[];
}

/** Exige login + pelo menos uma das roles (ADMIN sempre passa). */
export default function RoleProtectedRoute({ children, roles }: RoleProtectedRouteProps) {
  const userRoles = getRoles();

  return (
    <ProtectedRoute>
      {hasAnyRole(userRoles, roles) ? children : <Navigate to="/access-denied" replace />}
    </ProtectedRoute>
  );
}
