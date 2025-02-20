
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

      // Attempt login directly without session check
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        console.error('Auth error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Too many login attempts. Please wait a moment and try again.');
        }
        throw new Error('Authentication failed. Please check your credentials and try again.');
      }

      if (!data?.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Success! Now fetch the user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .limit(1)
        .single();

      if (roleError) {
        console.error('Role fetch error:', roleError);
        // Continue with default role if role fetch fails
      }

      const userRole = roleData?.role || 'user';
      
      toast.success("Login successful!");

      // Navigate based on user role
      if (userRole === 'global_admin' || userRole === 'org_admin') {
        navigate("/admin");
      } else {
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
