import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Store the attempted URL for redirect after login
    return <Navigate 
      to={`/auth/${role || 'select-role'}/login`} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate 
      to={`/dashboard/${role}`} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  return <Outlet />;
};

export default PrivateRoute; 