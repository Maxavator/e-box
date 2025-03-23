
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export const ProtectedRoute = () => {
  const session = useSession();
  const location = useLocation();
  
  if (!session) {
    // Redirect to the login page if there is no session
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};
