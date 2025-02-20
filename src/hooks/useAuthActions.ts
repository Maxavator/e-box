
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
        
        console.log('Attempting SA ID login with:', { 
          email: formattedEmail,
          isSaId: true 
        });
        
        // First try with provided password
        signInResult = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password: password
        });

        // If that fails, try with SA ID as password
        if (signInResult.error) {
          console.log('First attempt failed, trying with SA ID as password');
          signInResult = await supabase.auth.signInWithPassword({
            email: formattedEmail,
            password: email // Use SA ID itself as password
          });
        }
      } else {
        // Regular email login
        signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (signInResult.error) {
        console.error('Login error details:', signInResult.error);
        if (signInResult.error.message.includes('Invalid login credentials')) {
          toast.error("Invalid credentials. If using SA ID, use your SA ID as password.");
        } else {
          toast.error(signInResult.error.message);
        }
        return;
      }

      if (signInResult.data.session) {
        toast.success("Login successful!");
        navigate("/admin");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
  };
};
