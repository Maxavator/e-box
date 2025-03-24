
import { Outlet, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { AuthenticationDialog } from "./AuthenticationDialog";

export const ProtectedRoute = () => {
  const session = useSession();
  const location = useLocation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  useEffect(() => {
    // Show auth dialog if no session
    if (!session) {
      setShowAuthDialog(true);
    } else {
      setShowAuthDialog(false);
    }
  }, [session]);

  // If the user is authenticated, render the child routes
  if (session) {
    return <Outlet />;
  }

  // If not authenticated, render the auth dialog along with a blank outlet
  return (
    <>
      <AuthenticationDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Authentication Required"
        description="Please login to access this part of the application."
      />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Please login to continue</p>
      </div>
    </>
  );
};
