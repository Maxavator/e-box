
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect, ReactNode } from "react";
import { AuthenticationDialog } from "./AuthenticationDialog";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
        }
        
        setSession(session);
        
        // If we're at the root path and authenticated, redirect to dashboard
        if (session && location.pathname === '/') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      
      // On login, redirect to dashboard if at root
      if (session && location.pathname === '/') {
        navigate('/dashboard');
      }
    });

    getSession();
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);
  
  useEffect(() => {
    // Show auth dialog if no session
    if (!loading && !session) {
      setShowAuthDialog(true);
    } else {
      setShowAuthDialog(false);
    }
  }, [session, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading authentication...</div>
      </div>
    );
  }

  // If the user is authenticated, render the children
  if (session) {
    return <>{children}</>;
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
