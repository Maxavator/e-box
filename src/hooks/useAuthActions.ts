
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
        const formattedEmail = `${email}@said.auth`;
        const expectedPassword = formatSaIdPassword(email);

        // For test accounts, verify the exact password
        if (isTestAccount(email) && password !== expectedPassword) {
          toast.error(`For test account ${email}, use password: ${expectedPassword}`);
          setIsLoading(false);
          return;
        }

        // First try to sign in
        signInResult = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password: expectedPassword,
        });

        // If sign in fails due to no user, create the account for test accounts
        if (signInResult.error && isTestAccount(email)) {
          console.log('Attempting to create test account...');
          const signUpResult = await supabase.auth.signUp({
            email: formattedEmail,
            password: expectedPassword,
          });

          if (signUpResult.error) {
            console.error('Sign up error:', signUpResult.error);
            toast.error("Failed to create test account");
            setIsLoading(false);
            return;
          }

          // Try signing in again after creating the account
          signInResult = await supabase.auth.signInWithPassword({
            email: formattedEmail,
            password: expectedPassword,
          });
        }
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
