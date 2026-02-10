import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children, role }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (role && user.role !== role) {
   
    if (user.role === "organizer") {
      return <Navigate to="/organizer" replace />;
    }
   
    return <Navigate to="/home" replace />;
  }

  
  return children;
};

export default ProtectedRoutes;