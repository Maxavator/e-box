
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
      toast.error("Please enter both email/SA ID and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        const errorMessage = {
          'Email not confirmed': "Please verify your email address before logging in",
          'Invalid login credentials': "Invalid email or password",
          'Database error querying schema': "Unable to connect to the authentication service. Please try again later."
        }[error.message] || error.message;
        
        toast.error(errorMessage);
        return;
      }

      if (data.session) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin };
};
