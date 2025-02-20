
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";

interface UseAuthActionsProps {
  email: string;
  password: string;
  setIsLoading: (loading: boolean) => void;
  navigate: (path: string) => void;
}

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

  try {
    // Transform SA ID to email format if needed
    const loginEmail = isSaId(email) ? `${email}@said.auth` : email;

    // Simple login attempt with 10 second timeout
    const loginPromise = supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );

    const { data, error } = await Promise.race([loginPromise, timeoutPromise])
      .then(result => result as Awaited<typeof loginPromise>)
      .catch(error => ({ data: { user: null }, error }));

    if (error) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email address');
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Too many login attempts. Please wait a moment and try again.');
      }
      if (error.message.includes('Connection timeout')) {
        throw new Error('Connection timed out. Please check your internet connection and try again.');
      }
      if (error.message.includes('Database error')) {
        throw new Error('Service temporarily unavailable. Please try again in a few moments.');
      }
      
      throw new Error('Unable to connect. Please try again.');
    }

    if (!data.user) {
      throw new Error('No user data received');
    }

    console.log('Login successful, fetching user role...');

    // Simple role fetch with timeout
    const rolePromise = supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .maybeSingle();

    const { data: roleData } = await Promise.race([rolePromise, timeoutPromise])
      .then(result => result as Awaited<typeof rolePromise>)
      .catch(() => ({ data: null }));

    const userRole = roleData?.role || 'user';
    console.log('Role fetched:', userRole);
    
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

export const useAuthActions = (props: UseAuthActionsProps) => {
  return {
    handleLogin: () => handleLogin(props),
  };
};
