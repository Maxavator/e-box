
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
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          let signInResult;
          
          if (isSaId(email)) {
            const formattedEmail = `${email}@said.auth`;
            signInResult = await supabase.auth.signInWithPassword({
              email: formattedEmail,
              password
            });
          } else {
            console.log('Attempting login with:', { email });
            signInResult = await supabase.auth.signInWithPassword({
              email,
              password,
            });
          }

          if (signInResult.error) {
            console.error('Login error:', signInResult.error);
            
            // Check if error requires retry
            if (signInResult.error.message.includes('Database error querying schema')) {
              if (retryCount < maxRetries - 1) {
                retryCount++;
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                continue;
              } else {
                toast.error("Unable to connect to the authentication service. Please try again later.");
                return;
              }
            }
            
            // Handle other specific error cases
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
            return; // Exit loop on success
          }
        } catch (error: any) {
          console.error('Login error:', error);
          if (retryCount < maxRetries - 1) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          toast.error("An unexpected error occurred. Please try again later.");
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
  };
};
