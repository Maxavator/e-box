
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";

interface UseAuthActionsProps {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

export const useAuthActions = ({
  email,
  password,
  setIsLoading,
  navigate,
}: UseAuthActionsProps) => {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    try {
      // Transform SA ID to email format if needed
      const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // If user is already logged in, just navigate
      if (sessionData?.session) {
        navigate("/admin");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Database error querying schema')) {
          console.error('Database connection error:', error);
          throw new Error('Unable to connect to authentication service');
        }
        throw error;
      }

      if (data?.session) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error: any) {
      const errorMessage = {
        'Email not confirmed': "Please verify your email address",
        'Invalid login credentials': "Invalid email or password",
        'Unable to connect to authentication service': "Authentication service unavailable. Please try again later.",
      }[error.message] || "Login failed. Please try again.";
      
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin };
};
