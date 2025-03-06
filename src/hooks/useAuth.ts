
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if there are any connection issues with Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check connectivity
        const { error } = await supabase.from('user_roles').select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
          console.error('Supabase connection issue:', error);
        }
      } catch (err) {
        console.error('Supabase connectivity check failed:', err);
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
    handleLogin,
  };
};
