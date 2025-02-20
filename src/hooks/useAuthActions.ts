
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

    // Simple login attempt
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

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
      if (error.message.includes('Database error')) {
        throw new Error('Service temporarily unavailable. Please try again in a few moments.');
      }
      
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data received');
    }

    console.log('Login successful, fetching user role...');

    // Simple role fetch
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    const userRole = roleData?.role || 'user';
    
    console.log('Role fetched successfully:', userRole);
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
