import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children, role }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Loading State
  // This prevents the "flicker" where a user is redirected before Redux is ready
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Not Logged In
  // We use 'state' to remember where the user was trying to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Authorization
  if (role && user.role !== role) {
    // If an organizer tries to access attendee pages, send them to their dashboard
    if (user.role === "organizer") {
      return <Navigate to="/organizer" replace />;
    }
    // If an attendee tries to access organizer pages, send them to their home
    return <Navigate to="/home" replace />;
  }

  // 4. Authorized Access
  return children;
};

export default ProtectedRoutes;