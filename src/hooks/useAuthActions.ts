
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";

interface UseAuthActionsProps {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

// Track our last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
const MAX_RETRIES = 2;

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

    // Check if we're making requests too quickly
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      toast.error("Please wait a moment before trying again");
      return;
    }
    lastRequestTime = now;

    setIsLoading(true);
    
    try {
      // Transform SA ID to email format if needed
      const loginEmail = isSaId(email) ? `${email}@said.auth` : email;

      let lastError = null;
      let data = null;

      // Try authentication with retries
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            // Add increasing delay between retries
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          }

          const result = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password,
          });

          if (!result.error) {
            data = result.data;
            break; // Success! Exit retry loop
          }

          lastError = result.error;

          if (result.error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password');
          }
          if (result.error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address');
          }
          if (result.error.message.includes('rate limit')) {
            throw new Error('Too many login attempts. Please wait a moment and try again.');
          }

          // Only continue retrying for specific errors
          if (!result.error.message.includes('Database error querying schema')) {
            throw result.error;
          }

          console.log(`Retry attempt ${attempt + 1} of ${MAX_RETRIES}`);

        } catch (error: any) {
          // If it's a known error type, throw immediately
          if (error.message && !error.message.includes('Database error querying schema')) {
            throw error;
          }
          lastError = error;
        }
      }

      // If we exhausted retries without success
      if (!data?.user) {
        console.error('Final auth error:', lastError);
        throw new Error('Unable to connect. Please try again in a few moments.');
      }

      // Try to fetch user role
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        const userRole = roleData?.role || 'user';
        
        toast.success("Login successful!");

        // Navigate based on user role
        if (userRole === 'global_admin' || userRole === 'org_admin') {
          navigate("/admin");
        } else {
          navigate("/chat");
        }
      } catch (roleError) {
        // If role fetch fails, proceed with default route
        console.error('Role fetch error:', roleError);
        toast.success("Login successful!");
        navigate("/chat");
      }

    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin };
};
