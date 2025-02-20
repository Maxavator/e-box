
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId, formatSaIdPassword } from "@/utils/saIdValidation";

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
      toast.error("Please enter both email/SA ID and password");
      return;
    }

    setIsLoading(true);
    try {
      let signInResult;
      
      if (isSaId(email)) {
        // For SA ID login, use the SA ID as both email and password
        const formattedEmail = `${email}@said.auth`;
        signInResult = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password
        });
      } else {
        // Regular email login
        console.log('Attempting login with:', { email });
        signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (signInResult.error) {
        console.error('Login error:', signInResult.error);
        
        // Handle specific error cases
        if (signInResult.error.message.includes('Database error querying schema')) {
          toast.error("System error. Please try again in a few moments.");
          return;
        }
        
        if (signInResult.error.message.includes('Email not confirmed')) {
          toast.error("Please verify your email address before logging in");
        } else if (signInResult.error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password");
        } else {
          toast.error(signInResult.error.message);
        }
        return;
      }

      if (signInResult.data.session) {
        console.log('Login successful');
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
  };
};
