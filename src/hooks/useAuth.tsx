
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateSaId } from "@/utils/saIdValidation";

export const useAuth = () => {
  const [saId, setSaId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionChecking, setIsConnectionChecking] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if there are any connection issues with Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsConnectionChecking(true);
        setConnectionError(null);
        
        // Simple ping to check connectivity
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth check failed:', error);
          setConnectionError(error.message);
        } else {
          console.log('Supabase connection successful');
        }
        
        setIsConnectionChecking(false);
      } catch (err: any) {
        console.error('Supabase connectivity check failed:', err);
        setConnectionError(err.message || 'Failed to connect to database');
        setIsConnectionChecking(false);
      }
    };
    
    checkConnection();
  }, []);

  const { handleLogin: handleLoginAction } = useAuthActions({
    email: saId,
    password,
    setIsLoading,
    navigate,
  });

  const handleLogin = async () => {
    if (isConnectionChecking) {
      toast.error("Still checking connection. Please wait a moment.");
      return;
    }
    
    if (connectionError) {
      toast.error(`Connection error: ${connectionError}. Please try again later.`);
      return;
    }

    // Validate SA ID
    const validation = validateSaId(saId);
    if (!validation.isValid) {
      toast.error(validation.message || "Invalid SA ID");
      return;
    }
    
    try {
      await handleLoginAction();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    }
  };

  return {
    saId,
    setSaId,
    password,
    setPassword,
    isLoading,
    isConnectionChecking,
    connectionError,
    handleLogin,
  };
};
