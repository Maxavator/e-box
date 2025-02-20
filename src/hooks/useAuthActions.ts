
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId, formatSaIdPassword, isTestAccount } from "@/utils/saIdValidation";

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
        signInResult = await supabase.auth.signInWithPassword({
          email: `${email}@said.auth`,
          password: formatSaIdPassword(email),
        });
      } else {
        signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (signInResult.error) {
        console.error('Login error details:', signInResult.error);
        if (signInResult.error.message.includes('Invalid login credentials')) {
          if (isSaId(email)) {
            const isTest = isTestAccount(email);
            toast.error(isTest 
              ? `For test account ${email}, use password: Test${email}`
              : "Invalid SA ID number or password format incorrect"
            );
          } else {
            toast.error("Invalid email or password");
          }
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
