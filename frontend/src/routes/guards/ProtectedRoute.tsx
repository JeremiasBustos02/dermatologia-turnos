import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/auth.store';
import type { UserRole } from '../../types/index';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  allowOnlyPatients?: boolean;
}

export const ProtectedRoute = ({
  allowedRoles,
  allowOnlyPatients = false,
}: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role;

  if (allowOnlyPatients && userRole !== 'PATIENT') {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole as UserRole)) {
    if (userRole === 'PATIENT') {
      return <Navigate to="/portal/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};