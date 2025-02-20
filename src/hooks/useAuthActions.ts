
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
    
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Transform SA ID to email format if needed
        const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Database error querying schema') && attempt < maxRetries - 1) {
            attempt++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          throw error;
        }

        if (data.session) {
          toast.success("Login successful!");
          navigate("/admin");
          return;
        }
      } catch (error: any) {
        const errorMessage = {
          'Email not confirmed': "Please verify your email address",
          'Invalid login credentials': "Invalid email or password",
          'Database error querying schema': "Connection error. Please try again",
        }[error.message] || "Login failed. Please try again.";
        
        toast.error(errorMessage);
        break;
      }
    }
    
    setIsLoading(false);
  };

  return { handleLogin };
};
