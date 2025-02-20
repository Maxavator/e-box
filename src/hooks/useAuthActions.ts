
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
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Transform SA ID to email format if needed
        const loginEmail = isSaId(email) ? `${email}@said.auth` : email;
        
        // First get current session to check connection
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (sessionError.message.includes('Database error querying schema') && retryCount < maxRetries - 1) {
            console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          throw new Error('Unable to connect to authentication service. Please try again.');
        }

        // Sign in user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        if (error) {
          if (error.message.includes('Database error querying schema') && retryCount < maxRetries - 1) {
            console.log(`Retry attempt ${retryCount + 1} of ${maxRetries}`);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address');
          }
          throw error;
        }

        if (!data?.user) {
          throw new Error('Login failed. Please try again.');
        }

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (roleError) {
          console.error('Error fetching user role:', roleError);
          // Don't throw here, we can still proceed with login
        }

        const userRole = roleData?.role || 'user';

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Don't throw here, we can still proceed with login
        }

        toast.success("Login successful!");

        // Navigate based on user role
        if (userRole === 'global_admin' || userRole === 'org_admin') {
          navigate("/admin");
        } else {
          navigate("/chat");
        }

        // Successfully logged in, break the retry loop
        break;

      } catch (error: any) {
        const errorMessage = error?.message || "An unexpected error occurred";
        
        // If this was our last retry, show the error
        if (retryCount === maxRetries - 1) {
          toast.error(errorMessage);
          console.error('Login error:', error);
        } else {
          console.log(`Retry attempt ${retryCount + 1} of ${maxRetries} failed:`, error);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
    
    setIsLoading(false);
  };

  return { handleLogin };
};
