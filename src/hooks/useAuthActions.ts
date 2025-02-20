
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";

interface UseAuthActionsProps {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleLogin = async ({
  email,
  password,
  setIsLoading,
  navigate,
}: UseAuthActionsProps) => {
  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  setIsLoading(true);
  console.log('Starting login process...');

  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Transform SA ID to email format if needed
      const loginEmail = isSaId(email) ? `${email}@said.auth` : email;

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        
        // For database errors, retry
        if (error.message.includes('Database error') && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          console.log(`Retrying login attempt ${retryCount} of ${MAX_RETRIES}...`);
          await wait(RETRY_DELAY * retryCount);
          continue;
        }
        
        // Handle other specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        }
        
        throw new Error('Unable to connect. Please try again in a few moments.');
      }

      if (!data.user) {
        throw new Error('No user data received');
      }

      console.log('Login successful, fetching user role...');

      // Attempt to fetch role with retries
      let roleRetryCount = 0;
      while (roleRetryCount < MAX_RETRIES) {
        try {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .maybeSingle();

          if (roleError) {
            if (roleRetryCount < MAX_RETRIES - 1) {
              roleRetryCount++;
              await wait(RETRY_DELAY * roleRetryCount);
              continue;
            }
            throw roleError;
          }

          const userRole = roleData?.role || 'user';
          console.log('Role fetched successfully:', userRole);
          toast.success("Login successful!");

          // Navigate based on user role
          if (userRole === 'global_admin' || userRole === 'org_admin') {
            navigate("/admin");
          } else {
            navigate("/chat");
          }
          return; // Success - exit the function

        } catch (roleError) {
          if (roleRetryCount === MAX_RETRIES - 1) {
            console.error('Role fetch error:', roleError);
            // Continue with default role if we can't fetch it
            toast.success("Login successful!");
            navigate("/chat");
            return;
          }
          roleRetryCount++;
        }
      }

      // If we get here, we've successfully logged in but couldn't get the role
      toast.success("Login successful!");
      navigate("/chat");
      return;

    } catch (error: any) {
      if (retryCount === MAX_RETRIES - 1) {
        const errorMessage = error?.message || "An unexpected error occurred";
        toast.error(errorMessage);
        console.error('Login error:', error);
        return;
      }
      retryCount++;
    }
  }
};

export const useAuthActions = (props: UseAuthActionsProps) => {
  return {
    handleLogin: () => handleLogin(props),
  };
};
