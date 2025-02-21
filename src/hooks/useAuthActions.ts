
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isSaId } from "@/utils/saIdValidation";
import type { UserRoleType } from "@/types/database";

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

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      console.error('Auth error:', error);
      
      // Map Supabase errors to user-friendly messages
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Invalid email or password',
        'Email not confirmed': 'Please verify your email address',
        'Rate limit exceeded': 'Too many login attempts. Please wait a moment',
      };

      const errorMessage = errorMap[Object.keys(errorMap).find(key => error.message.includes(key)) || ''] 
        || 'Unable to connect. Please try again.';
      
      throw new Error(errorMessage);
    }

    if (!data.user) {
      throw new Error('Login failed. Please try again.');
    }

    try {
      // Get user role from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Role fetch error:', roleError);
        // Continue with default role if there's an error
        toast.success("Login successful!");
        navigate("/chat");
        return;
      }

      // Default to 'user' if no role is found
      const userRole: UserRoleType = roleData?.role || 'user';
      console.log('Role fetched:', userRole);
      
      toast.success("Login successful!");

      // Navigate based on user role
      if (userRole === 'global_admin' || userRole === 'org_admin') {
        navigate("/admin");
      } else {
        navigate("/chat");
      }
    } catch (roleError) {
      // If role fetch fails, continue with default navigation
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

export const useAuthActions = (props: UseAuthActionsProps) => {
  return {
    handleLogin: () => handleLogin(props),
  };
};
