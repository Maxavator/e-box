
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionChecking, setIsConnectionChecking] = useState(true);
  const navigate = useNavigate();

  // Check if there are any connection issues with Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsConnectionChecking(true);
        // Simple ping to check connectivity
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth check failed:', error);
        }
        
        setIsConnectionChecking(false);
      } catch (err) {
        console.error('Supabase connectivity check failed:', err);
        setIsConnectionChecking(false);
      }
    };
    
    checkConnection();
  }, []);

  const { handleLogin: handleLoginAction } = useAuthActions({
    email,
    password,
    setIsLoading,
    navigate,
  });

  const handleLogin = async () => {
    if (isConnectionChecking) {
      toast.error("Still checking connection. Please wait a moment.");
      return;
    }
    
    try {
      await handleLoginAction();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    isConnectionChecking,
    handleLogin,
  };
};
